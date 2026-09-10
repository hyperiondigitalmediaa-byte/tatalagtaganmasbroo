# Debug Guide: Article Creation 400 Error

## Status
🔄 **Changes Pushed to GitHub** - Vercel will auto-deploy in ~2 minutes

## What Was Done

### 1. Enhanced Error Logging
Added detailed logging to `/api/articles` endpoint to capture:
- ✅ Full request body received
- ✅ Validation errors with field names
- ✅ Database errors with error codes
- ✅ Step-by-step execution trace

### 2. Updated CSP for Google Ads
The middleware.ts already had most Google Ads domains configured. The CSP now includes:
- `script-src`: pagead2.googlesyndication.com, adservice.google.com, googleads.g.doubleclick.net
- `connect-src`: pagead2.googlesyndication.com, googleads.g.doubleclick.net, *.google.com, *.doubleclick.net
- `frame-src`: googleads.g.doubleclick.net, tpc.googlesyndication.com
- `child-src`: googleads.g.doubleclick.net

## Next Steps to Debug Article Creation

### Step 1: Wait for Vercel Deployment
Wait 2-3 minutes for Vercel to deploy the new changes.

### Step 2: Try Creating an Article
1. Go to https://www.kilas.net/admin/artikel/buat
2. Fill in the form:
   - **Title**: Any title (minimum 10 characters)
   - **Category**: Select a category from dropdown
   - **Content**: Write at least 100 characters
   - **Featured Image**: Upload an image (optional but recommended)
3. Click **"Publikasikan"** or **"Simpan Draft"**

### Step 3: Capture the Error Details

#### Option A: Check Server Logs (Vercel Dashboard)
1. Go to https://vercel.com/your-project/logs
2. Look for entries starting with `=== Article Creation Debug ===`
3. Copy the entire log output

#### Option B: Check Browser Network Tab
1. Open Chrome DevTools (F12)
2. Go to **Network** tab
3. Try creating the article
4. Find the failed `articles` request (it will be red)
5. Click on it
6. Go to **Response** tab
7. Copy the JSON response that shows the error

### Step 4: Identify the Issue

Look for one of these common errors:

#### Error Type 1: Validation Failed (400)
```json
{
  "error": "Validation failed",
  "errors": {
    "categoryId": "Category ID tidak valid",
    "title": "Judul minimal 10 karakter"
  }
}
```
**Solution**: The form data doesn't match validation rules. Check which fields are failing.

#### Error Type 2: Slug Already Exists (400)
```json
{
  "error": "Slug already exists"
}
```
**Solution**: Change the article slug to something unique.

#### Error Type 3: Database Error (500)
```json
{
  "error": "Failed to create article",
  "details": "Foreign key constraint failed",
  "code": "P2003"
}
```
**Solution**: The categoryId or authorId doesn't exist in the database.

## Common Problems & Solutions

### Problem 1: categoryId Validation Error
**Symptoms**: Error says "Category ID tidak valid"

**Cause**: The validation schema expects categoryId to be in CUID format (e.g., `clxxx...`)

**Solution**: Check if categories exist in the database:
```bash
npm run prisma studio
```
Look at the Category table and verify:
- Categories exist
- They have valid CUID ids
- The dropdown in the form shows them

### Problem 2: Tags Validation Error
**Symptoms**: Error mentions tags field

**Cause**: Tag IDs must also be valid CUIDs

**Solution**: 
- Don't select any tags for now
- Tags are optional in the schema

### Problem 3: Content Too Short
**Symptoms**: Error says "Konten minimal 100 karakter"

**Cause**: The RichTextEditor content has less than 100 characters

**Solution**: Write more content (at least 100 characters)

### Problem 4: Upload Succeeds But Article Fails
**Symptoms**: Image uploads successfully to Cloudinary, but article creation fails

**Cause**: Image upload and article creation are separate operations. Image URL might not be saved in form state.

**Solution**: 
1. Check if `featuredImage` URL appears in the error response's `receivedData`
2. If missing, there's a state management issue in the form component

## Testing Without Featured Image

Try creating an article **without** uploading an image first:
1. Leave the featured image field empty
2. Just fill: title, category, content
3. Click publish

This helps isolate whether the issue is with:
- The upload process
- The article creation process

## If Still Failing

Send me the complete error response from either:
- Vercel logs showing `=== VALIDATION FAILED ===`
- Browser Network tab Response

Include:
1. The `errors` object
2. The `receivedData` object (I'll check what the form is actually sending)

## Files Modified
- ✅ `app/api/articles/route.ts` - Enhanced error logging
- ✅ `middleware.ts` - Updated CSP for Google Ads

## Vercel Auto-Deploy Status
Check: https://vercel.com/dashboard

The deployment should show:
- Commit: "Enhanced error logging for article creation and updated CSP for Google Ads"
- Status: Building → Ready (takes ~2 minutes)
