// Script to initialize tasksCompleted for existing users
import { prisma } from "../src/lib/prisma.js";

async function initializeTasksCompleted() {
  console.log("Initializing tasksCompleted field for existing users...");

  const users = await prisma.user.findMany({
    include: {
      tasks: true
    }
  });

  console.log(`Found ${users.length} users to update`);

  for (const user of users) {
    const completedTasksCount = user.tasks.filter(t => t.completed).length;
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        tasksCompleted: completedTasksCount,
        points: completedTasksCount * 10 // Also set points based on completed tasks
      }
    });

    console.log(`Updated user ${user.email}: ${completedTasksCount} tasks completed`);
  }

  console.log("Done!");
  await prisma.$disconnect();
}

initializeTasksCompleted().catch((error) => {
  console.error("Error:", error);
  process.exit(1);
});
