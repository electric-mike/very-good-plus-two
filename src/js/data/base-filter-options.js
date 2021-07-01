const baseFilterOptions = [
  {
    name    : 'Size',
    strings : [],
    options : [],
  },
  {
    name    : 'Vendor',
    strings : [],
    options : [],
  },
  {
    name    : 'Product Type',
    strings : [],
    options : [],
  },
  {
    name   : 'Price',
    ranges : [{
      name : '$0 - $49',
      min  : 0,
      max  : 4999,
    },
    {
      name : '$50 - $99',
      min  : 5000,
      max  : 9999,
    },
    {
      name : '$100 - $149',
      min  : 10000,
      max  : 14999,
    },
    {
      name : '$150 - $199',
      min  : 15000,
      max  : 19999,
    },
    {
      name : '$200 - $249',
      min  : 20000,
      max  : 24999,
    },
    {
      name : '$250 - $299',
      min  : 25000,
      max  : 29999,
    },
    {
      name : '$300 - $349',
      min  : 30000,
      max  : 34999,
    },
    {
      name : '$350 - $399',
      min  : 35000,
      max  : 39999,
    },
    {
      name : '$400 - $449',
      min  : 40000,
      max  : 44999,
    },
    {
      name : '$450 - $499',
      min  : 45000,
      max  : 49999,
    },
    {
      name : '$500+',
      min  : 50000,
      max  : null,
    },
    ],
    options: [],
  },
  {
    name    : 'Other Filters',
    strings : [],
    options : [],
  },
]

export default baseFilterOptions
