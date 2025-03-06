
import { Button } from "@/components/ui/button";

interface RegionTablePaginationProps {
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
}

export const RegionTablePagination = ({ 
  currentPage, 
  totalPages,
  setCurrentPage 
}: RegionTablePaginationProps) => {
  if (totalPages <= 1) return null;
  
  const pageRange = Array.from({ length: totalPages }, (_, i) => i + 1);
  
  return (
    <div className="flex justify-center my-4">
      <nav className="flex items-center space-x-1">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          Əvvəlki
        </Button>
        
        {pageRange.map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          Sonrakı
        </Button>
      </nav>
    </div>
  );
};
