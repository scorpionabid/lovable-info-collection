import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { CategoryModal } from './CategoryModal';
import { CategoryColumnsModal } from './CategoryColumnsModal';
import { Eye, Edit, Archive, MoreHorizontal, Download, Table2, ArrowUp, ArrowDown } from "lucide-react";
import { CategoryType } from './CategoryDetailView';

interface CategoryTableProps {
  categories: CategoryType[];
}

export const CategoryTable = ({ categories }: CategoryTableProps) => {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState<CategoryType | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);

  const handleView = (category: CategoryType) => {
    navigate(`/categories/${category.id}`);
  };

  const handleEdit = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsEditModalOpen(true);
  };

  const handleArchive = (category: CategoryType) => {
    console.log(`Archiving category: ${category.name}`);
  };

  const handleManageColumns = (category: CategoryType) => {
    setSelectedCategory(category);
    setIsColumnsModalOpen(true);
  };

  const handlePriorityChange = (category: CategoryType, direction: 'up' | 'down') => {
    console.log(`Moving ${category.name} ${direction}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Prioritet</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Ad</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Təyinat</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Sütun sayı</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Son tarix</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Doldurma faizi</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-infoline-dark-blue">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr 
                key={category.id} 
                className="border-b border-infoline-light-gray hover:bg-infoline-lightest-gray transition-colors cursor-pointer"
                onClick={() => handleView(category)}
              >
                <td className="px-4 py-3">
                  <div className="flex items-center space-x-1" onClick={(e) => e.stopPropagation()}>
                    <span className="w-6 h-6 flex items-center justify-center bg-infoline-light-gray rounded-full text-sm font-medium text-infoline-dark-blue">
                      {category.priority}
                    </span>
                    <div className="flex flex-col">
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handlePriorityChange(category, 'up')}>
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handlePriorityChange(category, 'down')}>
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{category.name}</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">{category.assignment}</td>
                <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">
                  {typeof category.columns === 'number' ? category.columns : category.columns.length}
                </td>
                <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">
                  {new Date(category.deadline).toLocaleDateString('az-AZ')}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${category.completionRate}%`,
                          backgroundColor: category.completionRate > 80 ? '#10B981' : category.completionRate > 50 ? '#F59E0B' : '#EF4444'
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-infoline-dark-gray">{category.completionRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    category.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {category.status === 'Active' ? 'Aktiv' : 'Deaktiv'}
                  </span>
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(category)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Baxış</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(category)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Redaktə et</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleManageColumns(category)}>
                        <Table2 className="mr-2 h-4 w-4" />
                        <span>Sütunları idarə et</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(category)}>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Arxivləşdir</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>Excel şablonu</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {categories.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-infoline-dark-gray">Nəticə tapılmadı</p>
        </div>
      )}
      
      {selectedCategory && (
        <>
          <CategoryModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            mode="edit"
            category={selectedCategory}
          />
          
          <CategoryColumnsModal 
            isOpen={isColumnsModalOpen} 
            onClose={() => setIsColumnsModalOpen(false)} 
            category={selectedCategory}
          />
        </>
      )}
    </div>
  );
};
