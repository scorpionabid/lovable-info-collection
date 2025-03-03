import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X, Plus, GripVertical, AlignJustify, Edit, Trash2 } from "lucide-react";
import { CategoryType, CategoryColumn } from "./CategoryDetailView";

interface CategoryColumnsModalProps {
  isOpen: boolean;
  onClose: () => void;
  category: CategoryType;
}

export const CategoryColumnsModal = ({ isOpen, onClose, category }: CategoryColumnsModalProps) => {
  // Mock columns data
  const [columns, setColumns] = useState<CategoryColumn[]>([
    {
      id: '1',
      name: 'Ad',
      type: 'text',
      required: true,
      description: 'Müəllimin adı',
      order: 1
    },
    {
      id: '2',
      name: 'Soyad',
      type: 'text',
      required: true,
      description: 'Müəllimin soyadı',
      order: 2
    },
    {
      id: '3',
      name: 'Doğum tarixi',
      type: 'date',
      required: true,
      description: 'Müəllimin doğum tarixi',
      order: 3
    },
    {
      id: '4',
      name: 'Cinsi',
      type: 'select',
      required: true,
      description: 'Müəllimin cinsi',
      options: ['Kişi', 'Qadın'],
      order: 4
    },
    {
      id: '5',
      name: 'Təhsil səviyyəsi',
      type: 'select',
      required: true,
      description: 'Müəllimin təhsil səviyyəsi',
      options: ['Bakalavr', 'Magistr', 'Doktorantura'],
      order: 5
    }
  ]);

  const [isColumnModalOpen, setIsColumnModalOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<CategoryColumn | null>(null);
  const [columnFormMode, setColumnFormMode] = useState<'create' | 'edit'>('create');

  const handleAddColumn = () => {
    setSelectedColumn(null);
    setColumnFormMode('create');
    setIsColumnModalOpen(true);
  };

  const handleEditColumn = (column: CategoryColumn) => {
    setSelectedColumn(column);
    setColumnFormMode('edit');
    setIsColumnModalOpen(true);
  };

  const handleDeleteColumn = (columnId: string) => {
    setColumns(columns.filter(column => column.id !== columnId));
  };

  const handleSaveColumn = (column: CategoryColumn) => {
    if (columnFormMode === 'create') {
      // Generate a new ID and add the column
      const newColumn = {
        ...column,
        id: Date.now().toString(),
        order: columns.length + 1
      };
      setColumns([...columns, newColumn]);
    } else {
      // Update the existing column
      setColumns(columns.map(c => c.id === column.id ? column : c));
    }
    setIsColumnModalOpen(false);
  };

  // Sort columns by order property
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  return (
    <div className={`fixed inset-0 z-50 ${isOpen ? 'block' : 'hidden'}`}>
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose}></div>
      
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden animate-scale-in">
          <div className="flex items-center justify-between px-6 py-4 border-b border-infoline-light-gray">
            <h2 className="text-xl font-semibold text-infoline-dark-blue">
              Sütunları İdarə Et: {category.name}
            </h2>
            <Button variant="ghost" size="icon" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
            <div className="flex justify-between items-center mb-4">
              <p className="text-infoline-dark-gray">
                Bu kateqoriya üçün məlumat sütunlarını idarə edin. Sütunları <span className="font-medium">sürükləyib buraxmaqla</span> prioritetlərini dəyişdirə bilərsiniz.
              </p>
              <Button 
                onClick={handleAddColumn}
                className="bg-infoline-blue hover:bg-infoline-dark-blue"
              >
                <Plus className="mr-2 h-4 w-4" />
                Yeni Sütun
              </Button>
            </div>
            
            <div className="bg-infoline-lightest-gray rounded-lg border border-infoline-light-gray overflow-hidden mt-4">
              <table className="w-full">
                <thead>
                  <tr className="bg-infoline-light-gray border-b border-infoline-gray">
                    <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue w-10">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Sütun adı</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Tip</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Məcburilik</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Təsvir</th>
                    <th className="px-4 py-3 text-right text-sm font-medium text-infoline-dark-blue">Əməliyyatlar</th>
                  </tr>
                </thead>
                <tbody>
                  {sortedColumns.map((column, index) => (
                    <tr key={column.id} className="border-b border-infoline-light-gray hover:bg-white transition-colors">
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center">
                          <GripVertical className="h-4 w-4 text-infoline-dark-gray cursor-move mr-2" />
                          <span className="text-sm text-infoline-dark-gray">{index + 1}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{column.name}</td>
                      <td className="px-4 py-3 text-sm text-infoline-dark-gray capitalize">{column.type}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex justify-center">
                          <span className={`h-2.5 w-2.5 rounded-full ${column.required ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-infoline-dark-gray truncate max-w-[200px]">
                        {column.description}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex justify-end space-x-1">
                          <Button variant="ghost" size="icon" onClick={() => handleEditColumn(column)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDeleteColumn(column.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            <div className="mt-6 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose}>
                Bağla
              </Button>
              <Button className="bg-infoline-blue hover:bg-infoline-dark-blue">
                Yadda saxla
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Column Add/Edit Dialog */}
      <Dialog open={isColumnModalOpen} onOpenChange={setIsColumnModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {columnFormMode === 'create' ? 'Yeni Sütun Əlavə Et' : 'Sütunu Redaktə Et'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="py-4 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="column-name">Sütun adı *</Label>
              <Input
                id="column-name"
                placeholder="Sütun adını daxil edin"
                defaultValue={selectedColumn?.name}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="column-type">Sütun tipi *</Label>
              <Select defaultValue={selectedColumn?.type || 'text'}>
                <SelectTrigger id="column-type">
                  <SelectValue placeholder="Tip seçin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="text">Mətn (Text)</SelectItem>
                  <SelectItem value="number">Rəqəm (Number)</SelectItem>
                  <SelectItem value="date">Tarix (Date)</SelectItem>
                  <SelectItem value="select">Seçim (Select)</SelectItem>
                  <SelectItem value="textarea">Uzun Mətn (Textarea)</SelectItem>
                  <SelectItem value="checkbox">Seçim qutusu (Checkbox)</SelectItem>
                  <SelectItem value="file">Fayl (File)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="column-description">Təsvir</Label>
              <Input
                id="column-description"
                placeholder="Sütun təsvirini daxil edin"
                defaultValue={selectedColumn?.description}
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="column-required">Məcburilik statusu</Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="column-required"
                  defaultChecked={selectedColumn?.required}
                />
                <span className="text-sm text-infoline-dark-gray">Məcburi sahə</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsColumnModalOpen(false)}>
              Ləğv et
            </Button>
            <Button onClick={() => {
              // Dummy implementation - in a real app, collect the form values
              const updatedColumn = {
                ...(selectedColumn || { id: '', order: 0 }),
                name: 'Yeni sütun', // This would be from form value
                type: 'text',        // This would be from form value
                required: true,      // This would be from form value
                description: 'Sütun təsviri' // This would be from form value
              };
              handleSaveColumn(updatedColumn);
            }}>
              {columnFormMode === 'create' ? 'Əlavə et' : 'Yadda saxla'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
