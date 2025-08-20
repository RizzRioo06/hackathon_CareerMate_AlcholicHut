#!/bin/bash

echo "🚀 CareerMate Deployment Script"
echo "================================"

# Check if git is clean
if [ -n "$(git status --porcelain)" ]; then
    echo "❌ Git repository has uncommitted changes!"
    echo "Please commit all changes before deploying."
    exit 1
fi

echo "✅ Git repository is clean"

# Push to GitHub
echo "📤 Pushing to GitHub..."
git push origin main

echo ""
echo "🌐 Next Steps for Deployment:"
echo ""
echo "1. 🚀 Deploy Backend on Railway:"
echo "   - Go to https://railway.app"
echo "   - Connect your GitHub repo"
echo "   - Set environment variables:"
echo "     OPENAI_API_KEY=your_api_key"
echo "     PROVIDER=openai"
echo "     PORT=5000"
echo ""
echo "2. 🎨 Deploy Frontend on Vercel:"
echo "   - Go to https://vercel.com"
echo "   - Import your GitHub repo"
echo "   - Set environment variable:"
echo "     NEXT_PUBLIC_API_BASE_URL=https://your-backend-url.railway.app"
echo ""
echo "3. 🧪 Test your deployment!"
echo ""
echo "📖 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "�� Happy Deploying!"
