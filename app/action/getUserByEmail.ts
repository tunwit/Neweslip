"use server";
import { clerkClient, User } from "@clerk/nextjs/server";

export async function getUserByEmail(email: string) {
    const client = await clerkClient()
    const users = await client.users.getUserList({ emailAddress: [email] });
    return JSON.parse(JSON.stringify(users.data)) as User[]
}