# Deployment Guide

## 🚀 Deployment Checklist

### Prerequisites
- [ ] Code pushed to GitHub repository
- [ ] OpenAI API key ready
- [ ] Vercel account created
- [ ] Render account created

### Backend Deployment (Render)

1. **Create Database**
   - [ ] Select "New PostgreSQL" from Render dashboard
   - [ ] Database name: `promptify-db`
   - [ ] Copy Connection String after creation

2. **Create Backend Service**
   - [ ] Select "New Web Service" from Render dashboard
   - [ ] Connect GitHub repository
   - [ ] Enter the following settings:
     ```
     Name: promptify-backend
     Build Command: cd backend && pip install -r requirements.txt
     Start Command: cd backend && uvicorn app.main:app --host 0.0.0.0 --port $PORT
     ```

3. **Environment Variables Setup**
   - [ ] `DATABASE_URL`: Connection String copied above
   - [ ] `OPENAI_API_KEY`: OpenAI API key
   - [ ] `SECRET_KEY`: Generate random string
   - [ ] `CORS_ORIGINS`: `https://your-app-name.vercel.app` (update later)
   - [ ] `ENVIRONMENT`: `production`
   - [ ] `DEBUG`: `False`

4. **Deployment Verification**
   - [ ] Check `https://your-backend.onrender.com/health` after deployment
   - [ ] Check API docs at `https://your-backend.onrender.com/docs`

### Frontend Deployment (Vercel)

1. **Create Project**
   - [ ] Select "New Project" from Vercel dashboard
   - [ ] Connect GitHub repository
   - [ ] Set Root Directory to `frontend`

2. **Environment Variables Setup**
   - [ ] `NEXT_PUBLIC_API_URL`: Render backend URL (e.g., `https://your-backend.onrender.com`)

3. **Deployment Verification**
   - [ ] Check frontend access after deployment
   - [ ] Test API connection (prompt generation, etc.)

### Final Configuration

1. **CORS Update**
   - [ ] Update Render backend's `CORS_ORIGINS` environment variable with actual Vercel domain
   - [ ] Restart backend service

2. **Feature Testing**
   - [ ] Test prompt generation functionality
   - [ ] Test project analysis functionality
   - [ ] Test idea save/load functionality

## 🔧 Common Issues

### CORS Error
**Problem**: CORS error when frontend calls backend API
**Solution**: 
1. Set correct Vercel domain in Render's `CORS_ORIGINS` environment variable
2. Restart backend service

### API Connection Failure
**Problem**: Frontend cannot connect to backend API
**Solution**:
1. Check Vercel's `NEXT_PUBLIC_API_URL` environment variable
2. Verify Render backend service is running properly via `/health` endpoint

### Database Connection Failure
**Problem**: Backend database connection error
**Solution**:
1. Verify Render PostgreSQL Connection String is correct
2. Check if `DATABASE_URL` environment variable is properly set

## 📱 Domain Setup (Optional)

### Custom Domain Connection
1. **Vercel (Frontend)**
   - Add Custom Domain in Vercel project settings
   - Add CNAME record in DNS settings

2. **Render (Backend)**
   - Add Custom Domain in Render service settings
   - Add CNAME record in DNS settings

3. **CORS Update**
   - Update `CORS_ORIGINS` environment variable with custom domain

## 🔄 Continuous Deployment

- **Vercel**: Auto-deploy on push to `main` branch
- **Render**: Auto-deploy on push to `main` branch
- **Preview Deployment**: Vercel automatically creates preview environment on Pull Request creation

## 💡 Tips

1. **Environment Variable Management**: `.env.local` (development) / Vercel & Render dashboard (production)
2. **Log Checking**: Real-time log checking available in Render dashboard
3. **Performance Monitoring**: Utilize Vercel Analytics and Render Metrics
4. **Backup**: Recommend setting up regular database backup in Render 