# 📌 DAILY GIT OPERATIONS QUICK REFERENCE
## University Academic Management System

---

## 🚀 START OF DAY

### **First thing every morning (all team members)**:

```bash
cd d:\University-Academic-Management-System

# Update local repository
git fetch origin
git status

# If you're working on a feature branch
git rebase origin/dev
# or
git merge origin/dev

# Make sure you're on correct branch
git branch
```

---

## 💻 DURING DEVELOPMENT

### **Commit cycle** (repeat many times):

```bash
# 1. Make code changes in your editor

# 2. Check what changed
git status
git diff

# 3. Stage the files for this logical unit of work
git add path/to/files

# 4. Verify staging
git diff --staged

# 5. Commit with a clear message
git commit -m "feat(scope): Description of what changed"

# 6. Check your commits are good
git log --oneline -3
```

---

## 🔄 PUSH TO GITHUB

### **Ready to push your feature branch**:

```bash
# 1. Fetch latest updates
git fetch origin

# 2. Ensure you're not behind
git status
#   If says "Your branch is behind"
#   → Run: git rebase origin/dev

# 3. Verify your commits one more time
git log origin/dev..HEAD --oneline

# 4. Check for conflicts you might have
git merge-base --is-ancestor origin/dev HEAD && echo "✓ No conflicts" || echo "⚠ Has conflicts"

# 5. Push to GitHub
git push origin feature/your-branch-name
#   First time? Use: git push -u origin feature/branch
```

---

## 📝 CREATE A PULL REQUEST

### **After pushing to GitHub**:

1. Go to: https://github.com/mahdiazfar27/University-Academic-Management-System/pulls
2. Click **"Compare & pull request"** (auto-appears after push)
3. Verify:
   - **Base branch**: `dev` ✅ (NOT `main`)
   - **Compare branch**: `feature/your-branch-name` ✅
4. Fill in PR details:
   ```
   Title: feat: Clear present-tense description
   
   Description:
   - What does this PR do?
   - Any files I changed?
   - References any issues? #123
   
   Closes: (if it fixes a bug/issue)
   ```
5. Click **"Create pull request"**
6. Notify Mahdi to review

---

## ✅ AFTER MAHDI REVIEWS

### **Scenario 1: PR is approved**

```bash
# Mahdi will merge on GitHub
# Then you should:
git checkout dev
git pull origin dev

# Delete your local feature branch
git branch -d feature/your-branch-name

# Clean up remote branch (Mahdi should have done this)
git push origin --delete feature/your-branch-name
```

### **Scenario 2: Mahdi Requests Changes**

```bash
# Make the requested changes locally
# Edit files...

# Commit and push same feature branch
git add file1 file2
git commit -m "fix: Address review feedback - [description]"
git push origin feature/your-branch-name

# PR updates automatically
# Re-notify Mahdi for re-review
```

### **Scenario 3: Merge Conflict**

```bash
# Mahdi will notify of conflict
# Update your branch:
git fetch origin
git rebase origin/dev

# Git will show conflicted files
# Open them and manually fix:
#   Look for: <<<<< HEAD
#             ======
#             >>>>>

# After fixing all conflicts:
git add fixed_file1 fixed_file2
git rebase --continue

# Force push (safe because you're the only one on this branch)
git push --force-with-lease origin feature/your-branch-name
```

---

## 🔀 SYNC WITH LATEST DEV

### **When other team members' PRs get merged**:

```bash
git fetch origin
git status

# If you're behind dev:
git rebase origin/dev
#   or
git merge origin/dev

# Then continue working on your feature
```

---

## 🐛 COMMON MISTAKES & FIXES

### **"I committed to dev instead of a feature branch"**

```bash
# Undo! First check what's on dev
git log --oneline origin/dev -1

# Create feature branch with current commits
git branch feature/correct-branch

# Reset dev to remote version
git reset --hard origin/dev

# Verify
git log --oneline -1  # Should match origin/dev
git branch           # Should show feature/correct-branch

# Switch to feature branch and continue
git checkout feature/correct-branch
```

