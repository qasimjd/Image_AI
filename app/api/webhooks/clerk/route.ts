// import { clerkClient } from "@clerk/nextjs";
import { WebhookEvent } from "@clerk/nextjs/server";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { Webhook } from "svix";

import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing WEBHOOK_SECRET in environment variables.");
    return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return NextResponse.json({ error: "Missing Svix headers" }, { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Webhook verification failed:", err);
    return NextResponse.json({ error: "Invalid webhook signature" }, { status: 400 });
  }

  const eventType = evt.type;
  const { id } = evt.data;

  try {
    if (eventType === "user.created") {
      const { email_addresses, image_url, first_name, last_name, username } = evt.data;

      const user = {
        clerkId: id!, // Ensure 'id' is always a string
        email: email_addresses?.[0]?.email_address ?? "", // Use optional chaining and default values
        username: username ?? "", // Default to empty string if undefined
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        photo: image_url ?? "",
      };

      const newUser = await createUser(user);
      // if (newUser) {
      //   await clerkClient.users.updateUserMetadata(id!, {
      //     publicMetadata: { userId: newUser._id },
      //   });
      // }
      return NextResponse.json({ message: "User created", user: newUser });
    }

    if (eventType === "user.updated") {
      const { image_url, first_name, last_name, username } = evt.data;
      const user = {
        firstName: first_name ?? "",
        lastName: last_name ?? "",
        username: username ?? "",
        photo: image_url ?? "",
      };
      const updatedUser = await updateUser(id!, user);
      return NextResponse.json({ message: "User updated", user: updatedUser });
    }

    if (eventType === "user.deleted") {
      const deletedUser = await deleteUser(id!);
      return NextResponse.json({ message: "User deleted", user: deletedUser });
    }
  } catch (error) {
    console.error(`Error processing ${eventType}:`, error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }

  console.log(`Unhandled webhook event: ${eventType}`, body);
  return NextResponse.json({ message: "Event received but not processed" }, { status: 200 });
}
