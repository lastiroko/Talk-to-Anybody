import { PrismaClient } from '@prisma/client';
import * as fs from 'fs';
import * as path from 'path';

const prisma = new PrismaClient();

interface PlanDayJson {
  dayNumber: number;
  title: string;
  objective: string;
  estimatedMinutes: number;
  durationTargetSec: number;
  lessonText: string;
  exercises: unknown[];
  anxietyGate?: unknown;
  rewardEligibleFormats?: string[];
}

async function main() {
  // Read plan.v1.json from the mobile app
  const planPath = path.resolve(
    __dirname,
    '../../mobile/src/content/plan.v1.json',
  );

  if (!fs.existsSync(planPath)) {
    console.error(`Plan file not found at: ${planPath}`);
    process.exit(1);
  }

  const raw = fs.readFileSync(planPath, 'utf-8');
  const days: PlanDayJson[] = JSON.parse(raw);

  console.log(`Seeding ${days.length} plan days...`);

  for (const day of days) {
    // Derive difficulty from day position (1-5 scale across 60 days)
    const difficulty = Math.min(5, Math.ceil(day.dayNumber / 12));

    await prisma.planDay.upsert({
      where: { dayNumber: day.dayNumber },
      update: {
        title: day.title,
        description: day.objective,
        difficulty,
        exercisesJson: day.exercises as any,
        assetsJson: {
          estimatedMinutes: day.estimatedMinutes,
          durationTargetSec: day.durationTargetSec,
          lessonText: day.lessonText,
          anxietyGate: day.anxietyGate ?? null,
          rewardEligibleFormats: day.rewardEligibleFormats ?? [],
        },
      },
      create: {
        dayNumber: day.dayNumber,
        title: day.title,
        description: day.objective,
        difficulty,
        exercisesJson: day.exercises as any,
        assetsJson: {
          estimatedMinutes: day.estimatedMinutes,
          durationTargetSec: day.durationTargetSec,
          lessonText: day.lessonText,
          anxietyGate: day.anxietyGate ?? null,
          rewardEligibleFormats: day.rewardEligibleFormats ?? [],
        },
      },
    });
  }

  console.log(`Successfully seeded ${days.length} plan days.`);
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
