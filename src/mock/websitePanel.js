const mockWebsitePanels = [
  {
    id: 1, panelName: "Home Banner", panelType: "Home", section: "Top",
    description: "Main landing page banner", developer: "Team Alpha", status: "Active"
  },
  {
    id: 2, panelName: "Footer Links", panelType: "Footer", section: "Bottom",
    description: "Quick links and contact info", developer: "Team Beta", status: "Inactive"
  },
  {
    id: 3, panelName: "Sidebar Navigation", panelType: "Navigation", section: "Left",
    description: "Internal navigation links", developer: "Team Gamma", status: "Active"
  },
  {
    id: 4, panelName: "Product Slider", panelType: "Product", section: "Middle",
    description: "Featured product carousel", developer: "Team Alpha", status: "Active"
  },
  {
    id: 5, panelName: "About Us Content", panelType: "Content", section: "Main",
    description: "Company information section", developer: "Team Beta", status: "Pending"
  },
  {
    id: 6, panelName: "Customer Reviews", panelType: "Testimonial", section: "Main",
    description: "Customer feedback display", developer: "Team Gamma", status: "Active"
  },
  {
    id: 7, panelName: "FAQ Section", panelType: "Support", section: "Bottom",
    description: "Frequently asked questions", developer: "Team Support", status: "Active"
  },
  {
    id: 8, panelName: "Contact Form", panelType: "Form", section: "Main",
    description: "Reach us form", developer: "Team Beta", status: "Inactive"
  },
  {
    id: 9, panelName: "Blog Highlights", panelType: "Blog", section: "Right",
    description: "Latest blog preview", developer: "Team Content", status: "Active"
  },
  {
    id: 10, panelName: "Newsletter Signup", panelType: "Form", section: "Footer",
    description: "Subscribe to newsletter", developer: "Team Growth", status: "Pending"
  },

  // Add 20 more dummy rows
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 11 + i,
    panelName: `Panel ${11 + i}`,
    panelType: ["Home", "Footer", "Navigation", "Product", "Content"][i % 5],
    section: ["Top", "Bottom", "Left", "Middle", "Main"][i % 5],
    description: `Description for panel ${11 + i}`,
    developer: ["Team A", "Team B", "Team C", "Team D", "Team E"][i % 5],
    status: ["Active", "Inactive", "Pending"][i % 3],
  }))
];

export default mockWebsitePanels;
