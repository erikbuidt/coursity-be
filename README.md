# Coursity API

A backend REST API built with [NestJS](https://nestjs.com/) for a course platform application. This API provides user management, course, chapter, and lesson functionalities with database integration, logging, health checks, and HTTP client support.

## Project Overview

Coursity API is designed to serve as the backend for an online course platform. It manages users, courses, chapters, lessons, and tracks progress. The API is versioned and provides OpenAPI documentation for easy integration.

## Features

- User management module
- Course, chapter, and lesson management
- Database integration using TypeORM with migrations
- API versioning with URI versioning strategy
- OpenAPI (Swagger) documentation available
- Logging module for request and application logging
- Health check endpoints for monitoring
- HTTP client module for external API calls
- Global configuration management with environment variables
- Unit and end-to-end testing setup

## Installation

Clone the repository and install dependencies:

```bash
npm install
```

## Running the Application

Start the application in development mode:

```bash
npm run start:dev
```

Or start in production mode:

```bash
npm run start:prod
```

The API will be available at:

```
http://localhost:3000/api/v1
```

OpenAPI documentation is available at:

```
http://localhost:3000/api/v1/docs
```

## API Usage Overview

The API exposes the following main modules and endpoints:

- **User Module**: Manage user registration, authentication, and profile.
- **Course Module**: Manage courses and their metadata.
- **Chapter Module**: Manage chapters within courses.
- **Lesson Module**: Manage lessons within chapters.
- **Health Module**: Health check endpoints for monitoring service status.

All endpoints are prefixed with `/api/v{version}` (e.g., `/api/v1/user`).

## Database and Migrations

The project uses TypeORM for database integration. Database entities are defined for users, courses, chapters, lessons, enrollments, and progress tracking.

Migrations are used to manage database schema changes. To generate a new migration, run:

```bash
npm run migration:generate --name=YOUR_MIGRATION_NAME
```

## Testing

Run unit tests:

```bash
npm run test
```

Run end-to-end tests:

```bash
npm run test:e2e
```

Check test coverage:

```bash
npm run test:cov
```

## Deployment

For production deployment, refer to the [NestJS deployment documentation](https://docs.nestjs.com/deployment).

## Resources and Support

- [NestJS Documentation](https://docs.nestjs.com)
- [NestJS Discord Channel](https://discord.gg/G7Qnnhy)
- [NestJS Video Courses](https://courses.nestjs.com/)
- [NestJS Devtools](https://devtools.nestjs.com)
- [NestJS Enterprise Support](https://enterprise.nestjs.com)
- Follow on [Twitter](https://twitter.com/nestframework) and [LinkedIn](https://linkedin.com/company/nestjs)
- [NestJS Jobs Board](https://jobs.nestjs.com)

## License

This project is licensed under the MIT License.
