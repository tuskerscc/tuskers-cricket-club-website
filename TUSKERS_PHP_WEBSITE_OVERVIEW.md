# TUSKERS CRICKET CLUB - PHP Website

Complete PHP conversion of the React/Node.js website with all functionality preserved.

## File Structure

```
php_version/
├── config/
│   └── database.php          # PostgreSQL database connection
├── includes/
│   ├── functions.php         # Core functions for database operations
│   ├── header.php           # Common header with navigation
│   └── footer.php           # Common footer
├── admin/
│   ├── login.php            # Admin authentication
│   ├── index.php            # Admin dashboard
│   └── logout.php           # Session cleanup
├── assets/
│   ├── css/style.css        # Custom styling
│   └── js/main.js           # JavaScript functionality
├── index.php                # Home page with hero section
├── squad.php                # Player profiles and squad info
├── news.php                 # Articles listing and single article view
├── stats.php                # Team statistics and performance
└── subscribe.php            # Newsletter subscription handler
```

## Key Features Implemented

### Database Operations
- PostgreSQL connection with environment variable support
- Player management (view, add, edit)
- Article/news management
- Team statistics tracking
- Gallery management
- Newsletter subscriptions

### Admin System
- Secure login (admin/tuskers2024)
- Dashboard with statistics overview
- Session management

### Frontend Features
- Responsive design with Royal Blue and Gold theme
- Cricket widget integration (cricwaves.com)
- Mobile navigation
- Newsletter subscription with email to tuskerscckandy@gmail.com
- Social media integration

### Pages Available
- Home page with featured content
- Squad page with player profiles
- News section with article management
- Team statistics with detailed metrics
- Admin panel for content management

## Installation Requirements

1. PHP 7.4 or higher
2. PostgreSQL database
3. Web server (Apache/Nginx)
4. PHP extensions: PDO, pgsql

## Configuration

Update `config/database.php` with your database credentials:
- DATABASE_URL environment variable or
- Individual PGHOST, PGPORT, PGDATABASE, PGUSER, PGPASSWORD variables

## Admin Access

- URL: /admin/login.php
- Username: admin
- Password: tuskers2024

## Database Tables Required

The website expects the same database structure as the original React version:
- players
- articles
- gallery
- team_match_stats
- player_stats
- newsletter_subscribers

## Hosting Recommendations

1. **Shared Hosting**: Easy setup, $3-10/month
2. **VPS**: More control, $5-20/month
3. **Cloud**: Scalable, pay-as-you-use

Make sure your hosting provider supports PostgreSQL or convert to MySQL if needed.