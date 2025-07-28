const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  await prisma.user.deleteMany();
  await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'user@example.com', password: passwordHash, role: 'user' },
      { name: 'Bob', email: 'admin@example.com', password: passwordHash, role: 'admin' },
    ],
  });

  console.log('✅ Database seeded!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
