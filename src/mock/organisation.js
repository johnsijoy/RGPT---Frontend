// mark/organisation.js

const mockOrganisationData = [
  {
    name: "Tech Orbit",
    type: "Corporate",
    industry: "IT",
    description: "Software company",
    createdBy: "Admin",
    status: "Active"
  },
  {
    name: "Green Earth NGO",
    type: "NGO",
    industry: "Environment",
    description: "Climate advocacy group",
    createdBy: "User1",
    status: "Active"
  },
  {
    name: "EduSpark",
    type: "Education",
    industry: "E-Learning",
    description: "Online education platform",
    createdBy: "Admin",
    status: "Inactive"
  },
  {
    name: "HealthHive",
    type: "Corporate",
    industry: "Healthcare",
    description: "Health tech startup",
    createdBy: "User2",
    status: "Active"
  },
  {
    name: "AgroLife",
    type: "Corporate",
    industry: "Agriculture",
    description: "Farming innovations company",
    createdBy: "Admin",
    status: "Pending"
  },
  {
    name: "CodeCrafters",
    type: "Corporate",
    industry: "Software Development",
    description: "Custom software solutions",
    createdBy: "User3",
    status: "Active"
  },
  {
    name: "BlueShield",
    type: "NGO",
    industry: "Social Welfare",
    description: "Children protection NGO",
    createdBy: "User1",
    status: "Active"
  },
  {
    name: "Urban Architects",
    type: "Corporate",
    industry: "Architecture",
    description: "Urban city design firm",
    createdBy: "User5",
    status: "Inactive"
  },
  {
    name: "MediCare Plus",
    type: "Corporate",
    industry: "Pharmaceuticals",
    description: "Pharma supply chain",
    createdBy: "Admin",
    status: "Active"
  },
  {
    name: "NextGen Motors",
    type: "Corporate",
    industry: "Automobile",
    description: "Electric vehicle manufacturer",
    createdBy: "User6",
    status: "Active"
  },
  // Duplicate and tweak for pagination testing
  ...Array.from({ length: 45 }, (_, i) => ({
    name: `Organisation ${i + 11}`,
    type: i % 2 === 0 ? "Corporate" : "NGO",
    industry: ["IT", "Healthcare", "Finance", "Education", "Environment"][i % 5],
    description: `Description for organisation ${i + 11}`,
    createdBy: `User${i % 10}`,
    status: ["Active", "Inactive", "Pending"][i % 3]
  }))
];

export default mockOrganisationData;
