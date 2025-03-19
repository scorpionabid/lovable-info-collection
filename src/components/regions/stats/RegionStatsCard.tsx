/**
 * Region statistikası kartı
 * Yeni hook-ların istifadəsi nümunəsi
 */
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useRegionsData } from '../hooks/useRegions';

export function RegionStatsCard() {
  // Sadə sorğu parametrləri ilə useRegionsData hook-unu istifadə edirik
  const { data, isLoading, error } = useRegionsData({
    page: 0,
    pageSize: 5,
    sortColumn: 'name',
    sortDirection: 'asc'
  });
  
  if (isLoading) return (
    <Card>
      <CardHeader>
        <CardTitle>Region Statistikası</CardTitle>
        <CardDescription>Yüklənir...</CardDescription>
      </CardHeader>
    </Card>
  );
  
  if (error) return (
    <Card className="border-red-300">
      <CardHeader>
        <CardTitle>Xəta baş verdi</CardTitle>
        <CardDescription>{error.message}</CardDescription>
      </CardHeader>
    </Card>
  );
  
  const regionCount = data?.count || 0;
  const topRegions = data?.data?.slice(0, 3) || [];
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Region Statistikası</CardTitle>
        <CardDescription>Son məlumatlar</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Ümumi Regionlar</h4>
              <p className="text-2xl font-bold">{regionCount}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-muted-foreground">Orta Tamamlanma</h4>
              <p className="text-2xl font-bold">
                {topRegions.length > 0 
                  ? Math.round(topRegions.reduce((sum, r) => sum + r.completionRate, 0) / topRegions.length) + '%' 
                  : '0%'}
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Ən Son Regionlar</h4>
            <div className="space-y-2">
              {topRegions.map(region => (
                <div key={region.id} className="flex justify-between items-center p-2 bg-muted rounded-md">
                  <span className="font-medium">{region.name}</span>
                  <div className="text-sm text-muted-foreground">
                    <span>{region.sectorCount} sektor</span>
                  </div>
                </div>
              ))}
              {topRegions.length === 0 && (
                <p className="text-sm text-muted-foreground">Region tapılmadı</p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
