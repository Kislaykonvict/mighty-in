import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function resetSuperAdmin() {
  const email = 'admin@mightywarner.com';
  const password = 'AdminPassword2026!';
  const passwordHash = await bcrypt.hash(password, 10);

  console.log(`Resetting Super Admin user for ${email}...`);

  const user = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name: 'Mighty SuperAdmin',
      passwordHash,
      role: 'SUPERADMIN',
      isActive: true,
    },
    create: {
      email,
      name: 'Mighty SuperAdmin',
      passwordHash,
      role: 'SUPERADMIN',
      isActive: true,
    },
  });

  console.log(`✅ Super Admin reset successfully!`);
  console.log(`Email: ${user.email}`);
  console.log(`Password: ${password}`);
  console.log(`Role: ${user.role}`);
  console.log(`Active: ${user.isActive}`);
}

resetSuperAdmin()
  .catch((err) => {
    console.error('Error resetting Super Admin:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
