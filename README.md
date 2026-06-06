# Eventful Backend

Event management backend built with NestJS, Prisma, PostgreSQL, and JWT authentication.

## Features

- User registration and login
- JWT authentication
- Role-based access control
- Event creation and management
- Ticket purchasing
- QR code ticket generation
- Ticket verification
- Analytics dashboard

## Tech Stack

- NestJS
- Prisma
- PostgreSQL
- JWT
- TypeScript

## Installation

npm install

## Run

npm run start:dev

## API Endpoints

POST /auth/register
POST /auth/login
GET /auth/profile

POST /events
GET /events
GET /events/mine
GET /events/analytics
GET /events/:eventId/analytics

POST /tickets/purchase/:eventId
POST /tickets/verify/:ticketId
