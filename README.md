# Social App Backend

A feature-rich social networking backend built with **Node.js, Express, TypeScript, MongoDB, GraphQL, and Socket.IO**.

The project was designed to go beyond simple CRUD APIs and explore backend architecture, authentication, data modeling, reusable abstractions, validation, real-time communication, and multiple API paradigms within a modular monolithic application.

## Overview

The application provides the backend for a social platform where users can:

- Create and manage accounts
- Verify accounts using OTP
- Authenticate with JWT
- Reset passwords
- Create posts
- Comment on posts and build nested comment threads
- React to posts and comments
- Freeze and restore posts/comments
- Send and manage friend requests
- Accept/reject friend requests
- Block and unfriend users
- Communicate through real-time private chat
- Retrieve application data through REST and GraphQL

The project uses a **modular structure** where each major business capability is isolated into its own module.

---

## Key Engineering Highlights

### Modular Monolith Architecture

The application follows a modular monolithic structure rather than placing all business logic into a single large codebase.

Each major domain is organized independently:

```text
src/
├── modules/
│   ├── auth/
│   ├── user/
│   ├── post/
│   ├── comment/
│   └── chat/
├── DB/
├── middlewares/
├── socket.io/
├── utils/
├── config/
└── app.controller.ts

This keeps domain-specific code close together and makes the system easier to extend and maintain.

### Separation of Responsibilities

The project separates responsibilities across several layers:

- **Controllers** — HTTP routing and request/response handling 
- **Services** — application and business logic 
- **Repositories** — database access abstraction 
- **Entities / DTOs** — application data structures 
- **Factories** — object creation and preparation 
- **Validation** — request and input validation 
- **Middleware** — cross-cutting concerns such as authentication 
- **Utilities / Providers** — reusable application functionality 

This structure makes the business logic less dependent on Express and Mongoose implementation details.

---

## Features

### Authentication & Account Management

The authentication module implements:

-  User registration 
-  Password hashing with `bcrypt` 
-  Email verification through OTP 
-  OTP expiration 
-  Login with JWT 
-  Logout 
-  OTP regeneration 
-  Password reset 
-  Credential update timestamps 
-  Account verification state 

Authentication is shared across HTTP, GraphQL, and Socket.IO contexts.

### Authorization & User Relationships

Authenticated users can:

-  Send friend requests 
-  Accept friend requests 
-  Reject friend requests 
-  Block users 
-  Unfriend users 

The application also checks blocking relationships before allowing interactions such as comments, reactions, and chat messages.

### Posts

Users can:

-  Create posts 
-  Retrieve posts 
-  Delete their own posts 
-  React to posts 
-  Freeze posts 
-  Restore posts 

Posts maintain their reactions and expose related comments through MongoDB relationships/virtuals.

### Nested Comments

The comment system supports threaded conversations.

A comment can contain:

-  A direct parent comment 
-  A list of parent IDs for its ancestry 
-  Replies 
-  Reactions 
-  Freeze/restore state 

This allows the application to represent nested comment trees rather than only flat comments.

### Reactions

Posts and comments share reusable reaction logic.

Supported reactions include:

-  Like 
-  Love 
-  Care 
-  Angry 
-  Sad 
-  Wow 

A user can:

-  Add a reaction 
-  Change their existing reaction 
-  Remove their reaction 

Reaction handling is extracted into a reusable provider instead of duplicating the same logic in multiple services.

### Real-Time Private Chat

The application uses **Socket.IO** for real-time communication.

The chat flow includes:

1.  Authenticate the socket connection 
2.  Associate the connected user with their socket 
3.  Validate message data 
4.  Check blocking relationships 
5.  Deliver the message to the recipient in real time 
6.  Persist the message in MongoDB 
7.  Create or update the corresponding chat document 

A connected-user map is maintained in memory to route messages directly to currently connected recipients.

Example Socket.IO events:

```
```

```
sendMessage
successMessage
receiveMessage
failMessage
```

### REST API

The application exposes REST endpoints for the main application domains:

```
```

```
/auth
/user
/post
/comment
/chat
```

### GraphQL API

The application also exposes a GraphQL endpoint:

```
```

```
/graphql
```

The current GraphQL implementation demonstrates:

-  GraphQL schema definition 
-  Custom GraphQL object types 
-  Query resolvers 
-  GraphQL-specific validation 
-  Authentication through request context 
-  Reuse of repository/data-access logic 

REST and GraphQL therefore coexist within the same backend.

---

## Architecture

A simplified request flow looks like this:

```
```

```
                   ┌──────────────────┐
                   │     Client       │
                   └────────┬─────────┘
                            │
              ┌─────────────┼─────────────┐
              │             │             │
              ▼             ▼             ▼
         REST API       GraphQL       Socket.IO
              │             │             │
              └─────────────┼─────────────┘
                            ▼
                    Authentication /
                     Validation
                            │
                            ▼
                       Controllers
                            │
                            ▼
                         Services
                            │
                ┌───────────┴───────────┐
                │                       │
                ▼                       ▼
             Factories             Providers
                │                       │
                └───────────┬───────────┘
                            ▼
                       Repositories
                            │
                            ▼
                         MongoDB
