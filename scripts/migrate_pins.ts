import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting PIN migration script...');

  // 1. Set Admin PIN to 199999
  const adminHash = await bcrypt.hash('199999', 10);
  const admins = await prisma.user.findMany({
    where: { role: 'ADMIN' }
  });

  for (const admin of admins) {
    await prisma.user.update({
      where: { id: admin.id },
      data: { pinHash: adminHash }
    });
    console.log(`Updated Admin PIN for: ${admin.email}`);
  }

  // 2. Notify Legacy Users & Employees
  const legacyUsers = await prisma.user.findMany({
    where: { pinHash: null }
  });

  console.log(`Found ${legacyUsers.length} users without a PIN. Sending notifications...`);

  let notifiedCount = 0;
  for (const user of legacyUsers) {
    // Check if they already have a PIN setup notification to avoid duplicates
    const existingNotif = await prisma.notification.findFirst({
      where: {
        userId: user.id,
        title: 'Security Update: Create Your Dashboard PIN',
      }
    });

    if (!existingNotif) {
      await prisma.notification.create({
        data: {
          userId: user.id,
          title: 'Security Update: Create Your Dashboard PIN',
          message: 'For enhanced security, all accounts now require a 6-digit PIN. You will be prompted to set this up the next time you log in to your dashboard.',
          type: 'WARNING',
        }
      });
      notifiedCount++;
    }
  }

  console.log(`Successfully sent ${notifiedCount} notifications.`);
  console.log('Migration complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
