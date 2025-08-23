# 🚀 CareerMate Deployment Guide - Render.com

## 📋 **Prerequisites**
- GitHub account
- Render.com account (free)
- MongoDB Atlas account (free)

## 🔧 **Step 1: Prepare Your Code**

### **1.1 Update Frontend API URL**
Update `components/config.ts`:
```typescript
const config = {
  apiUrl: process.env.NODE_ENV === 'production' 
    ? 'https://careermate-backend.onrender.com' 
    : 'http://localhost:5000'
}
export default config
```

### **1.2 Update Backend Environment**
Create `backend/.env`:
```env
PORT=10000
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key-here
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/careermate
```

## 🌐 **Step 2: Deploy to Render**

### **2.1 Create Render Account**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Verify your email

### **2.2 Deploy Backend**
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name**: `careermate-backend`
   - **Root Directory**: `backend`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `PORT`: `10000`
     - `JWT_SECRET`: `your-secret-key`
     - `MONGODB_URI`: `your-mongodb-uri`

### **2.3 Deploy Frontend**
1. Click "New +" → "Web Service"
2. Connect your GitHub repo
3. Configure:
   - **Name**: `careermate-frontend`
   - **Root Directory**: `/` (root)
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Environment Variables**:
     - `NODE_ENV`: `production`
     - `NEXT_PUBLIC_API_URL`: `https://careermate-backend.onrender.com`

## 🗄️ **Step 3: Setup MongoDB Atlas**

### **3.1 Create MongoDB Atlas Account**
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas)
2. Create free account
3. Create new cluster (free tier)

### **3.2 Get Connection String**
1. Click "Connect"
2. Choose "Connect your application"
3. Copy connection string
4. Replace `<password>` with your database password
5. Add to Render environment variables

## 🔗 **Step 4: Custom Domain (Optional)**
1. In Render dashboard, go to your service
2. Click "Settings" → "Custom Domains"
3. Add your domain
4. Update DNS records

## ✅ **Step 5: Test Deployment**
1. Wait for build to complete
2. Test your app at the Render URL
3. Test authentication
4. Test all features

## 🆘 **Troubleshooting**

### **Build Errors**
- Check build logs in Render
- Ensure all dependencies are in package.json
- Verify Node.js version compatibility

### **Database Connection**
- Verify MongoDB URI format
- Check network access in Atlas
- Ensure username/password are correct

### **Environment Variables**
- Double-check all variables are set
- Restart service after adding variables
- Verify variable names match code

## 🌟 **Benefits of Render**
- ✅ **Free tier**: 750 hours/month
- ✅ **Auto-deploy** from GitHub
- ✅ **Custom domains** supported
- ✅ **SSL certificates** included
- ✅ **Global CDN** for fast loading
- ✅ **No credit card** required

## 📱 **Mobile Testing**
- Test on your phone
- Verify hamburger menu works
- Check responsive design
- Test authentication flow

## 🎯 **Next Steps**
1. Deploy to Render
2. Test all features
3. Share your app URL
4. Get user feedback
5. Iterate and improve

---

**Need help?** Check Render's documentation or ask in their community forums!
