
import { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, ArrowRight, Save, FileText, BarChart, PieChart, LineChart, Table, Download, Eye } from "lucide-react";
import * as reportService from '@/services/supabase/reportService';
import { toast } from 'sonner';

export const CustomReportBuilder = () => {
  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState('table');
  const [isCreatingNewReport, setIsCreatingNewReport] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    reportType: 'completion',
    category: '',
    fields: [] as string[],
    filterRegion: 'all',
    filterSector: 'all',
    groupBy: 'none',
    dateFilter: 'all',
    sortBy: 'name-asc',
    limit: '20',
    visualType: 'table' as 'table' | 'bar' | 'line' | 'pie'
  });
  
  // Fetch categories
  const { data: categories, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await reportService.supabase
        .from('categories')
        .select('id, name');
      
      if (error) throw error;
      return data;
    }
  });
  
  // Fetch fields based on selected category
  const { data: fields, isLoading: isLoadingFields } = useQuery({
    queryKey: ['categoryFields', formData.category],
    queryFn: async () => {
      if (!formData.category) return [];
      
      const { data, error } = await reportService.supabase
        .from('columns')
        .select('id, name, category_id')
        .eq('category_id', formData.category);
      
      if (error) throw error;
      return data;
    },
    enabled: !!formData.category
  });
  
  // Fetch saved reports
  const { data: savedReports, isLoading: isLoadingSavedReports, refetch: refetchSavedReports } = useQuery({
    queryKey: ['customReports'],
    queryFn: () => reportService.getCustomReports()
  });
  
  // Save report mutation
  const saveReportMutation = useMutation({
    mutationFn: (reportDefinition: reportService.CustomReportDefinition) => 
      reportService.saveCustomReport(reportDefinition),
    onSuccess: () => {
      toast.success('Hesabat uğurla yadda saxlanıldı');
      setIsCreatingNewReport(false);
      refetchSavedReports();
    },
    onError: (error) => {
      toast.error('Hesabat yadda saxlanılarkən xəta baş verdi');
      console.error('Error saving report:', error);
    }
  });
  
  // Handle form changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleCheckboxChange = (fieldId: string, checked: boolean) => {
    setFormData(prev => {
      if (checked) {
        return { ...prev, fields: [...prev.fields, fieldId] };
      } else {
        return { ...prev, fields: prev.fields.filter(id => id !== fieldId) };
      }
    });
  };
  
  const handleVisualTypeChange = (type: 'table' | 'bar' | 'line' | 'pie') => {
    setFormData(prev => ({ ...prev, visualType: type }));
    setReportType(type);
  };
  
  // Reset form when creating a new report
  useEffect(() => {
    if (isCreatingNewReport) {
      setFormData({
        name: '',
        description: '',
        reportType: 'completion',
        category: '',
        fields: [],
        filterRegion: 'all',
        filterSector: 'all',
        groupBy: 'none',
        dateFilter: 'all',
        sortBy: 'name-asc',
        limit: '20',
        visualType: 'table'
      });
      setStep(1);
    }
  }, [isCreatingNewReport]);
  
  // Handle report creation
  const handleCreateReport = () => {
    // Validate form
    if (!formData.name) {
      toast.error('Hesabat adı daxil edin');
      return;
    }
    
    if (!formData.category) {
      toast.error('Kateqoriya seçin');
      return;
    }
    
    if (formData.fields.length === 0) {
      toast.error('Ən azı bir sahə seçin');
      return;
    }
    
    // Create report definition
    const reportDefinition: reportService.CustomReportDefinition = {
      name: formData.name,
      description: formData.description,
      reportType: formData.reportType,
      parameters: {
        category: formData.category,
        fields: formData.fields,
        filterRegion: formData.filterRegion,
        filterSector: formData.filterSector,
        groupBy: formData.groupBy,
        dateFilter: formData.dateFilter,
        sortBy: formData.sortBy,
        limit: formData.limit
      },
      visualType: formData.visualType
    };
    
    // Save report
    saveReportMutation.mutate(reportDefinition);
  };
  
  // Handle export report
  const handleExportReport = async (reportId: string, type: 'xlsx' | 'csv' | 'pdf') => {
    try {
      // Generate and export the report
      const reportData = await reportService.generateCustomReport(reportId);
      
      if (reportData) {
        const success = await reportService.exportReportData(
          reportData.data,
          `${reportData.reportName}_${new Date().toISOString().split('T')[0]}`,
          type
        );
        
        if (success) {
          toast.success(`Hesabat ${type.toUpperCase()} formatında uğurla ixrac edildi`);
        }
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Hesabat ixrac edilərkən xəta baş verdi');
    }
  };
  
  // Get icon for report type
  const getIconForReportType = (type: string) => {
    switch (type) {
      case 'table': return <Table className="h-4 w-4" />;
      case 'bar': return <BarChart className="h-4 w-4" />;
      case 'pie': return <PieChart className="h-4 w-4" />;
      case 'line': return <LineChart className="h-4 w-4" />;
      default: return <FileText className="h-4 w-4" />;
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-infoline-dark-blue">Custom Hesabatlar</h2>
          <p className="text-sm text-infoline-dark-gray mt-1">
            Öz hesabatlarınızı yaradın və yadda saxlayın
          </p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setIsCreatingNewReport(true)}
          disabled={isCreatingNewReport}
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni Custom Hesabat
        </Button>
      </div>
      
      <Tabs defaultValue={isCreatingNewReport ? "build" : "saved"}>
        <TabsList className="w-full bg-white border border-infoline-light-gray p-1 mb-6">
          <TabsTrigger 
            value="build" 
            className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
          >
            Hesabat Yarat
          </TabsTrigger>
          <TabsTrigger 
            value="saved" 
            className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
          >
            Saxlanmış Hesabatlar
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="build" className="mt-6">
          {isCreatingNewReport ? (
            <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
              <div className="flex items-center mb-6">
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-infoline-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
                  1
                </div>
                <div className={`h-1 w-24 ${step >= 2 ? 'bg-infoline-blue' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-infoline-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
                  2
                </div>
                <div className={`h-1 w-24 ${step >= 3 ? 'bg-infoline-blue' : 'bg-gray-200'}`}></div>
                <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-infoline-blue text-white' : 'bg-gray-200 text-gray-500'}`}>
                  3
                </div>
              </div>
              
              {step === 1 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-infoline-dark-blue">Məlumat Mənbəyini Seçin</h3>
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Hesabat adı</Label>
                      <Input 
                        id="name" 
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="Hesabat adını daxil edin" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Təsvir</Label>
                      <Input 
                        id="description" 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Hesabat təsvirini daxil edin" 
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="reportType">Hesabat növü</Label>
                      <Select 
                        value={formData.reportType} 
                        onValueChange={(value) => handleSelectChange('reportType', value)}
                      >
                        <SelectTrigger id="reportType">
                          <SelectValue placeholder="Hesabat növünü seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="completion">Doldurulma Statistikası</SelectItem>
                          <SelectItem value="performance">Performans Analizi</SelectItem>
                          <SelectItem value="trends">Müqayisəli Trendlər</SelectItem>
                          <SelectItem value="custom">Custom Hesabat</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="category">Kateqoriya</Label>
                      <Select 
                        value={formData.category} 
                        onValueChange={(value) => handleSelectChange('category', value)}
                      >
                        <SelectTrigger id="category">
                          <SelectValue placeholder="Kateqoriya seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          {isLoadingCategories ? (
                            <SelectItem value="loading" disabled>Yüklənir...</SelectItem>
                          ) : categories && categories.length > 0 ? (
                            categories.map(category => (
                              <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                            ))
                          ) : (
                            <SelectItem value="empty" disabled>Kateqoriya tapılmadı</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {formData.category && (
                      <div className="space-y-2">
                        <Label>Sahələr</Label>
                        <div className="bg-infoline-lightest-gray p-4 rounded-md max-h-48 overflow-y-auto">
                          {isLoadingFields ? (
                            <div className="flex justify-center items-center py-4">
                              <div className="animate-spin h-5 w-5 border-2 border-infoline-blue border-opacity-50 border-t-infoline-blue rounded-full"></div>
                            </div>
                          ) : fields && fields.length > 0 ? (
                            fields.map(field => (
                              <div key={field.id} className="flex items-center space-x-2 mb-2">
                                <Checkbox 
                                  id={`field-${field.id}`} 
                                  checked={formData.fields.includes(field.id)}
                                  onCheckedChange={(checked) => handleCheckboxChange(field.id, checked as boolean)}
                                />
                                <Label htmlFor={`field-${field.id}`}>{field.name}</Label>
                              </div>
                            ))
                          ) : (
                            <div className="text-center py-2 text-infoline-dark-gray">
                              Bu kateqoriya üçün sahə tapılmadı
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex justify-end">
                    <Button onClick={() => setStep(2)} disabled={!formData.category || formData.fields.length === 0}>
                      Növbəti
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 2 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-infoline-dark-blue">Hesabat Parametrlərini Seçin</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="filterRegion">Region filtri</Label>
                        <Select 
                          value={formData.filterRegion} 
                          onValueChange={(value) => handleSelectChange('filterRegion', value)}
                        >
                          <SelectTrigger id="filterRegion">
                            <SelectValue placeholder="Region seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Bütün regionlar</SelectItem>
                            <SelectItem value="baku">Bakı</SelectItem>
                            <SelectItem value="ganja">Gəncə</SelectItem>
                            <SelectItem value="sumgait">Sumqayıt</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="filterSector">Sektor filtri</Label>
                        <Select 
                          value={formData.filterSector} 
                          onValueChange={(value) => handleSelectChange('filterSector', value)}
                        >
                          <SelectTrigger id="filterSector">
                            <SelectValue placeholder="Sektor seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Bütün sektorlar</SelectItem>
                            <SelectItem value="nesimi">Nəsimi</SelectItem>
                            <SelectItem value="sabunchu">Sabunçu</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="groupBy">Qruplaşdırma</Label>
                        <Select 
                          value={formData.groupBy} 
                          onValueChange={(value) => handleSelectChange('groupBy', value)}
                        >
                          <SelectTrigger id="groupBy">
                            <SelectValue placeholder="Qruplaşdırma seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="none">Qruplaşdırma yoxdur</SelectItem>
                            <SelectItem value="region">Region</SelectItem>
                            <SelectItem value="sector">Sektor</SelectItem>
                            <SelectItem value="school">Məktəb</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="dateFilter">Tarix filtri</Label>
                        <Select 
                          value={formData.dateFilter} 
                          onValueChange={(value) => handleSelectChange('dateFilter', value)}
                        >
                          <SelectTrigger id="dateFilter">
                            <SelectValue placeholder="Tarix filtri seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Bütün tarixlər</SelectItem>
                            <SelectItem value="this-month">Bu ay</SelectItem>
                            <SelectItem value="this-year">Bu il</SelectItem>
                            <SelectItem value="last-year">Keçən il</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="sortBy">Sıralama</Label>
                        <Select 
                          value={formData.sortBy} 
                          onValueChange={(value) => handleSelectChange('sortBy', value)}
                        >
                          <SelectTrigger id="sortBy">
                            <SelectValue placeholder="Sıralama seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="name-asc">Ad (A-Z)</SelectItem>
                            <SelectItem value="name-desc">Ad (Z-A)</SelectItem>
                            <SelectItem value="date-asc">Tarix (Köhnədən yeniyə)</SelectItem>
                            <SelectItem value="date-desc">Tarix (Yenidən köhnəyə)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="limit">Nəticə limiti</Label>
                        <Select 
                          value={formData.limit} 
                          onValueChange={(value) => handleSelectChange('limit', value)}
                        >
                          <SelectTrigger id="limit">
                            <SelectValue placeholder="Limit seçin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="all">Bütün nəticələr</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(1)}>Geri</Button>
                    <Button onClick={() => setStep(3)}>
                      Növbəti
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              {step === 3 && (
                <div className="space-y-6">
                  <h3 className="text-lg font-medium text-infoline-dark-blue">Vizualizasiya Seçin</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div 
                        className={`border rounded-lg p-4 flex items-center space-x-3 cursor-pointer ${reportType === 'table' ? 'border-infoline-blue bg-infoline-lightest-gray' : 'border-infoline-light-gray'}`}
                        onClick={() => handleVisualTypeChange('table')}
                      >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${reportType === 'table' ? 'bg-infoline-blue text-white' : 'bg-infoline-light-gray text-infoline-dark-gray'}`}>
                          <Table className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-infoline-dark-blue">Cədvəl</h4>
                          <p className="text-xs text-infoline-dark-gray">Məlumatları cədvəl formatında göstərir</p>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 flex items-center space-x-3 cursor-pointer ${reportType === 'bar' ? 'border-infoline-blue bg-infoline-lightest-gray' : 'border-infoline-light-gray'}`}
                        onClick={() => handleVisualTypeChange('bar')}
                      >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${reportType === 'bar' ? 'bg-infoline-blue text-white' : 'bg-infoline-light-gray text-infoline-dark-gray'}`}>
                          <BarChart className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-infoline-dark-blue">Bar Qrafik</h4>
                          <p className="text-xs text-infoline-dark-gray">Kateqorik məlumatları müqayisə etmək üçün</p>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 flex items-center space-x-3 cursor-pointer ${reportType === 'pie' ? 'border-infoline-blue bg-infoline-lightest-gray' : 'border-infoline-light-gray'}`}
                        onClick={() => handleVisualTypeChange('pie')}
                      >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${reportType === 'pie' ? 'bg-infoline-blue text-white' : 'bg-infoline-light-gray text-infoline-dark-gray'}`}>
                          <PieChart className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-infoline-dark-blue">Pie Diaqram</h4>
                          <p className="text-xs text-infoline-dark-gray">Proporsional paylanmanı göstərmək üçün</p>
                        </div>
                      </div>
                      
                      <div 
                        className={`border rounded-lg p-4 flex items-center space-x-3 cursor-pointer ${reportType === 'line' ? 'border-infoline-blue bg-infoline-lightest-gray' : 'border-infoline-light-gray'}`}
                        onClick={() => handleVisualTypeChange('line')}
                      >
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${reportType === 'line' ? 'bg-infoline-blue text-white' : 'bg-infoline-light-gray text-infoline-dark-gray'}`}>
                          <LineChart className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-medium text-infoline-dark-blue">Xətt Qrafik</h4>
                          <p className="text-xs text-infoline-dark-gray">Zaman əsaslı məlumatlar və trendlər üçün</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-infoline-lightest-gray p-4 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        {getIconForReportType(reportType)}
                        <p className="text-sm text-infoline-dark-gray mt-2">Vizual önizləmə burada görünəcək</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-between">
                    <Button variant="outline" onClick={() => setStep(2)}>Geri</Button>
                    <Button 
                      onClick={handleCreateReport}
                      disabled={saveReportMutation.isPending}
                    >
                      {saveReportMutation.isPending ? (
                        <>
                          <div className="animate-spin h-4 w-4 mr-2 border-2 border-white border-opacity-50 border-t-white rounded-full"></div>
                          Saxlanılır...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Hesabatı Yarat və Saxla
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm">
              <FileText className="h-16 w-16 text-infoline-light-gray mb-4" />
              <h3 className="text-lg font-medium text-infoline-dark-blue">Hesabat yaratmağa başlayın</h3>
              <p className="text-sm text-infoline-dark-gray mt-1 mb-6">
                Yeni hesabat yaratmaq üçün "Yeni Custom Hesabat" düyməsini klikləyin
              </p>
              <Button onClick={() => setIsCreatingNewReport(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Custom Hesabat
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          {isLoadingSavedReports ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin h-8 w-8 border-4 border-infoline-blue border-opacity-50 border-t-infoline-blue rounded-full"></div>
            </div>
          ) : savedReports && savedReports.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {savedReports.map(report => (
                <div key={report.id} className="bg-white rounded-lg shadow-sm overflow-hidden animate-scale-in">
                  <div className="bg-infoline-blue/10 p-4 flex items-center space-x-3">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-infoline-blue/20 text-infoline-blue">
                      {getIconForReportType(report.visualType)}
                    </div>
                    <div className="flex-1 truncate">
                      <h4 className="font-medium text-infoline-dark-blue truncate">{report.name}</h4>
                      <p className="text-xs text-infoline-dark-gray">
                        Yaradılıb: {new Date(report.createdAt || '').toLocaleDateString('az-AZ')}
                      </p>
                    </div>
                  </div>
                  <div className="p-4">
                    {report.description && (
                      <p className="text-sm text-infoline-dark-gray mb-3 line-clamp-2">
                        {report.description}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <Button variant="outline" size="sm" title="Hesabata bax">
                        <Eye className="h-4 w-4 mr-1" />
                        Önizlə
                      </Button>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline" 
                          title="Excel formatında ixrac et"
                          onClick={() => report.id && handleExportReport(report.id, 'xlsx')}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button 
                          size="sm" 
                          title="Redaktə et"
                          disabled={true} // Would be implemented in a real app
                        >
                          Düzəliş et
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow-sm">
              <FileText className="h-16 w-16 text-infoline-light-gray mb-4" />
              <h3 className="text-lg font-medium text-infoline-dark-blue">Saxlanılmış hesabat yoxdur</h3>
              <p className="text-sm text-infoline-dark-gray mt-1 mb-6">
                İlk hesabatınızı yaratmaq üçün "Yeni Custom Hesabat" düyməsini klikləyin
              </p>
              <Button onClick={() => setIsCreatingNewReport(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Yeni Custom Hesabat
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
