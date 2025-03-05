
import { Form } from "@/components/ui/form";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ModalHeader } from "./ModalHeader";
import { GeneralInfoTab } from "./tabs/GeneralInfoTab";
import { DirectorTab } from "./tabs/DirectorTab";
import { AdminTab } from "./tabs/AdminTab";
import { ModalFooter } from "./ModalFooter";
import { SchoolModalProps } from "./types";
import { useSchoolForm } from "./useSchoolForm";

export const SchoolModalContent = ({
  mode,
  school,
  onClose,
  onSchoolCreated,
  onSchoolUpdated
}: SchoolModalProps) => {
  const {
    form,
    activeTab,
    setActiveTab,
    isSubmitting,
    regions,
    sectors,
    watchedRegionId,
    onSubmit
  } = useSchoolForm(
    mode,
    school,
    onSchoolCreated,
    onSchoolUpdated,
    onClose
  );

  return (
    <>
      <ModalHeader mode={mode} />
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3 mb-4">
              <TabsTrigger value="general">Ümumi Məlumatlar</TabsTrigger>
              <TabsTrigger value="director">Direktor Məlumatları</TabsTrigger>
              <TabsTrigger value="admin">Admin Təyini</TabsTrigger>
            </TabsList>
            
            <TabsContent value="general">
              <GeneralInfoTab 
                form={form}
                regions={regions}
                sectors={sectors}
                watchedRegionId={watchedRegionId}
              />
            </TabsContent>
            
            <TabsContent value="director">
              <DirectorTab form={form} />
            </TabsContent>
            
            <TabsContent value="admin">
              <AdminTab />
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
