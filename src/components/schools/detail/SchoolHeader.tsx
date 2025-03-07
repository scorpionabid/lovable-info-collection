
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, FileDown, Pencil, Trash } from "lucide-react";

interface SchoolHeaderProps {
  school: {
    name: string;
    type: string;
  };
  onEdit: () => void;
  onExport: () => void;
  onDelete: () => void;
}

export const SchoolHeader = ({
  school,
  onEdit,
  onExport,
  onDelete
}: SchoolHeaderProps) => {
  return (
    <div className="flex justify-between items-center">
      <div className="space-y-1">
        <h2 className="text-2xl font-bold text-infoline-dark-blue">{school.name}</h2>
        <p className="text-sm text-infoline-dark-gray">{school.type}</p>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={onEdit}
        >
          <Pencil className="w-4 h-4 mr-2" />
          Redaktə et
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={onExport}>
              <FileDown className="w-4 h-4 mr-2" />
              Eksport et
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              onClick={onDelete}
              className="text-red-600 focus:text-red-600"
            >
              <Trash className="w-4 h-4 mr-2" />
              Sil
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
