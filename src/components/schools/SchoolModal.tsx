
import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { School } from "@/services/supabase/school/types";
import { useToast } from "@/hooks/use-toast";

export interface SchoolModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  school?: School;
  regionId?: string;
  sectorId?: string;
  onCreated?: () => void;
}

export const SchoolModal = ({
  isOpen,
  onClose,
  mode,
  school,
  regionId,
  sectorId,
  onCreated
}: SchoolModalProps) => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Placeholder function to demonstrate form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Simulating an API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: mode === "create" ? "School created" : "School updated",
        description: "The operation was successful"
      });
      
      if (onCreated) {
        onCreated();
      }
      
      onClose();
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "An error occurred during the operation",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Create New School" : "Edit School"}
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="general">General Information</TabsTrigger>
            <TabsTrigger value="details">Additional Details</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general" className="space-y-4 py-4">
            <p>General school information form would go here</p>
            {/* This is a placeholder - implement actual form fields */}
          </TabsContent>
          
          <TabsContent value="details" className="space-y-4 py-4">
            <p>Additional school details form would go here</p>
            {/* This is a placeholder - implement actual form fields */}
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            className="px-4 py-2 border rounded-md"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded-md"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting
              ? "Saving..."
              : mode === "create"
              ? "Create"
              : "Save Changes"}
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
