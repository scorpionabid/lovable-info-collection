
import { ReactNode } from 'react';

export type ChartType = 'bar' | 'pie';

export interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: ChartType;
  data: any[];
  height?: number;
  colors?: string[];
  children?: ReactNode;
  isLoading?: boolean;
}
