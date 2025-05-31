# TUSKERS CRICKET CLUB - Vercel Deployment Guide

Complete guide to deploy your Node.js website to Vercel with PostgreSQL database.

## Step 1: Prepare Your Project

### Download Your Code
1. In Replit, go to your project files
2. Download the entire project as a ZIP file
3. Extract it on your local computer

### Install Git (if not already installed)
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
4. Don't initialize with README (you have existing code)
5. Click "Create repository"

### Upload Your Code
Open terminal/command prompt in your project folder:

```bash
git init
git add .
git commit -m "Initial commit - TUSKERS CRICKET CLUB website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/tuskers-cricket-club.git
git push -u origin main
```

## Step 3: Set Up Database

### Neon Database Setup (Recommended - Free)
1. Go to https://neon.tech
2. Sign up using email or GitHub account
3. Create new project:
   - Project name: "tuskers-cricket-club"
   - Region: Choose closest to your location
   - PostgreSQL version: Keep default
4. Copy the connection string from dashboard
5. It will look like: `postgresql://username:password@hostname/database?sslmode=require`

## Step 4: Deploy to Vercel

### Connect GitHub to Vercel
1. Go to https://vercel.com
2. Sign up using your GitHub account
3. Click "New Project"
4. Import your `tuskers-cricket-club` repository
5. Click "Deploy"

### Configure Environment Variables
In Vercel dashboard, go to your project → Settings → Environment Variables:

Add these variables:
```
DATABASE_URL=your_postgresql_connection_string
NODE_ENV=production
SESSION_SECRET=your_session_secret_key
```

### Set Build Commands
In Vercel project settings:
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

## Step 5: Database Setup

### Run Database Migrations
After deployment, you need to set up your database tables:

1. In Vercel dashboard, go to Functions tab
2. Or use Vercel CLI locally:
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
```

### Seed Database
You can either:
1. Use the database seeding function in your code
2. Manually add data through your admin panel
3. Import data from your existing database

## Step 6: Custom Domain (Optional)

### Add Custom Domain
1. In Vercel dashboard, go to your project
2. Click "Settings" → "Domains"
3. Add your domain (e.g., tuskerscc.com)
4. Update DNS records as instructed
5. SSL certificate will be automatically provisioned

## Step 7: Test Your Deployment

### Verify Everything Works
1. Check homepage loads correctly
2. Test player profiles and statistics
3. Verify cricket widget functionality
4. Test admin panel access
5. Check newsletter subscription
6. Validate mobile responsiveness

### Monitor Performance
1. Check Vercel Analytics tab
2. Monitor function execution times
3. Review error logs if any issues

## Step 8: Ongoing Maintenance

### Update Your Site
1. Make changes to your code locally
2. Push to GitHub: `git push origin main`
3. Vercel automatically redeploys

### Database Backups
1. Set up automatic backups in your database provider
2. Export data regularly
3. Test restore procedures

## Troubleshooting

### Common Issues:
1. **Build Fails**: Check package.json scripts
2. **Database Connection**: Verify DATABASE_URL format
3. **Environment Variables**: Ensure all secrets are set
4. **API Keys**: Verify cricket API credentials
5. **Domain Issues**: Check DNS propagation

### Support Resources:
- Vercel Documentation: https://vercel.com/docs
- GitHub Support: https://support.github.com
- Database Provider Support

## Cost Estimation

### Free Tier Includes:
- 100GB bandwidth per month
- Unlimited static requests
- 100 serverless function executions per day
- Custom domain support

### Paid Features:
- Additional bandwidth: $40/TB
- More function executions: $2 per 1M requests
- Advanced analytics: $20/month

Your TUSKERS CRICKET CLUB website should run comfortably within the free tier for moderate traffic.

## Final Steps

1. Update any hardcoded URLs to your new domain
2. Test all functionality thoroughly
3. Set up monitoring and alerts
4. Share your new website URL with team members

Your website will be live at: https://tuskers-cricket-club.vercel.app
(or your custom domain if configured)