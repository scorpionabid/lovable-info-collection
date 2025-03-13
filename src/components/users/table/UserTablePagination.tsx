
import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  setPerPage,
}) => {
  const totalPages = Math.ceil(totalItems / perPage) || 1;

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  const handleNextPage = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(parseInt(value, 10));
    setPage(1); // Reset to first page when changing items per page
  };

  return (
    <div className="flex items-center justify-between py-4">
      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          Səhifə başına nəticə sayı
        </p>
        <Select
          value={perPage.toString()}
          onValueChange={handlePerPageChange}
        >
          <SelectTrigger className="h-8 w-[70px]">
            <SelectValue placeholder={perPage.toString()} />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
            <SelectItem value="20">20</SelectItem>
            <SelectItem value="50">50</SelectItem>
            <SelectItem value="100">100</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center space-x-2">
        <p className="text-sm text-muted-foreground">
          {totalItems > 0 
            ? `${(page - 1) * perPage + 1}-${Math.min(page * perPage, totalItems)} / ${totalItems}` 
            : "0 nəticə"}
        </p>
        <div className="flex items-center space-x-1">
          <Button
            variant="outline"
            size="icon"
            onClick={handlePrevPage}
            disabled={page <= 1}
            className="h-8 w-8"
          >
            <ChevronLeft className="h-4 w-4" />
            <span className="sr-only">Əvvəlki səhifə</span>
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleNextPage}
            disabled={page >= totalPages}
            className="h-8 w-8"
          >
            <ChevronRight className="h-4 w-4" />
            <span className="sr-only">Növbəti səhifə</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
