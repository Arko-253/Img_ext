# Vercel Environment Variables Setup

## 🔧 **Step-by-Step: Add Environment Variable to Vercel**

### **Step 1: Go to Vercel Dashboard**
```
https://vercel.com/dashboard
```

### **Step 2: Select Your Project**
- Click on **"picfin"** project

### **Step 3: Go to Settings**
- Click **"Settings"** (top navigation)

### **Step 4: Environment Variables**
- Left sidebar → Click **"Environment Variables"**

### **Step 5: Add New Variable**
Click **"Add New"** button

**Fill in these fields:**

```
Name: VITE_API_URL
Value: https://picfin-backend.onrender.com
Environments: 
  ☑ Production
  ☑ Preview
  ☑ Development
```

### **Step 6: Save**
- Click **"Save"** button
- Vercel will automatically redeploy your project

---

## ⏱️ **Wait for Deployment**

Check dashboard for:
- ✅ Build in progress
- ✅ Build completed
- ✅ Deployment success (status: "Ready")

---

## 🧪 **Verify It Works**

1. **Go to:** https://picfin.vercel.app
2. **Open DevTools** (F12)
3. **Go to Network tab**
4. **Upload files and click "find me"**
5. **Look for the request:**
   - Should see: `https://picfin-backend.onrender.com/search` ✅
   - NOT: `http://localhost:5000` ❌

---

## ✅ **Expected Result**

After setting the environment variable:

1. Frontend loads from Vercel ✅
2. Frontend uses Render backend API ✅
3. Files upload successfully ✅
4. Search returns results ✅
5. No CORS errors ✅
6. No localhost errors ✅

---

## 🆘 **If It's Still Not Working**

### **Check 1: Did Vercel redeploy?**
- Dashboard should show deployment completed
- Check the "Deployments" tab

### **Check 2: Is environment variable visible?**
- Settings → Environment Variables
- Should show: `VITE_API_URL` = `https://picfin-backend.onrender.com`

### **Check 3: Clear cache and refresh**
```
Ctrl + Shift + Delete (on https://picfin.vercel.app)
Hard refresh: Ctrl + Shift + R
```

### **Check 4: Check browser console**
- Open DevTools (F12)
- Console tab
- Should NOT show: `Cannot use 'import.meta' outside a module`
- Should show requests to: `https://picfin-backend.onrender.com`

---

## 📝 **Also Verify Backend CORS**

Make sure Render backend has correct CORS:

1. Go to https://dashboard.render.com
2. Select **"picfin-backend"** service
3. Click **"Environment"**
4. Find **`CORS_ORIGINS`** variable
5. Value should be: `https://picfin.vercel.app`
6. Click **"Save"** (triggers redeploy)

---

## ✨ **Summary**

- ✅ App.vue uses `import.meta.env.VITE_API_URL`
- ✅ ui/.env has correct backend URL
- ✅ ui/.env.production has correct backend URL
- 🔲 Vercel environment variable `VITE_API_URL` set (DO THIS NOW)
- 🔲 Render CORS_ORIGINS set to `https://picfin.vercel.app` (VERIFY THIS)

Once you set these, everything will work! 🚀
