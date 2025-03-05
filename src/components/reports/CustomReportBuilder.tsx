
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartLoading } from "@/components/dashboard/charts/ChartLoading";
import ReportForm from "./custom-report/ReportForm";
import ReportDisplay from "./custom-report/ReportDisplay";
import { useReportGenerator } from "./custom-report/useReportGenerator";

const CustomReportBuilder = () => {
  const { reportData, isLoading, error, generateReport } = useReportGenerator();

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Xüsusi Hesabat Generatoru</CardTitle>
        </CardHeader>
        <CardContent>
          <ReportForm 
            onSubmit={generateReport}
            isLoading={isLoading}
            error={error}
          />
        </CardContent>
      </Card>

      {isLoading && <ChartLoading />}
      <ReportDisplay reportData={reportData} isLoading={isLoading} />
    </div>
  );
}

export default CustomReportBuilder;
