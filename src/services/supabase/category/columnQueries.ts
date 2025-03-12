
import { supabase, supabaseAdmin } from '../supabaseClient';
import { CategoryColumn } from '@/components/categories/columns/types';
import { CreateColumnDto, UpdateColumnDto } from './types';
import { getCategoryColumnsCount } from './helpers';

// Column CRUD functions
export const getCategoryColumns = async (categoryId: string): Promise<CategoryColumn[]> => {
  try {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('category_id', categoryId)
      .order('order', { ascending: true });

    if (error) throw error;

    return data.map(column => ({
      id: column.id,
      name: column.name,
      type: column.type,
      required: column.required,
      description: column.description || '',
      options: column.options,
      order: column.order
    }));
  } catch (error) {
    console.error('Error fetching category columns:', error);
    throw error;
  }
};

// Re-export the getCategoryColumnsCount function from helpers
export { getCategoryColumnsCount };

export const createColumn = async (categoryId: string, column: CreateColumnDto): Promise<CategoryColumn> => {
  try {
    // Get the highest order value to set the new column's order
    const { data: existingColumns, error: countError } = await supabase
      .from('columns')
      .select('order')
      .eq('category_id', categoryId)
      .order('order', { ascending: false })
      .limit(1);

    if (countError) throw countError;

    const nextOrder = existingColumns.length > 0 ? existingColumns[0].order + 1 : 1;

    console.log('Creating column with data:', {
      categoryId,
      name: column.name,
      type: column.type,
      required: column.required,
      description: column.description,
      options: column.options,
      order: nextOrder
    });

    // RLS siyasətlərini bypass etmək üçün supabaseAdmin istifadə edin
    const { data, error } = await supabaseAdmin
      .from('columns')
      .insert({
        category_id: categoryId,
        name: column.name,
        type: column.type,
        required: column.required,
        description: column.description,
        options: column.options,
        order: nextOrder
      })
      .select()
      .single();

    if (error) {
      console.error('Column creation error details:', error);
      throw error;
    }

    console.log('Column created successfully:', data);
    
    return {
      id: data.id,
      name: data.name,
      type: data.type,
      required: data.required,
      description: data.description || '',
      options: data.options,
      order: data.order
    };
  } catch (error) {
    console.error('Error creating column:', error);
    throw error;
  }
};

export const updateColumn = async (id: string, column: UpdateColumnDto): Promise<CategoryColumn> => {
  try {
    // RLS siyasətlərini bypass etmək üçün supabaseAdmin istifadə edin
    const { data, error } = await supabaseAdmin
      .from('columns')
      .update({
        name: column.name,
        type: column.type,
        required: column.required,
        description: column.description,
        options: column.options,
        order: column.order
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      type: data.type,
      required: data.required,
      description: data.description || '',
      options: data.options,
      order: data.order
    };
  } catch (error) {
    console.error('Error updating column:', error);
    throw error;
  }
};

export const deleteColumn = async (id: string): Promise<void> => {
  try {
    // RLS siyasətlərini bypass etmək üçün supabaseAdmin istifadə edin
    const { error } = await supabaseAdmin
      .from('columns')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting column:', error);
    throw error;
  }
};

export const updateColumnsOrder = async (columns: { id: string; order: number }[]): Promise<void> => {
  try {
    // Supabase doesn't support bulk updates, so we need to update each column separately
    for (const column of columns) {
      // RLS siyasətlərini bypass etmək üçün supabaseAdmin istifadə edin
      const { error } = await supabaseAdmin
        .from('columns')
        .update({ order: column.order })
        .eq('id', column.id);

      if (error) throw error;
    }
  } catch (error) {
    console.error('Error updating columns order:', error);
    throw error;
  }
};
