import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🔍 Testing database connection...");
    
    // Test connection
    await prisma.$connect();
    console.log("✅ Database connected successfully!");
    
    // Check tables
    const userCount = await prisma.user.count();
    const categoryCount = await prisma.category.count();
    const articleCount = await prisma.article.count();
    
    console.log("\n📊 Database Stats:");
    console.log(`- Users: ${userCount}`);
    console.log(`- Categories: ${categoryCount}`);
    console.log(`- Articles: ${articleCount}`);
    
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
