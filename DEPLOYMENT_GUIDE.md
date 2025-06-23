# Vue.js Website Deployment Guide

## Quick Start

Your Vue.js website is ready for deployment! Follow these steps to deploy it to GitHub Pages with custom domain support.

## What's Included

✅ Complete Vue.js application with modern design
✅ Responsive layout that works on all devices
✅ GitHub Actions workflow for automatic deployment
✅ Custom domain configuration ready
✅ Comprehensive documentation

## Deployment Steps

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and create a new repository
2. Name it `vue-website` (or any name you prefer)
3. Make sure it's **public** (required for GitHub Pages on free accounts)
4. Don't initialize with README (we already have one)

### 2. Upload Your Code

Option A - Using Git Command Line:
```bash
cd vue-website
git init
git add .
git commit -m "Initial commit: Vue.js website ready for GitHub Pages"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/vue-website.git
git push -u origin main
```

Option B - Using GitHub Desktop or Web Interface:
- Upload all files from the vue-website folder to your repository

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on **Settings** tab
3. Scroll down to **Pages** in the left sidebar
4. Under **Source**, select **GitHub Actions**
5. The workflow will automatically run and deploy your site

### 4. Access Your Website

After the GitHub Action completes (usually 2-3 minutes):
- Your site will be live at: `https://YOUR_USERNAME.github.io/vue-website/`
- Check the **Actions** tab to see deployment status

## Custom Domain Setup (Optional)

### 1. Update CNAME File

Edit the file `public/CNAME` and replace `your-custom-domain.com` with your actual domain:
```
mydomain.com
```

### 2. Configure DNS

Add these DNS records with your domain provider:

For subdomain (www.mydomain.com):
```
Type: CNAME
Name: www
Value: YOUR_USERNAME.github.io
```

For apex domain (mydomain.com):
```
Type: A
Name: @
Value: 185.199.108.153
Value: 185.199.109.153
Value: 185.199.110.153
Value: 185.199.111.153
```

### 3. Enable in GitHub

1. Go to repository **Settings** > **Pages**
2. Enter your domain in **Custom domain** field
3. Enable **Enforce HTTPS**
4. Wait for DNS verification (can take up to 24 hours)

## File Structure

```
vue-website/
├── .github/workflows/deploy.yml    # Auto-deployment workflow
├── public/
│   ├── CNAME                       # Custom domain config
│   └── favicon.svg                 # Site icon
├── src/
│   ├── components/                 # Vue components
│   ├── App.vue                     # Main app
│   ├── main.js                     # Entry point
│   └── style.css                   # Global styles
├── dist/                           # Built files (auto-generated)
├── package.json                    # Dependencies
├── vite.config.js                  # Build configuration
└── README.md                       # Documentation
```

## Customization

### Change Site Content
- Edit `src/components/HomePage.vue` for main content
- Update `src/components/Header.vue` for navigation
- Modify `src/components/Footer.vue` for footer

### Update Styling
- Colors and design: Edit component styles
- Global styles: Modify `src/style.css`

### Add New Pages
1. Create new `.vue` files in `src/components/`
2. Import them in `src/App.vue`
3. Update navigation in Header component

## Troubleshooting

**Site shows 404 error:**
- Ensure repository is public
- Check Actions tab for build errors
- Verify GitHub Pages is enabled

**Custom domain not working:**
- Check DNS settings with your provider
- Verify CNAME file has correct domain
- Wait for DNS propagation (up to 24 hours)

**Build fails:**
- Check Actions tab for error details
- Ensure all files are uploaded correctly

## Support

Your Vue.js website includes:
- Modern Vue 3 with Vite build system
- Responsive design for all devices
- Smooth animations and professional styling
- SEO-friendly structure
- Automatic deployment via GitHub Actions

The website is production-ready and optimized for performance!

