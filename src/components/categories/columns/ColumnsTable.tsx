
import { Button } from "@/components/ui/button";
import { Plus, GripVertical, Edit, Trash2 } from "lucide-react";
import { CategoryColumn } from "../CategoryDetailView";
import { ColumnsTableProps } from "./types";

export const ColumnsTable = ({
  columns,
  isLoading,
  isError,
  onAddColumn,
  onEditColumn,
  onDeleteColumn,
  onRefetch
}: ColumnsTableProps) => {
  const sortedColumns = [...columns].sort((a, b) => a.order - b.order);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg text-center">
        <p>Sütunları yükləyərkən xəta baş verdi. Zəhmət olmasa bir daha cəhd edin.</p>
        <Button 
          variant="outline" 
          className="mt-2"
          onClick={onRefetch}
        >
          Yenidən cəhd et
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-infoline-dark-gray">
          Bu kateqoriya üçün məlumat sütunlarını idarə edin. Sütunların nizamlanması funksiyası tezliklə əlavə olunacaq.
        </p>
        <Button 
          onClick={onAddColumn}
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
            {sortedColumns.length > 0 ? (
              sortedColumns.map((column, index) => (
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
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onEditColumn(column)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => onDeleteColumn(column.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-infoline-dark-gray">
                  Bu kateqoriya üçün hələ sütun əlavə edilməyib.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