```

The real-time chat path additionally uses Socket.IO's connection middleware and event handlers to authenticate users and route messages.

---

## Repository Pattern

Database access is abstracted through a reusable repository base class:

```
```

```
AbstractRepository<T>
```

The abstraction provides common operations such as:

```
```

```
create
getOne
getById
updateOne
updateMany
deleteOne
deleteMany
getOneAndUpdate
getOneAndDelete
```

Domain-specific repositories then extend this abstraction:

```
```

```
UserRepository
PostRepository
CommentRepository
ChatRepository
MessageRepository
```

This keeps the services focused on business logic instead of directly coupling them to Mongoose queries throughout the application.

---

## Factory Pattern

Factories are used to construct domain objects before persistence.

Examples include:

```
```

```
AuthFactoryService
PostFactoryService
CommentFactoryService
UserFactoryService
```

For example, post creation is handled through a dedicated factory before the resulting object is passed to the repository.

This keeps object construction separate from the controller/service orchestration logic.

---

## Validation

The project uses **Zod** for runtime validation.

Validation is applied to:

-  Request bodies 
-  Route parameters 
-  Query parameters 
-  GraphQL arguments 
-  Socket.IO message data 

Example flow:

```
```

```
Request
   │
   ▼
Zod Schema
   │
   ├── valid ──────► Controller / Service
   │
   └── invalid ────► Application Error
```

Validation errors are normalized into application-specific error responses.

---

## Error Handling

The application defines a custom error hierarchy:

```
```

```
AppError
├── BadRequestException
├── UnAuthorizedException
├── ForbiddenException
├── NotFoundException
└── ConflictException
```

A global error handler is responsible for converting application errors into HTTP responses.

This avoids scattering response/error formatting logic throughout the application.

---

## Database Design

MongoDB is accessed through **Mongoose**.

Main models include:

```
```

```
User
Post
Comment
Chat
Message
```

Relationships are represented with MongoDB references.

Examples:

-  Posts reference their users 
-  Comments reference users and posts 
-  Comments can reference parent comments 
-  Chats contain participating users 
-  Chats contain message references 
-  Reactions contain the reacting user's ID 

The project also uses Mongoose features such as:

-  Schemas 
-  References 
- `populate` 
-  Virtual fields 
-  Middleware/hooks 
-  Timestamps 

---

## Account Verification Flow

A typical registration flow is:

```
```

```
Register
   │
   ▼
Validate input
   │
   ▼
Check existing account
   │
   ▼
Hash password
   │
   ▼
Generate OTP
   │
   ▼
