
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface ModalHeaderProps {
  title: string;
  onClose: () => void;
}

export const ModalHeader = ({ title, onClose }: ModalHeaderProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b border-infoline-light-gray">
      <h2 className="text-xl font-semibold text-infoline-dark-blue">{title}</h2>
      <Button variant="ghost" size="icon" onClick={onClose}>
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};
