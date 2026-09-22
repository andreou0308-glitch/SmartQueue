CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    full_name VARCHAR(120) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) NOT NULL
        CHECK (role IN ('EMPLOYEE', 'ADMIN')),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE services (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) NOT NULL UNIQUE,
    description TEXT,
    average_service_minutes INTEGER NOT NULL DEFAULT 10
        CHECK (average_service_minutes > 0),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE counters (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE queue_tickets (
    id BIGSERIAL PRIMARY KEY,
    service_id BIGINT NOT NULL
        REFERENCES services(id),
    counter_id BIGINT
        REFERENCES counters(id),
    daily_number INTEGER NOT NULL
        CHECK (daily_number > 0),
    ticket_number VARCHAR(30) NOT NULL,
    ticket_date DATE NOT NULL DEFAULT CURRENT_DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'WAITING'
        CHECK (
            status IN (
                'WAITING',
                'CALLED',
                'COMPLETED',
                'CANCELLED',
                'SKIPPED'
            )
        ),
    issued_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    called_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,

    CONSTRAINT unique_daily_service_number
        UNIQUE (service_id, ticket_date, daily_number)
);

CREATE TABLE service_sessions (
    id BIGSERIAL PRIMARY KEY,
    ticket_id BIGINT NOT NULL UNIQUE
        REFERENCES queue_tickets(id),
    employee_id BIGINT NOT NULL
        REFERENCES users(id),
    counter_id BIGINT NOT NULL
        REFERENCES counters(id),
    started_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMPTZ,
    result VARCHAR(20)
        CHECK (result IN ('COMPLETED', 'SKIPPED'))
);

CREATE INDEX idx_queue_tickets_active_queue
    ON queue_tickets(service_id, ticket_date, status, issued_at);

CREATE INDEX idx_queue_tickets_ticket_number
    ON queue_tickets(ticket_number);

INSERT INTO services (
    name,
    code,
    description,
    average_service_minutes
)
VALUES
    (
        'Γενική Εξυπηρέτηση',
        'A',
        'Γενικές πληροφορίες και εξυπηρέτηση πελατών',
        10
    ),
    (
        'Ταμείο',
        'B',
        'Πληρωμές και οικονομικές συναλλαγές',
        7
    );

INSERT INTO counters (name)
VALUES
    ('Γκισέ 1'),
    ('Γκισέ 2');