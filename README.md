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