
import {
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ModalHeaderProps {
  mode: 'create' | 'edit';
}

export const ModalHeader = ({ mode }: ModalHeaderProps) => {
  return (
    <DialogHeader>
      <DialogTitle>
        {mode === 'create' ? 'Yeni Məktəb Yarat' : 'Məktəb Məlumatlarını Redaktə Et'}
      </DialogTitle>
      <DialogDescription>
        Zəhmət olmasa aşağıdakı formu doldurun. Bütün məcburi xanaları (*) doldurmağınız vacibdir.
      </DialogDescription>
    </DialogHeader>
  );
};
