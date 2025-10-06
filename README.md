# 📚 Student Revision App

An AI-powered web application to help students revise from their coursebooks using PDFs, quizzes, and intelligent chatbots.

## 🚀 Tech Stack

- **Frontend:** React, Vite, Tailwind CSS
- **Backend:** Node.js, Express
- **Database:** MongoDB
- **AI:** OpenAI API, LangChain (upcoming)

## 📦 Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Git

### Installation

1. Clone the repository:
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/student-revision-app.git
cd student-revision-app
\`\`\`

2. Install frontend dependencies:
\`\`\`bash
cd client
npm install
\`\`\`

3. Install backend dependencies:
\`\`\`bash
cd ../server
npm install
\`\`\`

4. Create `.env` file in server directory:
\`\`\`env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/student-revision
\`\`\`

### Running the App

**Terminal 1 - Frontend:**
\`\`\`bash
cd client
npm run dev
\`\`\`

**Terminal 2 - Backend:**
\`\`\`bash
cd server
npm run dev
\`\`\`

Open `http://localhost:5173` in your browser.

## ✅ Current Progress

- [x] Project initialization
- [x] Basic frontend UI
- [x] Backend server setup
- [x] MongoDB connection
- [ ] PDF upload functionality
- [ ] Quiz generator
- [ ] Progress tracking
- [ ] Chat interface
- [ ] RAG implementation

## 📝 Development Notes

Built as part of BeyondChats assignment. Using LLM tools (Claude) for rapid development.

---

**Last Updated:** October 6, 2025