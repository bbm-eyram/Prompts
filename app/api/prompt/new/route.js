import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";

export const POST = async (request) => {
    // Destructure the required fields from the request body
    const { userId, prompt, tag } = await request.json();

    // Simple validation to check if the necessary data is provided
    if (!userId || !prompt || !tag) {
        return new Response("Missing required fields", { status: 400 });
    }

    try {
        await connectToDB(); // Connect to the database

        // Create a new prompt with the provided data
        const newPrompt = new Prompt({ creator: userId, prompt, tag });

        // Save the prompt to the database
        await newPrompt.save();

        // Return the created prompt with a 201 status
        return new Response(JSON.stringify(newPrompt), { status: 201 });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return new Response("Failed to create a new prompt", { status: 500 });
    }
};
