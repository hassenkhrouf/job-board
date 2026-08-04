# Software Requirements Specification


# System Description

The system is a public job publishing website.


# User Roles

## Visitor

Can:

- View jobs
- Search jobs
- Filter jobs
- Share jobs


## Administrator

Can:

- Add jobs
- Edit jobs
- Delete jobs
- Manage categories
- Manage companies


# Functional Requirements


## FR-01 Job Management

Admin can create job posts.


Required fields:

- title
- slug
- description
- company
- category
- location
- application_url
- deadline
- published_at


## FR-02 Search

Users can search jobs by:

- Keyword
- Category
- Location


## FR-03 SEO Pages

System generates:

- Job pages
- Category pages
- Location pages


## FR-04 Content Management

Administrator manages website content.


# Non Functional Requirements


## Security

- Protect admin area
- Validate inputs
- Prevent spam


## Performance

- Cache public pages
- Optimize database queries


## Scalability

The architecture should support thousands of daily visitors.