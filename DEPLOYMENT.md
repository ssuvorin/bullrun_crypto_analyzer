# 🚀 Deployment Guide

This guide covers different deployment options for Bull Run Crypto Analyzer.

## 📋 Prerequisites

Before deploying, ensure you have:
- ✅ Gemini AI API key
- ✅ Node.js >= 16.0.0
- ✅ Git repository set up

## 🌐 Deployment Options

### 1. Vercel (Recommended) ⭐

**Why Vercel?**
- ✅ Zero configuration
- ✅ Automatic HTTPS
- ✅ Global CDN
- ✅ Serverless functions
- ✅ Free tier available

**Steps:**
1. **Fork/Clone repository**
   ```bash
   git clone https://github.com/yourusername/bullrun-crypto-analyzer.git
   ```

2. **Connect to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will auto-detect the Node.js project

3. **Set environment variables**
   - In Vercel dashboard → Settings → Environment Variables
   - Add: `GEMINI_API_KEY` = `your_api_key_here`

4. **Deploy**
   - Click "Deploy"
   - Your app will be live at `https://your-app.vercel.app`

**Custom Domain:**
- Add your domain in Vercel dashboard
- Update DNS records as instructed

### 2. Heroku

**Steps:**
1. **Install Heroku CLI**
   ```bash
   npm install -g heroku
   ```

2. **Login and create app**
   ```bash
   heroku login
   heroku create your-app-name
   ```

3. **Set environment variables**
   ```bash
   heroku config:set GEMINI_API_KEY=your_api_key_here
   heroku config:set NODE_ENV=production
   ```

4. **Deploy**
   ```bash
   git push heroku main
   ```

5. **Open app**
   ```bash
   heroku open
   ```

### 3. Railway

**Steps:**
1. **Connect GitHub**
   - Go to [railway.app](https://railway.app)
   - Connect your GitHub repository

2. **Configure**
   - Railway auto-detects Node.js
   - Add environment variable: `GEMINI_API_KEY`

3. **Deploy**
   - Automatic deployment on git push

### 4. Netlify

**Note:** Netlify is primarily for static sites, but can work with serverless functions.

**Steps:**
1. **Build for static deployment**
   ```bash
   # You'll need to modify the app for static deployment
   # This requires significant changes to the architecture
   ```

2. **Deploy**
   - Connect GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### 5. DigitalOcean App Platform

**Steps:**
1. **Create app**
   - Go to DigitalOcean → Apps
   - Connect GitHub repository

2. **Configure**
   - Runtime: Node.js
   - Build command: `npm install`
   - Run command: `npm start`

3. **Environment variables**
   - Add `GEMINI_API_KEY`

### 6. AWS (Advanced)

**Using AWS Elastic Beanstalk:**
1. **Install EB CLI**
   ```bash
   pip install awsebcli
   ```

2. **Initialize**
   ```bash
   eb init
   eb create production
   ```

3. **Set environment variables**
   ```bash
   eb setenv GEMINI_API_KEY=your_api_key_here
   ```

4. **Deploy**
   ```bash
   eb deploy
   ```

### 7. Docker Deployment

**Build and run locally:**
```bash
# Build image
docker build -t bullrun-analyzer .

# Run container
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key bullrun-analyzer
```

**Deploy to cloud:**
- Push to Docker Hub
- Deploy to any cloud provider supporting Docker

### 8. VPS/Dedicated Server

**Steps:**
1. **Server setup**
   ```bash
   # Update system
   sudo apt update && sudo apt upgrade -y
   
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Install PM2
   sudo npm install -g pm2
   ```

2. **Deploy application**
   ```bash
   # Clone repository
   git clone https://github.com/yourusername/bullrun-crypto-analyzer.git
   cd bullrun-crypto-analyzer
   
   # Install dependencies
   npm install
   
   # Create .env file
   echo "GEMINI_API_KEY=your_api_key_here" > .env
   echo "PORT=3000" >> .env
   
   # Start with PM2
   pm2 start server.js --name "bullrun-analyzer"
   pm2 startup
   pm2 save
   ```

3. **Setup reverse proxy (Nginx)**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## 🔒 Security Checklist

Before deploying:
- [ ] ✅ API keys are in environment variables
- [ ] ✅ `.env` file is in `.gitignore`
- [ ] ✅ No sensitive data in code
- [ ] ✅ HTTPS is enabled
- [ ] ✅ CORS is properly configured
- [ ] ✅ Input validation is implemented

## 📊 Monitoring

**Recommended monitoring tools:**
- **Uptime:** UptimeRobot, Pingdom
- **Performance:** New Relic, DataDog
- **Errors:** Sentry, LogRocket
- **Analytics:** Google Analytics, Plausible

## 🔄 CI/CD Setup

**GitHub Actions is already configured:**
- Automatic testing on PR
- Security scanning
- Deployment on merge to main

**To enable:**
1. Push to GitHub
2. Actions will run automatically
3. Add deployment secrets if needed

## 🌍 Custom Domain

**Steps for any platform:**
1. **Buy domain** (Namecheap, GoDaddy, etc.)
2. **Update DNS records:**
   - A record: `@` → `your-server-ip`
   - CNAME: `www` → `your-app-domain.com`
3. **Configure SSL** (usually automatic)

## 📈 Performance Optimization

**Before deploying:**
- [ ] Enable gzip compression
- [ ] Optimize images
- [ ] Minify CSS/JS
- [ ] Enable caching headers
- [ ] Use CDN for static assets

## 🆘 Troubleshooting

**Common issues:**
1. **Build fails:** Check Node.js version compatibility
2. **API errors:** Verify environment variables
3. **CORS issues:** Check server configuration
4. **Performance:** Enable compression and caching

**Getting help:**
- Check deployment platform docs
- Open GitHub issue
- Contact [@MazinoTower](https://x.com/MazinoTower)

---

**🎉 Congratulations!** Your Bull Run Crypto Analyzer is now live!