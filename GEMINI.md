# GEMINI.md

## Project Overview

This project is a backend REST API for a course platform named "Coursity". It is built with [NestJS](https://nestjs.com/), a framework for building efficient, scalable Node.js server-side applications. The API manages users, courses, chapters, lessons, enrollments, and progress tracking. It uses a PostgreSQL database via TypeORM, and integrates with Clerk for authentication, Minio for object storage, and Redis for caching.

The application is containerized using Docker.

## Building and Running

### Prerequisites

*   Node.js
*   npm
*   Docker

### Installation

1.  Clone the repository.
2.  Install dependencies:

    ```bash
    npm install
    ```

### Running the Application

**Using Docker (Recommended)**

1.  Ensure you have a `.env` file with the necessary environment variables (refer to `.env.example` if available, or configure based on `docker-compose.yaml`).
2.  Start the services (PostgreSQL, Minio, Redis):

    ```bash
    docker-compose up -d
    ```

3.  Start the application in development mode (with hot-reloading):

    ```bash
    npm run start:dev
    ```

The API will be available at `http://localhost:3000/api/v1`, and the OpenAPI (Swagger) documentation will be at `http://localhost:3000/api/v1/docs`.

**Other Scripts**

*   **Production mode:** `npm run start:prod`
*   **Build:** `npm run build`
*   **Linting:** `npm run lint`

### Testing

*   **Unit tests:** `npm run test`
*   **End-to-end tests:** `npm run test:e2e`
*   **Test coverage:** `npm run test:cov`

## Development Conventions

*   **Framework:** The project follows the standard structure and conventions of a NestJS application.
*   **Authentication:** Authentication is handled by Clerk. The `ClerkAuthGuard` is used globally, so most endpoints are protected by default. Public endpoints can be created using the `@Public()` decorator.
*   **Database:** The project uses TypeORM with a PostgreSQL database. Database migrations are used to manage schema changes.
    *   To generate a migration: `npm run migration:generate --name=YOUR_MIGRATION_NAME`
    *   To run migrations: `npm run migration:run`
*   **Configuration:** Configuration is managed via environment variables and the `@nestjs/config` module.
*   **API Versioning:** The API is versioned using the URI strategy (e.g., `/api/v1/...`).
*   **Linting and Formatting:** The project uses Biome for linting and formatting. Run `npm run lint` to check and fix issues.

## Key Files and Directories

*   `src/main.ts`: The application entry point.
*   `src/app/app.module.ts`: The root module of the application, importing all other major modules.
*   `src/entity/`: Contains the TypeORM entity definitions.
*   `src/api/`: Contains the different modules for the API (e.g., `user`, `course`, `lesson`).
*   `docker-compose.yaml`: Defines the services used by the application (PostgreSQL, Minio, Redis).
*   `Dockerfile`: Defines the Docker image for the application.
*   `package.json`: Lists project dependencies and scripts.
*   `README.md`: The original README file with project information.
