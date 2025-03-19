
/**
 * Metric Service - Fetches and processes metrics data
 */
import { supabase } from '@/lib/supabase';
import { logger } from '@/utils/logger';

interface Metric {
  id: string;
  name: string;
  value: number;
  timestamp: string;
}

interface FilterOptions {
  startDate?: string;
  endDate?: string;
  category?: string;
  schoolId?: string;
  regionId?: string;
  sectorId?: string;
}

const metricService = {
  /**
   * Fetches metrics data based on specified filters.
   * @param {FilterOptions} filters - Filters to apply to the query.
   * @returns {Promise<Metric[]>} - A promise that resolves to an array of metrics.
   */
  getMetrics: async (filters: FilterOptions): Promise<Metric[]> => {
    try {
      let query = supabase
        .from('metrics')
        .select('*');

      if (filters.startDate) {
        query = query.gte('timestamp', filters.startDate);
      }

      if (filters.endDate) {
        query = query.lte('timestamp', filters.endDate);
      }

      if (filters.category) {
        query = query.eq('category', filters.category);
      }

      if (filters.schoolId) {
        query = query.eq('school_id', filters.schoolId);
      }

      if (filters.regionId) {
        query = query.eq('region_id', filters.regionId);
      }

      if (filters.sectorId) {
        query = query.eq('sector_id', filters.sectorId);
      }

      const { data, error } = await query;

      if (error) {
        logger.error('Error fetching metrics:', error);
        throw error;
      }

      return data as Metric[];
    } catch (error) {
      logger.error('Error in getMetrics:', error);
      return [];
    }
  },

  /**
   * Calculates the average value of a specific metric over a time range.
   * @param {string} metricName - The name of the metric to average.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the average value of the metric.
   */
  getAverageMetric: async (metricName: string, startDate: string, endDate: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('metrics')
        .select('value')
        .eq('name', metricName)
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

      if (error) {
        logger.error(`Error fetching average metric ${metricName}:`, error);
        return null;
      }

      if (!data || data.length === 0) {
        return 0;
      }

      const total = data.reduce((sum, metric) => sum + metric.value, 0);
      return total / data.length;
    } catch (error) {
      logger.error(`Error calculating average metric ${metricName}:`, error);
      return null;
    }
  },

  /**
   * Retrieves the total count of data entries for a specific category within a time range.
   * @param {string} categoryName - The name of the category to count.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the total count of data entries.
   */
  getTotalDataEntries: async (categoryName: string, startDate: string, endDate: string): Promise<number | null> => {
    try {
      const { data, error, count } = await supabase
        .from('data_entries')
        .select('*', { count: 'exact' })
        .eq('category', categoryName)
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (error) {
        logger.error(`Error fetching total data entries for ${categoryName}:`, error);
        return null;
      }

      return count;
    } catch (error) {
      logger.error(`Error getting total data entries for ${categoryName}:`, error);
      return null;
    }
  },

  /**
   * Fetches the submission rate for a specific school within a time range.
   * @param {string} schoolId - The ID of the school.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the submission rate.
   */
  getSubmissionRate: async (schoolId: string, startDate: string, endDate: string): Promise<number | null> => {
    try {
      // Fetch total number of data entries for the school
      const { count: totalEntries, error: totalError } = await supabase
        .from('data_entries')
        .select('*', { count: 'exact' })
        .eq('school_id', schoolId)
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (totalError) {
        logger.error(`Error fetching total data entries for school ${schoolId}:`, totalError);
        return null;
      }

      // Fetch number of submitted data entries for the school
      const { count: submittedEntries, error: submittedError } = await supabase
        .from('data_entries')
        .select('*', { count: 'exact' })
        .eq('school_id', schoolId)
        .eq('status', 'submitted')
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (submittedError) {
        logger.error(`Error fetching submitted data entries for school ${schoolId}:`, submittedError);
        return null;
      }

      if (totalEntries === 0) {
        return 0;
      }

      return (submittedEntries || 0) / totalEntries;
    } catch (error) {
      logger.error(`Error getting submission rate for school ${schoolId}:`, error);
      return null;
    }
  },

  /**
   * Retrieves the approval rate for data entries within a specific time range.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the approval rate.
   */
  getApprovalRate: async (startDate: string, endDate: string): Promise<number | null> => {
    try {
      // Fetch total number of data entries
      const { count: totalEntries, error: totalError } = await supabase
        .from('data_entries')
        .select('*', { count: 'exact' })
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (totalError) {
        logger.error('Error fetching total data entries:', totalError);
        return null;
      }

      // Fetch number of approved data entries
      const { count: approvedEntries, error: approvedError } = await supabase
        .from('data_entries')
        .select('*', { count: 'exact' })
        .eq('status', 'approved')
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (approvedError) {
        logger.error('Error fetching approved data entries:', approvedError);
        return null;
      }

      if (totalEntries === 0) {
        return 0;
      }

      return (approvedEntries || 0) / totalEntries;
    } catch (error) {
      logger.error('Error getting approval rate:', error);
      return null;
    }
  },

  /**
   * Calculates the average completion time for data entries.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the average completion time in milliseconds.
   */
  getAverageCompletionTime: async (startDate: string, endDate: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('data_entries')
        .select('submitted_at, created_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .not('submitted_at', 'is', null);

      if (error) {
        logger.error('Error fetching data entries for completion time:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return 0;
      }

      // Calculate the total completion time
      const totalCompletionTime = data.reduce((sum, entry) => {
        const submittedAt = new Date(entry.submitted_at).getTime();
        const createdAt = new Date(entry.created_at).getTime();
        return sum + (submittedAt - createdAt);
      }, 0);

      // Calculate the average completion time
      return totalCompletionTime / data.length;
    } catch (error) {
      logger.error('Error calculating average completion time:', error);
      return null;
    }
  },

  /**
   * Retrieves the distribution of data entry statuses (e.g., draft, submitted, approved).
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the distribution of statuses.
   */
  getDataEntryStatusDistribution: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('data_entries')
        .select('status')
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (error) {
        logger.error('Error fetching data entry statuses:', error);
        return null;
      }

      if (!data) {
        return { draft: 0, submitted: 0, approved: 0, rejected: 0 };
      }

      // Count the occurrences of each status
      const statusCounts: Record<string, number> = data.reduce((counts, entry) => {
        counts[entry.status] = (counts[entry.status] || 0) + 1;
        return counts;
      }, {});

      // Ensure all possible statuses are represented
      return {
        draft: statusCounts.draft || 0,
        submitted: statusCounts.submitted || 0,
        approved: statusCounts.approved || 0,
        rejected: statusCounts.rejected || 0,
      };
    } catch (error) {
      logger.error('Error getting data entry status distribution:', error);
      return null;
    }
  },

  /**
   * Retrieves the average number of data entries per school within a specified time range.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the average number of data entries per school.
   */
  getAverageDataEntriesPerSchool: async (startDate: string, endDate: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('data_entries')
        .select('school_id')
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (error) {
        logger.error('Error fetching data entries for schools:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return 0;
      }

      // Count the number of entries per school
      const entriesPerSchool: Record<string, number> = data.reduce((counts, entry) => {
        counts[entry.school_id] = (counts[entry.school_id] || 0) + 1;
        return counts;
      }, {});

      // Calculate the total number of schools and total entries
      const numberOfSchools = Object.keys(entriesPerSchool).length;
      const totalEntries = data.length;

      // Calculate the average number of entries per school
      return totalEntries / numberOfSchools;
    } catch (error) {
      logger.error('Error getting average data entries per school:', error);
      return null;
    }
  },

  /**
   * Retrieves the number of active users within a specified time range.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the number of active users.
   */
  getActiveUsersCount: async (startDate: string, endDate: string): Promise<number | null> => {
    try {
      const { data, error, count } = await supabase
        .from('users')
        .select('*', { count: 'exact' })
        .gte('last_login', startDate)
        .lte('last_login', endDate);

      if (error) {
        logger.error('Error fetching active users:', error);
        return null;
      }

      return count;
    } catch (error) {
      logger.error('Error getting active users count:', error);
      return null;
    }
  },

  /**
   * Retrieves the average session duration for users within a specified time range.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the average session duration in milliseconds.
   */
  getAverageSessionDuration: async (startDate: string, endDate: string): Promise<number | null> => {
    try {
      // This is a placeholder as session data is not directly available
      logger.warn('Session duration metric is not implemented.');
      return null;
    } catch (error) {
      logger.error('Error getting average session duration:', error);
      return null;
    }
  },

  /**
   * Retrieves the most frequent actions performed by users.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each action.
   */
  getMostFrequentActions: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('action')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

      if (error) {
        logger.error('Error fetching audit log actions:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each action
      const actionCounts: Record<string, number> = data.reduce((counts, log) => {
        counts[log.action] = (counts[log.action] || 0) + 1;
        return counts;
      }, {});

      return actionCounts;
    } catch (error) {
      logger.error('Error getting most frequent actions:', error);
      return null;
    }
  },

  /**
   * Retrieves the number of unique users who performed actions within a specified time range.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the number of unique users.
   */
  getUniqueUsersCount: async (startDate: string, endDate: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('user_id')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

      if (error) {
        logger.error('Error fetching audit log for unique users:', error);
        return null;
      }

      if (!data) {
        return 0;
      }

      // Extract unique user IDs
      const uniqueUserIds = new Set(data.map(log => log.user_id));
      return uniqueUserIds.size;
    } catch (error) {
      logger.error('Error getting unique users count:', error);
      return null;
    }
  },

  /**
   * Retrieves the average time spent per data entry.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the average time spent per data entry in milliseconds.
   */
  getAverageTimePerDataEntry: async (startDate: string, endDate: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('data_entries')
        .select('created_at, submitted_at')
        .gte('created_at', startDate)
        .lte('created_at', endDate)
        .not('submitted_at', 'is', null);

      if (error) {
        logger.error('Error fetching data entries for time spent:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return 0;
      }

      // Calculate the total time spent on data entries
      const totalTimeSpent = data.reduce((sum, entry) => {
        const createdAt = new Date(entry.created_at).getTime();
        const submittedAt = new Date(entry.submitted_at).getTime();
        return sum + (submittedAt - createdAt);
      }, 0);

      // Calculate the average time spent per data entry
      return totalTimeSpent / data.length;
    } catch (error) {
      logger.error('Error getting average time per data entry:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of most visited endpoints.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each endpoint.
   */
  getMostVisitedEndpoints: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('endpoint')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

      if (error) {
        logger.error('Error fetching audit log endpoints:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each endpoint
      const endpointCounts: Record<string, number> = data.reduce((counts, log) => {
        counts[log.endpoint] = (counts[log.endpoint] || 0) + 1;
        return counts;
      }, {});

      return endpointCounts;
    } catch (error) {
      logger.error('Error getting most visited endpoints:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of least visited endpoints.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each endpoint.
   */
  getLeastVisitedEndpoints: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('endpoint')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

      if (error) {
        logger.error('Error fetching audit log endpoints:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each endpoint
      const endpointCounts: Record<string, number> = data.reduce((counts, log) => {
        counts[log.endpoint] = (counts[log.endpoint] || 0) + 1;
        return counts;
      }, {});

      return endpointCounts;
    } catch (error) {
      logger.error('Error getting least visited endpoints:', error);
      return null;
    }
  },

  /**
   * Retrieves the average number of data entries per user.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<number>} - A promise that resolves to the average number of data entries per user.
   */
  getAverageDataEntriesPerUser: async (startDate: string, endDate: string): Promise<number | null> => {
    try {
      const { data, error } = await supabase
        .from('data_entries')
        .select('user_id')
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (error) {
        logger.error('Error fetching data entries for users:', error);
        return null;
      }

      if (!data || data.length === 0) {
        return 0;
      }

      // Count the number of entries per user
      const entriesPerUser: Record<string, number> = data.reduce((counts, entry) => {
        counts[entry.user_id] = (counts[entry.user_id] || 0) + 1;
        return counts;
      }, {});

      // Calculate the total number of users and total entries
      const numberOfUsers = Object.keys(entriesPerUser).length;
      const totalEntries = data.length;

      // Calculate the average number of entries per user
      return totalEntries / numberOfUsers;
    } catch (error) {
      logger.error('Error getting average data entries per user:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of most active users.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each user.
   */
  getMostActiveUsers: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('user_id')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

      if (error) {
        logger.error('Error fetching audit log for users:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each user
      const userCounts: Record<string, number> = data.reduce((counts, log) => {
        counts[log.user_id] = (counts[log.user_id] || 0) + 1;
        return counts;
      }, {});

      return userCounts;
    } catch (error) {
      logger.error('Error getting most active users:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of least active users.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each user.
   */
  getLeastActiveUsers: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('audit_log')
        .select('user_id')
        .gte('timestamp', startDate)
        .lte('timestamp', endDate);

      if (error) {
        logger.error('Error fetching audit log for users:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each user
      const userCounts: Record<string, number> = data.reduce((counts, log) => {
        counts[log.user_id] = (counts[log.user_id] || 0) + 1;
        return counts;
      }, {});

      return userCounts;
    } catch (error) {
      logger.error('Error getting least active users:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of most frequent categories.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each category.
   */
  getMostFrequentCategories: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('data_entries')
        .select('category_id')
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (error) {
        logger.error('Error fetching data entries for categories:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each category
      const categoryCounts: Record<string, number> = data.reduce((counts, entry) => {
        counts[entry.category_id] = (counts[entry.category_id] || 0) + 1;
        return counts;
      }, {});

      return categoryCounts;
    } catch (error) {
      logger.error('Error getting most frequent categories:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of least frequent categories.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each category.
   */
  getLeastFrequentCategories: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('data_entries')
        .select('category_id')
        .gte('submitted_at', startDate)
        .lte('submitted_at', endDate);

      if (error) {
        logger.error('Error fetching data entries for categories:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each category
      const categoryCounts: Record<string, number> = data.reduce((counts, entry) => {
        counts[entry.category_id] = (counts[entry.category_id] || 0) + 1;
        return counts;
      }, {});

      return categoryCounts;
    } catch (error) {
      logger.error('Error getting least frequent categories:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of most frequent school types.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each school type.
   */
  getMostFrequentSchoolTypes: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('type_id')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) {
        logger.error('Error fetching schools for types:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each school type
      const typeCounts: Record<string, number> = data.reduce((counts, school) => {
        counts[school.type_id] = (counts[school.type_id] || 0) + 1;
        return counts;
      }, {});

      return typeCounts;
    } catch (error) {
      logger.error('Error getting most frequent school types:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of least frequent school types.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each school type.
   */
  getLeastFrequentSchoolTypes: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('type_id')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) {
        logger.error('Error fetching schools for types:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each school type
      const typeCounts: Record<string, number> = data.reduce((counts, school) => {
        counts[school.type_id] = (counts[school.type_id] || 0) + 1;
        return counts;
      }, {});

      return typeCounts;
    } catch (error) {
      logger.error('Error getting least frequent school types:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of most frequent regions.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each region.
   */
  getMostFrequentRegions: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('region_id')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) {
        logger.error('Error fetching schools for regions:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each region
      const regionCounts: Record<string, number> = data.reduce((counts, school) => {
        counts[school.region_id] = (counts[school.region_id] || 0) + 1;
        return counts;
      }, {});

      return regionCounts;
    } catch (error) {
      logger.error('Error getting most frequent regions:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of least frequent regions.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each region.
   */
  getLeastFrequentRegions: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('region_id')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) {
        logger.error('Error fetching schools for regions:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each region
      const regionCounts: Record<string, number> = data.reduce((counts, school) => {
        counts[school.region_id] = (counts[school.region_id] || 0) + 1;
        return counts;
      }, {});

      return regionCounts;
    } catch (error) {
      logger.error('Error getting least frequent regions:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of most frequent sectors.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each sector.
   */
  getMostFrequentSectors: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('sector_id')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) {
        logger.error('Error fetching schools for sectors:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each sector
      const sectorCounts: Record<string, number> = data.reduce((counts, school) => {
        counts[school.sector_id] = (counts[school.sector_id] || 0) + 1;
        return counts;
      }, {});

      return sectorCounts;
    } catch (error) {
      logger.error('Error getting most frequent sectors:', error);
      return null;
    }
  },

  /**
   * Retrieves the list of least frequent sectors.
   * @param {string} startDate - The start date for the time range.
   * @param {string} endDate - The end date for the time range.
   * @returns {Promise<Record<string, number>>} - A promise that resolves to an object representing the frequency of each sector.
   */
  getLeastFrequentSectors: async (startDate: string, endDate: string): Promise<Record<string, number> | null> => {
    try {
      const { data, error } = await supabase
        .from('schools')
        .select('sector_id')
        .gte('created_at', startDate)
        .lte('created_at', endDate);

      if (error) {
        logger.error('Error fetching schools for sectors:', error);
        return null;
      }

      if (!data) {
        return {};
      }

      // Count the occurrences of each sector
      const sectorCounts: Record<string, number> = data.reduce((counts, school) => {
        counts[school.sector_id] = (counts[school.sector_id] || 0) + 1;
        return counts;
      }, {});

      return sectorCounts;
    } catch (error) {
      logger.error('Error getting least frequent sectors:', error);
      return null;
    }
  }
};

export default metricService;
