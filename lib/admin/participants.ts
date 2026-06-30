"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { participants } from "@/lib/db/schema";

export async function listParticipants() {
  if (!db) return [];

  return db.query.participants.findMany({
    orderBy: (table, { asc }) => [asc(table.name)],
  });
}

export async function createParticipant(formData: FormData) {
  if (!db) return;

  await db.insert(participants).values({
    name: String(formData.get("name") ?? "").trim(),
    username: String(formData.get("username") ?? "").trim(),
    avatarUrl: String(formData.get("avatarUrl") ?? "").trim() || null,
    favoriteTeam: String(formData.get("favoriteTeam") ?? "").trim() || null,
  });

  revalidatePath("/admin/participants");
}

export async function updateParticipant(formData: FormData) {
  if (!db) return;

  const id = String(formData.get("id") ?? "");

  await db.update(participants).set({
    name: String(formData.get("name") ?? "").trim(),
    username: String(formData.get("username") ?? "").trim(),
    avatarUrl: String(formData.get("avatarUrl") ?? "").trim() || null,
    favoriteTeam: String(formData.get("favoriteTeam") ?? "").trim() || null,
    updatedAt: new Date(),
  }).where(eq(participants.id, id));

  revalidatePath("/admin/participants");
}

export async function deactivateParticipant(formData: FormData) {
  if (!db) return;

  const id = String(formData.get("id") ?? "");

  await db.update(participants).set({ isActive: false, updatedAt: new Date() }).where(eq(participants.id, id));
  revalidatePath("/admin/participants");
}
