# 2. Use NestJS with strict TypeScript for the service

Date: 2026-07-29

## Status

Accepted

## Context

Hookrelay is a webhook delivery service: an HTTP ingest API, a relay that publishes
queued work, and workers that deliver signed requests to subscriber endpoints. We need a
language and framework for all of these parts.

The forces at play:

- **Several processes, one codebase.** The API, the outbox relay and the delivery workers
  share entities, configuration and signing logic. The framework needs clear module
  boundaries and dependency injection so each process wires in only what it needs, and
  so components can be replaced by fakes in tests.
- **Correctness matters more than raw throughput.** Delivery state, retry counts and
  signatures must be right. We want the compiler to reject `null`/`undefined` mistakes
  and untyped payloads before they reach runtime.
- **Delivery is I/O-bound.** Workers mostly wait on outbound HTTP, PostgreSQL, Redis and
  RabbitMQ. An event-loop runtime handles that concurrency well without threads.
- **Team experience.** The main developer has shipped production NestJS services, so
  time goes into the delivery semantics instead of learning a framework.
- **Documentation and ecosystem.** The framework must be well documented and have
  maintained integrations for PostgreSQL (TypeORM), configuration, testing and metrics.

## Decision

We will build Hookrelay in **TypeScript on Node.js, using NestJS**, with the compiler in
strict mode (`"strict": true` in `tsconfig.json`).

- NestJS runs on Express by default (`@nestjs/platform-express`). It is an architecture
  layer (modules, dependency injection, a standard request pipeline of guards, pipes,
  interceptors and filters), not a replacement for the HTTP server.
- Code is organised as feature modules (for example `health`, `events`, `deliveries`).
- The specific infrastructure choices (PostgreSQL and data access, RabbitMQ with a
  transactional outbox, the signature scheme, observability) are recorded in their own
  ADRs, not here.

## Alternatives considered

- **Plain Express.** Minimal and unopinionated. We would have to invent and enforce
  module structure, dependency injection and validation conventions ourselves. That is
  fine for a single small service but costs more here, with three process types sharing
  code.
- **Fastify (without NestJS).** Faster HTTP layer and good schema validation. It has the
  same structural gap as Express, and HTTP ingest speed is not our bottleneck, since
  delivery is dominated by outbound network waits.
- **Go.** A strong fit for long-running workers: cheap concurrency, a single static binary,
  predictable memory use. We rejected it for v1 because of team experience, and because
  a second language on day one would slow down the part we want to get right, which is
  the delivery semantics. See "Revisit" below.
- **Python with FastAPI.** Productive and familiar, but its type hints are not enforced at
  compile time. For a service whose correctness depends on state transitions, we prefer
  a compiler that fails the build.

## Consequences

Positive:

- Strict typing catches whole classes of bugs (unhandled `null`, wrong payload shapes)
  at build time.
- Dependency injection makes the relay and workers testable with fake brokers and HTTP
  clients.
- Consistent structure makes the codebase easy for a new contributor to navigate.

Negative / accepted costs:

- NestJS adds decorator and dependency-injection "magic" and boilerplate that plain
  Express would not have.
- A single-threaded Node.js process does not use multiple CPU cores. We scale workers
  by running more processes, not more threads. CPU-heavy work (for example signing very
  large payloads) blocks the event loop and must stay small.
- Node.js memory per worker is higher than an equivalent Go binary.

Revisit:

- Once v1 is complete and the delivery worker has benchmarks, we will evaluate rewriting
  the worker in Go. Because workers only talk to other components through RabbitMQ and
  PostgreSQL, a worker in another language can replace the Node.js one without changing
  the API or the relay. That decision will get its own ADR, with measured numbers.
