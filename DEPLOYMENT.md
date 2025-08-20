# 🚀 CareerMate Deployment Guide

## 🌐 **Recommended Hosting Setup**

### **Frontend: Vercel (Free Tier)**
### **Backend: Railway (Free Tier) or Render (Free Tier)**

---

## 📋 **Step 1: Deploy Backend First**

### **Option A: Railway (Recommended)**
1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your CareerMate repository
5. Set environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   PROVIDER=openai
   PORT=5000
   ```
6. Deploy and get your backend URL (e.g., `https://careermate-backend.railway.app`)

### **Option B: Render**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: `careermate-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
6. Add environment variables
7. Deploy and get your backend URL

---

## 📋 **Step 2: Deploy Frontend on Vercel**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Click "New Project"
4. Import your CareerMate repository
5. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Add environment variable:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app
   ```
7. Deploy!

---

## 🔧 **Environment Variables Setup**

### **Backend (.env)**
```bash
# AI Provider
OPENAI_API_KEY=your_openai_api_key
PROVIDER=openai

# Server
PORT=5000
NODE_ENV=production
```

### **Frontend (Vercel Dashboard)**
```bash
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app
```

---

## 📱 **Custom Domain (Optional)**

### **Vercel Custom Domain:**
1. Go to your project settings
2. Click "Domains"
3. Add your custom domain
4. Update DNS records as instructed

### **Railway Custom Domain:**
1. Go to your service settings
2. Click "Custom Domains"
3. Add your domain
4. Update DNS records

---

## 🧪 **Testing Your Deployment**

1. **Test Backend**: Visit your backend URL + `/api/career-guidance`
2. **Test Frontend**: Visit your Vercel URL
3. **Test AI Features**: Try career guidance, mock interviews, job suggestions

---

## 🚨 **Troubleshooting**

### **Common Issues:**
- **CORS Errors**: Backend needs proper CORS configuration
- **API Timeouts**: Increase function timeout in Vercel
- **Environment Variables**: Make sure they're set in both platforms

### **Support:**
- **Vercel**: [vercel.com/support](https://vercel.com/support)
- **Railway**: [railway.app/docs](https://railway.app/docs)
- **Render**: [render.com/docs](https://render.com/docs)

---

## 💰 **Costs**

### **Free Tiers:**
- **Vercel**: Free hosting, 100GB bandwidth/month
- **Railway**: $5 credit/month (enough for small projects)
- **Render**: Free tier with limitations

### **Paid Plans:**
- **Vercel Pro**: $20/month
- **Railway**: Pay-as-you-use
- **Render**: $7/month

---

## 🎯 **Next Steps After Deployment**

1. **Test all features** thoroughly
2. **Set up monitoring** (Vercel Analytics, Railway metrics)
3. **Configure custom domain** if desired
4. **Set up CI/CD** for automatic deployments
5. **Share your app** with the world! 🚀

---

**Your CareerMate app will be live at:**
- **Frontend**: `https://your-project.vercel.app`
- **Backend**: `https://your-project.railway.app`

**Happy Deploying! 🎉**
