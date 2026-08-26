import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  try {
    console.log("🔐 Creating admin user...");

    // Check if admin already exists
    const existingAdmin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (existingAdmin) {
      console.log("⚠️  Admin user already exists!");
      console.log(`Email: ${existingAdmin.email}`);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("admin123", 10);
    
    const admin = await prisma.user.create({
      data: {
        email: "admin@portalberita.com",
        name: "Administrator",
        password: hashedPassword,
        role: "ADMIN",
        emailVerified: new Date(),
      },
    });

    console.log("✅ Admin user created successfully!");
    console.log("\n📧 Login credentials:");
    console.log("Email: admin@portalberita.com");
    console.log("Password: admin123");
    console.log("\n⚠️  IMPORTANT: Change this password after first login!");
    
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
