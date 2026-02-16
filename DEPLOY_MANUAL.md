# Manual Deploy Steps (Simple)

## ✅ Repository Ban Gayi!
URL: https://github.com/Arbazkhanj/photo-tools

## Step 1: GitHub Desktop App Download Karo
1. https://desktop.github.com par jao
2. Download aur install karo
3. Login karo apne GitHub account se

## Step 2: Repository Clone Karo
1. GitHub Desktop mein **File** → **Clone Repository**
2. **URL** tab select karo
3. URL: `https://github.com/Arbazkhanj/photo-tools`
4. Local path: Koi bhi folder select karo jaise `/Users/arbaz/Documents/photo-tools`
5. **Clone** karo

## Step 3: Files Copy Karo
1. `/Users/arbaz/Downloads/app/dist` folder kholo
2. Saari files copy karo (Ctrl+A, Ctrl+C)
3. Clone kiye hue repository folder mein paste karo (Ctrl+V)

## Step 4: Commit & Push
1. GitHub Desktop mein dekho - saari files dikhayengi changes mein
2. Summary mein likho: "Initial deploy"
3. **Commit to main** click karo
4. **Push origin** click karo

## Step 5: GitHub Pages Enable Karo
1. https://github.com/Arbazkhanj/photo-tools par jao
2. **Settings** tab click karo
3. Left sidebar mein **Pages** click karo
4. **Source**: Select **Deploy from a branch**
5. **Branch**: Select **main** aur **/(root)**
6. **Save** karo

## Step 6: Domain Connect Karo
1. Same Pages settings mein
2. **Custom domain** mein daalo: `khanjansevakendra.com`
3. **Save** karo
4. **Enforce HTTPS** ✅ tick karo

## Step 7: DNS Settings (Domain Provider)
Aapke domain provider (GoDaddy/Namecheap/etc.) pe jao:

| Type | Name | Value |
|------|------|-------|
| A | @ | 185.199.108.153 |
| A | @ | 185.199.109.153 |
| A | @ | 185.199.110.153 |
| A | @ | 185.199.111.153 |
| CNAME | www | arbazkhanj.github.io |

## Done! 🎉
10-15 minutes mein live hoga:
- `https://khanjansevakendra.com` - Aapki website

## Problem Aaye?
Mujhe batao, main help karunga!
