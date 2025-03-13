
import React from 'react';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface UserTablePaginationProps {
  page: number;
  perPage: number;
  totalItems: number;
  setPage: (page: number) => void;
  setPerPage: (perPage: number) => void;
}

export const UserTablePagination: React.FC<UserTablePaginationProps> = ({
  page,
  perPage,
  totalItems,
  setPage,
  setPerPage
}) => {
  const totalPages = Math.ceil(totalItems / perPage);
  
  const handlePerPageChange = (value: string) => {
    setPerPage(parseInt(value));
    setPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-2">
      <div className="text-sm text-gray-500">
        Cəmi {totalItems} qeyd
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Səhifə başına:</span>
          <Select value={perPage.toString()} onValueChange={handlePerPageChange}>
            <SelectTrigger className="w-16">
              <SelectValue placeholder={perPage.toString()} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(1)}
            disabled={page === 1}
          >
            &lt;&lt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            &lt;
          </Button>
          
          <span className="mx-2 text-sm">
            {page} / {totalPages || 1}
          </span>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(page + 1)}
            disabled={page >= totalPages}
          >
            &gt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(totalPages)}
            disabled={page >= totalPages}
          >
            &gt;&gt;
          </Button>
        </div>
      </div>
    </div>
  );
};
