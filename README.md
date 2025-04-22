# AI Blog API

A RESTful API for an AI-powered blog website using Node.js, Express, and MongoDB. This backend service handles blog post management, AI content generation, and user authentication.

## Features

- 🔐 JWT Authentication 
- 📝 Blog posts CRUD operations
- 🤖 Scheduled AI content generation
- 📊 Swagger API documentation
- 🔒 Security best practices (OWASP)
- 📋 Input validation
- 📈 Structured logging

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT
- **Documentation**: Swagger/OpenAPI
- **Testing**: Jest and Supertest
- **Logging**: Pino
- **Scheduling**: node-cron
- **AI Integration**: OpenAI API

## Project Structure

```
src/
├── config/            # Environment and configuration setup
├── modules/           # Feature-based modules
│   ├── posts/         # Posts feature (model, controller, routes, service)
│   ├── auth/          # Authentication feature
│   └── scheduler/     # AI post scheduling feature
├── middleware/        # Express middleware (auth, validation, error handling)
├── utils/             # Utility functions and helpers
└── server.js          # Application entry point
```

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- MongoDB (local or Atlas)
- OpenAI API key (for AI post generation)

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/amitvashis/ai-blog-api.git
   cd ai-blog-api
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Copy the environment variables file and update it:
   ```
   cp .env.example .env
   ```
   Update the `.env` file with your MongoDB connection string, JWT secret, and OpenAI API key.

4. Start the development server:
   ```
   npm run dev
   ```

5. The API will be available at http://localhost:3001

### API Documentation

Once the server is running, you can access the Swagger UI documentation at:
```
http://localhost:3001/api-docs
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Posts
- `GET /api/posts` - Get all posts (with pagination)
- `GET /api/posts/:id` - Get post by ID
- `POST /api/posts` - Create a new post (admin only)
- `PUT /api/posts/:id` - Update a post (admin only)
- `DELETE /api/posts/:id` - Delete a post (admin only)

### AI Post Generation
- `POST /api/posts/ai` - Manually trigger AI content generation (admin only)

## Testing

Run the test suite with:
```
npm test
```

## Deployment

The API is containerized and can be deployed using Docker:

```
# Build the image
docker build -t ai-blog-api .

# Run the container
docker run -p 3001:3001 --env-file .env ai-blog-api
```

## Security

This project follows OWASP security best practices:
- Input validation and sanitization
- JWT token-based authentication
- Rate limiting
- CORS protection
- Security headers (via Helmet)
- Environment-based secrets
- MongoDB query injection protection

## License

This project is licensed under the MIT License - see the LICENSE file for details.