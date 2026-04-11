# 🤖 GITHUB WORKFLOW AUTOMATION & TROUBLESHOOTING

## University Academic Management System

---

## GitHub Repository Settings (RECOMMENDED)

### **Branch Protection Rules - DEV branch**

```
Navigate to: Settings → Branches → Add Rule

Branch name pattern: dev

Require pull request reviews before merging
  ✅ Required number of reviews: 1
  ✅ Dismiss stale pull request approvals when new commits are pushed

Require status checks to pass before merging
  ✅ Require branches to be up to date before merging

Require signed commits
  ☐ Optional (for additional security)

Restrict who can push to matching branches
  ✅ Allows: Repository administrator (Mahdi)

Allow force pushes
  ☐ Do not allow force pushes

Allow deletions
  ☐ Do not allow deletions
```

### **Branch Protection Rules - MAIN branch**

```
Branch name pattern: main

Require pull request reviews before merging
  ✅ Required number of reviews: 2 (Mahdi, Redowan, and/or Rupam)
  ✅ Dismiss stale pull request approvals

Require status checks to pass before merging
  ✅ Require branches to be up to date before merging

Require signed commits
  ✅ Recommended for production

Restrict who can push to matching branches
  ✅ Repository administrator only

Allow deletions
  ☐ No
```

---

## PR Review Checklist for Mahdi

Before merging any PR into dev:

### **Code Quality**
- [ ] Commit messages are clear and follow convention
- [ ] No debug console.log() or var_dump() left in code
- [ ] No temporary test files included
- [ ] Code is properly indented and formatted

### **Files & Contents**
- [ ] ✅ Only relevant files are included
- [ ] ❌ NO .env files (must stay local)
- [ ] ❌ NO node_modules or vendor directories
- [ ] ❌ NO build artifacts (dist/, public/build/)
- [ ] ❌ NO .DS_Store, Thumbs.db, or OS files

### **Git Hygiene**
- [ ] Commits are logically grouped by feature/module
- [ ] No merge commits mixed with feature work
- [ ] No "WIP" or "temp" commits
- [ ] Branch is up-to-date with dev (no conflicts)

### **Functionality**
- [ ] Feature branch builds locally without errors
- [ ] Code follows project conventions
- [ ] Related documentation is updated
- [ ] Tests pass (if applicable)

### **Approval Decision**

```
✅ APPROVE AND MERGE if:
  - All checklist items are satisfied
  - Code quality is good
  - No blocking issues

🔄 REQUEST CHANGES if:
  - Test files or secrets committed
  - Code quality issues detected
  - Documentation missing

❌ CLOSE if:
  - Unrelated to project scope
  - Breaks existing functionality
  - Conflicts cannot be resolved
```

---

## Automated PR Creation Script

### **For Mahdi: Merge PR locally and push**

```bash
#!/bin/bash
# save as: merge_pr.sh

# Variables
BRANCH=$1  # "feature/mahdi-database-core"
PR_NUMBER=$2

if [ -z "$BRANCH" ]; then
  echo "Usage: ./merge_pr.sh <branch-name> [pr-number]"
  echo "Example: ./merge_pr.sh feature/mahdi-database-core 1"
  exit 1
fi

# Ensure on dev
git checkout dev
git pull origin dev

# Merge feature branch
git merge origin/$BRANCH --no-ff -m "Merge $BRANCH into dev via PR #$PR_NUMBER"

# Verify merge
echo "✓ Merged $BRANCH into dev"
git log --oneline -3

# Push to GitHub
git push origin dev

# Delete remote branch
git push origin --delete $BRANCH

echo "✓ PR #$PR_NUMBER merged and cleaned up"
```

**Usage**:
```bash
bash merge_pr.sh feature/mahdi-database-core 1
bash merge_pr.sh feature/redowan-frontend-setup 3
```

---

## Conflict Resolution Guide

### **Scenario: PR has conflicts**

**Mahdi's action**:

```bash
# Get the conflicted branch
git fetch origin
git checkout feature/conflicting-branch

# Merge dev to see conflicts locally
git merge origin/dev

# Git shows which files have conflicts
git status

# Open conflicted files in editor
# Look for: <<<<< HEAD, =====, >>>>>
# Choose which version to keep

# Example of resolving
nano server/routes/api.php  # or your editor

# After fixing manually:
git add server/routes/api.php
git commit -m "resolve: Merge conflicts from dev"

# Push the resolved branch
git push origin feature/conflicting-branch

# Notify team: "PR #X conflicts resolved, ready to re-review"
```

---

## Auto-Sync Script

Everyone runs this daily to stay in sync:

```bash
#!/bin/bash
# save as: sync.sh

echo "🔄 Syncing with GitHub..."

# Fetch latest
git fetch origin

# Show what changed
echo ""
echo "📊 Changes since last sync:"
git log HEAD..origin/dev --oneline

echo ""
echo "Your branches:"
git branch -vv | head -5

echo ""
echo "✓ Fetch complete. Consider running: git rebase origin/dev"
```

**Usage**:
```bash
bash sync.sh
```

---

## Automated Push-to-PR workflow

