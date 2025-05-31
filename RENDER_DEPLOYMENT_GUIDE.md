# TUSKERS CRICKET CLUB - Render Deployment Guide

Complete guide to deploy your Node.js website to Render with PostgreSQL database.

## Step 1: Prepare Your Project

### Download Your Code
1. In Replit, download your project as a ZIP file
2. Extract it on your local computer
3. Your project is now clean and ready (Vercel files removed)

### Install Git (if needed)
- Windows: Download from https://git-scm.com/
- Mac: Install via Homebrew: `brew install git`
- Linux: `sudo apt install git`

## Step 2: Set Up GitHub Repository

### Create GitHub Account
1. Go to https://github.com and sign up
2. Verify your email address

### Create New Repository
1. Click "New repository"
2. Name: `tuskers-cricket-club`
3. Make it Public
4. Don't initialize with README
5. Click "Create repository"

### Upload Your Code
Open terminal in your project folder:

```bash
git init
git add .
git commit -m "Initial commit - TUSKERS CRICKET CLUB website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tuskers-cricket-club.git
git push -u origin main
```

## Step 3: Deploy to Render

### Sign Up for Render
1. Go to https://render.com
2. Sign up using your GitHub account
3. Connect your GitHub account

### Create New Web Service
1. Click "New +" → "Web Service"
2. Connect your `tuskers-cricket-club` repository
3. Configure the service:
   - **Name**: tuskers-cricket-club
   - **Environment**: Node
   - **Region**: Choose closest to your location
   - **Branch**: main
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`

### Set Environment Variables
In the Environment tab, add:
```
NODE_ENV=production
SESSION_SECRET=tuskers_cricket_secret_2024
```

## Step 4: Set Up Database

### Create PostgreSQL Database
1. In Render dashboard, click "New +" → "PostgreSQL"
2. Configure:
   - **Name**: tuskers-cricket-db
   - **Database Name**: tuskers_cricket
   - **User**: tuskers_user
   - **Region**: Same as your web service
   - **Plan**: Free

### Connect Database to Web Service
1. Go to your web service settings
2. In Environment tab, add:
   - **Key**: DATABASE_URL
   - **Value**: Copy from your PostgreSQL database's "External Database URL"

## Step 5: Deploy and Test

### Initial Deployment
1. Render will automatically build and deploy your app
2. Monitor the build logs for any issues
3. Your app will be available at: `https://tuskers-cricket-club.onrender.com`

### Database Setup
On first deployment, your database tables will be created automatically.

### Test Your Website
1. Check homepage loads correctly
2. Test player profiles and statistics
3. Verify admin panel access
4. Check newsletter subscription
5. Test mobile responsiveness

## Step 6: Using Your Neon Database (Alternative)

If you prefer to use your existing Neon database instead of Render's PostgreSQL:

1. In your web service Environment tab, set:
   ```
   DATABASE_URL=postgresql://neondb_owner:npg_EhWH5ZUoONm6@ep-little-rice-a86f2b2v-pooler.eastus2.azure.neon.tech/neondb?sslmode=require
   ```
2. Skip creating the Render PostgreSQL database
3. Your existing data will be preserved

## Step 7: Custom Domain (Optional)

### Add Custom Domain
1. In your web service settings, go to "Settings" tab
2. Click "Add Custom Domain"
3. Enter your domain (e.g., tuskerscc.com)
4. Update DNS records as instructed
5. SSL certificate will be automatically provisioned

## Step 8: Ongoing Maintenance

### Update Your Site
1. Make changes to your code
2. Push to GitHub: `git push origin main`
3. Render automatically redeploys

### Monitor Performance
1. Check Render dashboard for metrics
2. Monitor build and deployment logs
3. Set up monitoring alerts

## Cost and Scaling

### Free Tier Includes:
- 750 hours per month (enough for most websites)
- Automatic SSL certificates
- Custom domains
- Built-in CI/CD

### Paid Features:
- Persistent disk storage
- Faster builds and deploys
- Priority support
- Custom health checks

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check build logs in Render dashboard
2. **Database Connection**: Verify DATABASE_URL format
3. **Environment Variables**: Ensure all required variables are set
4. **Port Issues**: Render automatically sets PORT environment variable

### Support Resources:
- Render Documentation: https://render.com/docs
- GitHub Support: https://support.github.com

Your TUSKERS CRICKET CLUB website will be live and fully functional without any external API dependencies. All cricket polls and quizzes work with built-in historical cricket questions.

## Final Steps

1. Test all functionality thoroughly
2. Share your new website URL with team members
3. Set up monitoring and backups if needed

Your website will be live at: https://tuskers-cricket-club.onrender.com