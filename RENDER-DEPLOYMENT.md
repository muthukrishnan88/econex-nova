# ECONEX NOVA - Render Deployment Guide

## 🚀 Quick Deploy to Render

### Prerequisites

- GitHub account
- Render account (free tier works)
- Code pushed to GitHub repository

---

## Step 1: Push to GitHub

```bash
cd econexnova
git add .
git commit -m "feat: Add Render deployment config"
git push origin main
```

**Repository:** https://github.com/muthukrishnan88/econex-nova

---

## Step 2: Deploy to Render

### Option A: Using render.yaml (Recommended)

1. **Go to Render Dashboard**
   - https://dashboard.render.com

2. **Click "New +"**
   - Select "Blueprint"

3. **Connect Repository**
   - Connect your GitHub account
   - Select `muthukrishnan88/econex-nova`
   - Branch: `main`

4. **Render will detect `render.yaml`**
   - Automatically creates 2 services:
     - `econex-nova-api` (Backend)
     - `econex-nova-frontend` (Frontend)

5. **Click "Apply"**

6. **Wait for deployment** (~3-5 minutes)

---

### Option B: Manual Deployment

#### Backend API:

1. **New Web Service**
   - Name: `econex-nova-api`
   - Region: Oregon (Free)
   - Branch: `main`
   - Root Directory: `econex-image-server`
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`

2. **Environment Variables:**
   ```
   NODE_ENV=production
   PORT=3000
   AI_PROVIDER=mock
   ```

3. **Click "Create Web Service"**

4. **Note the API URL** (e.g., `https://econex-nova-api.onrender.com`)

#### Frontend Static Site:

1. **New Static Site**
   - Name: `econex-nova-frontend`
   - Branch: `main`
   - Root Directory: `ai-main`
   - Build Command: (leave empty)
   - Publish Directory: `.`

2. **Environment Variable:**
   ```
   ECONEX_API_URL=https://econex-nova-api.onrender.com
   ```
   (Use the API URL from step 4 above)

3. **Add Custom Header** (Optional for API URL injection)
   - Go to Settings → Headers
   - Add:
     ```
     /*
       Content-Security-Policy: default-src 'self' https://econex-nova-api.onrender.com; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'
     ```

4. **Click "Create Static Site"**

---

## Step 3: Configure API URL

### Auto-Configuration (Blueprint Method)

If using `render.yaml`, API URL automatically injected.

### Manual Configuration

1. **Go to Frontend Service** → Environment
2. **Add Variable:**
   ```
   ECONEX_API_URL=https://your-api-service.onrender.com
   ```
3. **Save Changes** → Triggers rebuild

---

## Step 4: Test Deployment

1. **Open Frontend URL**
   - Example: `https://econex-nova-frontend.onrender.com`

2. **Test Health Check**
   - API: `https://your-api-service.onrender.com/api/health`
   - Should return JSON with `{"ok":true,...}`

3. **Upload Test Image**
   - Select "Scan Pollution"
   - Upload image
   - Verify analysis works

4. **Check for Errors**
   - Open Browser DevTools → Console
   - Should see: `[ECONEX] Config loaded: {API_URL: "https://..."}`
   - No CORS errors

---

## Free Tier Limitations

### Render Free Tier:

- **750 hours/month free** (enough for 1 service running 24/7)
- **Cold starts:** Services sleep after 15 min inactivity
  - First request after sleep: 30-60 sec delay
  - Subsequent requests: normal speed
- **Build minutes:** 500 min/month free
- **Bandwidth:** 100GB/month free

### Keeping API Awake (Optional):

