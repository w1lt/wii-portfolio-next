"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export interface GuestbookEntry {
  id: string;
  message: string;
  createdAt: Date;
}

export async function getGuestbookEntries(): Promise<GuestbookEntry[]> {
  try {
    const entries = await prisma.guestbookEntry.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    });
    return entries;
  } catch (error) {
    console.error("Error fetching guestbook entries:", error);
    return [];
  }
}

export async function checkIfCanSign(
  fingerprint: string
): Promise<{ canSign: boolean; error?: string }> {
  try {
    const headersList = await headers();
    const ipAddress = 
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Check if IP has already signed
    const ipEntry = await prisma.guestbookEntry.findFirst({
      where: { ipAddress },
    });

    if (ipEntry) {
      return { canSign: false, error: "You've already signed the guestbook" };
    }

    // Check if fingerprint has already signed
    const fingerprintEntry = await prisma.guestbookEntry.findFirst({
      where: { fingerprint },
    });

    if (fingerprintEntry) {
      return { canSign: false, error: "You've already signed the guestbook" };
    }

    return { canSign: true };
  } catch (error) {
    console.error("Error checking sign eligibility:", error);
    return { canSign: true }; // Allow signing on error
  }
}

export async function addGuestbookEntry(
  message: string,
  fingerprint: string
): Promise<{ success: boolean; error?: string; entryId?: string }> {
  try {
    // Basic validation
    if (!message || message.trim().length === 0) {
      return { success: false, error: "Message is required" };
    }
    if (message.length > 20) {
      return { success: false, error: "Message must be 20 characters or less" };
    }

    // Get IP address from headers
    const headersList = await headers();
    const ipAddress = 
      headersList.get("x-forwarded-for")?.split(",")[0] ||
      headersList.get("x-real-ip") ||
      "unknown";

    // Double-check if already signed
    const eligibility = await checkIfCanSign(fingerprint);
    if (!eligibility.canSign) {
      return { success: false, error: eligibility.error };
    }

    const entry = await prisma.guestbookEntry.create({
      data: {
        message: message.trim(),
        ipAddress,
        fingerprint,
      },
    });

    revalidatePath("/channels/guestbook");
    return { success: true, entryId: entry.id };
  } catch (error) {
    console.error("Error adding guestbook entry:", error);
    return { success: false, error: "Failed to add entry" };
  }
}

export async function deleteGuestbookEntry(
  entryId: string,
  fingerprint: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find the entry
    const entry = await prisma.guestbookEntry.findUnique({
      where: { id: entryId },
    });

    if (!entry) {
      return { success: false, error: "Entry not found" };
    }

    // Verify ownership by fingerprint
    if (entry.fingerprint !== fingerprint) {
      return { success: false, error: "Not authorized to delete this entry" };
    }

    await prisma.guestbookEntry.delete({
      where: { id: entryId },
    });

    revalidatePath("/channels/guestbook");
    return { success: true };
  } catch (error) {
    console.error("Error deleting guestbook entry:", error);
    return { success: false, error: "Failed to delete entry" };
  }
}