Generate OTP expiry
   │
   ▼
Persist user
   │
   ▼
Send verification email
   │
   ▼
Verify OTP
   │
   ▼
Mark account as verified
```

OTP generation and expiration are isolated in reusable utility functions.

---

## Authentication Flow

The application uses JWT-based authentication.

```
```

```
Login
  │
  ▼
Validate credentials
  │
  ▼
Compare password hash
  │
  ▼
Check account verification
  │
  ▼
Generate JWT
  │
  ▼
Persist token
  │
  ▼
Return token
```

Protected REST endpoints use authentication middleware to:

1.  Read the authorization token 
2.  Verify the JWT 
3.  Resolve the user 
4.  Validate the stored token 
5.  Attach the authenticated user to the request 

The same general authentication concept is also used by GraphQL and Socket.IO.

---

## Real-Time Chat Architecture

The Socket.IO implementation maintains an in-memory map:

```
```

```
Map<UserId, SocketId>
```

This allows the server to determine whether a recipient is currently connected and route messages to the correct socket.

Simplified flow:

```
```

```
Sender
  │
  │ sendMessage
  ▼
Socket.IO Server
  │
  ├── authenticate socket
  │
  ├── validate message
  │
  ├── check blocked users
  │
  ├── emit to sender
  │
  ├── emit to recipient
  │
  └── persist message
          │
          ▼
       MongoDB
