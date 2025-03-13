import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryColumnsModal } from './CategoryColumnsModal';
import { CategoryModal } from './CategoryModal';
import { 
  ArrowLeft, 
  Edit, 
  Download, 
  BarChart4, 
  Table2, 
  Share2, 
  Archive,
  AlertCircle,
  Clock,
  CheckCircle2,
  XCircle
} from "lucide-react";

export interface CategoryColumn {
  id: string;
  name: string;
  type: string;
  required: boolean;
  description: string;
  options?: string[] | any;
  order: number;
}

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  assignment: string;
  columns: CategoryColumn[];
  status: string;
  priority: number;
  completionRate: number;
  region_id?: string;
  sector_id?: string;
  school_id?: string;
  school_type_id?: string;
  created_at?: string;
  updated_at?: string;
  created_by?: string;
  createdAt: string;
  deadline: string;
}

interface CategoryDetailViewProps {
  category: CategoryType;
}

export const CategoryDetailView = ({ category }: CategoryDetailViewProps) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isColumnsModalOpen, setIsColumnsModalOpen] = useState(false);
  
  const columnsCount = category.columns.length;
  
  const regionCompletionData = [
    { name: 'Bakı şəhəri', completion: 85 },
    { name: 'Gəncə şəhəri', completion: 72 },
    { name: 'Sumqayıt şəhəri', completion: 65 },
    { name: 'Şəki rayonu', completion: 58 },
    { name: 'Quba rayonu', completion: 43 }
  ];
  
  const deadlineDate = new Date(category.deadline);
  const today = new Date();
  const daysUntilDeadline = Math.ceil((deadlineDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  
  const getDeadlineStatus = () => {
    if (daysUntilDeadline > 7) {
      return { status: 'normal', text: `${daysUntilDeadline} gün qalıb`, icon: Clock, color: 'text-blue-500' };
    } else if (daysUntilDeadline > 0) {
      return { status: 'warning', text: `${daysUntilDeadline} gün qalıb`, icon: AlertCircle, color: 'text-amber-500' };
    } else if (daysUntilDeadline === 0) {
      return { status: 'critical', text: 'Bu gün son gündür', icon: AlertCircle, color: 'text-red-500' };
    } else {
      return { status: 'overdue', text: `${Math.abs(daysUntilDeadline)} gün gecikir`, icon: XCircle, color: 'text-red-600' };
    }
  };
  
  const deadlineInfo = getDeadlineStatus();
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="icon"
            onClick={() => navigate('/categories')}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-infoline-dark-blue">{category.name}</h1>
            <p className="text-infoline-dark-gray">{category.description}</p>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsColumnsModalOpen(true)}
          >
            <Table2 className="h-4 w-4" />
            Sütunları idarə et
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download className="h-4 w-4" />
            Excel şablonu
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Share2 className="h-4 w-4" />
            Paylaş
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Archive className="h-4 w-4" />
            Arxivləşdir
          </Button>
          
          <Button 
            className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Redaktə et
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-infoline-dark-gray text-sm">Sütun sayı</p>
              <h3 className="text-2xl font-bold text-infoline-dark-blue">{columnsCount}</h3>
            </div>
            <div className="bg-blue-100 p-2 rounded-full">
              <Table2 className="h-5 w-5 text-infoline-blue" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-infoline-dark-gray text-sm">Təyinat</p>
              <h3 className="text-2xl font-bold text-infoline-dark-blue">{category.assignment}</h3>
            </div>
            <div className="bg-purple-100 p-2 rounded-full">
              <Share2 className="h-5 w-5 text-purple-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-infoline-dark-gray text-sm">Doldurma faizi</p>
              <h3 className="text-2xl font-bold text-infoline-dark-blue">{category.completionRate}%</h3>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="h-2.5 rounded-full" 
                  style={{ 
                    width: `${category.completionRate}%`,
                    backgroundColor: category.completionRate > 80 ? '#10B981' : category.completionRate > 50 ? '#F59E0B' : '#EF4444'
                  }}
                ></div>
              </div>
            </div>
            <div className="bg-green-100 p-2 rounded-full">
              <BarChart4 className="h-5 w-5 text-green-600" />
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-infoline-dark-gray text-sm">Son tarix</p>
              <h3 className="text-lg font-bold text-infoline-dark-blue">
                {new Date(category.deadline).toLocaleDateString('az-AZ')}
              </h3>
              <div className={`flex items-center gap-1 mt-1 ${deadlineInfo.color}`}>
                <deadlineInfo.icon className="h-4 w-4" />
                <span className="text-sm">{deadlineInfo.text}</span>
              </div>
            </div>
            <div className={`bg-${deadlineInfo.status === 'overdue' ? 'red' : deadlineInfo.status === 'critical' ? 'amber' : 'blue'}-100 p-2 rounded-full`}>
              <Clock className={`h-5 w-5 ${deadlineInfo.color}`} />
            </div>
          </div>
        </div>
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="bg-white rounded-lg shadow-sm">
        <div className="px-4 pt-4 border-b">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">İcmal</TabsTrigger>
            <TabsTrigger value="columns">Sütunlar</TabsTrigger>
            <TabsTrigger value="statistics">Statistika</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="overview" className="p-4 space-y-4">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-medium text-infoline-dark-blue mb-2">Kateqoriya məlumatları</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-infoline-dark-gray">Yaradılma tarixi</p>
                  <p className="font-medium">{new Date(category.createdAt).toLocaleDateString('az-AZ')}</p>
                </div>
                <div>
                  <p className="text-sm text-infoline-dark-gray">Status</p>
                  <p className="font-medium">{category.status === 'Active' ? 'Aktiv' : 'Deaktiv'}</p>
                </div>
                <div>
                  <p className="text-sm text-infoline-dark-gray">Prioritet</p>
                  <p className="font-medium">{category.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-infoline-dark-gray">Təyinat</p>
                  <p className="font-medium">{category.assignment}</p>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-medium text-infoline-dark-blue mb-2">Doldurma proqresi</h3>
              <div className="border rounded-lg p-4">
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-infoline-dark-gray">Ümumi proqres</span>
                    <span className="text-sm font-medium">{category.completionRate}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${category.completionRate}%`,
                        backgroundColor: category.completionRate > 80 ? '#10B981' : category.completionRate > 50 ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-infoline-dark-blue mb-2">Regionlar üzrə doldurma</h4>
                <div className="space-y-3">
                  {regionCompletionData.map((region) => (
                    <div key={region.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-infoline-dark-gray">{region.name}</span>
                        <span className="text-sm font-medium">{region.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full" 
                          style={{ 
                            width: `${region.completion}%`,
                            backgroundColor: region.completion > 80 ? '#10B981' : region.completion > 50 ? '#F59E0B' : '#EF4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="columns" className="p-4">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-infoline-dark-blue">Sütunlar</h3>
              <Button 
                className="bg-infoline-blue hover:bg-infoline-dark-blue"
                onClick={() => setIsColumnsModalOpen(true)}
              >
                <Table2 className="mr-2 h-4 w-4" />
                Sütunları idarə et
              </Button>
            </div>
            
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
                    <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">#</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Sütun adı</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Tip</th>
                    <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Məcburilik</th>
                    <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Təsvir</th>
                  </tr>
                </thead>
                <tbody>
                  {category.columns.map((column, index) => (
                    <tr key={column.id} className="border-b border-infoline-light-gray">
                      <td className="px-4 py-3 text-sm text-infoline-dark-gray">{index + 1}</td>
                      <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{column.name}</td>
                      <td className="px-4 py-3 text-sm text-infoline-dark-gray capitalize">{column.type}</td>
                      <td className="px-4 py-3 text-center">
                        {column.required ? (
                          <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-400 mx-auto" />
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-infoline-dark-gray">{column.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="statistics" className="p-4">
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-infoline-dark-blue">Doldurma statistikası</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium text-infoline-dark-blue mb-4">Region səviyyəsində doldurma</h4>
                <div className="space-y-4">
                  {regionCompletionData.map((region) => (
                    <div key={region.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm text-infoline-dark-gray">{region.name}</span>
                        <span className="text-sm font-medium">{region.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div 
                          className="h-2.5 rounded-full" 
                          style={{ 
                            width: `${region.completion}%`,
                            backgroundColor: region.completion > 80 ? '#10B981' : region.completion > 50 ? '#F59E0B' : '#EF4444'
                          }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="border rounded-lg p-4">
                <h4 className="text-md font-medium text-infoline-dark-blue mb-4">Status üzrə məktəblər</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-green-500"></div>
                      <span className="text-sm text-infoline-dark-gray">Tamamlanmış</span>
                    </div>
                    <span className="text-sm font-medium">324 məktəb (45%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                      <span className="text-sm text-infoline-dark-gray">Qismən tamamlanmış</span>
                    </div>
                    <span className="text-sm font-medium">210 məktəb (29%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500"></div>
                      <span className="text-sm text-infoline-dark-gray">Başlanmamış</span>
                    </div>
                    <span className="text-sm font-medium">186 məktəb (26%)</span>
                  </div>
                  
                  <div className="h-4 bg-gray-200 rounded-full mt-3 flex overflow-hidden">
                    <div className="h-full bg-green-500" style={{ width: '45%' }}></div>
                    <div className="h-full bg-amber-500" style={{ width: '29%' }}></div>
                    <div className="h-full bg-red-500" style={{ width: '26%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
      
      {isEditModalOpen && (
        <CategoryModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          mode="edit"
          category={category}
        />
      )}
      
      {isColumnsModalOpen && (
        <CategoryColumnsModal 
          isOpen={isColumnsModalOpen} 
          onClose={() => setIsColumnsModalOpen(false)} 
          category={category}
        />
      )}
    </div>
  );
};
