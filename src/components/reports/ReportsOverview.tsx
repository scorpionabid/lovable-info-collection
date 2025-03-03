
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ReportConfigPanel } from "./ReportConfigPanel";
import { CompletionStatisticsReport } from "./CompletionStatisticsReport";
import { PerformanceAnalysisReport } from "./PerformanceAnalysisReport";
import { ComparativeTrendsReport } from "./ComparativeTrendsReport";
import { CustomReportBuilder } from "./CustomReportBuilder";
import { PlusCircle, FileText, BarChart, LineChart, PieChart } from "lucide-react";

export const ReportsOverview = () => {
  const [selectedReportType, setSelectedReportType] = useState("completion");
  const [isCreatingNewReport, setIsCreatingNewReport] = useState(false);

  return (
    <div className="container mx-auto py-6 space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-infoline-dark-blue">Hesabatlar</h1>
          <p className="text-sm text-infoline-dark-gray mt-1">
            Məlumatlar əsasında analitik hesabatlar və statistikalar
          </p>
        </div>
        <Button onClick={() => setIsCreatingNewReport(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Yeni Hesabat Yarat
        </Button>
      </div>

      {isCreatingNewReport ? (
        <ReportConfigPanel onCancel={() => setIsCreatingNewReport(false)} />
      ) : (
        <Tabs defaultValue="completion" value={selectedReportType} onValueChange={setSelectedReportType}>
          <TabsList className="w-full bg-white border border-infoline-light-gray p-1 mb-6">
            <TabsTrigger 
              value="completion" 
              className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
            >
              <BarChart className="h-4 w-4" />
              Doldurulma Statistikası
            </TabsTrigger>
            <TabsTrigger 
              value="performance" 
              className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
            >
              <LineChart className="h-4 w-4" />
              Performans Analizi
            </TabsTrigger>
            <TabsTrigger 
              value="trends" 
              className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
            >
              <PieChart className="h-4 w-4" />
              Müqayisəli Trendlər
            </TabsTrigger>
            <TabsTrigger 
              value="custom" 
              className="flex items-center gap-2 text-sm px-4 py-2 data-[state=active]:bg-infoline-blue data-[state=active]:text-white"
            >
              <FileText className="h-4 w-4" />
              Custom Hesabatlar
            </TabsTrigger>
          </TabsList>

          <TabsContent value="completion" className="mt-6">
            <CompletionStatisticsReport />
          </TabsContent>
          
          <TabsContent value="performance" className="mt-6">
            <PerformanceAnalysisReport />
          </TabsContent>
          
          <TabsContent value="trends" className="mt-6">
            <ComparativeTrendsReport />
          </TabsContent>
          
          <TabsContent value="custom" className="mt-6">
            <CustomReportBuilder />
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};
