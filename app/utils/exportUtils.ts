import { Vessel } from '../types';

export const exportVesselsToCSV = (vessels: Vessel[]): string => {
  const headers = [
    'ID',
    'Name',
    'Type',
    'Status',
    'Latitude',
    'Longitude',
    'Speed',
    'Course'
  ];

  const rows = vessels.map(vessel => [
    vessel.id,
    vessel.name,
    vessel.type,
    vessel.status,
    vessel.location.lat,
    vessel.location.lng,
    vessel.speed,
    vessel.course
  ]);

  const csvContent = [
    headers.join(','),
    ...rows.map(row => row.join(','))
  ].join('\n');

  return csvContent;
};

export const downloadCSV = (csvContent: string, filename: string) => {
  // Create a blob with the CSV content
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Create a download link
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  // Set link properties
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  // Add link to document, click it, and remove it
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}; 