import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const count = await prisma.notification.count({ where: { isRead: false } });
  console.log('Unread:', count);
  const all = await prisma.notification.findMany();
  console.log('All length:', all.length);
  if (all.length > 0) console.log(all[0]);
}
main().catch(console.error).finally(()=>prisma.$disconnect());
