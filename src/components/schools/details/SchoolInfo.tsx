
import { School } from '@/supabase/types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useSchoolType } from '@/components/schools/hooks/useSchoolType';

interface SchoolInfoProps {
  school: School;
}

export const SchoolInfo = ({ school }: SchoolInfoProps) => {
  // Correctly fetch the school type
  const { data: schoolTypeData } = useSchoolType({ 
    typeId: school.type_id,
    enabled: !!school.type_id
  });

  // Only use the type if it's available
  const schoolType = schoolTypeData ? schoolTypeData.name : 'Unknown';

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-xl font-bold">School Information</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">School Name</p>
            <p className="font-medium">{school.name}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Code</p>
            <p className="font-medium">{school.code || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Type</p>
            <p className="font-medium">{schoolType}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Region</p>
            <p className="font-medium">{school.region || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Sector</p>
            <p className="font-medium">{school.sector || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Address</p>
            <p className="font-medium">{school.address || '-'}</p>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Status</p>
            <Badge variant={school.archived ? "secondary" : "success"}>
              {school.archived ? 'Archived' : 'Active'}
            </Badge>
          </div>
          
          <div>
            <p className="text-sm text-muted-foreground">Created At</p>
            <p className="font-medium">
              {new Date(school.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SchoolInfo;
