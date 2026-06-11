# Deployment Guide - Lifestyle Redesign

## Current Status

✅ **Development**: Running on http://localhost:3000
✅ **Build**: Production-ready, 0 errors
✅ **All functionality**: Preserved and tested

---

## Local Development

### Start Dev Server
```bash
npm run dev
```
- Opens at http://localhost:3000 (or next available port)
- Auto-refreshes on file changes
- Full source maps for debugging

### Stop Dev Server
Press `Ctrl + C` in terminal

---

## Production Build

### Build Command
```bash
npm run build
```

**What it does:**
- Compiles all code
- Optimizes images
- Generates static pages
- Creates production bundle
- Outputs to `.next` folder

**Time:** ~3-5 minutes depending on product count

### Verify Build
```bash
npm start
```
- Runs production server
- Simulates live environment
- Visit http://localhost:3000

---

## Deployment Options

### Option 1: Vercel (Recommended for Next.js)

**Easiest deployment:**

1. **Connect Repository**
   - Go to https://vercel.com
   - Sign in with GitHub/GitLab/Bitbucket
   - Import your repository

2. **Configure**
   - Framework: Next.js (auto-detected)
   - Build Command: `npm run build`
   - Output Directory: `.next`
   - Environment Variables: Add `.env.local` settings

3. **Deploy**
   - Click "Deploy"
   - Automatic deployments on git push

**Features:**
- Automatic HTTPS
- Global CDN
- Preview deployments
- Analytics included
- Zero-config deployment

---

### Option 2: Netlify

**Good alternative:**

1. **Build locally first**
   ```bash
   npm run build
   npm start
   ```

2. **Create Netlify site**
   - Go to https://netlify.com
   - Sign in with GitHub
   - Import repository

3. **Configure**
   - Build command: `npm run build`
   - Publish directory: `.next/static`
   - Environment variables: Add your settings

4. **Deploy**
   - Click deploy
   - Automatic on git push

---

### Option 3: AWS / Digital Ocean / Heroku

**Manual deployment:**

1. **Build locally**
   ```bash
   npm run build
   ```

2. **Upload to server**
   - Upload `.next` folder
   - Upload `package.json` and `package-lock.json`
   - Upload `.env.local` (secure)
   - Upload `public` folder

3. **On server, run**
   ```bash
   npm install --production
   npm start
   ```

4. **Set up reverse proxy** (Nginx/Apache)
   - Point to http://localhost:3000
   - Configure SSL/HTTPS
   - Set up domain

---

### Option 4: Docker (For containers)

**Create Dockerfile:**
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY .next ./
COPY public ./public
CMD ["npm", "start"]
```

**Build & Run:**
```bash
docker build -t inspofashions .
docker run -p 3000:3000 inspofashions
```

---

## Environment Variables

### Required Variables

Create `.env.local` with:
```
NEXT_PUBLIC_SITE_URL=https://yourdomain.com
NEXT_PUBLIC_WHATSAPP_NUMBER=+919876543210
```

### Optional Variables

```
DATABASE_URL=your_database_url
API_KEY=your_api_key
```

---

## Database Setup

If using a database, ensure:
- Database is accessible from server
- Connection string in `.env.local`
- Migrations run before deployment
- Backups configured

---

## SSL/HTTPS Setup

### If using Vercel/Netlify
- Automatic HTTPS (included)

### If using manual server
1. Get SSL certificate (Let's Encrypt free)
2. Configure Nginx/Apache
3. Enable HTTPS on port 443
4. Redirect HTTP to HTTPS

**Example Nginx config:**
```nginx
server {
    listen 443 ssl;
    server_name yourdomain.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:3000;
        proxy_set_header Host $host;
    }
}
```

---

## Performance Optimization

### Already Implemented
- ✅ Image optimization (Next.js)
- ✅ Code splitting
- ✅ Lazy loading
- ✅ CSS optimization
- ✅ Minification

### Monitor Performance
- Use Lighthouse (Chrome DevTools)
- Check Core Web Vitals
- Monitor page load time
- Track user analytics

---

## Monitoring & Maintenance

### Set Up Monitoring
- Uptime monitoring (UptimeRobot, Pingdom)
- Error tracking (Sentry)
- Analytics (Google Analytics, Mixpanel)
- Performance monitoring (New Relic, DataDog)

### Regular Maintenance
- Monitor error logs
- Update dependencies monthly
- Backup database regularly
- Check analytics for issues

---

## Rollback Plan

If issues occur after deployment:

**Option 1: Revert Git**
```bash
git revert <commit-hash>
git push
# Auto-deploys on Vercel/Netlify
```

**Option 2: Redeploy Previous Version**
- Vercel: Click "Rollback" on deployments
- Netlify: Deploy previous version

**Option 3: Local Fix**
```bash
git checkout <previous-commit>
npm run build
npm start
```

---

## Deployment Checklist

Before going live:

- [ ] Build succeeds: `npm run build`
- [ ] No console errors
- [ ] Test locally: `npm start`
- [ ] Mobile responsive works
- [ ] All links functional
- [ ] Cart functionality works
- [ ] WhatsApp checkout works
- [ ] Images load correctly
- [ ] Database connected (if applicable)
- [ ] Environment variables set
- [ ] SSL/HTTPS configured
- [ ] DNS configured for domain
- [ ] Error handling in place
- [ ] Analytics configured
- [ ] Monitoring set up
- [ ] Backup strategy defined

---

## Domain & DNS

### Point Domain to Deployment

**Vercel/Netlify:**
- Add custom domain in dashboard
- Update DNS at domain registrar
- Point CNAME to Vercel/Netlify

**Manual Server:**
- Create A record pointing to server IP
- Configure server for domain

---

## Common Issues & Solutions

### Issue: Build fails
**Solution:**
```bash
rm -rf node_modules
npm install
npm run build
```

### Issue: Images not loading
**Solution:**
- Check image paths are correct
- Verify public folder uploaded
- Check file permissions

### Issue: Database connection fails
**Solution:**
- Verify connection string in `.env.local`
- Check database is accessible from server
- Verify credentials

### Issue: Site shows 404
**Solution:**
- Check domain DNS configuration
- Verify reverse proxy configuration
- Restart server/container

---

## Performance Targets

After deployment, aim for:
- **Lighthouse Score:** 90+
- **Page Load Time:** < 2 seconds
- **First Contentful Paint:** < 1 second
- **Largest Contentful Paint:** < 2.5 seconds

---

## Support & Help

- **Next.js Docs:** https://nextjs.org/docs
- **Deployment Guides:**
  - Vercel: https://vercel.com/docs
  - Netlify: https://docs.netlify.com
- **Community Help:** https://github.com/vercel/next.js/discussions

---

## Quick Start Deploy

### Fastest Way (Vercel):

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Lifestyle redesign ready"
   git push
   ```

2. **Connect to Vercel**
   - Go to https://vercel.com/new
   - Select your repository
   - Click Import
   - Click Deploy

3. **Done!**
   - Gets a live URL immediately
   - Auto-deploys on future git pushes
   - Your site is live

---

**Your lifestyle redesign is ready to deploy!**

Choose a deployment option above and follow the steps. If you prefer Vercel (recommended for Next.js), you can have your site live in under 5 minutes.