**External Ping Service:**
- Use [UptimeRobot](https://uptimerobot.com) (free)
- Ping your API every 5 minutes
- Prevents cold starts

**Cron Job:**
```bash
# Add to your machine's crontab
*/5 * * * * curl https://your-api-service.onrender.com/api/health
```

---

## Environment Variables Reference

### Backend (econex-nova-api):

| Variable | Value | Required |
|----------|-------|----------|
| `NODE_ENV` | `production` | Yes |
| `PORT` | `3000` | Auto-set by Render |
| `AI_PROVIDER` | `mock` or `bedrock` | Yes |
| `AWS_REGION` | `us-east-1` | If using Bedrock |
| `AWS_ACCESS_KEY_ID` | Your AWS key | If using Bedrock |
| `AWS_SECRET_ACCESS_KEY` | Your AWS secret | If using Bedrock |
| `BEDROCK_MODEL_ID` | `anthropic.claude-3-5-sonnet-20241022-v2:0` | If using Bedrock |

### Frontend (econex-nova-frontend):

| Variable | Value | Required |
|----------|-------|----------|
| `ECONEX_API_URL` | `https://your-api.onrender.com` | Yes |

---

## Production AI (Optional)

### Switch from Mock to Real AI:

1. **Get AWS Credentials**
   - AWS Console → IAM
   - Create user with Bedrock access
   - Get Access Key ID + Secret

2. **Update Backend Environment:**
   ```
   AI_PROVIDER=bedrock
   AWS_REGION=us-east-1
   AWS_ACCESS_KEY_ID=AKIA...
   AWS_SECRET_ACCESS_KEY=...
   BEDROCK_MODEL_ID=anthropic.claude-3-5-sonnet-20241022-v2:0
   ```

3. **Save & Deploy**

4. **Test Real AI Analysis**
   - Upload image
   - Verify evidence-first analysis
   - Check rejected categories display

---

## Custom Domain (Optional)

### Add Your Domain:

1. **Buy Domain** (Namecheap, Google Domains, etc.)

2. **Render → Service → Settings → Custom Domain**

3. **Add Domain:**
   - Frontend: `www.econex-nova.com`
   - API: `api.econex-nova.com`

4. **Update DNS Records** (at your registrar):
   ```
   A record: @ → Render IP
   CNAME: www → your-frontend.onrender.com
   CNAME: api → your-api.onrender.com
   ```

5. **Update Frontend Environment:**
   ```
   ECONEX_API_URL=https://api.econex-nova.com
   ```

---

## Troubleshooting

### "Analysis failed. Please check server connection."

**Check:**
1. API service running? (Green status in Render)
2. API health endpoint works? `curl https://your-api/api/health`
3. CORS configured? (Should see Access-Control-Allow-Origin in response headers)
4. Frontend has correct ECONEX_API_URL?

**Fix:**
- Render Dashboard → API Service → Logs
- Look for errors
- Check environment variables
- Restart service

---

### Cold Start Delay

**Symptom:** First request after 15+ min takes 30-60 sec

**Solutions:**
1. Use UptimeRobot to ping every 5 min (keeps awake)
2. Upgrade to paid tier ($7/month, no sleep)
3. Accept delay (free tier trade-off)

---

### Build Failed

**Check:**
1. `package.json` exists in `econex-image-server/`
2. Node version compatible (use v18+)
3. All dependencies in `package.json`

**Fix:**
- Render Dashboard → Build Logs
- Check error message
- Update `package.json` if needed
- Trigger manual deploy

---

### CORS Error in Browser

**Symptom:** Console shows "CORS policy" error

**Check:**
1. Backend CORS middleware configured (already done)
2. Frontend uses correct API URL
3. No typos in URL

**Fix:**
- Backend already allows all origins
- Verify `ECONEX_API_URL` in frontend environment
- Check browser DevTools → Network tab → Response headers

---

## Monitoring

### Render Dashboard:

- **Metrics:** CPU, Memory, Request count
- **Logs:** Real-time application logs
- **Events:** Deploys, restarts, errors

### External Monitoring:

- **UptimeRobot:** Uptime monitoring
- **Google Analytics:** Add to frontend for usage stats
- **Sentry:** Error tracking (optional)

---

## Costs

### Free Tier (Current):

- Backend API: Free (with cold starts)
- Frontend Static: Free
- Total: $0/month

### Paid Tier (Optional):

- Backend API (no sleep): $7/month
- Frontend Static: Free
- Custom domain SSL: Included
- Total: $7/month

---

## URLs After Deployment

### Development (Local):

- Frontend: `http://localhost:5500/image.html` (Live Server)
- Backend: `http://localhost:3000`
- Health: `http://localhost:3000/api/health`

### Production (Render):

- Frontend: `https://econex-nova-frontend.onrender.com`
- Backend: `https://econex-nova-api.onrender.com`
- Health: `https://econex-nova-api.onrender.com/api/health`

---

## Deploy Checklist

- [ ] Code pushed to GitHub
- [ ] Render account created
- [ ] Backend service deployed
- [ ] Backend health check passing
- [ ] Frontend service deployed
- [ ] Frontend environment variable set
- [ ] Test pollution analysis works
- [ ] No CORS errors
- [ ] No [object Object] bugs
- [ ] Development mode notice removed (if desired)

---

## Next Steps

1. **Test thoroughly:**
   - Upload multiple images
   - Test waste analysis
   - Test pollution analysis
   - Check mobile responsive

2. **Share URL:**
   - Send frontend URL to users/demo

3. **Monitor usage:**
   - Check Render dashboard
   - Watch for errors

4. **Optional upgrades:**
   - Add custom domain
   - Enable real AI (Bedrock)
   - Set up monitoring
   - Upgrade to paid tier (no sleep)

---

## 🌱 ECONEX NOVA

**Production deployment ready.**

**Frontend:** Professional environmental intelligence platform  
**Backend:** Evidence-first pollution analysis API  
**Free tier:** Perfect for demos and testing  

Read `POLLUTION-ACCURACY-UPGRADE.md` for feature documentation.

**Repository:** https://github.com/muthukrishnan88/econex-nova
