import { PrismaClient, UserRole, ProductCategory, UnitType, SeasonType } from '@prisma/client';
import * as argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Sènè database seeding...');

  // 1. Regions
  const regionLabe = await prisma.region.upsert({
    where: { code: 'LABE' },
    update: {},
    create: {
      code: 'LABE',
      name: 'Région de Labé',
    },
  });

  const regionFaranah = await prisma.region.upsert({
    where: { code: 'FARANAH' },
    update: {},
    create: {
      code: 'FARANAH',
      name: 'Région de Faranah',
    },
  });

  const regionConakry = await prisma.region.upsert({
    where: { code: 'CONAKRY' },
    update: {},
    create: {
      code: 'CONAKRY',
      name: 'Zone Spéciale de Conakry',
    },
  });

  // 2. Prefectures (Pilot Corridors)
  const prefLabe = await prisma.prefecture.upsert({
    where: { code: 'LAB' },
    update: {},
    create: {
      code: 'LAB',
      name: 'Labé',
      regionId: regionLabe.id,
    },
  });

  const prefPita = await prisma.prefecture.upsert({
    where: { code: 'PIT' },
    update: {},
    create: {
      code: 'PIT',
      name: 'Pita',
      regionId: regionLabe.id,
    },
  });

  const prefDinguiraye = await prisma.prefecture.upsert({
    where: { code: 'DIN' },
    update: {},
    create: {
      code: 'DIN',
      name: 'Dinguiraye',
      regionId: regionFaranah.id,
    },
  });

  // 3. Sub-Prefectures & Key Villages
  const spTimbiMadina = await prisma.subPrefecture.create({
    data: {
      name: 'Timbi-Madina',
      prefectureId: prefPita.id,
      villages: {
        create: [
          { name: 'Kaganya', landmarkNotes: 'Zone de forte production de pomme de terre' },
          { name: 'Bantignel', landmarkNotes: 'Proche du centre de groupage' },
        ],
      },
    },
  });

  const spDinguirayeCentre = await prisma.subPrefecture.create({
    data: {
      name: 'Dinguiraye-Centre',
      prefectureId: prefDinguiraye.id,
      villages: {
        create: [
          { name: 'Diomaban', landmarkNotes: 'Zone de culture de fonio' },
          { name: 'Tambikounda', landmarkNotes: 'Coopérative des femmes productrices' },
        ],
      },
    },
  });

  // 4. Products (Pilot Corridor Crops)
  const potato = await prisma.product.upsert({
    where: { code: 'POTATO_TIMBI' },
    update: {},
    create: {
      code: 'POTATO_TIMBI',
      name: 'Pomme de terre (Belle de Guinée)',
      category: ProductCategory.TUBER,
      defaultUnit: UnitType.SAC_50KG,
      description: 'Pomme de terre renommée du Fouta Djallon, variété Nicola / Belle de Guinée.',
      isActive: true,
    },
  });

  const fonio = await prisma.product.upsert({
    where: { code: 'FONIO_DINGUIRAYE' },
    update: {},
    create: {
      code: 'FONIO_DINGUIRAYE',
      name: 'Fonio précuit de Dinguiraye',
      category: ProductCategory.CEREAL,
      defaultUnit: UnitType.SAC_25KG,
      description: 'Fonio artisanal de haute qualité produit par les groupements féminins de Dinguiraye.',
      isActive: true,
    },
  });

  // 5. Default Users (Admin, Agent, Buyer)
  const defaultPasswordHash = await argon2.hash('SeneSecure2026!');

  // Admin
  const admin = await prisma.user.upsert({
    where: { phone: '+224620000001' },
    update: {},
    create: {
      phone: '+224620000001',
      email: 'admin@sene.gn',
      passwordHash: defaultPasswordHash,
      role: UserRole.ADMIN,
      firstName: 'Directeur',
      lastName: 'Opérations',
    },
  });

  // Local Agent (Labé / Pita corridor)
  const agent = await prisma.user.upsert({
    where: { phone: '+224621000002' },
    update: {},
    create: {
      phone: '+224621000002',
      email: 'agent.labe@sene.gn',
      passwordHash: defaultPasswordHash,
      role: UserRole.AGENT,
      firstName: 'Mamadou',
      lastName: 'Diallo',
      agentBadgeCode: 'AGT-2026-LAB-01',
      assignedPrefectureId: prefLabe.id,
    },
  });

  // Conakry Restaurant Buyer
  const buyer = await prisma.user.upsert({
    where: { phone: '+224622000003' },
    update: {},
    create: {
      phone: '+224622000003',
      email: 'restaurant.conakry@sene.gn',
      passwordHash: defaultPasswordHash,
      role: UserRole.BUYER,
      firstName: 'Aissatou',
      lastName: 'Camara',
      companyName: 'Restaurant Saveurs de Guinée (Kipé, Conakry)',
    },
  });

  console.log('✅ Seeding completed successfully!');
  console.log(`- Admin: +224620000001 / SeneSecure2026!`);
  console.log(`- Agent: +224621000002 / SeneSecure2026!`);
  console.log(`- Buyer: +224622000003 / SeneSecure2026!`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