```bash
#!/bin/bash
# save as: push_and_notify.sh
# Usage: bash push_and_notify.sh "feat: My feature" "Mahdi" "this is the description"

BRANCH=$(git rev-parse --abbrev-ref HEAD)
COMMIT_MSG=$1
AUTHOR=$2
DESCRIPTION=$3

# Verify we're not on main or dev
if [[ "$BRANCH" == "main" ]] || [[ "$BRANCH" == "dev" ]]; then
  echo "❌ ERROR: Cannot push from $BRANCH"
  exit 1
fi

# Verify branch is clean
if ! git diff-index --quiet HEAD --; then
  echo "❌ ERROR: Uncommitted changes. Commit first:"
  git status
  exit 1
fi

# Push to GitHub
echo "🚀 Pushing $BRANCH to GitHub..."
git push -u origin $BRANCH

echo "✓ Branch pushed!"
echo ""
echo "📝 Next steps:"
echo "1. Go to: https://github.com/mahdiazfar27/University-Academic-Management-System/pulls"
echo "2. Click 'New Pull Request' or 'Compare & pull request'"
echo "3. Base: dev, Compare: $BRANCH"
echo "4. Title: $COMMIT_MSG"
echo "5. Description: $DESCRIPTION"
echo "6. Assign reviewers: @mahdiazfar27"
echo ""
echo "⏰ Waiting for review..."
```

**Usage**:
```bash
bash push_and_notify.sh \
  "feat: Add database migrations" \
  "Mahdi" \
  "Adds 16 database migrations for complete schema"
```

---

## Emergency: Revert a Merge

**If Mahdi accidentally merged bad code to dev**:

```bash
# Check the commit hash of the merge
git log --oneline dev -10

# Find the commit to revert (usually newest)
# Let's say it's: abc1234

# Revert the merge commit
git revert abc1234 -m 1

# This creates a NEW commit that undoes the merge
git push origin dev

# Notify team: "Reverted commit abc1234, please sync"

# All team members:
git checkout dev
git pull origin dev
```

---

## Undoing a Push (Advanced)

**ONLY if nothing else was pushed after your commit**:

```bash
# Check what you pushed
git log origin/dev -5 --oneline

# Find YOUR commit hash
HASH=abc1234

# Reset your local branch
git reset --soft $HASH^

# This undoes the commit but keeps changes
git status  # Files are unstaged

# Create a new commit with fixed version
git add .
git commit -m "fix: Corrected version of previous commit"

# Force push (RISKY - only safe if no one else pushed)
git push --force-with-lease origin dev

# Notify team immediately
```

**⚠️ WARNING**: Only do this if you're 100% sure no one else pushed after your commit

---

## GitHub Actions Automation (Optional)

### **Automatic tests on PR**

Create `.github/workflows/test.yml`:

```yaml
name: Tests

on: [pull_request, push]

jobs:
  backend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup PHP
        uses: shivammathur/setup-php@v2
        with:
          php-version: '8.2'
      
      - name: Install dependencies
        run: cd server && composer install
      
      - name: Run tests
        run: cd server && php artisan test
  
  frontend:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: cd client && npm install
      
      - name: Run tests
        run: cd client && npm run test
```

This automatically runs tests when PRs are created!

---

## GitHub Branch Status Dashboard

**See all branch statuses**:

```bash
git log --all --oneline --graph --decorate

# Or just see which branches are ahead/behind
git branch -vv

# See branches deleted from remote
git remote prune origin --dry-run
git remote prune origin  # actually prune
```

---

## Notification Setup (Teams/Slack)

### **GitHub Slack Integration**

1. Go to GitHub → Settings → Integrations & services
2. Add Slack
3. Select events to notify
4. Set Slack channel

### **GitHub Teams Integration**

1. Go to GitHub → Settings → Teams
2. Add team members
3. Set notification preferences

---

## FAQ & Troubleshooting

### Q: "I accidentally committed to main instead of a feature branch"

A:
```bash
git reset --soft HEAD~1  # Undo commit, keep changes
git checkout -b feature/correct-branch  # Create correct branch
git commit -m "feat: Correct commit"  # Re-commit
git reset --hard origin/main  # Fix main
```

---

### Q: "Someone merged a broken PR, how do I revert?"

A:
```bash
git log dev -10 --oneline
git revert <commit-hash> -m 1
git push origin dev
```

---

### Q: "How do I keep my feature branch up-to-date with dev?"

A:
```bash
git fetch origin
git rebase origin/dev
# Or
git merge origin/dev
```

---

### Q: "My PR has conflicts, how do I fix?"

A:
```bash
git fetch origin
git merge origin/dev
# Fix conflicts in editor
git add fixed_files
git commit -m "resolve: merge conflicts"
git push
```

---

### Q: "I want to see what changed in dev since I started my branch"

A:
```bash
git diff origin/dev...HEAD --stat
git diff origin/dev...HEAD
```

---

### Q: "How do I rename my branch?"

A:
```bash
# Local rename
git branch -m old-name new-name

# If already pushed, need to update remote
git push origin :old-name new-name
git push origin -u new-name
```

---

## Performance Tips

### **Speed up git operations**:

```bash
# Convert to shallow clone (faster for large repos)
git clone --depth 1 https://github.com/mahdiazfar27/...

# Or configure for frequently-used repos
git config --global http.postBuffer 524288000
```

### **Speed up commits**:

```bash
# Enable git gc (garbage collection)
git gc

# Configure status command
git config --global status.showUntrackedFiles all
```

---

## Security Best Practices

✅ **DO**:
- Use SSH keys for authentication
- Sign commits with GPG (optional)
- Keep .env files ONLY locally
- Review all code before merging
- Use branch protection rules

❌ **DON'T**:
- Commit secrets or credentials
- Force push to main or dev
- Commit node_modules or vendor
- Share access tokens or keys
- Merge without review

---

*This guide is living documentation - update as needed*

*Last updated: April 11, 2026*
