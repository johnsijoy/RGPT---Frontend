const portalIntegration = [
  {
    userName: "alice_admin", active: true, apiType: "REST", minTime: 5, maxTime: 60, description: "Primary admin integration", userId: "U001",
    created: "2024-01-10", createdBy: "SystemAdmin", lastUpdated: "2024-05-10", lastUpdatedBy: "AdminUser"
  },
  {
    userName: "bob_support", active: true, apiType: "SOAP", minTime: 2, maxTime: 30, description: "Support level API access", userId: "U002",
    created: "2024-01-12", createdBy: "SupportTeam", lastUpdated: "2024-05-14", lastUpdatedBy: "Bob"
  },
  {
    userName: "carol_dev", active: false, apiType: "GraphQL", minTime: 10, maxTime: 45, description: "Developer portal access", userId: "U003",
    created: "2024-02-01", createdBy: "DevTeam", lastUpdated: "2024-05-20", lastUpdatedBy: "Carol"
  },
  {
    userName: "dave_ops", active: true, apiType: "REST", minTime: 3, maxTime: 40, description: "Operations team integration", userId: "U004",
    created: "2024-01-20", createdBy: "OpsLead", lastUpdated: "2024-06-01", lastUpdatedBy: "Dave"
  },
  {
    userName: "eve_test", active: false, apiType: "SOAP", minTime: 6, maxTime: 20, description: "Test API user", userId: "U005",
    created: "2024-01-05", createdBy: "QAAdmin", lastUpdated: "2024-06-10", lastUpdatedBy: "Eve"
  },
  {
    userName: "frank_client", active: true, apiType: "REST", minTime: 4, maxTime: 50, description: "Client-side access", userId: "U006",
    created: "2024-01-25", createdBy: "SystemAdmin", lastUpdated: "2024-06-15", lastUpdatedBy: "Frank"
  },
  {
    userName: "grace_ui", active: true, apiType: "GraphQL", minTime: 7, maxTime: 35, description: "UI interaction API", userId: "U007",
    created: "2024-02-02", createdBy: "UITeam", lastUpdated: "2024-06-18", lastUpdatedBy: "Grace"
  },
  {
    userName: "harry_sys", active: true, apiType: "REST", minTime: 5, maxTime: 25, description: "System internal API", userId: "U008",
    created: "2024-01-18", createdBy: "SysAdmin", lastUpdated: "2024-06-22", lastUpdatedBy: "Harry"
  },
  {
    userName: "irene_api", active: false, apiType: "SOAP", minTime: 3, maxTime: 15, description: "API testing account", userId: "U009",
    created: "2024-01-30", createdBy: "TestTeam", lastUpdated: "2024-05-30", lastUpdatedBy: "Irene"
  },
  {
    userName: "jackie_prod", active: true, apiType: "REST", minTime: 8, maxTime: 60, description: "Production integration", userId: "U010",
    created: "2024-01-15", createdBy: "DevOps", lastUpdated: "2024-06-20", lastUpdatedBy: "Jackie"
  },
  {
    userName: "kate_admin", active: true, apiType: "GraphQL", minTime: 5, maxTime: 55, description: "Admin GraphQL integration", userId: "U011",
    created: "2024-01-12", createdBy: "AdminTeam", lastUpdated: "2024-06-25", lastUpdatedBy: "Kate"
  },
  {
    userName: "leo_agent", active: false, apiType: "REST", minTime: 2, maxTime: 12, description: "Agent API access", userId: "U012",
    created: "2024-02-03", createdBy: "AgentManager", lastUpdated: "2024-05-18", lastUpdatedBy: "Leo"
  },
  {
    userName: "mia_support", active: true, apiType: "SOAP", minTime: 6, maxTime: 30, description: "Support integration", userId: "U013",
    created: "2024-01-10", createdBy: "SupportTeam", lastUpdated: "2024-06-05", lastUpdatedBy: "Mia"
  },
  {
    userName: "nina_dev", active: false, apiType: "GraphQL", minTime: 10, maxTime: 50, description: "Developer sandbox", userId: "U014",
    created: "2024-01-22", createdBy: "DevTeam", lastUpdated: "2024-06-07", lastUpdatedBy: "Nina"
  },
  {
    userName: "oliver_user", active: true, apiType: "REST", minTime: 4, maxTime: 45, description: "Basic API user", userId: "U015",
    created: "2024-01-05", createdBy: "UserAdmin", lastUpdated: "2024-06-09", lastUpdatedBy: "Oliver"
  },
  {
    userName: "paul_ops", active: true, apiType: "SOAP", minTime: 3, maxTime: 20, description: "Ops API test", userId: "U016",
    created: "2024-02-01", createdBy: "OpsLead", lastUpdated: "2024-06-14", lastUpdatedBy: "Paul"
  },
  {
    userName: "quinn_client", active: false, apiType: "REST", minTime: 5, maxTime: 60, description: "Client staging access", userId: "U017",
    created: "2024-01-19", createdBy: "SystemAdmin", lastUpdated: "2024-06-21", lastUpdatedBy: "Quinn"
  },
  {
    userName: "rachel_ui", active: true, apiType: "GraphQL", minTime: 4, maxTime: 25, description: "UI module sync", userId: "U018",
    created: "2024-01-07", createdBy: "UITeam", lastUpdated: "2024-06-16", lastUpdatedBy: "Rachel"
  },
  {
    userName: "sam_sys", active: true, apiType: "REST", minTime: 6, maxTime: 40, description: "System-wide API", userId: "U019",
    created: "2024-02-04", createdBy: "SysAdmin", lastUpdated: "2024-06-23", lastUpdatedBy: "Sam"
  },
  {
    userName: "tara_test", active: false, apiType: "SOAP", minTime: 8, maxTime: 35, description: "Test integration", userId: "U020",
    created: "2024-01-28", createdBy: "QAAdmin", lastUpdated: "2024-06-24", lastUpdatedBy: "Tara"
  },
  {
    userName: "umar_prod", active: true, apiType: "GraphQL", minTime: 5, maxTime: 55, description: "Production API", userId: "U021",
    created: "2024-01-11", createdBy: "DevOps", lastUpdated: "2024-06-20", lastUpdatedBy: "Umar"
  },
  {
    userName: "vera_admin", active: true, apiType: "REST", minTime: 3, maxTime: 45, description: "Admin role access", userId: "U022",
    created: "2024-01-13", createdBy: "AdminTeam", lastUpdated: "2024-06-11", lastUpdatedBy: "Vera"
  },
  {
    userName: "wade_support", active: false, apiType: "SOAP", minTime: 7, maxTime: 28, description: "Support tools", userId: "U023",
    created: "2024-01-09", createdBy: "SupportTeam", lastUpdated: "2024-06-13", lastUpdatedBy: "Wade"
  },
  {
    userName: "xena_dev", active: true, apiType: "GraphQL", minTime: 6, maxTime: 35, description: "Dev module", userId: "U024",
    created: "2024-02-05", createdBy: "DevTeam", lastUpdated: "2024-06-12", lastUpdatedBy: "Xena"
  },
  {
    userName: "yuri_ops", active: true, apiType: "REST", minTime: 5, maxTime: 30, description: "Ops integration", userId: "U025",
    created: "2024-01-14", createdBy: "OpsLead", lastUpdated: "2024-06-14", lastUpdatedBy: "Yuri"
  },
  {
    userName: "zoe_test", active: false, apiType: "SOAP", minTime: 3, maxTime: 20, description: "Testing environment", userId: "U026",
    created: "2024-01-06", createdBy: "QAAdmin", lastUpdated: "2024-06-10", lastUpdatedBy: "Zoe"
  },
  {
    userName: "alan_api", active: true, apiType: "GraphQL", minTime: 2, maxTime: 40, description: "API interface", userId: "U027",
    created: "2024-01-26", createdBy: "APIAdmin", lastUpdated: "2024-06-22", lastUpdatedBy: "Alan"
  },
  {
    userName: "bella_admin", active: true, apiType: "REST", minTime: 5, maxTime: 50, description: "Admin tools", userId: "U028",
    created: "2024-01-16", createdBy: "AdminTeam", lastUpdated: "2024-06-25", lastUpdatedBy: "Bella"
  },
  {
    userName: "chris_dev", active: false, apiType: "SOAP", minTime: 4, maxTime: 30, description: "Dev automation", userId: "U029",
    created: "2024-01-27", createdBy: "DevTeam", lastUpdated: "2024-06-19", lastUpdatedBy: "Chris"
  },
  {
    userName: "diana_sys", active: true, apiType: "REST", minTime: 6, maxTime: 60, description: "System controller", userId: "U030",
    created: "2024-01-08", createdBy: "SysAdmin", lastUpdated: "2024-06-26", lastUpdatedBy: "Diana"
  }
];

export default portalIntegration;
