
import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModalHeader } from "./ModalHeader";
import { GeneralInfoTab } from "./tabs/GeneralInfoTab";
import { AdminTab } from "./tabs/AdminTab";
import { ModalFooter } from "./ModalFooter";
import { SchoolModalProps } from "./types";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SchoolFormValues, schoolSchema } from "./types";

export const SchoolModalContent = ({
  mode,
  school,
  onClose,
  onSchoolCreated,
  onSchoolUpdated
}: SchoolModalProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<SchoolFormValues>({
    resolver: zodResolver(schoolSchema),
    defaultValues: {
      name: school?.name || "",
      type: school?.type || "",
      regionId: school?.region_id || "",
      sectorId: school?.sector_id || "",
      studentCount: school?.studentCount || 0,
      teacherCount: school?.teacherCount || 0,
      address: school?.address || "",
      contactEmail: school?.contactEmail || "",
      contactPhone: school?.contactPhone || "",
      status: school?.status || "Aktiv",
    }
  });

  const watchedRegionId = form.watch("regionId");

  const onSubmit = async (data: SchoolFormValues) => {
    setIsSubmitting(true);
    try {
      // Submit the form data
      console.log("Form data submitted:", data);
      // Here you would normally call a service to save the data
      setIsSubmitting(false);
      
      if (mode === 'create' && onSchoolCreated) {
        onSchoolCreated();
      } else if (mode === 'edit' && onSchoolUpdated) {
        onSchoolUpdated();
      }
      
      if (onClose) onClose();
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <ModalHeader mode={mode} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="general">Ümumi Məlumatlar</TabsTrigger>
              <TabsTrigger value="admin">Admin Təyini</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <GeneralInfoTab 
                form={form}
                regions={[]}
                sectors={[]}
                schoolTypes={[]}
                watchedRegionId={watchedRegionId}
              />
            </TabsContent>
            
            <TabsContent value="admin">
              <AdminTab schoolId={school?.id} />
            </TabsContent>
          </Tabs>
          
          <ModalFooter 
            onClose={onClose} 
            isSubmitting={isSubmitting} 
            mode={mode} 
          />
        </form>
      </Form>
    </>
  );
};
