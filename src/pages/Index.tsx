import { 
  BarChart3, 
  Users, 
  School, 
  BookOpen, 
  Award,
  Map,
  Building2,
  FileText,
  TrendingUp,
  User,
  List,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { Layout } from "@/components/layout/Layout";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from '@/components/dashboard/ChartCard';
import { useAuth } from "@/contexts/AuthContext";

// Sample data for charts
const schoolsData = [
  { name: 'Yanvar', value: 54 },
  { name: 'Fevral', value: 67 },
  { name: 'Mart', value: 80 },
  { name: 'Aprel', value: 95 },
  { name: 'May', value: 120 },
  { name: 'İyun', value: 145 },
];

const completionData = [
  { name: 'Tamamlanmış', value: 65 },
  { name: 'Təsdiqlənmiş', value: 25 },
  { name: 'Gözləmədə', value: 10 },
];

const regionsData = [
  { name: 'Bakı', value: 125 },
  { name: 'Sumqayıt', value: 85 },
  { name: 'Gəncə', value: 67 },
  { name: 'Mingəçevir', value: 45 },
  { name: 'Lənkəran', value: 38 },
  { name: 'Şirvan', value: 28 },
];

const Index = () => {
  const { user } = useAuth();
  
  return (
    <Layout userRole={user?.role}>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-infoline-dark-blue">İdarəetmə Paneli</h1>
        <p className="text-infoline-dark-gray mt-1">Sistem məlumatlarının ümumi statistikası və icmalı</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard 
          title="Məktəblər" 
          value="584" 
          icon={<School size={20} />} 
          change={8}
        />
        <StatCard 
          title="İstifadəçilər" 
          value="1,284" 
          icon={<Users size={20} />} 
          change={12}
          color="green"
        />
        <StatCard 
          title="Regionlar" 
          value="16" 
          icon={<Map size={20} />} 
          color="purple"
        />
        <StatCard 
          title="Sektorlar" 
          value="42" 
          icon={<Building2 size={20} />} 
          change={-5}
          color="yellow"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ChartCard 
          title="Məktəblərin Statistikası" 
          subtitle="Son 6 ay üzrə məktəblərin sayı" 
          type="bar" 
          data={schoolsData} 
        />
        
        <ChartCard 
          title="Məlumat Doldurma Statistikası" 
          subtitle="Cari hesabatların statusu" 
          type="pie" 
          data={completionData} 
          colors={['#34D399', '#60A5FA', '#FBBF24']}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-1 animate-scale-in">
          <h3 className="font-medium text-infoline-dark-blue mb-4">Son Aktivliklər</h3>
          
          <div className="space-y-4">
            {[
              { user: 'Arif Məmmədov', action: 'Bakı regionu üçün yeni məlumat əlavə etdi', time: '15 dəq əvvəl', icon: <FileText size={16} /> },
              { user: 'Leyla Əliyeva', action: 'Sumqayıt məktəbləri hesabatlarını təsdiqlədi', time: '1 saat əvvəl', icon: <CheckCircle size={16} /> },
              { user: 'Elçin Həsənov', action: 'Yeni istifadəçi qeydiyyatı tamamladı', time: '3 saat əvvəl', icon: <User size={16} /> },
              { user: 'Səbinə Hüseynova', action: 'Gəncə region statistikasını yenilədi', time: '5 saat əvvəl', icon: <TrendingUp size={16} /> },
              { user: 'Rəşad Əhmədov', action: 'Lənkəran məktəbləri üçün xəbərdarlıq göndərdi', time: '8 saat əvvəl', icon: <AlertCircle size={16} /> },
            ].map((activity, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-infoline-light-gray rounded-full p-2 text-infoline-dark-blue mt-0.5">
                  {activity.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-infoline-dark-blue">{activity.user}</p>
                  <p className="text-xs text-infoline-dark-gray">{activity.action}</p>
                  <p className="text-xs text-infoline-dark-gray mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-4 text-center text-sm text-infoline-blue hover:underline">
            Bütün aktivlikləri göstər
          </button>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm p-6 lg:col-span-2 animate-scale-in">
          <h3 className="font-medium text-infoline-dark-blue mb-4">Region Statistikası</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-infoline-light-gray">
                  <th className="text-left text-xs font-medium text-infoline-dark-gray uppercase py-3 px-4">Region</th>
                  <th className="text-left text-xs font-medium text-infoline-dark-gray uppercase py-3 px-4">Məktəblər</th>
                  <th className="text-left text-xs font-medium text-infoline-dark-gray uppercase py-3 px-4">İrəliləyiş</th>
                  <th className="text-left text-xs font-medium text-infoline-dark-gray uppercase py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-infoline-light-gray">
                {regionsData.map((region, index) => (
                  <tr key={index} className="hover:bg-infoline-lightest-gray transition-colors">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-2">
                        <Map size={16} className="text-infoline-blue" />
                        <span className="font-medium text-infoline-dark-blue">{region.name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-infoline-dark-blue">{region.value}</td>
                    <td className="py-3 px-4">
                      <div className="w-full bg-infoline-light-gray rounded-full h-2">
                        <div 
                          className="bg-infoline-blue h-2 rounded-full" 
                          style={{ width: `${Math.min(100, 20 + index * 15)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs text-infoline-dark-gray mt-1 inline-block">
                        {Math.min(100, 20 + index * 15)}% tamamlandı
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        index === 0 ? 'bg-green-100 text-green-800' : 
                        index === 1 ? 'bg-blue-100 text-blue-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {index === 0 ? 'Tamamlandı' : index === 1 ? 'Davam edir' : 'Başlanğıc'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <button className="w-full mt-4 text-center text-sm text-infoline-blue hover:underline">
            Bütün regionları göstər
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium text-infoline-dark-blue">Sürətli Giriş</h3>
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {[
            { name: 'Hesabatlar', icon: <FileText size={24} />, color: 'bg-blue-500' },
            { name: 'İstifadəçilər', icon: <Users size={24} />, color: 'bg-green-500' },
            { name: 'Məktəblər', icon: <School size={24} />, color: 'bg-purple-500' },
            { name: 'Müəllimlər', icon: <BookOpen size={24} />, color: 'bg-yellow-500' },
            { name: 'Statistikalar', icon: <BarChart3 size={24} />, color: 'bg-red-500' },
            { name: 'Nailiyyətlər', icon: <Award size={24} />, color: 'bg-indigo-500' },
          ].map((item, index) => (
            <div 
              key={index}
              className="flex flex-col items-center justify-center p-4 rounded-lg border border-infoline-light-gray hover:border-infoline-blue hover:shadow-md transition-all cursor-pointer"
            >
              <div className={`${item.color} text-white p-3 rounded-lg mb-3`}>
                {item.icon}
              </div>
              <span className="text-sm text-infoline-dark-blue font-medium">{item.name}</span>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default Index;
