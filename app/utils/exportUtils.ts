import { Vessel } from '../types';

export const convertVesselsToCSV = (vessels: Vessel[]): string => {
  // Define CSV headers
  const headers = [
    'ID',
    'Name',
    'Type',
    'MMSI',
    'IMO',
    'Flag',
    'Latitude',
    'Longitude',
    'Speed',
    'Course',
    'Last Update',
    'Risk Level',
    'Region'
  ].join(',');

  // Convert each vessel to CSV row
  const rows = vessels.map(vessel => [
    vessel.id,
    `"${vessel.name}"`,
    vessel.type,
    vessel.mmsi,
    vessel.imo,
    vessel.flag,
    vessel.position.lat,
    vessel.position.lng,
    vessel.speed,
    vessel.course,
    vessel.lastUpdate,
    vessel.riskLevel,
    vessel.region
  ].join(','));

  // Combine headers and rows
  return [headers, ...rows].join('\n');
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