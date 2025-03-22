
import React from 'react';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { PlusCircle, Trash2, Edit, MoveUp, MoveDown } from 'lucide-react';
import { CategoryType, CategoryTableProps } from './types';

const CategoryTable: React.FC<CategoryTableProps> = ({ 
  categories, 
  isLoading = false,
  onRefresh = () => {},
  onDelete, 
  onUpdatePriority 
}) => {
  // Status-u CategoryStatus enum tipinə çevirən funksiya
  const normalizeStatus = (status: string) => {
    return status.toLowerCase() as 'active' | 'inactive' | 'draft' | 'archived';
  };

  const getStatusColor = (status: string) => {
    switch (normalizeStatus(status)) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      case 'draft':
        return 'bg-gray-100 text-gray-800';
      case 'archived':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handlePriorityUp = (id: string, currentPriority: number) => {
    onUpdatePriority(id, currentPriority - 1);
  };

  const handlePriorityDown = (id: string, currentPriority: number) => {
    onUpdatePriority(id, currentPriority + 1);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-infoline-blue"></div>
      </div>
    );
  }

  if (!categories || categories.length === 0) {
    return (
      <div className="text-center p-8 bg-white rounded-lg shadow">
        <h3 className="text-xl font-semibold mb-2">Kateqoriya tapılmadı</h3>
        <p className="text-gray-500 mb-4">Hal-hazırda heç bir kateqoriya yoxdur</p>
        <Button onClick={onRefresh} variant="outline">Yenilə</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ad</TableHead>
            <TableHead>Təyinat</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Tamamlanma</TableHead>
            <TableHead>Prioritet</TableHead>
            <TableHead className="text-right">Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {categories.map((category, index) => (
            <TableRow key={category.id}>
              <TableCell className="font-medium">{category.name}</TableCell>
              <TableCell>{category.assignment}</TableCell>
              <TableCell>
                <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(category.status)}`}>
                  {category.status}
                </span>
              </TableCell>
              <TableCell>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-infoline-blue h-2.5 rounded-full" 
                    style={{ width: `${category.completionRate}%` }}
                  ></div>
                </div>
                <span className="text-xs text-gray-500">{category.completionRate}%</span>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="mr-2">{category.priority}</span>
                  <div className="flex flex-col">
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5" 
                      onClick={() => handlePriorityUp(category.id, category.priority)}
                      disabled={index === 0}
                    >
                      <MoveUp size={16} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-5 w-5" 
                      onClick={() => handlePriorityDown(category.id, category.priority)}
                      disabled={index === categories.length - 1}
                    >
                      <MoveDown size={16} />
                    </Button>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" size="icon">
                    <Edit size={16} />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-red-500" 
                    onClick={() => onDelete(category)}
                  >
                    <Trash2 size={16} />
                  </Button>
                  <Button variant="outline" size="icon">
                    <PlusCircle size={16} />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CategoryTable;
