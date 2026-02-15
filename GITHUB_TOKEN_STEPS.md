# GitHub Token Kaise Generate Karein

## Step-by-Step Guide (with Screenshots description)

### Step 1: GitHub Login Karo
- github.com par jao
- Apna username/password se login karo

### Step 2: Settings Mein Jao
1. Top right corner mein aapka **profile photo** dikhega
2. Uspe **click** karo
3. Dropdown mein **"Settings"** select karo

```
┌─────────────────────────────────────┐
│  Profile Photo                      │
│     ↓                               │
│  Your profile                       │
│  Your repositories                  │
│  Settings  ←  YEH CLICK KARO        │
└─────────────────────────────────────┘
```

### Step 3: Developer Settings
1. Left sidebar mein sabse **neeche** scroll karo
2. **"Developer settings"** par click karo

```
┌──────────────────────────┐
│ Settings                 │
│                          │
│ Account                  │
│ Emails                   │
│ ...                      │
│                          │
│ Developer settings  ←    │
└──────────────────────────┘
```

### Step 4: Personal Access Tokens
1. Left sidebar mein **"Personal access tokens"** par click karo
2. **"Tokens (classic)"** select karo
3. **"Generate new token"** button par click karo
4. **"Generate new token (classic)"** select karo

### Step 5: Token Configure Karo

**Note:** Likho kuch bhi jaise "Deploy Website"

**Expiration:** Select karo **"No expiration"** (ya 90 days)

**Scopes (Permissions):** Yeh select karo:
- ✅ **repo** (Full control of private repositories)
- ✅ **workflow** (Update GitHub Action workflows)

```
☑️ repo
   ☑️ repo:status
   ☑️ repo_deployment
   ☑️ public_repo
   ☑️ repo:invite
   
☑️ workflow
```

### Step 6: Generate Token
- **"Generate token"** button par click karo
- **GREEN COLOR** ka ek token dikhega
- **YEH COPY KARO** (kahi safe jagah save kar lo)

⚠️ **IMPORTANT:** Yeh token sirf EK HI BAAR dikhega! 
Agar bhool gaye toh naya banana padega.

### Step 7: Mujhe Token Do
Token aise dikhega:
```
ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**Example:**
```
ghp_aBcDeFgHiJkLmNoPqRsTuVwXyZ1234567890
```

---

## 🔒 Security Warning
- Is token ko kisi ke saath share mat karo
- Bas mujhe temporarily do, main deploy kar dunga
- Ya phir khud use kar lo neeche diye commands mein

---

## Alternative: Khud Deploy Karo

Token generate karne ke baad, terminal mein yeh run karo:

```bash
cd "/Users/arbaz/Downloads/app"

# Git remote add (repo link)
git remote add origin https://github.com/Arbazkhanj/photo-tools.git

# Push karo - yahan token maangega
git push -u origin main

# Username: Arbazkhanj
# Password: YEHAN TOKEN DAALO (jo abhi generate kiya)
```

---

## 🆘 Help
Agar koi problem aaye toh screenshot bhejo, main guide karunga!
