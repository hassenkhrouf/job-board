# Project File Structure


Recommended structure:


job-board/

├── app/
│   ├── jobs/
│   ├── categories/
│   ├── locations/
│   ├── admin/
│   ├── api/
│   └── layout.tsx
│

├── components/

│   ├── JobCard/
│   ├── SearchBar/
│   ├── Header/
│   ├── Footer/
│   └── Ads/


├── lib/

│   ├── database/
│   ├── seo/
│   └── utils/


├── prisma/

│   └── schema.prisma


├── public/

│   ├── images/
│   └── icons/


├── docs/


├── .env

├── package.json

└── README.md



# Rules

Keep business logic separated.

Components should be reusable.

Pages should focus on rendering data.