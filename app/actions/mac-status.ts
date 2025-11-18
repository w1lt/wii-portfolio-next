"use server";

import { prisma } from "@/lib/prisma";

export async function getMacStatuses() {
  try {
    // Get the latest 100 status entries, ordered by most recent
    const statuses = await prisma.macStatus.findMany({
      take: 100,
      orderBy: {
        timestamp: "desc",
      },
    });

    // Convert BigInt to string and Date to ISO string for JSON serialization
    const serializedStatuses = statuses.map((status) => ({
      ...status,
      totalMemory: status.totalMemory ? status.totalMemory.toString() : null,
      timestamp: status.timestamp.toISOString(),
      receivedAt: status.receivedAt.toISOString(),
    }));

    return serializedStatuses;
  } catch (error) {
    console.error("Error fetching MacStatus data:", error);
    throw new Error("Failed to fetch MacStatus data");
  }
}

