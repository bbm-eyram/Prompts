import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const GET = async (request, { params }) => {
    try {
        await connectToDB();

        // Fetch prompts for a specific creator
        const prompts = await Prompt.find({ creator: params.id }).populate("creator");

        // If no prompts found, return a 404
        if (prompts.length === 0) {
            return new Response("No prompts found for the user", { status: 404 });
        }

        return new Response(JSON.stringify(prompts), { status: 200 });
    } catch (error) {
        console.error(error);  // Log the error for debugging
        return new Response("Failed to fetch prompts created by user", { status: 500 });
    }
};
