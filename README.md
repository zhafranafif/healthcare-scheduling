# Healthcare Scheduling

Healthcare scheduling backend built as an npm monorepo with NestJS, GraphQL, PostgreSQL, Redis, BullMQ, and a notification worker.

## Services

| Service | Responsibility | Local endpoint |
| --- | --- | --- |
| `auth-service` | Registration, login, JWT validation | `http://localhost:3001/graphql` |
| `scheduling-service` | Doctors, customers, and schedules | `http://localhost:3002/graphql` |
| `notification-service` | Consumes BullMQ jobs and sends email | Worker, no HTTP port |
| `postgres-db` | PostgreSQL database | `localhost:5432` |
| `redis` | BullMQ queue broker | `localhost:6379` |

## Architecture

![Architecture Design](docs/images/Healthcare%20Scheduling%20Microservices%20Architecture.png)

`packages/database` is a shared workspace package. It contains the Prisma 8 database contract and database service used by `auth-service` and `scheduling-service`; it is not a separate container.

## Prerequisites

- Node.js 24 or later
- npm
- Docker Desktop with Docker Compose
- PostgreSQL 15 or later for a non-Compose local setup
- Redis for a non-Compose local setup
- A Resend API key for email delivery

## Clone the Repository

Both setup options start by cloning the repository:

```bash
git clone <repository-url>
cd healthcare-scheduling
```

## Environment Configuration

Each service and the shared database package has its own example environment file. Copy them before starting the project:

```powershell
Copy-Item .env.example .env
Copy-Item auth-service/.env.example auth-service/.env
Copy-Item scheduling-service/.env.example scheduling-service/.env
Copy-Item notification-service/.env.example notification-service/.env
Copy-Item packages/database/.env.example packages/database/.env
```

Set a real `JWT_SECRET` in `auth-service/.env` and a real `RESEND_API_KEY` in `notification-service/.env`. Do not commit these files.

When running with Docker Compose, use Docker service names for connections:

```env
DATABASE_URL=postgresql://postgres:postgres@postgres-db:5432/healthcare_scheduling?schema=public
REDIS_HOST=redis
REDIS_PORT=6379
AUTH_SERVICE_URL=http://auth-service:3001/graphql
```

The connection host depends on where the process runs:

- Inside Docker Compose: use `postgres-db`, `redis`, and `auth-service`. Never use `localhost`; inside a container, `localhost` points back to that same container.
- Directly on the host: use `localhost` for PostgreSQL, Redis, and the auth service.

## Run With Docker Compose

Run these commands from the cloned repository root. The service `.env` files are loaded by Compose, while `packages/database/.env` is available for database tooling and local contract operations.

### Quick Start

```bash
npm run compose:up
npm run db:migrate
docker compose restart auth-service scheduling-service
npm run compose:ps
```

The migration command runs against the PostgreSQL database configured by `DATABASE_URL` in the root `.env`. The services are available at `http://localhost:3001/graphql` and `http://localhost:3002/graphql`. The notification service runs as a background worker.

Build and start the complete stack:

```bash
docker compose up -d --build
```

Check container status:

```bash
docker compose ps
```

Check service logs when troubleshooting:

```bash
docker compose logs -f auth-service
docker compose logs -f scheduling-service
docker compose logs -f notification-service
```

Shut down the containers:

```bash
npm run compose:down
```

To remove the PostgreSQL and Redis data volumes as well:

```bash
docker compose down -v
```
## Run Locally Without Compose

The notification service is a background worker and intentionally has no published port. It consumes the `notification-queue` BullMQ queue from Redis.

Run these commands from the cloned repository root. This option requires PostgreSQL and Redis to be installed and running locally.

### 1. Create the PostgreSQL Database

Create an empty database once:

```bash
psql -U postgres -c "CREATE DATABASE healthcare_scheduling"
```

If the database already exists, PostgreSQL will report that it exists; continue with the next step.

### 2. Configure Environment Variables

Copy the example files as described above. For local execution, use `localhost` values. The database URL should point to the locally created database:

```env
DATABASE_URL=postgresql://postgres:<password>@localhost:5432/healthcare_scheduling?schema=public
```

Also use `REDIS_HOST=localhost` and `AUTH_SERVICE_URL=http://localhost:3001/graphql` in the relevant service `.env` files.

### 3. Install Dependencies

```
npm ci
```

### 4. Apply Database Migrations

Apply the committed migrations to the empty database:

```bash
npm run db:migrate
```

Do not run `npx prisma db init`; this repository already contains its Prisma contract and migrations.

### 5. Emit the Prisma Contract

This is needed when the Prisma contract has changed or the generated contract files are not present:

```bash
npm run contract:emit
```

### 6. Build the Workspaces

```bash
npm run build
```

### 7. Start Each Service

Start each service in a separate terminal. On Bash/Git Bash:

```bash
NODE_OPTIONS=--env-file=auth-service/.env npm run start:dev --workspace=auth-service
NODE_OPTIONS=--env-file=scheduling-service/.env npm run start:dev --workspace=scheduling-service
npm run start:dev --workspace=notification-service
```

On PowerShell, use:

```powershell
$env:NODE_OPTIONS="--env-file=auth-service/.env"; npm run start:dev --workspace=auth-service
$env:NODE_OPTIONS="--env-file=scheduling-service/.env"; npm run start:dev --workspace=scheduling-service
npm run start:dev --workspace=notification-service
```

The notification service loads `notification-service/.env` automatically. The auth and scheduling commands explicitly load their service `.env` files.

## GraphQL API

Open either endpoint in GraphiQL:

- Auth: `http://localhost:3001/graphql`
- Scheduling: `http://localhost:3002/graphql`

GraphiQL provides schema documentation through the **Docs** explorer. A ready-to-run collection of queries and mutations is available in [docs/graphql-queries.md](docs/graphql-queries.md).

### Login

```graphql
mutation Login {
	login(loginInput: {
		email: "alice@example.com"
		password: "password123"
	}) {
		id
		email
		accessToken
	}
}
```

Use the returned token for protected scheduling operations:

```text
Authorization: Bearer <accessToken>
```

### List doctors with pagination

```graphql
query GetDoctors {
	getAllDoctors(page: 1, limit: 3) {
		data { id name createdAt updatedAt }
		meta { total page limit }
	}
}
```

### List schedules with filtering and pagination

```graphql
query SearchSchedules {
	getAllSchedules(
		page: 1
		limit: 10
		objective: "Dental"
		scheduledFrom: "2026-11-01T00:00:00.000Z"
		scheduledTo: "2026-11-30T23:59:59.999Z"
	) {
		data {
			id
			objective
			doctorId
			customerId
			scheduledAt
		}
		meta { total page limit }
	}
}
```

## Testing

Run all tests:

```bash
npm test
```

Run coverage:

```bash
npm run test:cov
```

Run a specific workspace test suite:

```bash
npm run test --workspace=scheduling-service
npm run test --workspace=notification-service
```

## Project Structure

```text
auth-service/          Authentication GraphQL service
scheduling-service/    Doctor, customer, and schedule GraphQL service
notification-service/  BullMQ email worker
packages/database/     Shared Prisma/database package
docker-compose.yml     Local infrastructure and service orchestration
docs/graphql-queries.md Copy-paste GraphQL test operations
```