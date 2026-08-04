# Database Design


# Job

Main table containing job announcements.


Fields:

id
title
slug
description

company_id

category_id

location_id

employment_type

application_url

deadline

status

created_at

updated_at



# Company

Stores company information.


Fields:

id

name

slug

logo_url

website

description



# Category

Job categories.


Fields:

id

name

slug



# Location

Geographical locations.


Fields:

id

name

slug



# Admin

Website administrators.


Fields:

id

email

password_hash

created_at



# Relationships


Company

has many Jobs


Category

has many Jobs


Location

has many Jobs