---

### **"I forgot to pull before pushing"**

```bash
git status
# Shows: "Your branch is behind 'origin/dev'"

# Pull latest
git pull --rebase  # Keeps history cleaner

# Or merge
git pull
```

---

### **"My feature branch has conflicts with dev"**

```bash
# Fetch latest
git fetch origin

# Try to rebase
git rebase origin/dev

# If it fails and shows conflicts:
# 1. Open conflicted files
# 2. Search for: <<<<< HEAD ....... >>>>>
# 3. Choose which version to keep
# 4. Remove conflict markers
# 5. Stage and continue

git add path/to/fixed-file
git rebase --continue

# If rebase becomes too messy, abort and start over
git rebase --abort
```

---

### **"I want to undo my last commit"**

```bash
# If not yet pushed:
git reset HEAD~1      # Keep changes in working directory
# or
git reset --soft HEAD~1  # Keep changes staged
# or
git reset --hard HEAD~1  # Discard changes completely (DANGER!)

# If already pushed (and no PR yet):
# Ask Mahdi before doing anything
# Contact: @ Mahdi
```

---

### **"I accidentally deleted a file"**

```bash
# Restore from Git
git checkout -- path/to/deleted/file

# If you already committed the deletion:
git revert HEAD  # Creates new commit that undoes deletion
```

---

## 📊 CHECK YOUR STATUS

### **What's the state of my branch?**

```bash
# All your commits not in dev
git log origin/dev..HEAD --oneline

# All files you've modified (staged and unstaged)
git status

# Detailed line-by-line changes
git diff

# What's committed vs what could be committed
git diff --staged
```

### **What has other people pushed?**

```bash
# New PRs or branches since last fetch
git fetch origin

# What's on dev now
git log origin/dev --oneline -10

# What's changed on dev since yesterday
git log --since="1 day ago" origin/dev --oneline
```

---

## 📋 BEFORE YOU LEAVE FOR THE DAY

### **Checklist**:

- [ ] All my changes are either committed or safely staged
- [ ] My feature branch is pushed to GitHub
- [ ] If PR is  ready, it's created and Mahdi is notified
- [ ] `git status` shows no uncommitted changes
- [ ] `git log` shows my commits look good

```bash
# Final verification

git status
# Should show: "On branch feature/..."
#              "nothing to commit, working tree clean"

git log --oneline -5
# Should show your commits with clear messages

git branch -v
# Should show your branches and their status
```

---

## 🎯 QUICK COMMANDS

| Goal | Command |
|------|---------|
| See what I've done | `git log --oneline -10` |
| See what changed | `git diff` |
| See what I staged | `git diff --staged` |
| Stage a file | `git add path/to/file` |
| Unstage a file | `git reset path/to/file` |
| Commit | `git commit -m "message"` |
| Push first time | `git push -u origin feature/name` |
| Push normal | `git push` |
| Sync with dev | `git fetch origin` then `git rebase origin/dev` |
| View remote branches | `git branch -r` |
| Delete local branch | `git branch -d feature/name` |
| Undo last commit | `git reset HEAD~1` |
| See commits not in dev | `git log origin/dev..HEAD --oneline` |

---

## 🆘 WHEN TO ASK FOR HELP

**Ask Mahdi if you don't know**:
- Whether to rebase or merge
- How to handle a complex merge conflict
- Whether to force push
- How to recover deleted commits
- GitHub settings or permissions issues
- When to release a version

**Ask GitHub/Google if you want to learn**:
- How does Git work?
- What's the difference between merge and rebase?
- How do I write good commit messages?
- What's a detached HEAD?

---

## 📞 IMPORTANT PHONE NUMBERS

- **Mahdi (Lead)**: [Contact info]
- **Redowan (Frontend)**: [Contact info]
- **Rupam (DevOps)**: [Contact info]

---

**Print this and keep at your desk!** 🖨️

Generated: April 11, 2026
