// pages/api/users/[userId].js

import { connectedToDB } from "@utils/database";
import User from "@models/user"; // Assuming you have a User model

export const GET = async (request, { params }) => {
  try {
    await connectedToDB();

    const user = await User.findById(params.id); // Fetch the user by ID

    if (!user) return new Response("User not found", { status: 404 });

    return new Response(JSON.stringify(user), { status: 200 });
  } catch (error) {
    return new Response("Failed to fetch user", { status: 500 });
  }
};
