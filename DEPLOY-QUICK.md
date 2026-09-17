# ECONEX NOVA - Quick Deploy to Render

## ✅ ALL LOCALHOST REFERENCES REMOVED

Code now production-ready with dynamic URLs.

---

## 🚀 Deploy in 5 Steps

### Step 1: Push to GitHub ✓

Already done: https://github.com/muthukrishnan88/econex-nova

---

### Step 2: Deploy Backend

1. **Go to Render:** https://dashboard.render.com

2. **New Web Service**
   - Connect GitHub: `muthukrishnan88/econex-nova`
   - Name: `econex-nova-api`
   - Branch: `main`
   - Root Directory: `econex-image-server`
   - Environment: `Node`
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Plan: `Free`

3. **Environment Variables:**
   ```
   NODE_ENV=production
   AI_PROVIDER=mock
   ```

4. **Create Service** → Wait 2-3 min

5. **Copy Backend URL:**
   Example: `https://econex-nova-api.onrender.com`

6. **Test Health:**
   ```
   https://econex-nova-api.onrender.com/api/health
   ```
   Should return: `{"ok":true,...}`

---

### Step 3: Update Frontend API URL

1. **Open:** `ai-main/index.html` (line ~1765)

2. **Find:**
   ```javascript
   window.ECONEX_API_URL_PRODUCTION = '';
   ```

3. **Replace with your backend URL:**
   ```javascript
   window.ECONEX_API_URL_PRODUCTION = 'https://econex-nova-api.onrender.com';
   ```

4. **Do same in:** `ai-main/image.html` (same line)

5. **Commit & Push:**
   ```bash
   cd ai-main
   git add image.html index.html
   git commit -m "config: Set production API URL"
   git push origin master
   
   cd ..
   git add ai-main
   git commit -m "Update frontend with production API"
   git push origin main
   ```

---

### Step 4: Deploy Frontend

1. **Render Dashboard** → New Static Site

2. **Settings:**
   - Repository: `muthukrishnan88/econex-nova`
   - Name: `econex-nova-frontend`
   - Branch: `main`  
   - Root Directory: `ai-main`
   - Build Command: (leave empty)
   - Publish Directory: `.`
   - Plan: `Free`

3. **Create Static Site** → Wait 1-2 min

4. **Get Frontend URL:**
   Example: `https://econex-nova-frontend.onrender.com`

---

### Step 5: Test Everything

1. **Open Frontend URL**
   
2. **Check Console:**
   - F12 → Console
   - Should see: `[ECONEX] API URL: https://econex-nova-api.onrender.com`

3. **Upload Image:**
   - Select "Scan Pollution"
   - Upload test image
   - Click "Analyze Image"
   - Wait 5-10 sec (first request may be slow - cold start)

4. **Verify Results:**
   - ✓ Analysis completes
   - ✓ No CORS errors
   - ✓ Pollution results display
   - ✓ No [object Object] bugs

---

## ⚠️ Important Notes

### Free Tier Cold Starts

After 15 min inactivity:
- Service sleeps
- First request: 30-60 sec delay
- Subsequent requests: normal

**Solution:** Use [UptimeRobot](https://uptimerobot.com) to ping every 5 min

---

### Troubleshooting

**"Analysis failed" error:**

1. Check backend is running (green in Render)
2. Test health: `https://your-api.onrender.com/api/health`
3. Check frontend console for errors
4. Verify `ECONEX_API_URL_PRODUCTION` is set correctly
5. Check backend logs in Render

**CORS error:**

Backend already configured to allow:
- All localhost (dev)
- All *.onrender.com (prod)
- Development mode: allow all

Should not get CORS errors.

**Still using localhost:**

Check console: `[ECONEX] API URL: ...`

If shows localhost:
- Verify `ECONEX_API_URL_PRODUCTION` is set in HTML
- Clear browser cache
- Hard refresh (Ctrl+F5)

---

## 📊 What Was Changed

### Backend:

- ✅ Dynamic CORS (allows Render domains)
- ✅ Uses `RENDER_EXTERNAL_URL` for logging
- ✅ Graceful shutdown handling
- ✅ Production environment config

### Frontend:

- ✅ `ECONEX_API_URL_PRODUCTION` config point
- ✅ Fallback chain: Production > Config > Env > Localhost
- ✅ Console logging for debugging
- ✅ Both image.html and index.html updated

---

## 🔗 Your URLs

After deployment:

**Backend API:**
```
https://econex-nova-api.onrender.com
```

**Frontend:**
```
https://econex-nova-frontend.onrender.com
```

**Health Check:**
```
https://econex-nova-api.onrender.com/api/health
```

**Share this frontend URL with users!**

---

## 🌱 ECONEX NOVA

Production deployment complete.

Evidence-first pollution analysis now live.

Read `POLLUTION-ACCURACY-UPGRADE.md` for features.
