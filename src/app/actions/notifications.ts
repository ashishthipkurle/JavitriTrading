"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function getUnreadCount() {
  const user = await getAuthUser();
  if (!user) return 0;

  try {
    const count = await prisma.notification.count({
      where: {
        userId: user.id,
        isRead: false,
      },
    });
    return count;
  } catch (error) {
    console.error("Error getting unread count:", error);
    return 0;
  }
}

export async function getNotifications(limit = 10) {
  const user = await getAuthUser();
  if (!user) return [];

  try {
    const notifications = await prisma.notification.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      take: limit,
    });
    return notifications;
  } catch (error) {
    console.error("Error getting notifications:", error);
    return [];
  }
}

export async function markAsRead(notificationId: string) {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.notification.updateMany({
      where: {
        id: notificationId,
        userId: user.id,
      },
      data: {
        isRead: true,
      },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error marking notification as read:", error);
    return { success: false, error: "Failed to mark as read" };
  }
}

export async function markAllAsRead() {
  const user = await getAuthUser();
  if (!user) return { success: false, error: "Unauthorized" };

  try {
    await prisma.notification.updateMany({
      where: {
        userId: user.id,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    });
    revalidatePath("/", "layout");
    return { success: true };
  } catch (error) {
    console.error("Error marking all notifications as read:", error);
    return { success: false, error: "Failed to mark all as read" };
  }
}
