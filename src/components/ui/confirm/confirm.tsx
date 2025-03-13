
import React from 'react';
import ReactDOM from 'react-dom';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";

interface ConfirmOptions {
  title: string;
  description: string;
  cancelText?: string;
  confirmText?: string;
}

export const confirm = (options: ConfirmOptions): Promise<boolean> => {
  const { 
    title, 
    description, 
    cancelText = "Ləğv et", 
    confirmText = "Təsdiqlə" 
  } = options;

  return new Promise((resolve) => {
    const container = document.createElement('div');
    container.className = 'confirm-dialog-container';
    document.body.appendChild(container);

    const handleClose = () => {
      ReactDOM.unmountComponentAtNode(container);
      document.body.removeChild(container);
    };

    const handleCancel = () => {
      resolve(false);
      handleClose();
    };

    const handleConfirm = () => {
      resolve(true);
      handleClose();
    };

    ReactDOM.render(
      <AlertDialog defaultOpen>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleCancel}>{cancelText}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirm}>{confirmText}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>,
      container
    );
  });
};
