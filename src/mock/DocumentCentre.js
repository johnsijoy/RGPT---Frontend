// src/mock/mockDocumentCentre.js

const mockDocuments = [
  {
    id: 1,
    name: 'Report Logo',
    category: 'Report Images',
    description: 'Logo for final reports',
    assignedTo: ['Team Orbit'],
    teams: ['Public Team'],
  },
  {
    id: 2,
    name: 'Inner Logo',
    category: 'Logos',
    description: 'Logo used in document header',
    assignedTo: ['Team Alpha'],
    teams: ['Design'],
  },
  {
    id: 3,
    name: 'Invoice Template',
    category: 'Templates',
    description: 'PDF Invoice format',
    assignedTo: ['Finance'],
    teams: ['Billing'],
  },
  {
    id: 4,
    name: 'Proposal Draft',
    category: 'Documents',
    description: 'Draft format for client proposal',
    assignedTo: ['Sales'],
    teams: ['Proposal Team'],
  },
  {
    id: 5,
    name: 'Annual Report',
    category: 'Reports',
    description: 'Company annual summary',
    assignedTo: ['Executive'],
    teams: ['Board'],
  },
  {
    id: 6,
    name: 'Onboarding Guide',
    category: 'HR',
    description: 'For new hires',
    assignedTo: ['HR'],
    teams: ['Training'],
  },
  {
    id: 7,
    name: 'Legal Agreement',
    category: 'Legal',
    description: 'Standard NDA',
    assignedTo: ['Legal'],
    teams: ['Compliance'],
  },
];

export default mockDocuments;
