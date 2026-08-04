# API Documentation


# Jobs API


## Get Jobs


GET /api/jobs


Returns published jobs.



## Get Job By Slug


GET /api/jobs/:slug



## Create Job


POST /api/jobs


Admin only.



Required:

title

description

company

category

location

application_url

deadline



## Update Job


PUT /api/jobs/:id



## Delete Job


DELETE /api/jobs/:id



# Categories API


GET /api/categories



# Locations API


GET /api/locations