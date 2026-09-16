# SmartQueue Planning

## 1. Project goal

The goal of SmartQueue is to reduce physical waiting lines by allowing
customers to receive an electronic queue ticket and monitor their position.

## 2. User roles

### Customer

- Selects a service.
- Receives a queue ticket.
- Views the number of customers ahead.
- Views the estimated waiting time.
- Cancels an active ticket.

### Employee

- Logs into the system.
- Selects a service counter.
- Calls the next customer.
- Completes or skips a ticket.

### Administrator

- Manages employees.
- Manages services.
- Manages service counters.
- Views queue and service statistics.

## 3. Core entities

- User
- Service
- Counter
- Queue Ticket
- Service Session

## 4. Application architecture

The application will use a three-layer architecture:

1. React frontend for the user interface.
2. Express REST API for application logic.
3. PostgreSQL database for persistent data.

## 5. Main API areas

- Authentication
- Services
- Queue tickets
- Counters
- Users
- Statistics

## 6. Security

- Passwords will be hashed.
- Protected routes will require authentication.
- Access will depend on the user's role.
- Incoming data will be validated.
- Environment variables will store sensitive configuration.

## 7. Testing strategy

Unit and API tests will cover:

- Queue ticket creation
- Queue position calculation
- Calling the next customer
- Completing and cancelling tickets
- Authentication and role-based authorization
- Invalid input handling

## 8. DevOps strategy

- GitHub Flow will be used.
- Features will be developed in separate branches.
- GitHub Actions will automatically install dependencies, run tests and build the application.
- Docker will package the frontend, backend and database.
- Docker Compose will provide a local staging environment.