
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Plus, ArrowRight, Save, FileText, BarChart, PieChart, LineChart, Table } from "lucide-react";

export const CustomReportBuilder = () => {
  const [step, setStep] = useState(1);
  const [reportType, setReportType] = useState('table');
  
  // Sample data for selection options
  const categories = [
    { id: '1', name: 'Müəllim Məlumatları' },
    { id: '2', name: 'Şagird Məlumatları' },
    { id: '3', name: 'İnfrastruktur' },
    { id: '4', name: 'Tədris Proqramı' },
  ];
  
  const fields = [
    { id: '1', name: 'Ad', category: '1' },
    { id: '2', name: 'Soyad', category: '1' },
    { id: '3', name: 'Doğum tarixi', category: '1' },
    { id: '4', name: 'Cinsi', category: '1' },
    { id: '5', name: 'Ad', category: '2' },
    { id: '6', name: 'Soyad', category: '2' },
    { id: '7', name: 'Sinif', category: '2' },
    { id: '8', name: 'Strukturlar', category: '3' },
    { id: '9', name: 'Avadanlıqlar', category: '3' },
    { id: '10', name: 'Fənnlər', category: '4' },
  ];
  
  // Sample saved reports
  const savedReports = [
    { id: '1', name: 'Müəllim-Şagird Nisbəti Analizi', type: 'bar', createdAt: '2023-11-15' },
    { id: '2', name: 'Region üzrə İnfrastruktur Göstəriciləri', type: 'pie', createdAt: '2023-12-02' },
    { id: '3', name: 'Aylıq Doldurulma Statistikası', type: 'line', createdAt: '2024-01-05' },
  ];
  
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
        
        <Button variant="outline">
          <Plus className="mr-2 h-4 w-4" />
          Yeni Custom Hesabat
        </Button>
      </div>
      
      <Tabs defaultValue="build">
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
                    <Label htmlFor="report-name">Hesabat adı</Label>
                    <Input id="report-name" placeholder="Hesabat adını daxil edin" />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="category">Kateqoriya</Label>
                    <Select>
                      <SelectTrigger id="category">
                        <SelectValue placeholder="Kateqoriya seçin" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category.id} value={category.id}>{category.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Sahələr</Label>
                    <div className="bg-infoline-lightest-gray p-4 rounded-md max-h-48 overflow-y-auto">
                      {fields.slice(0, 6).map(field => (
                        <div key={field.id} className="flex items-center space-x-2 mb-2">
                          <Checkbox id={`field-${field.id}`} />
                          <Label htmlFor={`field-${field.id}`}>{field.name}</Label>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-end">
                  <Button onClick={() => setStep(2)}>
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
                      <Label htmlFor="filter-region">Region filtri</Label>
                      <Select>
                        <SelectTrigger id="filter-region">
                          <SelectValue placeholder="Region seçin" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Bütün regionlar</SelectItem>
                          <SelectItem value="baku">Bakı</SelectItem>
                          <SelectItem value="ganja">Gəncə</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="filter-sector">Sektor filtri</Label>
                      <Select>
                        <SelectTrigger id="filter-sector">
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
                      <Label htmlFor="group-by">Qruplaşdırma</Label>
                      <Select>
                        <SelectTrigger id="group-by">
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
                      <Label htmlFor="date-filter">Tarix filtri</Label>
                      <Select>
                        <SelectTrigger id="date-filter">
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
                      <Label htmlFor="sort-by">Sıralama</Label>
                      <Select>
                        <SelectTrigger id="sort-by">
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
                      <Select>
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
                    <div className="flex flex-col space-y-4">
                      <div 
                        className={`border rounded-lg p-4 flex items-center space-x-3 cursor-pointer ${reportType === 'table' ? 'border-infoline-blue bg-infoline-lightest-gray' : 'border-infoline-light-gray'}`}
                        onClick={() => setReportType('table')}
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
                        onClick={() => setReportType('bar')}
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
                        onClick={() => setReportType('pie')}
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
                        onClick={() => setReportType('line')}
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
                  <Button onClick={() => console.log("Report generated")}>
                    <Save className="mr-2 h-4 w-4" />
                    Hesabatı Yarat və Saxla
                  </Button>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="saved" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {savedReports.map(report => (
              <div key={report.id} className="bg-white rounded-lg shadow-sm overflow-hidden animate-scale-in">
                <div className="bg-infoline-blue/10 p-4 flex items-center space-x-3">
                  <div className="flex items-center justify-center w-10 h-10 rounded-full bg-infoline-blue/20 text-infoline-blue">
                    {getIconForReportType(report.type)}
                  </div>
                  <div className="flex-1 truncate">
                    <h4 className="font-medium text-infoline-dark-blue truncate">{report.name}</h4>
                    <p className="text-xs text-infoline-dark-gray">Yaradılıb: {new Date(report.createdAt).toLocaleDateString('az-AZ')}</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between">
                    <Button variant="outline" size="sm">
                      Önizlə
                    </Button>
                    <Button size="sm">
                      Düzəliş et
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
