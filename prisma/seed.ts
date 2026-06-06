import { PrismaClient, Category, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // 1. Create a user first (required for creatorId)
  const user = await prisma.user.create({
    data: {
      fullName: 'Seed User',
      email: 'seeduser@test.com',
      password: 'hashedpassword',
      role: Role.CREATOR,
    },
  });

  // 2. Create event (NOW matches schema exactly)
  const event = await prisma.event.create({
    data: {
      title: 'Tech Conference 2026',
      description: 'Big tech event',
      venue: 'Lagos Tech Hub',
      eventDate: new Date(),
      ticketPrice: 5000,
      category: Category.TECH,
      capacity: 200,
      creatorId: user.id,
    },
  });

  console.log('Seed completed:', event.id);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });