import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent, CardTitle } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Trash, RefreshCw, BarChart2, Clock } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';

// Performans məlumatları üçün tip
export interface PerformanceEntry {
  id: string;
  operation: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
  status: 'success' | 'error';
  errorMessage?: string;
}

/**
 * Performans monitorinqi üçün UI komponenti
 * Bu komponent performans məlumatlarını göstərir və analiz edir
 */
export const PerformanceMonitorUI: React.FC = () => {
  // Performans məlumatlarını local storage-dən əldə edirik
  const [entries, setEntries] = useLocalStorage<PerformanceEntry[]>('performance_logs', []);
  const [filter, setFilter] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'timestamp' | 'duration'>('timestamp');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Məlumatları filtrlə və sırala
  const filteredEntries = entries
    .filter(entry => filter === 'all' || entry.operation.includes(filter))
    .sort((a, b) => {
      const order = sortOrder === 'asc' ? 1 : -1;
      return sortBy === 'timestamp' 
        ? order * (a.timestamp - b.timestamp)
        : order * (a.duration - b.duration);
    });

  // Ortalama performans hesablaması
  const getAveragePerformance = (operationType: string) => {
    const relevantEntries = entries.filter(e => e.operation.includes(operationType) && e.status === 'success');
    if (relevantEntries.length === 0) return 0;
    
    const totalDuration = relevantEntries.reduce((sum, entry) => sum + entry.duration, 0);
    return totalDuration / relevantEntries.length;
  };

  // Performans statistikaları
  const stats = {
    apiCalls: entries.filter(e => e.operation.includes('api.')).length,
    queries: entries.filter(e => e.operation.includes('query')).length,
    avgApiTime: getAveragePerformance('api.'),
    avgQueryTime: getAveragePerformance('query'),
    errors: entries.filter(e => e.status === 'error').length
  };

  // Bütün logları təmizlə
  const clearLogs = () => {
    if (window.confirm('Bütün performans loglarını silmək istədiyinizə əminsiniz?')) {
      setEntries([]);
    }
  };

  // Logu sil
  const deleteEntry = (id: string) => {
    setEntries(entries.filter(entry => entry.id !== id));
  };

  // Vaxtı formatla
  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString();
  };

  // Millisaniyəni formatla
  const formatDuration = (ms: number) => {
    if (ms < 1000) return `${ms.toFixed(2)}ms`;
    return `${(ms / 1000).toFixed(2)}s`;
  };

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>Performans Monitorinqi</span>
            <Button variant="outline" size="sm" onClick={clearLogs}>
              <Trash className="h-4 w-4 mr-2" />
              Logları Təmizlə
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">API Sorğuları</p>
                    <p className="text-2xl font-bold">{stats.apiCalls}</p>
                  </div>
                  <BarChart2 className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Orta vaxt: {formatDuration(stats.avgApiTime)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Verilənlər Bazası Sorğuları</p>
                    <p className="text-2xl font-bold">{stats.queries}</p>
                  </div>
                  <Clock className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Orta vaxt: {formatDuration(stats.avgQueryTime)}
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Xətalar</p>
                    <p className="text-2xl font-bold">{stats.errors}</p>
                  </div>
                  <Badge variant={stats.errors > 0 ? "destructive" : "outline"}>
                    {stats.errors > 0 ? 'Xəta var' : 'Xəta yoxdur'}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  Son yenilənmə: {new Date().toLocaleTimeString()}
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="flex justify-between items-center mb-4">
            <div className="flex space-x-2">
              <Button 
                variant={filter === 'all' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                Hamısı
              </Button>
              <Button 
                variant={filter === 'api.' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('api.')}
              >
                API
              </Button>
              <Button 
                variant={filter === 'query' ? 'default' : 'outline'} 
                size="sm"
                onClick={() => setFilter('query')}
              >
                Sorğular
              </Button>
            </div>
            
            <div className="flex space-x-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (sortBy === 'timestamp') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('timestamp');
                    setSortOrder('desc');
                  }
                }}
              >
                Vaxt {sortBy === 'timestamp' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  if (sortBy === 'duration') {
                    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    setSortBy('duration');
                    setSortOrder('desc');
                  }
                }}
              >
                Müddət {sortBy === 'duration' && (sortOrder === 'asc' ? '↑' : '↓')}
              </Button>
            </div>
          </div>
          
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Əməliyyat</TableHead>
                  <TableHead>Vaxt</TableHead>
                  <TableHead>Müddət</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Əməliyyatlar</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEntries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-4">
                      Heç bir performans loqu tapılmadı
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEntries.slice(0, 50).map((entry) => (
                    <TableRow key={entry.id}>
                      <TableCell className="font-medium">{entry.operation}</TableCell>
                      <TableCell>{formatTime(entry.timestamp)}</TableCell>
                      <TableCell>{formatDuration(entry.duration)}</TableCell>
                      <TableCell>
                        <Badge variant={entry.status === 'success' ? 'outline' : 'destructive'}>
                          {entry.status === 'success' ? 'Uğurlu' : 'Xəta'}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="sm"
                          onClick={() => deleteEntry(entry.id)}
                        >
                          <Trash className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
          
          {filteredEntries.length > 50 && (
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Yalnız son 50 qeyd göstərilir. Ümumi qeyd sayı: {filteredEntries.length}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformanceMonitorUI;
