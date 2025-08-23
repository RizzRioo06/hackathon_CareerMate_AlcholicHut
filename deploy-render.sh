#!/bin/bash

echo "🚀 CareerMate Deployment to Render.com"
echo "======================================"

# Check if git is initialized
if [ ! -d ".git" ]; then
    echo "❌ Git repository not found. Please initialize git first:"
    echo "   git init"
    echo "   git add ."
    echo "   git commit -m 'Initial commit'"
    exit 1
fi

# Check if remote origin exists
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "❌ No remote origin found. Please add your GitHub repository:"
    echo "   git remote add origin https://github.com/username/repository.git"
    exit 1
fi

echo "✅ Git repository ready"
echo ""

echo "📋 Deployment Checklist:"
echo "1. ✅ Code is ready"
echo "2. ✅ Git repository initialized"
echo "3. ✅ Remote origin added"
echo "4. 🔄 Push to GitHub:"
echo ""

# Push to GitHub
echo "📤 Pushing to GitHub..."
git add .
git commit -m "🚀 Deploy to Render.com - $(date)"
git push origin main

echo ""
echo "✅ Code pushed to GitHub!"
echo ""
echo "🌐 Next Steps:"
echo "1. Go to [render.com](https://render.com)"
echo "2. Sign up with GitHub"
echo "3. Click 'New +' → 'Web Service'"
echo "4. Connect your repository"
echo "5. Configure deployment settings"
echo ""
echo "📚 See DEPLOYMENT.md for detailed instructions"
echo ""
echo "�� Happy Deploying!"
