-- Seed data for Job Board

-- Insert Categories
INSERT INTO "Category" ("id", "name", "slug", "createdAt", "updatedAt") VALUES 
('c1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Informatique & Télécommunications', 'informatique-telecommunications', NOW(), NOW()),
('c2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'Ingénierie', 'ingenierie', NOW(), NOW()),
('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'Commerce & Marketing', 'commerce-marketing', NOW(), NOW()),
('c4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Santé', 'sante', NOW(), NOW()),
('c5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Éducation & Formation', 'education-formation', NOW(), NOW()),
('c6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'Finance & Assurance', 'finance-assurance', NOW(), NOW()),
('c7g7g7g7-g7g7-g7g7-g7g7-g7g7g7g7g7g7', 'Ressources Humaines', 'ressources-humaines', NOW(), NOW()),
('c8h8h8h8-h8h8-h8h8-h8h8-h8h8h8h8h8h8', 'Juridique', 'juridique', NOW(), NOW());

-- Insert Locations
INSERT INTO "Location" ("id", "name", "slug", "createdAt", "updatedAt") VALUES 
('l1i1i1i1-i1i1-i1i1-i1i1-i1i1i1i1i1i1', 'Tunis', 'tunis', NOW(), NOW()),
('l2j2j2j2-j2j2-j2j2-j2j2-j2j2j2j2j2j2', 'Sfax', 'sfax', NOW(), NOW()),
('l3k3k3k3-k3k3-k3k3-k3k3-k3k3k3k3k3k3', 'Sousse', 'sousse', NOW(), NOW()),
('l4l4l4l4-l4l4-l4l4-l4l4-l4l4l4l4l4l4', 'Ariana', 'ariana', NOW(), NOW()),
('l5m5m5m5-m5m5-m5m5-m5m5-m5m5m5m5m5m5', 'Ben Arous', 'ben-arous', NOW(), NOW()),
('l6n6n6n6-n6n6-n6n6-n6n6-n6n6n6n6n6n6', 'Bizerte', 'bizerte', NOW(), NOW()),
('l7o7o7o7-o7o7-o7o7-o7o7-o7o7o7o7o7o7', 'Nabeul', 'nabeul', NOW(), NOW()),
('l8p8p8p8-p8p8-p8p8-p8p8-p8p8p8p8p8p8', 'Monastir', 'monastir', NOW(), NOW());

-- Insert Companies
INSERT INTO "Company" ("id", "name", "slug", "logoUrl", "website", "description", "createdAt", "updatedAt") VALUES 
('comp1-q1q1-q1q1-q1q1-q1q1q1q1q1q1', 'Vermeg', 'vermeg', NULL, 'https://www.vermeg.com', 'Éditeur de logiciels bancaires présent à Tunis et à l''international.', NOW(), NOW()),
('comp2-r2r2-r2r2-r2r2-r2r2r2r2r2r2', 'Telnet Holding', 'telnet-holding', NULL, 'https://www.telnet.tn', 'Groupe technologique tunisien : ingénierie logicielle, R&D et conseil.', NOW(), NOW()),
('comp3-s3s3-s3s3-s3s3-s3s3s3s3s3s3', 'Ooredoo Tunisie', 'ooredoo-tunisie', NULL, 'https://www.ooredoo.tn', 'Opérateur de télécommunications en Tunisie.', NOW(), NOW()),
('comp4-t4t4-t4t4-t4t4-t4t4t4t4t4t4', 'Smart Soft Tunisia', 'smart-soft-tunisia', NULL, 'https://www.smartsoft.tn', 'Société de services en ingénierie informatique.', NOW(), NOW()),
('comp5-u5u5-u5u5-u5u5-u5u5u5u5u5u5', 'Cogite', 'cogite', NULL, 'https://www.cogite.tn', 'Espace de coworking et communautés tech à Tunis.', NOW(), NOW()),
('comp6-v6v6-v6v6-v6v6-v6v6v6v6v6v6', 'Ministère de l''Éducation', 'ministere-education', NULL, NULL, 'Ministère de l''Éducation de la République tunisienne.', NOW(), NOW()),
('comp7-w7w7-w7w7-w7w7-w7w7w7w7w7w7', 'Banque Centrale de Tunisie', 'bct', NULL, 'https://www.bct.gov.tn', 'Banque centrale de la République tunisienne.', NOW(), NOW()),
('comp8-x8x8-x8x8-x8x8-x8x8x8x8x8x8', 'Tunisie Telecom', 'tunisie-telecom', NULL, 'https://www.tunisietelecom.tn', 'Opérateur historique des télécommunications en Tunisie.', NOW(), NOW());

-- Insert Jobs (with future deadlines)
INSERT INTO "Job" ("id", "title", "slug", "excerpt", "description", "applicationUrl", "employmentType", "status", "featured", "sourceName", "sourceUrl", "deadline", "publishedAt", "createdAt", "updatedAt", "companyId", "categoryId", "locationId") VALUES 
('job1-y1y1-y1y1-y1y1-y1y1y1y1y1y1', 'Développeur Full Stack Senior', 'developpeur-full-stack-senior', 'Rejoignez notre équipe de développement pour créer des solutions innovantes.', 'Nous recherchons un développeur Full Stack expérimenté pour rejoindre notre équipe. Vous travaillerez sur des projets challengeants utilisant les dernières technologies.\n\n**Compétences requises:**\n- React/Next.js\n- Node.js/Python\n- PostgreSQL/MongoDB\n- Docker/Kubernetes\n\n**Avantages:**\n- Salaire compétitif\n- Télétravail partiel\n- Formation continue', 'https://www.vermeg.com/careers/apply/1', 'FULL_TIME', 'PUBLISHED', true, 'Vermeg', 'https://www.vermeg.com/careers/1', NOW() + INTERVAL '30 days', NOW(), NOW(), NOW(), 'comp1-q1q1-q1q1-q1q1-q1q1q1q1q1q1', 'c1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'l1i1i1i1-i1i1-i1i1-i1i1-i1i1i1i1i1i1'),
('job2-z2z2-z2z2-z2z2-z2z2z2z2z2z2', 'Ingénieur DevOps', 'ingenieur-devops', 'Automatisez et optimisez notre infrastructure cloud.', 'Nous cherchons un ingénieur DevOps passionné pour gérer et améliorer notre infrastructure cloud.\n\n**Missions:**\n- CI/CD pipelines\n- Infrastructure as Code\n- Monitoring et alerting\n- Sécurité cloud\n\n**Profil:**\n- 3+ ans d''expérience\n- AWS/Azure/GCP\n- Terraform/Ansible', 'https://www.telnet.tn/jobs/devops', 'FULL_TIME', 'PUBLISHED', false, 'Telnet Holding', 'https://www.telnet.tn/jobs/devops', NOW() + INTERVAL '25 days', NOW(), NOW(), NOW(), 'comp2-r2r2-r2r2-r2r2-r2r2r2r2r2r2', 'c2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'l1i1i1i1-i1i1-i1i1-i1i1-i1i1i1i1i1i1'),
('job3-a3a3-a3a3-a3a3-a3a3a3a3a3a3', 'Chef de Projet Digital', 'chef-de-projet-digital', 'Pilotez nos projets de transformation digitale.', 'Poste de Chef de Projet Digital pour accompagner nos clients dans leur transformation digitale.\n\n**Responsabilités:**\n- Gestion de projet agile\n- Coordination équipes techniques\n- Relation client\n- Budget et planning', 'https://www.ooredoo.tn/careers/pm', 'FULL_TIME', 'PUBLISHED', true, 'Ooredoo Tunisie', 'https://www.ooredoo.tn/careers/pm', NOW() + INTERVAL '20 days', NOW(), NOW(), NOW(), 'comp3-s3s3-s3s3-s3s3-s3s3s3s3s3s3', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'l1i1i1i1-i1i1-i1i1-i1i1-i1i1i1i1i1i1'),
('job4-b4b4-b4b4-b4b4-b4b4b4b4b4b4', 'Data Scientist', 'data-scientist', 'Exploitez la donnée pour créer de la valeur.', 'Rejoignez notre équipe Data Science pour développer des modèles prédictifs et analytiques.\n\n**Stack technique:**\n- Python/R\n- TensorFlow/PyTorch\n- SQL/NoSQL\n- Big Data (Spark, Hadoop)', 'https://www.smartsoft.tn/jobs/ds', 'FULL_TIME', 'PUBLISHED', false, 'Smart Soft Tunisia', 'https://www.smartsoft.tn/jobs/ds', NOW() + INTERVAL '15 days', NOW(), NOW(), NOW(), 'comp4-t4t4-t4t4-t4t4-t4t4t4t4t4t4', 'c1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'l2j2j2j2-j2j2-j2j2-j2j2-j2j2j2j2j2j2'),
('job5-c5c5-c5c5-c5c5-c5c5c5c5c5c5', 'UX/UI Designer', 'ux-ui-designer', 'Concevez des expériences utilisateur exceptionnelles.', 'Nous recherchons un designer UX/UI créatif pour concevoir des interfaces modernes et intuitives.\n\n**Outils:**\n- Figma/Sketch\n- Adobe Creative Suite\n- Prototypage\n- User research', 'https://www.cogite.tn/jobs/designer', 'CONTRACT', 'PUBLISHED', false, 'Cogite', 'https://www.cogite.tn/jobs/designer', NOW() + INTERVAL '10 days', NOW(), NOW(), NOW(), 'comp5-u5u5-u5u5-u5u5-u5u5u5u5u5u5', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'l1i1i1i1-i1i1-i1i1-i1i1-i1i1i1i1i1i1');

-- Insert Admin user (password: admin123)
INSERT INTO "Admin" ("id", "email", "passwordHash", "createdAt", "updatedAt") VALUES 
('admin-d9d9-d9d9-d9d9-d9d9d9d9d9d9', 'admin@jobboard.tn', '194d2b6aec89bd2a9efd03835c5137d7:51763c2c4513d5d509f53bfeb56430aaee44d5c8e764c8c4ccdf6437bef8a7a191860a6d5388dc3223c54f4f0841ddb4c6802076ba0c2e7d12a0832d689c0f98', NOW(), NOW());
