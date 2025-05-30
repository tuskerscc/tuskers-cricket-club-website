# TUSKERS CRICKET CLUB - WordPress Theme Setup Guide

Complete WordPress theme conversion with all functionality from the original website.

## Installation Steps

### 1. WordPress Installation
1. Download and install WordPress on your server
2. Complete the standard WordPress setup process
3. Login to your WordPress admin dashboard

### 2. Theme Installation
1. Copy the `tuskers-cricket-club` folder to `/wp-content/themes/`
2. In WordPress admin, go to Appearance > Themes
3. Activate "TUSKERS CRICKET CLUB" theme

### 3. Required Setup

#### Create Navigation Menu
1. Go to Appearance > Menus
2. Create a new menu called "Primary Menu"
3. Add pages: Home, Squad, News, Gallery, Team Stats, Fan Zone
4. Assign to "Primary Menu" location

#### Create Required Pages
Create these pages with the specified templates:
- **Squad** - Use "Squad Page" template
- **News** - Standard blog page for articles
- **Gallery** - Create custom page
- **Team Stats** - Create custom page  
- **Fan Zone** - Create custom page

#### Set Homepage
1. Go to Settings > Reading
2. Set "Your homepage displays" to "A static page"
3. Choose your homepage or use the blog for dynamic content

### 4. Content Management

#### Adding Players
1. Go to Players > Add New Player
2. Fill in player details:
   - Name, Jersey Number, Role
   - Batting/Bowling style
   - Captain/Vice Captain status
   - Career statistics
3. Upload player photo
4. Publish the player

#### Adding News Articles
1. Go to Posts > Add New
2. Write your article content
3. Set featured image
4. Check "Feature this post on homepage" if desired
5. Publish the article

#### Managing Team Statistics
1. Go to Team Stats in admin menu
2. Update matches won, win percentage, squad size, total runs
3. Statistics will appear on homepage hero section

#### Newsletter Management
1. Go to Team Stats > Newsletter
2. View all newsletter subscribers
3. Export or email subscribers directly

### 5. Features Included

#### Custom Post Types
- **Players** - Complete player management with statistics
- **Team Statistics** - Team performance tracking

#### Theme Features
- Royal Blue and Gold branding
- Responsive design
- Cricket widget integration
- Newsletter subscription
- Social media integration
- SEO optimized
- Custom admin panels

#### Admin Functionality
- Player management with custom fields
- Featured post selection
- Team statistics management
- Newsletter subscriber tracking
- Custom meta boxes for content

### 6. Customization Options

#### Theme Options
- Update team statistics from admin panel
- Manage featured posts
- Control player information
- Track newsletter subscribers

#### Styling
- All styles in `style.css` using CSS variables
- Royal Blue (#1e3a8a) and Gold (#f59e0b) color scheme
- Responsive breakpoints included
- Custom animations and transitions

#### Cricket Widget
- Live scores from cricwaves.com
- Embedded in homepage hero section
- Configurable in header.php

### 7. Database Requirements

The theme works with standard WordPress database. Additional functionality uses:
- Custom post meta for players
- WordPress options for team statistics
- Custom tables not required (uses WordPress built-in storage)

### 8. Email Configuration

#### Newsletter Notifications
- Subscribers automatically emailed to: tuskerscckandy@gmail.com
- Uses WordPress wp_mail() function
- Configure SMTP plugin if needed for better email delivery

### 9. Performance Optimization

#### Included Optimizations
- Optimized images and lazy loading ready
- Minified CSS structure
- Efficient database queries
- Responsive images for different screen sizes

### 10. Maintenance

#### Regular Updates
- Keep WordPress core updated
- Update theme files as needed
- Backup player data and statistics
- Monitor newsletter subscriber growth

#### Content Management
- Regularly add new articles and news
- Update player statistics after matches
- Refresh team statistics
- Engage with newsletter subscribers

## Support

For technical support or customization requests, contact the development team.
The theme follows WordPress coding standards and best practices for easy maintenance and updates.