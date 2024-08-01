import { connectedToDB } from "@utils/database";
import Prompt from "@models/prompt";
//GET

export const GET = async (request, { params }) => {
  try {
    await connectedToDB();

    const prompt = await Prompt.findById(params.id).populate("creator");

    if (!prompt) return new Response("Prompt not Found", { status: 400 });

    return new Response(JSON.stringify(prompt), {
      status: 200,
    });
  } catch (error) {
    return new Response("Failed to fetch prompt", {
      status: 500,
    });
  }
};

//PATCH

export const PATCH = async (request, { params }) => {
  const { prompt, tag } = await request.json();

  try {
    await connectedToDB();

    const existingPromot = await Prompt.findById(params.id);

    if (!existingPromot)
      return new Response("Prompt not foound", {
        status: 404,
      });

    existingPromot.prompt = prompt;
    existingPromot.tag = tag;

    await existingPromot.save();

    return new Response(JSON.stringify(existingPromot), { status: 200 });
  } catch (error) {
    return new Response("Failed to update the prompt", {
      status: 500,
    });
  }
};

//DELETE
export const DELETE = async (request, { params }) => {
  try {
    await connectedToDB();
    await Prompt.findByIdAndDelete(params.id);

    return new Response("Prompt Deleted successfully", { status: 200 });
  } catch (error) {
    return new Response("Failed to delete the prompt", {
      status: 500,
    });
  }
};
