"use server";

import prisma from "@/lib/prisma";
import { getAuthUser } from "@/lib/auth";
import { Role, CMSType } from "@prisma/client";
import { revalidatePath } from "next/cache";

async function requireAdmin() {
  const user = await getAuthUser();
  if (!user || user.role !== Role.ADMIN) {
    if (process.env.NODE_ENV === "development") {
      // Bypass auth in development if no valid session
      const devAdmin = await prisma.user.findFirst({
        where: { role: Role.ADMIN }
      });
      if (devAdmin) return devAdmin;
    }
    throw new Error("Unauthorized: Admin access required");
  }
  return user;
}

export async function updateCMSContent(
  section: string,
  updates: { key: string; value: string; type?: CMSType }[]
) {
  try {
    const admin = await requireAdmin();

    // Use a transaction to perform all upserts
    await prisma.$transaction(
      updates.map((update) =>
        prisma.landingContent.upsert({
          where: {
            section_key: {
              section: section,
              key: update.key,
            },
          },
          update: {
            value: update.value,
            ...(update.type ? { type: update.type } : {}),
          },
          create: {
            section: section,
            key: update.key,
            value: update.value,
            type: update.type || CMSType.TEXT,
          },
        })
      )
    );

    // Log the action
    await prisma.auditLog.create({
      data: {
        actorId: admin.id,
        action: "UPDATE_CMS_CONTENT",
        meta: { section, keysUpdated: updates.map(u => u.key) },
      },
    });

    // Revalidate paths that use CMS content
    revalidatePath("/");
    revalidatePath("/admin/cms");

    return { success: true, message: "Content updated successfully." };
  } catch (error: any) {
    console.error("Failed to update CMS content:", error);
    return { success: false, message: error.message || "Failed to update content." };
  }
}
