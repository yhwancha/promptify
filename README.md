# Promptify

AI-powered prompt generation and analysis platform

## 🏗️ Project Structure

```
promptify/
├── frontend/          # Next.js frontend
├── backend/           # FastAPI backend
├── shared/            # Shared type definitions
└── scripts/           # Development scripts
```

## 🚀 Deployment Architecture

- **Frontend**: [Vercel](https://vercel.com)
- **Backend**: [Render](https://render.com)
- **Database**: Render PostgreSQL

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+
- Python 3.11+
- pnpm

### Local Development

1. **Clone Repository**
   ```bash
   git clone https://github.com/your-username/promptify.git
   cd promptify
   ```

2. **Environment Variables**
   ```bash
   # Backend environment variables
   cp backend/env.example backend/.env
   # Set required values like OpenAI API key
   ```

3. **Start Development Servers**
   ```bash
   # Start all services
   ./scripts/dev.sh

   # Or start individual services
   ./scripts/dev.sh frontend  # Frontend only
   ./scripts/dev.sh backend   # Backend only
   ```

4. **Access**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Documentation: http://localhost:8000/docs

## 🚀 Deployment Guide

### Frontend (Vercel)

1. **Connect Project to Vercel**
   - Connect GitHub repository to Vercel
   - Set Root Directory to `frontend`

2. **Environment Variables**
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-app.onrender.com
   ```

3. **Deploy**
   - Auto-deploy on push to `main` branch

### Backend (Render)

1. **Create New Web Service**
   - Connect GitHub repository
   - Build Command: `cd backend && pip install -r requirements.txt`
   - Start Command: `cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT`

2. **Create PostgreSQL Database**
   - Create new PostgreSQL service in Render

3. **Environment Variables**
   ```
   DATABASE_URL=postgresql://user:password@hostname:port/database
   OPENAI_API_KEY=your_openai_api_key
   SECRET_KEY=your_secret_key
   CORS_ORIGINS=https://your-frontend-app.vercel.app
   ENVIRONMENT=production
   DEBUG=False
   ```

### Auto-deployment with render.yaml

The repository includes a `render.yaml` file for easy deployment using the "Deploy to Render" button.

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy)

## 🔧 Key Features

- **Prompt Generation**: AI-powered custom prompt creation
- **Project Analysis**: Tech stack and development structure analysis
- **Idea Bank**: Prompt and idea storage/management
- **History Tracking**: Generated prompt history management

## 📋 API Endpoints

### Prompts
- `GET /api/v1/prompts` - List prompts
- `POST /api/v1/prompts` - Create new prompt
- `GET /api/v1/prompts/{id}` - Get specific prompt

### Analysis
- `POST /api/v1/analyze/project` - Perform project analysis

### Ideas
- `GET /api/v1/ideas` - List ideas
- `POST /api/v1/ideas` - Create new idea

## 🛡️ Security

- CORS configuration allowing only authorized domains
- Sensitive information management through environment variables
- HTTPS enforcement (production environment)

## 🤝 Contributing

1. Fork the repository
2. Create Feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Create Pull Request

## 📄 License

This project is under the MIT License. 