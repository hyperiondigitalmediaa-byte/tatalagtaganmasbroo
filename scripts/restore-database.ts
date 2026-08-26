import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';

const prisma = new PrismaClient();

async function restoreDatabase() {
    console.log('🔄 Starting database restore...');

    try {
        const backupData = JSON.parse(fs.readFileSync('database-backup.json', 'utf-8'));
        const data = backupData.data;

        console.log('📊 Backup from:', backupData.timestamp);
        console.log('📦 Restoring data...');

        // Restore in correct order (respecting foreign keys)

        // 1. Users
        if (data.users?.length > 0) {
            console.log(`  → Users: ${data.users.length}`);
            for (const user of data.users) {
                await prisma.user.create({ data: user });
            }

        }

        // 2. Categories
        if (data.categories?.length > 0) {
            console.log(`  → Categories: ${data.categories.length}`);

            for (const category of data.categories) {
                await prisma.category.create({ data: category });
            }
        }

        // 3. Tags
        if (data.tags?.length > 0) {
            console.log(`  → Tags: ${data.tags.length}`);
            for (const tag of data.tags) {
                await prisma.tag.create({ data: tag });
            }
        }

        // 4. Articles
        if (data.articles?.length > 0) {
            console.log(`  → Articles: ${data.articles.length}`);
            for (const article of data.articles) {
                await prisma.article.create({ data: article });
            }
        }

        // 5. ArticleTags
        if (data.articleTags?.length > 0) {
            console.log(`  → ArticleTags: ${data.articleTags.length}`);
            for (const articleTag of data.articleTags) {
                await prisma.articleTag.create({ data: articleTag });
            }
        }

        // 6. Comments
        if (data.comments?.length > 0) {
            console.log(`  → Comments: ${data.comments.length}`);
            for (const comment of data.comments) {
                await prisma.comment.create({ data: comment });
            }
        }

        // 7. Comment Reports
        if (data.commentReports?.length > 0) {
            console.log(`  → CommentReports: ${data.commentReports.length}`);
            for (const report of data.commentReports) {
                await prisma.commentReport.create({ data: report });
            }
        }

        // 8. Banners
        if (data.banners?.length > 0) {
            console.log(`  → Banners: ${data.banners.length}`);
            for (const banner of data.banners) {
                await prisma.banner.create({ data: banner });
            }
        }

        // 9. Menus (handle parent-child relationship)
        if (data.menus?.length > 0) {
            console.log(`  → Menus: ${data.menus.length}`);
            // First create parent menus
            const parentMenus = data.menus.filter((m: any) => !m.parentId);
            for (const menu of parentMenus) {
                await prisma.menu.create({ data: menu });
            }
            // Then create child menus
            const childMenus = data.menus.filter((m: any) => m.parentId);
            for (const menu of childMenus) {
                await prisma.menu.create({ data: menu });
            }
        }

        // 10. Pages
        if (data.pages?.length > 0) {
            console.log(`  → Pages: ${data.pages.length}`);
            for (const page of data.pages) {
                await prisma.page.create({ data: page });
            }
        }

        // 11. Site Settings
        if (data.siteSettings?.length > 0) {
            console.log(`  → SiteSettings: ${data.siteSettings.length}`);
            for (const setting of data.siteSettings) {
                await prisma.siteSettings.create({ data: setting });
            }
        }

        // 12. Sidebar Widgets
        if (data.sidebarWidgets?.length > 0) {
            console.log(`  → SidebarWidgets: ${data.sidebarWidgets.length}`);
            for (const widget of data.sidebarWidgets) {
                await prisma.sidebarWidget.create({ data: widget });
            }
        }

        // 13. Sidebar Settings
        if (data.sidebarSettings?.length > 0) {
            console.log(`  → SidebarSettings: ${data.sidebarSettings.length}`);
            for (const setting of data.sidebarSettings) {
                await prisma.sidebarSettings.create({ data: setting });
            }
        }

        // 14. Social Media
        if (data.socialMedia?.length > 0) {
            console.log(`  → SocialMedia: ${data.socialMedia.length}`);
            for (const social of data.socialMedia) {
                await prisma.socialMedia.create({ data: social });
            }
        }

        // 15. Audit Logs
        if (data.auditLogs?.length > 0) {
            console.log(`  → AuditLogs: ${data.auditLogs.length}`);
            for (const log of data.auditLogs) {
                await prisma.auditLog.create({ data: log });
            }
        }

        console.log('✅ Restore completed successfully!');
    } catch (error) {
        console.error('❌ Restore failed:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

restoreDatabase();
