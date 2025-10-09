# 🎓 ReviseAI - AI-Powered Student Revision Platform

A comprehensive web application that helps students learn from their coursebooks using AI-powered quizzes, chat assistance, and video recommendations.

![ReviseAI Banner](https://img.shields.io/badge/AI-Powered-purple?style=for-the-badge) ![Status](https://img.shields.io/badge/Status-Production%20Ready-success?style=for-the-badge)

## ✨ Features

### Must-Have Features ✅

- **📚 PDF Management** - Upload, view, and manage coursebook PDFs
- **📖 PDF Viewer** - Read PDFs directly in the app with iframe viewer
- **🧠 AI Quiz Generator** - Automatically generate MCQs, SAQs, and LAQs from PDFs using Groq AI
- **✅ Quiz System** - Take quizzes, get instant scoring and detailed explanations
- **📊 Progress Dashboard** - Track learning progress with comprehensive analytics
- **📈 Performance Tracking** - Monitor strengths/weaknesses by question type

### Nice-to-Have Features ✅

- **💬 AI Chat Interface** - ChatGPT-style interface for asking questions
- **🎥 YouTube Recommender** - Get relevant educational video recommendations
- **🎨 Modern UI/UX** - Beautiful, responsive design with smooth animations

## 🛠️ Tech Stack

### Frontend

- **React 18** - UI library
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Lucide React** - Icons
- **React Markdown** - Chat message formatting
- **Axios** - API calls

### Backend

- **Node.js** - Runtime
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM
- **Groq API** - AI model (Llama 3.3 70B)
- **YouTube Data API** - Video recommendations
- **PDF-Parse & PDF-Lib** - PDF processing

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MongoDB
- Groq API Key (free)
- YouTube API Key (optional)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/SaurabhDahibhate/student-revision-app.git
cd student-revision-app
```

2. **Install dependencies**

```bash
# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

3. **Environment Setup**

   Create server/.env:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-revision
GROQ_API_KEY=your_groq_api_key_here
YOUTUBE_API_KEY=your_youtube_api_key_here
```

4. **Start MongoDB**

```bash
mongod
```

5. **Run the application**

```bash
# Backend (in server folder)
npm run dev

# Frontend (in client folder, new terminal)
npm run dev
```

6. **Open browser**

```
http://localhost:5173
```

### 📖 Usage Guide

1. Upload PDFs

- Click "Browse Files" or drag-and-drop PDF coursebooks
- Maximum file size: 10MB
- Supports any PDF with extractable text

2. Generate Quizzes

- Click "Quiz" button on any uploaded PDF
- AI generates mixed question types (MCQ, SAQ, LAQ)
- Answer questions and submit for instant feedback

3. Track Progress

- Click "Dashboard" to view statistics
- See overall performance and question-type breakdown
- Review recent quiz attempts

4. Use AI Chat

- Click "AI Chat" for interactive learning
- Ask questions about any topic
- Get markdown-formatted responses

5. Find Videos

- Click "Find Videos" on any PDF
- Get curated YouTube educational content
- Watch directly on YouTube

### 🎨 Screenshots

#### Home Page Beautiful gradient interface with feature cards

![ui image for the project](https://i.imghippo.com/files/etQJ2126Wrk.png)

#### Quiz Interface MCQ options display as A, B, C, D with instant feedback

![ui image for the project](https://i.imghippo.com/files/Alkw5602Irk.png)

#### Progress Dashboard Comprehensive analytics with colorful charts

![ui image for the project](https://i.imghippo.com/files/yGJ9248qA.png)

#### Chat Interface

![ui image for the project](https://i.imghippo.com/files/Wrn6943JyI.png)

### 🏗️ Project Structure

```
student-revision-app/
├── client/                 # Frontend React app
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── services/      # API calls
│   │   └── App.jsx        # Main app
│   └── package.json
│
├── server/                 # Backend Node.js app
│   ├── controllers/       # Route handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── services/          # Business logic
│   ├── uploads/           # PDF storage
│   └── server.js          # Entry point
│
└── README.md
```

### 🔑 API Endpoints

#### PDFs

- `POST /api/pdfs/upload` - Upload PDF
- `GET /api/pdfs` - Get all PDFs
- `GET /api/pdfs/:id` - Get PDF by ID
- `GET /api/pdfs/:id/file` - Serve PDF file
- `DELETE /api/pdfs/:id` - Delete PDF

#### Quiz

- `POST /api/quiz/generate` - Generate quiz
- `POST /api/quiz/submit` - Submit quiz
- `GET /api/quiz/attempts` - Get attempts
- `GET /api/quiz/progress` - Get progress stats

#### Chat

- `POST /api/chats` - Create chat
- `GET /api/chats` - Get all chats
- `GET /api/chats/:id` - Get chat by ID
- `POST /api/chats/:chatId/message` - Send message
- `DELETE /api/chats/:id` - Delete chat

#### YouTube

- `GET /api/youtube/:pdfId` - Get video recommendations

### 🧪 Testing

#### Manual testing checklist:

- ✅ PDF upload and viewing
- ✅ Quiz generation and submission
- ✅ Progress tracking
- ✅ Chat functionality
- ✅ YouTube recommendations
- ✅ Responsive design

### 🚧 Known Limitations

- RAG with Citations: Attempted but blocked by:
- Windows ONNX runtime compatibility issues
- OpenAI API cost constraints
- Focused on delivering working features instead
- Chat PDF Context: Uses basic text context (not semantic search)
- YouTube API: Requires API key (free tier available)

### 🔮 Future Enhancements

- Implement proper RAG with vector embeddings
- Add user authentication
- Support more file formats (DOCX, TXT)
- Spaced repetition system
- Mobile app version
- Collaborative study sessions

### 🤝 Development Journey

#### Tools Used

- LLM Coding Assistance: Extensively used Claude AI for rapid development
- Git Workflow: Feature branches with descriptive commits
- Time Management: Built in 2 days with aggressive use of AI tools

#### Key Decisions

- Chose Groq over OpenAI for free, fast AI inference
- Used MongoDB for flexible schema design
- Skipped complex RAG implementation due to time/cost constraints
- Prioritized working features over experimental ones

### 👨‍💻 Author

Saurabh Dahibhate\
GitHub: [@SaurabhDahibhate](https://github.com/SaurabhDahibhate)\
Date: October 2025

### 🙏 Acknowledgments

Groq for free AI API access\
Claude AI for development assistance\
Open source community

Built with ❤️ and AI in 48 hours

> [!WARNING]
> © 2025 Saurabh Dahibhate. All rights reserved
