import { useState, useEffect } from 'react';
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { 
  Form, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormControl 
} from "@/components/ui/form";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { supabase } from '@/supabase/client';

interface Category {
  id: string;
  name: string;
}

interface Region {
  id: string;
  name: string;
}

interface ReportFormProps {
  onSubmit: (categoryId: string, regionIds: string[]) => void;
  isLoading: boolean;
  error: string | null;
}

const ReportForm = ({ onSubmit, isLoading, error }: ReportFormProps) => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [regions, setRegions] = useState<Region[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(undefined);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

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
      const { data, error } = await supabase
        .from('categories')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      setCategories(data || []);
    } catch (err) {
      console.error('Error loading categories:', err);
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
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    setSelectedCategory(categoryId);
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

  const handleGenerateReport = () => {
    if (!selectedCategory) {
      return;
    }
    onSubmit(selectedCategory, selectedRegions);
  };

  return (
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
        
        <Button onClick={handleGenerateReport} disabled={isLoading}>
          {isLoading ? "Yüklənir..." : "Hesabat yarat"}
        </Button>
        {error && <p className="text-red-500">{error}</p>}
      </form>
    </Form>
  );
};

export default ReportForm;
