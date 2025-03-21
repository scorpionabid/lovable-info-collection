import React from 'react';

export interface SchoolFormProps {
  initialData?: any;
  mode: 'create' | 'edit';
  onSuccess: () => void;
  onCancel: () => void;
}

const SchoolForm: React.FC<SchoolFormProps> = ({ initialData, mode, onSuccess, onCancel }) => {
  const [formData, setFormData] = React.useState({
    name: initialData?.name || '',
    code: initialData?.code || '',
    region_id: initialData?.region_id || '',
    sector_id: initialData?.sector_id || '',
    type_id: initialData?.type_id || '',
    address: initialData?.address || '',
    director: initialData?.director || '',
    email: initialData?.email || '',
    phone: initialData?.phone || '',
    status: initialData?.status || 'Aktiv',
    student_count: initialData?.student_count || 0,
    teacher_count: initialData?.teacher_count || 0
  });
  
  const [errors, setErrors] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [regions, setRegions] = React.useState([]);
  const [sectors, setSectors] = React.useState([]);
  const [schoolTypes, setSchoolTypes] = React.useState([]);
  
  // Fetch regions, sectors, and school types on component mount
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch regions
        const regionsResponse = await fetch('/api/regions');
        const regionsData = await regionsResponse.json();
        setRegions(regionsData);
        
        // Fetch sectors
        const sectorsResponse = await fetch('/api/sectors');
        const sectorsData = await sectorsResponse.json();
        setSectors(sectorsData);
        
        // Fetch school types
        const typesResponse = await fetch('/api/school-types');
        const typesData = await typesResponse.json();
        setSchoolTypes(typesData);
      } catch (error) {
        console.error('Error fetching form data:', error);
      }
    };
    
    fetchData();
  }, []);
  
  // Filter sectors based on selected region
  const filteredSectors = React.useMemo(() => {
    if (!formData.region_id) return sectors;
    return sectors.filter(sector => sector.region_id === formData.region_id);
  }, [sectors, formData.region_id]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear errors when field is changed
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
  };
  
  const handleNumberChange = (e) => {
    const { name, value } = e.target;
    const numValue = parseInt(value, 10) || 0;
    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Məktəb adı tələb olunur';
    }
    
    if (!formData.region_id) {
      newErrors.region_id = 'Region seçilməlidir';
    }
    
    if (!formData.sector_id) {
      newErrors.sector_id = 'Sektor seçilməlidir';
    }
    
    if (!formData.type_id) {
      newErrors.type_id = 'Məktəb tipi seçilməlidir';
    }
    
    if (formData.email && !/^\S+@\S+\.\S+$/.test(formData.email)) {
      newErrors.email = 'Düzgün email formatı daxil edin';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const url = mode === 'create' 
        ? '/api/schools' 
        : `/api/schools/${initialData.id}`;
      
      const method = mode === 'create' ? 'POST' : 'PUT';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error('Server error');
      }
      
      onSuccess();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors(prev => ({
        ...prev,
        submit: 'Məlumatları yadda saxlayarkən xəta baş verdi'
      }));
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        {mode === 'create' ? 'Yeni Məktəb Əlavə Et' : 'Məktəb Məlumatlarını Redaktə Et'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Məktəb adı */}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium">
              Məktəb adı *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
          </div>
          
          {/* Məktəb kodu */}
          <div className="space-y-2">
            <label htmlFor="code" className="block text-sm font-medium">
              Məktəb kodu
            </label>
            <input
              id="code"
              name="code"
              type="text"
              value={formData.code}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Region */}
          <div className="space-y-2">
            <label htmlFor="region_id" className="block text-sm font-medium">
              Region *
            </label>
            <select
              id="region_id"
              name="region_id"
              value={formData.region_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.region_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Seçin</option>
              {regions.map(region => (
                <option key={region.id} value={region.id}>
                  {region.name}
                </option>
              ))}
            </select>
            {errors.region_id && <p className="text-red-500 text-sm">{errors.region_id}</p>}
          </div>
          
          {/* Sektor */}
          <div className="space-y-2">
            <label htmlFor="sector_id" className="block text-sm font-medium">
              Sektor *
            </label>
            <select
              id="sector_id"
              name="sector_id"
              value={formData.sector_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.sector_id ? 'border-red-500' : 'border-gray-300'}`}
              disabled={!formData.region_id}
            >
              <option value="">Seçin</option>
              {filteredSectors.map(sector => (
                <option key={sector.id} value={sector.id}>
                  {sector.name}
                </option>
              ))}
            </select>
            {errors.sector_id && <p className="text-red-500 text-sm">{errors.sector_id}</p>}
          </div>
          
          {/* Məktəb tipi */}
          <div className="space-y-2">
            <label htmlFor="type_id" className="block text-sm font-medium">
              Məktəb tipi *
            </label>
            <select
              id="type_id"
              name="type_id"
              value={formData.type_id}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.type_id ? 'border-red-500' : 'border-gray-300'}`}
            >
              <option value="">Seçin</option>
              {schoolTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
            {errors.type_id && <p className="text-red-500 text-sm">{errors.type_id}</p>}
          </div>
          
          {/* Ünvan */}
          <div className="space-y-2">
            <label htmlFor="address" className="block text-sm font-medium">
              Ünvan
            </label>
            <input
              id="address"
              name="address"
              type="text"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Direktor */}
          <div className="space-y-2">
            <label htmlFor="director" className="block text-sm font-medium">
              Direktor
            </label>
            <input
              id="director"
              name="director"
              type="text"
              value={formData.director}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Email */}
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full p-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
          </div>
          
          {/* Telefon */}
          <div className="space-y-2">
            <label htmlFor="phone" className="block text-sm font-medium">
              Telefon
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Şagird sayı */}
          <div className="space-y-2">
            <label htmlFor="student_count" className="block text-sm font-medium">
              Şagird sayı
            </label>
            <input
              id="student_count"
              name="student_count"
              type="number"
              min="0"
              value={formData.student_count}
              onChange={handleNumberChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Müəllim sayı */}
          <div className="space-y-2">
            <label htmlFor="teacher_count" className="block text-sm font-medium">
              Müəllim sayı
            </label>
            <input
              id="teacher_count"
              name="teacher_count"
              type="number"
              min="0"
              value={formData.teacher_count}
              onChange={handleNumberChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          
          {/* Status */}
          <div className="space-y-2">
            <label htmlFor="status" className="block text-sm font-medium">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value="Aktiv">Aktiv</option>
              <option value="Deaktiv">Deaktiv</option>
              <option value="Müvəqqəti bağlı">Müvəqqəti bağlı</option>
            </select>
          </div>
        </div>
        
        {errors.submit && (
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-lg">
            {errors.submit}
          </div>
        )}
        
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            disabled={isSubmitting}
          >
            Ləğv et
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Yüklənir...' : mode === 'create' ? 'Əlavə et' : 'Yadda saxla'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SchoolForm;
