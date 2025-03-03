
export const downloadFile = (blob: Blob, filename: string) => {
  // Create a temporary URL to the file
  const url = window.URL.createObjectURL(blob);
  
  // Create a link element
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  
  // Append the link to body, click it, and then remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Clean up
  window.URL.revokeObjectURL(url);
};

export const exportAsCsv = (data: any[], filename: string = 'export.csv') => {
  // Convert data to CSV
  const headers = Object.keys(data[0]);
  const csvRows = [
    headers.join(','),
    ...data.map(row => 
      headers.map(header => {
        const value = row[header];
        // Handle commas and quotes in the value
        const escaped = value !== null && value !== undefined 
          ? String(value).replace(/"/g, '""') 
          : '';
        return `"${escaped}"`;
      }).join(',')
    )
  ];
  
  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  downloadFile(blob, filename);
};
