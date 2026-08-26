-- Add indexes for better query performance

-- Article indexes (most queried table)
CREATE INDEX IF NOT EXISTS "Article_status_publishedAt_idx" ON "Article"("status", "publishedAt" DESC);
CREATE INDEX IF NOT EXISTS "Article_categoryId_status_idx" ON "Article"("categoryId", "status");
CREATE INDEX IF NOT EXISTS "Article_authorId_status_idx" ON "Article"("authorId", "status");
CREATE INDEX IF NOT EXISTS "Article_createdAt_idx" ON "Article"("createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Article_views_idx" ON "Article"("views" DESC);

-- User indexes
CREATE INDEX IF NOT EXISTS "User_role_idx" ON "User"("role");
CREATE INDEX IF NOT EXISTS "User_createdAt_idx" ON "User"("createdAt" DESC);

-- Comment indexes
CREATE INDEX IF NOT EXISTS "Comment_status_createdAt_idx" ON "Comment"("status", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "Comment_userId_idx" ON "Comment"("userId");

-- Category indexes
CREATE INDEX IF NOT EXISTS "Category_name_idx" ON "Category"("name");

-- Tag indexes
CREATE INDEX IF NOT EXISTS "Tag_name_idx" ON "Tag"("name");

-- Menu indexes
CREATE INDEX IF NOT EXISTS "Menu_parentId_order_idx" ON "Menu"("parentId", "order");

-- Banner indexes
CREATE INDEX IF NOT EXISTS "Banner_position_isActive_order_idx" ON "Banner"("position", "isActive", "order");

-- AuditLog indexes
CREATE INDEX IF NOT EXISTS "AuditLog_userId_createdAt_idx" ON "AuditLog"("userId", "createdAt" DESC);
CREATE INDEX IF NOT EXISTS "AuditLog_action_createdAt_idx" ON "AuditLog"("action", "createdAt" DESC);
