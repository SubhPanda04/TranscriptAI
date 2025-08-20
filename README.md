# TranscriptAI

A full-stack web application for automated summarization of meeting transcripts using Google's Gemini AI model. The system provides RESTful APIs for transcript processing and a React-based frontend for user interaction.

## Architecture Overview

The application follows a microservices-inspired architecture with separate backend and frontend components:

### Backend Architecture
- **Express.js Server**: Handles HTTP requests with middleware for security, logging, and rate limiting
- **AI Integration**: Interfaces with Google Gemini 1.5 Flash API for natural language processing
- **Data Processing**: Supports text input and DOCX file parsing using Mammoth.js
- **Email Service**: SMTP-based email delivery using Nodemailer
- **Validation Layer**: Input sanitization and schema validation using Joi
- **Logging System**: Structured logging with Winston and daily rotation
- **Metrics Collection**: Performance monitoring and request tracking

### Frontend Architecture
- **React Application**: Component-based UI with lazy loading for performance
- **State Management**: Local state with React hooks for form data and API responses
- **HTTP Client**: Axios with retry logic and error handling
- **Styling**: Utility-first CSS with Tailwind CSS
- **Build System**: Vite for fast development and optimized production builds

## Features

- AI-powered transcript summarization using Google Gemini 1.5 Flash
- File upload support for DOCX documents
- Customizable summarization prompts with predefined templates
- Real-time summary generation with progress indicators
- Email delivery of generated summaries
- Rate limiting and request throttling
- Comprehensive error handling and validation
- Responsive web interface
- Request logging and metrics collection

## Technology Stack

### Backend Dependencies
- Node.js >= 18.0.0
- Express 5.1.0
- Axios 1.11.0 (with retry plugin)
- Joi 18.0.1
- Winston 3.17.0
- Nodemailer 7.0.5
- Helmet 8.1.0
- Compression 1.8.1
- Express Rate Limit 8.1.0

### Frontend Dependencies
- React 19.1.1
- Vite 7.1.2
- Tailwind CSS 4.1.12
- Axios 1.12.1
- Mammoth 1.10.0

## Prerequisites

- Node.js 18+ runtime
- Google Gemini API key
- SMTP email service credentials (optional)

## Installation

### Repository Setup
```bash
git clone <repository-url>
cd TranscriptAI
```

### Backend Configuration
```bash
cd backend
npm install
```

Create environment configuration:
```bash
cp .env.example .env
```

Edit `.env` with required variables:
```env
AI_API_KEY=your_gemini_api_key_here
PORT=5000
LOG_LEVEL=info
# Email configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
```

Start the backend server:
```bash
npm start
```

### Frontend Configuration
```bash
cd ../frontend
npm install
npm run dev
```

## API Reference

### POST /v1/summarize
Generates AI-powered summary of provided transcript text.

**Request Body:**
```json
{
  "transcript": "string (required)",
  "prompt": "string (required)"
}
```

**Response:**
```json
{
  "success": true,
  "summary": "Generated summary text"
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error description"
}
```

**Rate Limiting:** 100 requests per 15 minutes per IP

### GET /health
Health check endpoint returning server status.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-09-15T17:28:00.000Z",
  "uptime": 3600
}
```

### GET /metrics
Application metrics and performance data.

**Response:**
```json
{
  "requests_total": 150,
  "requests_duration_ms": 2500,
  "active_connections": 5
}
```

## Development

### Running Tests
```bash
cd backend
npm test
```

### Linting
```bash
cd frontend
npm run lint
```

### Building for Production
```bash
cd frontend
npm run build
```

## Security Considerations

- Input validation and sanitization using Joi schemas
- Rate limiting to prevent API abuse
- Helmet.js for security headers
- CORS configuration for cross-origin requests
- Environment variable management for sensitive data
- Request logging for audit trails

## Error Handling

The application implements comprehensive error handling:

- **ValidationError**: Invalid input data (400)
- **ExternalAPIError**: AI service failures (502)
- **RateLimitError**: Request throttling (429)
- **InternalServerError**: Unexpected errors (500)

All errors are logged with structured data and return consistent JSON responses.
