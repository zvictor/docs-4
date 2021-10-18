module.exports = {
  sidebar: [
    "introduction",
    "architecture",
    "recipes",
    {
      type: 'category',
      label: 'Migration',
      items: [
        "migration/to-st",
        "migration/away-from-st"
      ],
    },
    {
      type: 'category',
      label: 'Multi-tenant',
      items: [
        "multi-tenant/about",
        "multi-tenant/core",
        "multi-tenant/backend",
        "multi-tenant/frontend"
      ],
    },
    "compatibility-table",
    "sdks",
    "apis"
  ],
};
