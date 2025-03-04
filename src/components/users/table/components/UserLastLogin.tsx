
import { Calendar } from "lucide-react";
import { format, parseISO } from "date-fns";
import { az } from "date-fns/locale";

interface UserLastLoginProps {
  dateString: string | null | undefined;
}

export const UserLastLogin = ({ dateString }: UserLastLoginProps) => {
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return "Heç vaxt";
    try {
      return format(parseISO(dateString), "dd.MM.yyyy HH:mm", { locale: az });
    } catch (error) {
      console.error("Date format error:", error);
      return "Tarix xətası";
    }
  };

  return (
    <div className="flex items-center gap-1">
      <Calendar size={14} />
      <span>{formatDate(dateString)}</span>
    </div>
  );
};
