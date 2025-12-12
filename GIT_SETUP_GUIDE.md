# Git Setup Guide for Your Project

## Step 1: Install Git

### Download and Install Git for Windows:
1. Visit: https://git-scm.com/download/win
2. Download the latest version (64-bit recommended)
3. Run the installer
4. **Important**: During installation, select these options:
   - ✅ "Git from the command line and also from 3rd-party software"
   - ✅ "Use Windows' default console window"
   - ✅ Click "Next" through other options (defaults are fine)

### Verify Installation:
After installing, restart VS Code, then open a new terminal and run:
```powershell
git --version
```

You should see something like: `git version 2.43.0.windows.1`

## Step 2: Configure Git (First Time Setup)

```powershell
# Set your name (will appear in commits)
git config --global user.name "Your Name"

# Set your email (use your GitHub email)
git config --global user.email "your.email@example.com"

# Verify settings
git config --global --list
```

## Step 3: Initialize Git Repository

```powershell
cd C:\hackquest

# Initialize git repository
git init

# Check status
git status
```

## Step 4: Create .gitignore File

The project should already have a `.gitignore` file. If not, create one with:

```.gitignore
# Dependencies
node_modules/
.pnp
.pnp.js

# Testing
coverage/

# Next.js
.next/
out/
build/
dist/

# Production
build/

# Misc
.DS_Store
*.pem

# Debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Local env files
.env
.env*.local
.env.local
.env.development.local
.env.test.local
.env.production.local

# Vercel
.vercel

# TypeScript
*.tsbuildinfo
next-env.d.ts

# Prisma
prisma/dev.db
prisma/dev.db-journal

# Uploads (don't commit user uploads)
public/uploads/

# IDE
.vscode/
.idea/
*.swp
*.swo
*~

# OS
.DS_Store
Thumbs.db
```

## Step 5: Add Files to Git

```powershell
# Add all files to staging
git add .

# Check what will be committed
git status

# Create first commit
git commit -m "Initial commit: HackQuest Meme IP Vault project"
```

## Step 6: Create GitHub Repository

1. Go to https://github.com/new
2. Name your repository (e.g., `hackquest-meme-vault`)
3. **Don't** initialize with README (your project already has one)
4. Click "Create repository"

## Step 7: Connect to GitHub

GitHub will show you commands. Use these:

```powershell
# Add remote repository
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# Verify remote
git remote -v

# Push code to GitHub
git branch -M main
git push -u origin main
```

### If you get authentication errors:

**Option 1: GitHub Personal Access Token (Recommended)**
1. Go to GitHub Settings → Developer settings → Personal access tokens → Tokens (classic)
2. Click "Generate new token (classic)"
3. Select scopes: `repo` (full control of private repositories)
4. Copy the token (you won't see it again!)
5. When pushing, use token as password:
   ```
   Username: your_github_username
   Password: your_personal_access_token
   ```

**Option 2: GitHub Desktop (Easier)**
1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your GitHub account
3. Add existing repository: File → Add local repository → Choose `C:\hackquest`
4. Push to GitHub

## Step 8: Push to GitHub

```powershell
# Push your code
git push -u origin main
```

## Common Git Commands

```powershell
# Check status
git status

# Add specific file
git add filename.txt

# Add all changes
git add .

# Commit with message
git commit -m "Your commit message"

# Push to GitHub
git push

# Pull latest changes
git pull

# Create new branch
git checkout -b feature-name

# Switch branches
git checkout main

# See commit history
git log --oneline
```

## After Git is Installed

1. Close and reopen VS Code
2. The Source Control icon (third icon on left sidebar) should now show your files
3. You can stage, commit, and push from VS Code UI!

## Quick Start (After Git is Installed)

```powershell
cd C:\hackquest
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

## Troubleshooting

### "Git is not recognized"
- Restart VS Code after installing Git
- Restart your computer if needed
- Check Git is in PATH: `$env:PATH -split ';' | Select-String git`

### "Permission denied (publickey)"
- Use HTTPS instead of SSH for now
- Or set up SSH keys: https://docs.github.com/en/authentication/connecting-to-github-with-ssh

### "Failed to push some refs"
```powershell
# Pull first, then push
git pull origin main --allow-unrelated-histories
git push origin main
```

### Large files error
- Add them to `.gitignore`
- Or use Git LFS: https://git-lfs.github.com/

## VS Code Source Control

After Git is set up, you can use VS Code's built-in Git UI:

1. **Source Control Panel** (Ctrl+Shift+G):
   - See changed files
   - Stage files by clicking "+"
   - Write commit message
   - Click ✓ to commit
   - Click "..." → Push to push to GitHub

2. **GitHub Extension**:
   - Install "GitHub Pull Requests and Issues" extension
   - Sign in to GitHub
   - Push directly from VS Code

## Next Steps

1. Install Git from https://git-scm.com/download/win
2. Restart VS Code
3. Run the commands in Step 3-7
4. Your project will be on GitHub!
