# SEPLUS - Deployment Guide

## 🎯 Overview

Your application is now configured with **dynamic API endpoints** that automatically detect the environment (local vs production) and use the correct API base URL.

---

## ✅ What Was Changed

### 1. Created `config.js`
- Automatically detects if running on localhost or production
- Provides `API_CONFIG.getAPIURL()` function for all API calls
- Works seamlessly in both development and production environments

### 2. Updated All HTML Files
The following files now use dynamic API configuration:
- `hospital-patient-entry.html`
- `login.html`
- `register.html`
- `dashboard.html`
- `personal-portal.html`
- `script.js`

### 3. How It Works
```javascript
// OLD (hardcoded):
fetch('/api/personal/login', {...})

// NEW (dynamic):
fetch(API_CONFIG.getAPIURL('/api/personal/login'), {...})
```

**In Development (localhost):**
- API calls go to: `http://localhost:3000/api/...`

**In Production (deployed):**
- API calls go to: `https://your-domain.com/api/...`

---

## 🚀 Deployment Options

### Option 1: Streamlit Cloud (Recommended for Quick Deploy)

#### Step 1: Prepare Your Repository
```bash
git add .
git commit -m "Add Streamlit deployment with dynamic API config"
git push origin main
```

#### Step 2: Deploy to Streamlit Cloud
1. Go to [share.streamlit.io](https://share.streamlit.io)
2. Sign in with GitHub
3. Click "New app"
4. Select your repository: `Ryan-biju-ninan/vortex-2`
5. Main file path: `streamlit_app.py`
6. Click "Deploy"

#### Step 3: Configure Environment Variables
In Streamlit Cloud settings, add:
- `MONGODB_URI` - Your MongoDB Atlas connection string
- `JWT_SECRET` - Your JWT secret key
- Any other variables from your `.env` file

#### Step 4: Access Your App
Your app will be live at: `https://[your-app-name].streamlit.app`

---

### Option 2: Traditional Hosting (Netlify/Vercel + Backend)

#### Frontend (Netlify)
1. **Build your frontend:**
   ```bash
   # No build needed for static HTML
   ```

2. **Deploy to Netlify:**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   
   # Deploy
   netlify deploy --prod
   ```

3. **Configure:**
   - Set build command: (leave empty)
   - Set publish directory: `./`
   - Add `_redirects` file for SPA routing

#### Backend (Heroku/Railway/Render)

**For Heroku:**
```bash
# Create Procfile
echo "web: node server.js" > Procfile

# Deploy
heroku create seplus-backend
git push heroku main
```

**For Railway:**
1. Connect your GitHub repo
2. Set start command: `node server.js`
3. Add environment variables
4. Deploy

**For Render:**
1. Create new Web Service
2. Connect GitHub repo
3. Build command: `npm install`
4. Start command: `node server.js`
5. Add environment variables

#### Update Frontend to Point to Backend
If frontend and backend are separate, update `config.js`:
```javascript
getBaseURL: function() {
    // For separate backend deployment
    if (window.location.hostname === 'localhost') {
        return 'http://localhost:3000';
    }
    // Point to your backend URL
    return 'https://your-backend.herokuapp.com';
}
```

---

### Option 3: Full Stack on Single Platform

#### Render (Recommended)
1. Create a new Web Service
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `npm install && pip3 install -r requirements.txt`
   - **Start Command:** `npm start & streamlit run streamlit_app.py`
   - **Environment:** Node
4. Add environment variables
5. Deploy

#### Railway
1. Create new project from GitHub
2. Add environment variables
3. Railway auto-detects and deploys

---

## 🔧 Environment Variables

Create a `.env` file (already exists) with:
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/seplus
JWT_SECRET=your-secret-key-here
PORT=3000
```

**For Production (MongoDB Atlas):**
1. Go to [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create free cluster
3. Get connection string
4. Whitelist IP: `0.0.0.0/0` (all IPs) for cloud deployment
5. Update `MONGODB_URI` in deployment platform

---

## 📱 Testing Locally

### Test with Streamlit:
```bash
streamlit run streamlit_app.py
```
Access at: `http://localhost:8501`

### Test without Streamlit:
```bash
npm start
```
Access at: `http://localhost:3000`

---

## 🌐 Making It Publicly Accessible

### Quick Public URL (for testing):
```bash
# Using ngrok
npx ngrok http 3000

# Using localtunnel
npx localtunnel --port 3000
```

### Permanent Public URL:
Deploy to any of the platforms mentioned above. Your app will get a permanent public URL like:
- Streamlit Cloud: `https://seplus.streamlit.app`
- Netlify: `https://seplus.netlify.app`
- Vercel: `https://seplus.vercel.app`
- Heroku: `https://seplus.herokuapp.com`
- Railway: `https://seplus.up.railway.app`
- Render: `https://seplus.onrender.com`

---

## ✨ Benefits of Dynamic API Configuration

1. **No Code Changes Needed** - Same codebase works in dev and production
2. **Automatic Detection** - Detects environment automatically
3. **Easy Testing** - Test locally without modifying code
4. **Production Ready** - Deploy anywhere without configuration changes

---

## 🐛 Troubleshooting

### API calls failing in production:
1. Check browser console for CORS errors
2. Ensure backend allows requests from frontend domain
3. Verify environment variables are set correctly

### Streamlit deployment issues:
1. Check Streamlit Cloud logs
2. Ensure all dependencies in `requirements.txt`
3. Verify Node.js is available (Streamlit Cloud supports it)

### Database connection issues:
1. Verify MongoDB Atlas IP whitelist includes `0.0.0.0/0`
2. Check connection string format
3. Ensure database user has correct permissions

---

## 📞 Next Steps

1. ✅ **Test locally** with `streamlit run streamlit_app.py`
2. ✅ **Push to GitHub** if not already done
3. ✅ **Deploy to Streamlit Cloud** for instant public access
4. ✅ **Configure MongoDB Atlas** for production database
5. ✅ **Share your public URL** with users!

---

**Your app is now ready for deployment! 🎉**
