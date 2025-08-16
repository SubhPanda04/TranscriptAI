# 🧠 TranscriptAI

**Transform your meeting transcripts into actionable insights with AI-powered summarization and seamless email delivery.**

TranscriptAI is a modern web application that converts meeting transcripts into customized summaries using Google's Gemini AI. Upload text or DOCX files, generate executive summaries or action items with custom prompts, and automatically email results to stakeholders. Built with React and Node.js for a fast, intuitive experience that streamlines meeting documentation workflows.

---

## 🌟 Features

### ✨ **AI-Powered Summarization**
- **Google Gemini Integration**: Leverages Google's advanced Gemini 1.5 Flash model for intelligent text summarization
- **Custom Prompts**: Tailor summaries with personalized instructions (Executive Summary, Action Items, Meeting Minutes)
- **Smart Context Understanding**: AI comprehends meeting context to generate relevant, actionable insights

### 📄 **Multi-Format File Support**
- **Text Files (.txt)**: Direct upload and processing
- **Word Documents (.docx)**: Advanced parsing using Mammoth.js
- **Copy & Paste**: Simple text input for quick processing
- **Drag & Drop Interface**: Intuitive file uploading experience

### 📧 **Seamless Email Integration**
- **Gmail SMTP**: Automated email delivery using nodemailer
- **Multiple Recipients**: Send to multiple stakeholders simultaneously
- **Professional Templates**: Clean, formatted HTML email templates
- **Delivery Confirmation**: Real-time status updates for email sending

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18.0.0 or higher
- **npm** or **yarn**
- **Gmail account** with App Password (for email functionality)
- **Google Gemini API key**

### 🔧 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SubhPanda04/TranscriptAI.git
   cd MangoDesk
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Install frontend dependencies**
   ```bash
   cd ../frontend
   npm install
   ```

### ⚙️ Configuration

1. **Backend Environment Setup**
   
   Create `backend/.env`:
   ```env
   # Gmail Configuration
   EMAIL_USER=your-gmail@gmail.com
   EMAIL_PASS=your-app-password
   
   # Google Gemini AI
   AI_API_KEY=your-gemini-api-key
   
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   FRONTEND_URL=http://localhost:5173
   ```

2. **Frontend Environment Setup**
   
   Create `frontend/.env.local`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

### 🏃‍♂️ Running the Application

1. **Start the backend server**
   ```bash
   cd backend
   npm start
   ```

2. **Start the frontend development server**
   ```bash
   cd frontend
   npm run dev
   ```

3. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000

---

## 🏗️ Project Structure

```
TranscriptAI/
├── 📁 backend/                 # Express.js API server
│   ├── 📄 index.js            # Main server file with API endpoints
│   ├── 📄 package.json        # Backend dependencies
│   └── 📄 .env               # Environment variables
├── 📁 frontend/               # React frontend application
│   ├── 📁 src/
│   │   ├── 📄 App.jsx         # Main React component
│   │   ├── 📄 main.jsx        # React app entry point
│   │   ├── 📄 index.css       # Tailwind CSS imports
│   │   └── 📁 assets/         # Static assets
│   ├── 📄 package.json        # Frontend dependencies
│   ├── 📄 vite.config.js      # Vite configuration
│   ├── 📄 tailwind.config.js  # Tailwind CSS configuration
│   └── 📄 vercel.json         # Vercel deployment config
├── 📄 README.md               # Project documentation
└── 📄 .gitignore             # Git ignore rules
```

---

## 🛠️ Tech Stack

### Frontend
- **⚛️ React 19.1.1** - Modern React with latest features
- **🎨 Tailwind CSS 4.1.12** - Utility-first CSS framework
- **⚡ Vite 7.1.2** - Fast build tool and dev server
- **📄 Mammoth.js 1.10.0** - DOCX file parsing
- **🔧 ESLint** - Code linting and formatting

### Backend
- **🟢 Node.js 18+** - JavaScript runtime
- **🚂 Express.js 5.1.0** - Web application framework
- **🤖 Google Gemini AI** - Advanced language model for summarization
- **📧 Nodemailer 7.0.5** - Email sending functionality
- **🌐 CORS 2.8.5** - Cross-origin resource sharing
- **🔧 dotenv** - Environment variable management

### Deployment
- **🚀 Vercel** - Frontend hosting and deployment
- **🌍 Production API** - Backend API deployment

---

### Endpoints

#### `GET /`
**Health check endpoint**
```json
{
  "message": "MangoDesk Backend API is running!",
  "status": "healthy"
}
```

#### `POST /summarize`
**Generate AI summary from transcript**

**Request Body:**
```json
{
  "transcript": "Meeting transcript text...",
  "prompt": "Summarize in bullet points for executives"
}
```

**Response:**
```json
{
  "summary": "• Key point 1\n• Key point 2\n• Action items..."
}
```

#### `POST /send-email`
**Send summary via email**

**Request Body:**
```json
{
  "summary": "Generated summary text...",
  "recipients": "email1@example.com, email2@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully to 2 recipient(s)"
}
```

---
