# SEPLUS - Streamlit Deployment Guide

## 🚀 Quick Start

### Local Development

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Install Node.js dependencies (if not already done):**
   ```bash
   npm install
   ```

3. **Run the Streamlit app:**
   ```bash
   streamlit run streamlit_app.py
   ```

4. **Access the application:**
   - Open your browser to `http://localhost:8501`
   - The app will automatically start the Node.js server on port 3000

---

## 🌐 Deploy to Streamlit Cloud (Public Access)

### Prerequisites
- GitHub account
- Streamlit Cloud account (free at [share.streamlit.io](https://share.streamlit.io))

### Deployment Steps

1. **Push your code to GitHub:**
   ```bash
   git add .
   git commit -m "Add Streamlit deployment"
   git push origin main
   ```

2. **Deploy on Streamlit Cloud:**
   - Go to [share.streamlit.io](https://share.streamlit.io)
   - Click "New app"
   - Select your repository: `Ryan-biju-ninan/vortex-2`
   - Main file path: `streamlit_app.py`
   - Click "Deploy"

3. **Configure Environment Variables (if needed):**
   - In Streamlit Cloud dashboard, go to "Advanced settings"
   - Add any environment variables from your `.env` file:
     - `MONGODB_URI`
     - `JWT_SECRET`
     - etc.

4. **Your app will be live at:**
   ```
   https://[your-app-name].streamlit.app
   ```

---

## 🔧 Alternative Deployment Options

### Option 1: Heroku
```bash
# Install Heroku CLI
# Create Procfile
echo "web: streamlit run streamlit_app.py --server.port=\$PORT" > Procfile

# Deploy
heroku create your-app-name
git push heroku main
```

### Option 2: Railway
1. Connect your GitHub repo to Railway
2. Set build command: `pip install -r requirements.txt && npm install`
3. Set start command: `streamlit run streamlit_app.py`

### Option 3: Google Cloud Run
```bash
# Create Dockerfile
# Build and deploy
gcloud run deploy seplus --source .
```

---

## 📝 Important Notes

### For Streamlit Cloud Deployment:
- **Node.js Support**: Streamlit Cloud supports Node.js, so your app should work
- **MongoDB**: You'll need a cloud MongoDB instance (MongoDB Atlas free tier)
- **Environment Variables**: Set all required env vars in Streamlit Cloud settings
- **Port Configuration**: The app uses port 3000 for Node.js backend

### Limitations:
- Streamlit Cloud has resource limits (1 GB RAM for free tier)
- Consider using MongoDB Atlas for database
- For production, consider dedicated hosting (AWS, GCP, Azure)

---

## 🐛 Troubleshooting

### Server won't start:
- Check if Node.js is installed: `node --version`
- Check if port 3000 is available
- Check MongoDB connection

### Streamlit errors:
- Clear cache: `streamlit cache clear`
- Check Python version: `python --version` (needs 3.8+)

### Database connection issues:
- Update `.env` with MongoDB Atlas URI
- Ensure IP whitelist includes `0.0.0.0/0` for cloud deployment

---

## 📦 Project Structure

```
vortex-2-1/
├── streamlit_app.py          # Main Streamlit application
├── requirements.txt           # Python dependencies
├── .streamlit/
│   └── config.toml           # Streamlit configuration
├── server.js                 # Node.js backend
├── package.json              # Node.js dependencies
├── *.html                    # Frontend pages
├── style.css                 # Styles
└── models/                   # Database models
```

---

## 🎯 Next Steps

1. **Test locally** with `streamlit run streamlit_app.py`
2. **Push to GitHub**
3. **Deploy to Streamlit Cloud** for free public hosting
4. **Share your public URL** with users!

---

## 💡 Tips

- Use MongoDB Atlas (free tier) for cloud database
- Enable authentication for production
- Monitor usage in Streamlit Cloud dashboard
- Consider upgrading to Streamlit Cloud paid tier for better performance

---

**Need help?** Check the [Streamlit documentation](https://docs.streamlit.io) or [Streamlit Community](https://discuss.streamlit.io)
