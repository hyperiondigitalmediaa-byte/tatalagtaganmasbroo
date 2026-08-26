# 🎨 Font Backup & Restore Guide

## 📦 Original Fonts (Before Change)

**Date:** December 2024  
**Fonts:** Inter + Poppins

### Original Configuration:

```typescript
// app/layout.tsx
import { Inter, Poppins } from "next/font/google";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});

// Body className
className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
```

### CSS Variables:
```css
--font-inter: Inter
--font-poppins: Poppins
```

---

## 🆕 New Fonts (Current)

**Date:** December 2024  
**Fonts:** Roboto + Merriweather

### New Configuration:

```typescript
// app/layout.tsx
import { Roboto, Merriweather } from "next/font/google";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

// Body className
className={`${roboto.variable} ${merriweather.variable} font-sans antialiased`}
```

### CSS Variables:
```css
--font-roboto: Roboto
--font-merriweather: Merriweather
```

---

## 🔄 How to Restore Original Fonts

### Step 1: Update app/layout.tsx

Replace the import:
```typescript
// Change FROM:
import { Roboto, Merriweather } from "next/font/google";

// Change TO:
import { Inter, Poppins } from "next/font/google";
```

### Step 2: Update font configurations

Replace the font configs:
```typescript
// Change FROM:
const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  display: "swap",
});

const merriweather = Merriweather({
  variable: "--font-merriweather",
  subsets: ["latin"],
  weight: ["300", "400", "700", "900"],
  display: "swap",
});

// Change TO:
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const poppins = Poppins({
  variable: "--font-poppins",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  display: "swap",
});
```

### Step 3: Update body className

Replace the className:
```typescript
// Change FROM:
className={`${roboto.variable} ${merriweather.variable} font-sans antialiased`}

// Change TO:
className={`${inter.variable} ${poppins.variable} font-sans antialiased`}
```

### Step 4: Update tailwind.config.ts (if changed)

```typescript
// Change FROM:
fontFamily: {
  sans: ["var(--font-roboto)", "sans-serif"],
  serif: ["var(--font-merriweather)", "serif"],
}

// Change TO:
fontFamily: {
  sans: ["var(--font-inter)", "sans-serif"],
  heading: ["var(--font-poppins)", "sans-serif"],
}
```

### Step 5: Restart dev server

```bash
# Stop current server (Ctrl+C)
# Start again
npm run dev
```

---

## 📊 Font Comparison

| Aspect | Inter + Poppins | Roboto + Merriweather |
|--------|-----------------|----------------------|
| Style | Modern, Tech | Professional, News |
| Readability | 8/10 | 10/10 |
| News Feel | 6/10 | 10/10 |
| Performance | 9/10 | 9/10 |
| Use Case | Startup, SaaS | News, Editorial |

---

## 💡 Quick Switch Commands

### Switch to Roboto + Merriweather:
```bash
# Copy this file content to app/layout.tsx
# See "New Configuration" section above
```

### Switch back to Inter + Poppins:
```bash
# Copy this file content to app/layout.tsx
# See "Original Configuration" section above
```

---

## 🎯 Recommendation

**For News Website:** Use **Roboto + Merriweather** ✅  
**For Tech/Startup:** Use **Inter + Poppins** ✅

---

**Last Updated:** December 2024  
**Backup Created By:** Kiro AI Assistant
