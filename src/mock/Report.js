const mockReportData = Array.from({ length: 30 }, (_, i) => ({
  id: i + 1,
  name: `Report${i + 1}`,
  displayName: `Sample Report ${i + 1}`,
  module: 'Report',
  visibility: i % 2 === 0 ? 'Public' : 'Private',
  mailMergeTemplate: `Template${i + 1}`,
  toBeUsedFor: i % 3 === 0 ? 'Finance' : i % 3 === 1 ? 'HR' : 'Sales',
  status: i % 2 === 0 ? 'Active' : 'Inactive'
}));

export default mockReportData;


