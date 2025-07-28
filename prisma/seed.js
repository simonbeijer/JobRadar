const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('password123', 10);
  
  // Clear existing data
  await prisma.job.deleteMany();
  await prisma.user.deleteMany();
  
  // Seed users
  await prisma.user.createMany({
    data: [
      { name: 'Alice', email: 'user@example.com', password: passwordHash, role: 'user' },
      { name: 'Bob', email: 'admin@example.com', password: passwordHash, role: 'admin' },
    ],
  });

  // Seed sample jobs for testing
  await prisma.job.createMany({
    data: [
      {
        title: 'Frontend Developer',
        company: 'Tech Company AB',
        location: 'Göteborg',
        postedAt: new Date('2025-01-20'),
        url: 'https://example.com/job1',
        source: 'jobtech',
        applied: false,
        emailed: false
      },
      {
        title: 'Fullstack Developer - React & Node.js',
        company: 'Innovation Labs',
        location: 'Mölndal',
        postedAt: new Date('2025-01-22'),
        url: 'https://example.com/job2',
        source: 'jobtech',
        applied: true,
        emailed: false
      },
      {
        title: 'JavaScript Developer',
        company: 'Digital Solutions',
        location: 'Göteborg',
        postedAt: new Date('2025-01-25'),
        url: 'https://example.com/job3',
        source: 'jobtech',
        applied: false,
        emailed: true
      },
      {
        title: 'UI/UX Developer - Vue.js',
        company: 'Creative Agency',
        location: 'Göteborg',
        postedAt: new Date('2025-01-26'),
        url: 'https://example.com/job4',
        source: 'jobtech',
        applied: false,
        emailed: false
      },
      {
        title: 'TypeScript Developer - Next.js',
        company: 'Modern Web Co',
        location: 'Mölndal',
        postedAt: new Date('2025-01-27'),
        url: 'https://example.com/job5',
        source: 'jobtech',
        applied: false,
        emailed: false
      }
    ],
  });

  console.log('✅ Database seeded with users and sample jobs!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
