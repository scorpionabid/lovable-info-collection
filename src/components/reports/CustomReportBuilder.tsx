import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as reportService from "@/services/supabase/reportService";
import { supabase } from "@/integrations/supabase/client";
import { ChartLoading } from "@/components/dashboard/charts/ChartLoading";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

interface Category {
  id: string;
  name: string;
}

interface Region {
  id: string;
  name: string;
}

const CustomReportBuilder = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      category: "",
      regions: [],
    },
  });

  useEffect(() => {
    loadCategories();
    loadRegions();
  }, []);

  const loadCategories = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
      setError('Kateqoriyalar yüklənərkən xəta baş verdi');
    } finally {
      setIsLoading(false);
    }
  };

  const loadRegions = async () => {
    try {
      const { data, error } = await supabase
        .from('regions')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setRegions(data || []);
    } catch (err) {
      console.error('Error loading regions:', err);
      setError('Regionlar yüklənərkən xəta baş verdi');
    }
  };

  const generateReport = async () => {
    if (!selectedCategory) {
      setError("Zəhmət olmasa kateqoriya seçin");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const data = await reportService.generateCustomReport(selectedCategory);
      
      setReportData(data);
      toast.success("Hesabat uğurla yaradıldı");
    } catch (err) {
      console.error("Hesabat yaradilarkən xəta baş verdi:", err);
      setError("Hesabat yaradilarkən xəta baş verdi");
      toast.error("Hesabat yaradilarkən xəta baş verdi");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleRegionChange = (regionIds: string[]) => {
    setSelectedRegions(regionIds);
  };

  const toggleRegion = (regionId: string) => {
    setSelectedRegions(prev => {
      if (prev.includes(regionId)) {
        return prev.filter(id => id !== regionId);
      } else {
        return [...prev, regionId];
      }
    });
    
    form.setValue('regions', selectedRegions);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Xüsusi Hesabat Generatoru</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form className="space-y-4">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kateqoriya seçin</FormLabel>
                    <Select onValueChange={(value) => {
                      field.onChange(value);
                      handleCategoryChange(value);
                    }}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Kateqoriya seçin" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="regions"
                render={() => (
                  <FormItem>
                    <FormLabel>Regionları seçin</FormLabel>
                    <div className="space-y-2 border rounded-md p-4">
                      {regions.map((region) => (
                        <div key={region.id} className="flex items-center space-x-2">
                          <Checkbox 
                            id={`region-${region.id}`} 
                            checked={selectedRegions.includes(region.id)}
                            onCheckedChange={() => toggleRegion(region.id)}
                          />
                          <label 
                            htmlFor={`region-${region.id}`}
                            className="text-sm cursor-pointer"
                          >
                            {region.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  </FormItem>
                )}
              />
              
              <Button onClick={generateReport} disabled={isLoading}>
                {isLoading ? "Yüklənir..." : "Hesabat yarat"}
              </Button>
            </form>
          </Form>
          {error && <p className="text-red-500 mt-4">{error}</p>}
        </CardContent>
      </Card>

      {isLoading && <ChartLoading />}

      {reportData && !isLoading && (
        <div className="mt-8">
          <h2 className="text-2xl font-bold mb-4">Hesabat nəticələri:</h2>
          <pre className="bg-gray-100 p-4 rounded-md overflow-auto">{JSON.stringify(reportData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default CustomReportBuilder;
