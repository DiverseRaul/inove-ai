# Vue Website

A simple and elegant Vue.js website with modern design, responsive layout, and optimized for deployment to GitHub Pages with custom domain support.

## Features

- 🚀 **Fast**: Built with Vue 3 and Vite for optimal performance
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile devices
- 🌐 **Deployable**: Ready for GitHub Pages deployment with custom domain
- ✨ **Modern**: Clean design with gradient backgrounds and smooth animations

## Technologies Used

- Vue.js 3
- Vite
- CSS3 with modern features
- GitHub Actions for CI/CD

## Local Development

### Prerequisites

- Node.js (version 18 or higher)
- npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/vue-website.git
cd vue-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and visit `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## GitHub Pages Deployment

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

### Setup Instructions

1. **Create a GitHub Repository**:
   - Create a new repository on GitHub
   - Name it `vue-website` (or any name you prefer)
   - Make sure it's public (required for GitHub Pages on free accounts)

2. **Push Your Code**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/vue-website.git
   git push -u origin main
   ```

3. **Enable GitHub Pages**:
   - Go to your repository settings
   - Navigate to "Pages" in the left sidebar
   - Under "Source", select "GitHub Actions"
   - The workflow will automatically run and deploy your site

4. **Access Your Site**:
   - Your site will be available at: `https://yourusername.github.io/vue-website/`
   - The deployment URL will be shown in the Actions tab after successful deployment

### Custom Domain Setup

To use a custom domain with your GitHub Pages site:

1. **Update the CNAME file**:
   - Edit `public/CNAME` and replace `your-custom-domain.com` with your actual domain
   - Commit and push the changes

2. **Configure DNS**:
   - Add a CNAME record in your domain's DNS settings:
     - Name: `www` (or `@` for apex domain)
     - Value: `yourusername.github.io`
   
   For apex domains, you can also use A records pointing to GitHub's IP addresses:
   ```
   185.199.108.153
   185.199.109.153
   185.199.110.153
   185.199.111.153
   ```

3. **Enable Custom Domain in GitHub**:
   - Go to repository Settings > Pages
   - Enter your custom domain in the "Custom domain" field
   - Enable "Enforce HTTPS" (recommended)

4. **Wait for DNS Propagation**:
   - DNS changes can take up to 24 hours to propagate
   - You can check the status in the repository Settings > Pages

## Project Structure

```
vue-website/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow
├── public/
│   ├── CNAME                   # Custom domain configuration
│   └── favicon.svg             # Site favicon
├── src/
│   ├── components/
│   │   ├── Header.vue          # Navigation header
│   │   ├── HomePage.vue        # Main page content
│   │   └── Footer.vue          # Site footer
│   ├── App.vue                 # Root component
│   ├── main.js                 # Application entry point
│   └── style.css               # Global styles
├── index.html                  # HTML template
├── package.json                # Dependencies and scripts
├── vite.config.js              # Vite configuration
└── README.md                   # This file
```

## Customization

### Updating Content

- **Site Title**: Edit the title in `src/components/Header.vue` and `index.html`
- **Hero Section**: Modify `src/components/HomePage.vue` to change the main content
- **Contact Information**: Update the contact details in the contact section
- **Colors**: Adjust the gradient colors in the component styles

### Adding New Pages

1. Create new Vue components in `src/components/`
2. Import and register them in `src/App.vue`
3. Update the navigation in `src/components/Header.vue`

### Styling

The project uses scoped CSS in Vue components. Global styles are in `src/style.css`.

## Troubleshooting

### Common Issues

1. **404 Error on GitHub Pages**:
   - Make sure the repository is public
   - Check that GitHub Actions workflow completed successfully
   - Verify the base path in `vite.config.js` matches your repository name

2. **Custom Domain Not Working**:
   - Verify DNS settings are correct
   - Check that the CNAME file contains the correct domain
   - Wait for DNS propagation (up to 24 hours)

3. **Build Failures**:
   - Check the Actions tab for error details
   - Ensure all dependencies are listed in `package.json`
   - Verify Node.js version compatibility

### Getting Help

If you encounter issues:
1. Check the GitHub Actions logs in the "Actions" tab
2. Verify your DNS settings with your domain provider
3. Review the GitHub Pages documentation

## License

This project is open source and available under the [MIT License](LICENSE).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

