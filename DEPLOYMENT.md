# 🚀 CareerMate Deployment Guide

## 🌐 **100% FREE Hosting Setup (No Money Required!)**

### **Frontend: Vercel (Free Tier)**
### **Backend: Render (Free Tier) - RECOMMENDED for Free Users**

---

## 📋 **Step 1: Deploy Backend First (FREE!)**

### **Render (100% FREE - Recommended for Free Users)**
1. Go to [render.com](https://render.com)
2. Sign up with GitHub (FREE)
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - **Name**: `careermate-backend`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
   - **Environment**: Node
   - **Plan**: **FREE** (750 hours/month)
6. Add environment variables:
   ```
   OPENAI_API_KEY=your_openai_api_key
   PROVIDER=openai
   PORT=5000
   ```
7. Deploy and get your backend URL (e.g., `https://careermate-backend.onrender.com`)

### **Alternative: Railway (Limited Free Tier)**
- **Free**: $5 credit/month (enough for small projects)
- **Note**: Railway is great but requires a small amount of credit

---

## 📋 **Step 2: Deploy Frontend on Vercel (100% FREE!)**

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub (FREE)
3. Click "New Project"
4. Import your CareerMate repository
5. Configure build settings:
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`
6. Add environment variable:
   ```
   NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com
   ```
7. Deploy! (FREE - 100GB bandwidth/month)

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
NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.onrender.com
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

## 💰 **Costs - 100% FREE!**

### **Free Tiers (No Money Required):**
- **Vercel**: **FREE** hosting, 100GB bandwidth/month
- **Render**: **FREE** hosting, 750 hours/month
- **Total Cost**: **$0.00** 🎉

### **What You Get for FREE:**
- **Frontend**: Professional hosting on Vercel
- **Backend**: Full API hosting on Render
- **Custom URLs**: `your-project.vercel.app` and `your-project.onrender.com`
- **SSL Certificates**: Automatic HTTPS
- **CDN**: Global content delivery
- **Git Integration**: Automatic deployments

### **Limitations of Free Tiers:**
- **Vercel**: 100GB bandwidth/month (plenty for most projects)
- **Render**: 750 hours/month (31 days = 744 hours, so you get 31+ days free!)
- **Sleep Mode**: Render may sleep after 15 minutes of inactivity (wakes up on first request)

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
- **Backend**: `https://your-project.onrender.com`

**Happy Deploying! 🎉**
