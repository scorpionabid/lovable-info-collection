
import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Eye, Pencil, Trash2, ChevronUp, ChevronDown } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { CategoryStatus } from '@/lib/supabase/types/category';

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  status: CategoryStatus;
  assignment: string;
  priority: number;
  createdAt: string;
  [key: string]: any;
}

interface CategoryTableProps {
  categories: CategoryType[];
  onDelete: (category: CategoryType) => Promise<void>;
  onUpdatePriority?: (id: string, newPriority: number) => void;
}

export const CategoryTable: React.FC<CategoryTableProps> = ({ 
  categories, 
  onDelete,
  onUpdatePriority
}) => {
  const getStatusBadgeColor = (status: CategoryStatus) => {
    switch (status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'inactive':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'draft':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'archived':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handlePriorityChange = (category: CategoryType, direction: 'up' | 'down') => {
    const newPriority = direction === 'up' 
      ? category.priority - 1 
      : category.priority + 1;
    
    if (onUpdatePriority) {
      onUpdatePriority(category.id, newPriority);
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ad</TableHead>
          <TableHead>Təsvir</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Təyinat</TableHead>
          <TableHead>Üstünlük</TableHead>
          <TableHead className="text-right">Əməliyyatlar</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {categories.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              Heç bir kateqoriya tapılmadı
            </TableCell>
          </TableRow>
        ) : (
          categories.map((category) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell className="max-w-[300px] truncate">{category.description || '-'}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getStatusBadgeColor(category.status)}>
                  {category.status.charAt(0).toUpperCase() + category.status.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>{category.assignment}</TableCell>
              <TableCell className="flex items-center space-x-2">
                <span>{category.priority}</span>
                <div className="flex flex-col">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5" 
                    onClick={() => handlePriorityChange(category, 'up')}
                    disabled={!onUpdatePriority}
                  >
                    <ChevronUp className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-5 w-5" 
                    onClick={() => handlePriorityChange(category, 'down')}
                    disabled={!onUpdatePriority}
                  >
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
              <TableCell className="text-right space-x-1">
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="h-8 w-8">
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-8 w-8 text-red-500 hover:text-red-700"
                  onClick={() => onDelete(category)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default CategoryTable;
