# 📏 Typography (Font Size) Backup & Restore Guide

## 📦 Original Typography (Before Change)

**Date:** December 2024  
**Font Size:** 18px (1.125rem) - Large  
**Line Height:** 1.8

### Original Configuration:

```css
/* app/globals.css */

/* Article Detail Page Styles */
.article-content {
  font-family: var(--font-merriweather), Georgia, serif;
  font-size: 1.125rem;      /* 18px - LARGE */
  line-height: 1.8;         /* Wide spacing */
  color: #1a1a1a;
}

.article-content p {
  margin-bottom: 1.5rem;
  text-align: justify;
}
```

**Characteristics:**
- ✅ Very readable
- ✅ Good for accessibility
- ❌ Too large for news articles
- ❌ Inefficient scrolling
- ❌ Not industry standard

---

## 🆕 New Typography (Current)

**Date:** December 2024  
**Font Size:** 16px (1rem) - Standard  
**Line Height:** 1.7

### New Configuration:

```css
/* app/globals.css */

/* Article Detail Page Styles */
.article-content {
  font-family: var(--font-merriweather), Georgia, serif;
  font-size: 1rem;          /* 16px - STANDARD */
  line-height: 1.7;         /* Comfortable spacing */
  color: #1a1a1a;
}

.article-content p {
  margin-bottom: 1.25rem;   /* Reduced from 1.5rem */
  text-align: justify;
}
```

**Characteristics:**
- ✅ Industry standard (Detik, Kompas, CNN)
- ✅ Professional look
- ✅ Efficient scrolling
- ✅ Better for mobile
- ✅ Proven readability

---

## 📊 Size Comparison

| Size | Use Case | Readability | Efficiency | Professional |
|------|----------|-------------|------------|--------------|
| **18px (1.125rem)** | Accessibility sites | 10/10 | 6/10 | 7/10 |
| **17px (1.0625rem)** | Premium news | 9/10 | 8/10 | 9/10 |
| **16px (1rem)** | Standard news | 9/10 | 9/10 | 10/10 |
| **15px (0.9375rem)** | Compact news | 7/10 | 10/10 | 8/10 |

---

## 🔄 How to Restore Original Size (18px)

### Step 1: Open app/globals.css

Find this section:
```css
/* Article Detail Page Styles */
.article-content {
  font-family: var(--font-merriweather), Georgia, serif;
  font-size: 1rem;          /* Current: 16px */
  line-height: 1.7;
  color: #1a1a1a;
}

.article-content p {
  margin-bottom: 1.25rem;
  text-align: justify;
}
```

### Step 2: Change to Original Values

```css
/* Article Detail Page Styles */
.article-content {
  font-family: var(--font-merriweather), Georgia, serif;
  font-size: 1.125rem;      /* Back to 18px */
  line-height: 1.8;         /* Back to 1.8 */
  color: #1a1a1a;
}

.article-content p {
  margin-bottom: 1.5rem;    /* Back to 1.5rem */
  text-align: justify;
}
```

### Step 3: Save and Refresh

No need to restart server, just refresh browser!

---

## 🎨 Alternative Sizes (If Needed)

### Option A: Slightly Larger (17px)
```css
.article-content {
  font-size: 1.0625rem;     /* 17px */
  line-height: 1.7;
}
```

### Option B: Standard (16px) - CURRENT
```css
.article-content {
  font-size: 1rem;          /* 16px */
  line-height: 1.7;
}
```

### Option C: Compact (15px)
```css
.article-content {
  font-size: 0.9375rem;     /* 15px */
  line-height: 1.6;
}
```

---

## 📱 Mobile Considerations

### Current (16px):
```
Mobile: 16px (perfect)
Tablet: 16px (perfect)
Desktop: 16px (perfect)
```

### Original (18px):
```
Mobile: 18px (too large)
Tablet: 18px (okay)
Desktop: 18px (okay)
```

**Recommendation:** Keep 16px for better mobile experience!

---

## 🌐 Industry Standards

### Indonesian News Sites:
- **Detik.com:** 16px
- **Kompas.com:** 16px
- **CNN Indonesia:** 17px
- **Tribunnews:** 16px
- **Liputan6:** 16px

### International News Sites:
- **New York Times:** 18px (premium)
- **The Guardian:** 17px
- **BBC News:** 16px
- **Medium:** 21px (blog platform)

**Most Common:** **16px** ✅

---

## 💡 Quick Reference

### To Make Larger:
```css
font-size: 1.125rem;  /* 18px */
line-height: 1.8;
```

### To Make Standard (Current):
```css
font-size: 1rem;      /* 16px */
line-height: 1.7;
```

### To Make Smaller:
```css
font-size: 0.9375rem; /* 15px */
line-height: 1.6;
```

---

## 🎯 Recommendation

**For News Website:** Use **16px** (1rem) ✅  
**For Blog/Magazine:** Use **17-18px** ✅  
**For Documentation:** Use **15-16px** ✅

---

## 📝 Notes

- Font size affects reading speed
- Smaller = faster reading, more content visible
- Larger = easier reading, better accessibility
- **16px = Best balance for news**

---

**Last Updated:** December 2024  
**Backup Created By:** Kiro AI Assistant  
**Current Setting:** 16px (1rem) with line-height 1.7
