# Smart Campus Operations Hub - Member 4 Module

This is the implementation of Member 4's responsibilities:
1. Notifications System
2. Role Management (RBAC)
3. OAuth 2.0 Integration Improvements

## Tech Stack
- **Backend**: Spring Boot 3.4.2, Java 17, Spring Data MongoDB, Spring Security (OAuth2 Client), JJWT, Spring WebSocket.
- **Frontend**: React (Vite), Axios, Tailwind CSS, Lucide React, StompJS.

## Prerequisites
- MongoDB running locally on `mongodb://localhost:27017/campus_hub`
- Node.js & npm (for frontend)
- Java 17 & Maven (for backend)
- Google OAuth2 Client ID and Secret

## Backend Setup (Spring Boot)

1. Navigate to the `backend` folder.
2. In `src/main/resources/application.yml`, set up your Google OAuth2 credentials by assigning environment variables or hardcoding for testing:
   ```yaml
   GOOGLE_CLIENT_ID: "your-google-client-id"
   GOOGLE_CLIENT_SECRET: "your-google-client-secret"
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
   *(Backend starts on port 8080)*

## Frontend Setup (React/Vite)

1. Navigate to the `frontend` folder.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
   *(Frontend starts on port 5173 - explicitly checked by Spring Boot CORS)*

## How to use
1. Open `http://localhost:5173/login`.
2. Click "Continue with Google".
3. Upon successful login, you'll be redirected to the dashboard.
4. By default, newly registered users get the `USER` role.
5. To test RBAC, access MongoDB and set one user's role to `ADMIN`.
6. Admins can view the Admin Console at `http://localhost:5173/admin` and change roles of other users.
7. Notifications are streamed real-time via WebSocket STOMP endpoint.