```

---

## Project Structure

```
```

```
src/
│
├── config/
│   └── env/
│       └── dev.config.ts
│
├── DB/
│   ├── connection.ts
│   ├── absract.repository.ts
│   └── models/
│       ├── user/
│       ├── post/
│       ├── comment/
│       ├── chat/
│       ├── message/
│       └── common/
│
├── middlewares/
│   ├── auth.middleware.ts
│   ├── validation.middleware.ts
│   └── graphql/
│       ├── auth.ts
│       └── validation.ts
│
├── modules/
│   ├── auth/
│   │   ├── entity/
│   │   ├── factory/
│   │   ├── auth.controller.ts
│   │   ├── auth.dto.ts
│   │   ├── auth.provider.ts
│   │   ├── auth.service.ts
│   │   └── auth.validation.ts
│   │
│   ├── user/
│   │   ├── entity/
│   │   ├── factory/
│   │   ├── graphql/
│   │   ├── user.controller.ts
│   │   ├── user.dto.ts
│   │   ├── user.service.ts
│   │   └── user.validation.ts
│   │
│   ├── post/
│   │   ├── entity/
│   │   ├── factory/
│   │   ├── graphql/
│   │   ├── post.controller.ts
│   │   ├── post.dto.ts
│   │   ├── post.service.ts
│   │   └── post.validation.ts
│   │
│   ├── comment/
│   │   ├── entity/
│   │   ├── factory/
│   │   ├── comment.controller.ts
│   │   ├── comment.dto.ts
│   │   ├── comment.service.ts
│   │   └── comment.validation.ts
│   │
│   └── chat/
│       ├── chat.controller.ts
│       └── chat.service.ts
│
├── socket.io/
│   ├── chat/
│   ├── middleware/
│   ├── validation/
│   └── index.ts
│
├── utils/
│   ├── common/
│   │   ├── enums/
│   │   ├── interfaces/
│   │   └── providers/
│   ├── errors/
│   ├── global-error-handler/
│   ├── hash/
│   ├── mail/
│   ├── otp/
│   └── token/
│
├── app.controller.ts
├── app.schema.ts
└── index.ts
```

---

## Technology Stack

### Backend

-  Node.js 
-  Express 
-  TypeScript 

### Database

-  MongoDB 
-  Mongoose 

### APIs

-  REST 
-  GraphQL 

### Real-Time Communication

-  Socket.IO 

### Authentication & Security

-  JSON Web Tokens (JWT) 
-  bcrypt 

### Validation

-  Zod 

### Email

-  Nodemailer 

### Architecture / Design Techniques

-  Modular architecture 
-  Repository pattern 
-  Factory pattern 
-  Provider abstraction 
-  DTOs 
-  Middleware-based cross-cutting concerns 
-  Custom application error hierarchy 

---

## Getting Started

### Prerequisites

Make sure you have the following installed:

-  Node.js 
-  npm 
-  MongoDB 

### Clone the repository

```
```

```
git clone https://github.com/karem5k5k5/Social-App.git
cd Social-App
```

### Install dependencies

```
```

```
npm install
```

### Environment variables

Create a `.env` file in the project root:

```
```

```
PORT=3000
DB_URL=your_mongodb_connection_string
NODEMAILER_EMAIL=your_email
NODEMAILER_PASS=your_email_password
JWT_SECRET=your_jwt_secret
```

### Start the development server

```
```

```
npm run dev
```

The server will start on:

```
```

```
http://localhost:3000
```

---

## API Endpoints

### Authentication

```
```

```
POST   /auth/register
POST   /auth/verify-account
POST   /auth/login
POST   /auth/resend-otp
PATCH  /auth/reset-password
POST   /auth/logout
```

### Users

```
```

```
GET    /user/:id
PATCH  /user/update
POST   /user/send-friend-request/:friendId
PATCH  /user/accept-request/:friendId
DELETE /user/reject-request/:friendId
PATCH  /user/block/:id
DELETE /user/unfriend/:id
```

### Posts

```
```

```
POST   /post
GET    /post/:id
PATCH  /post/:id
PATCH  /post/freeze/:id
PATCH  /post/restore/:id
DELETE /post/:id
```

### Comments

```
```

```
POST   /post/:postId/comment
POST   /post/:postId/comment/:id
GET    /post/:postId/comment/:id
PATCH  /post/:postId/comment/:id
PATCH  /post/:postId/comment/freeze/:id
PATCH  /post/:postId/comment/restore/:id
DELETE /post/:postId/comment/:id
```

### Chat

```
```

```
GET /chat/:userId
```

### GraphQL

```
```

```
POST /graphql
```

---

## Design Patterns Demonstrated

This project intentionally explores several common backend design techniques.

### Repository Pattern

Provides an abstraction over MongoDB/Mongoose operations.

### Factory Pattern

Encapsulates construction of application/domain objects.

### Provider Abstraction

Reusable business logic such as reaction handling is extracted into providers shared by multiple modules.

### Middleware Pattern

Authentication and validation are implemented as reusable middleware layers across different transport mechanisms.

---

## What This Project Demonstrates

This project focuses on backend engineering concepts that go beyond basic API development:

-  Designing a modular backend 
-  Structuring a growing TypeScript codebase 
-  Separating business logic from persistence 
-  Designing MongoDB relationships 
-  Implementing authentication and authorization 
-  Handling OTP-based account verification 
-  Building nested data structures 
-  Reusing business logic across multiple domains 
-  Building REST APIs 
-  Adding GraphQL to an existing backend 
-  Implementing real-time communication with WebSockets/Socket.IO 
-  Validating untrusted input at multiple boundaries 
-  Creating centralized application error handling 
-  Designing reusable repository abstractions 

---

## Future Improvements

Potential extensions to the project include:

-  Refresh-token based authentication 
-  Rate limiting for authentication and OTP endpoints 
-  Centralized production configuration 
-  Automated test coverage 
-  API documentation with OpenAPI/Swagger 
-  Pagination and cursor-based pagination 
-  More comprehensive authorization policies 
-  Message delivery/read status 
-  Online/offline presence tracking 
-  Redis-backed Socket.IO scaling 
-  Background jobs for emails and notifications 
-  Docker-based development and deployment 
-  CI/CD pipeline 
-  More comprehensive GraphQL coverage 
-  Production-grade logging and monitoring 
