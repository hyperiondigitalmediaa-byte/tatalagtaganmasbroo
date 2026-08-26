import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function backupDatabase() {
  console.log('🔄 Starting database backup...');

  try {
    // Backup all data
    const users = await prisma.user.findMany();
    const categories = await prisma.category.findMany();
    const tags = await prisma.tag.findMany();
    const articles = await prisma.article.findMany();
    const articleTags = await prisma.articleTag.findMany();
    const comments = await prisma.comment.findMany();
    const commentReports = await prisma.commentReport.findMany();
    const banners = await prisma.banner.findMany();
    const menus = await prisma.menu.findMany();
    const pages = await prisma.page.findMany();
    const siteSettings = await prisma.siteSettings.findMany();
    const sidebarWidgets = await prisma.sidebarWidget.findMany();
    const sidebarSettings = await prisma.sidebarSettings.findMany();
    const socialMedia = await prisma.socialMedia.findMany();
    const auditLogs = await prisma.auditLog.findMany();

    const backup = {
      timestamp: new Date().toISOString(),
      data: {
        users,
        categories,
        tags,
        articles,
        articleTags,
        comments,
        commentReports,
        banners,
        menus,
        pages,
        siteSettings,
        sidebarWidgets,
        sidebarSettings,
        socialMedia,
        auditLogs,
      },
      stats: {
        users: users.length,
        categories: categories.length,
        tags: tags.length,
        articles: articles.length,
        comments: comments.length,
      }
    };

    fs.writeFileSync('database-backup.json', JSON.stringify(backup, null, 2));
    
    console.log('✅ Backup completed successfully!');
    console.log('📊 Stats:', backup.stats);
    console.log('💾 Saved to: database-backup.json');
  } catch (error) {
    console.error('❌ Backup failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

backupDatabase();
