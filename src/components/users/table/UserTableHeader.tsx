
import { ChevronDown, ChevronUp, LucideIcon } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { UserTableHeaderProps } from "./UserTableHeader.props";

export const UserTableHeader = ({ 
  onSelectAll, 
  allSelected, 
  hasUsers = true,
  onSort,
  sortField,
  sortDirection,
  columns = [],
  getSortIcon
}: UserTableHeaderProps) => {
  return (
    <thead className="bg-infoline-lightest-gray">
      <tr>
        <th className="px-4 py-3 text-left">
          <Checkbox 
            checked={allSelected && hasUsers} 
            onCheckedChange={onSelectAll}
          />
        </th>
        
        {columns.length > 0 ? (
          columns.map(column => (
            <th 
              key={column.key}
              className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
              onClick={() => onSort(column.key)}
            >
              <div className="flex items-center gap-1">
                <span>{column.label}</span>
                {sortField === column.key && (
                  sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                )}
              </div>
            </th>
          ))
        ) : (
          <>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
              onClick={() => onSort('name')}
            >
              <div className="flex items-center gap-1">
                <span>Ad Soyad</span>
                {sortField === 'name' && (
                  sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                )}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
              onClick={() => onSort('email')}
            >
              <div className="flex items-center gap-1">
                <span>E-mail</span>
                {sortField === 'email' && (
                  sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                )}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
              onClick={() => onSort('role')}
            >
              <div className="flex items-center gap-1">
                <span>Rol</span>
                {sortField === 'role' && (
                  sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                )}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
              onClick={() => onSort('entity')}
            >
              <div className="flex items-center gap-1">
                <span>Təşkilat</span>
                {sortField === 'entity' && (
                  sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                )}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
              onClick={() => onSort('lastActive')}
            >
              <div className="flex items-center gap-1">
                <span>Son aktivlik</span>
                {sortField === 'lastActive' && (
                  sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                )}
              </div>
            </th>
            <th 
              className="px-4 py-3 text-left text-xs font-medium text-infoline-dark-gray uppercase cursor-pointer"
              onClick={() => onSort('status')}
            >
              <div className="flex items-center gap-1">
                <span>Status</span>
                {sortField === 'status' && (
                  sortDirection === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />
                )}
              </div>
            </th>
          </>
        )}
        
        <th className="px-4 py-3 text-right text-xs font-medium text-infoline-dark-gray uppercase">
          Əməliyyatlar
        </th>
      </tr>
    </thead>
  );
};

export default UserTableHeader;
