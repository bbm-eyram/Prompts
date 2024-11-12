import Prompt from "@models/prompt";
import { connectToDB } from "@utils/database";
import mongoose from "mongoose";

export const GET = async (request, { params }) => {
    try {
        await connectToDB()

        const prompt = await Prompt.findById(params.id).populate("creator")
        if (!prompt) return new Response("Prompt Not Found", { status: 404 });

        return new Response(JSON.stringify(prompt), { status: 200 })

    } catch (error) {
        return new Response("Internal Server Error", { status: 500 });
    }
}

export const PATCH = async (request, { params }) => {
    const { prompt, tag } = await request.json();

    try {
        await connectToDB();

        // Find the existing prompt by ID
        const existingPrompt = await Prompt.findById(params.id);

        if (!existingPrompt) {
            return new Response("Prompt not found", { status: 404 });
        }

        // Update the prompt with new data
        existingPrompt.prompt = prompt;
        existingPrompt.tag = tag;

        await existingPrompt.save();

        return new Response("Successfully updated the Prompts", { status: 200 });
    } catch (error) {
        return new Response("Error Updating Prompt", { status: 500 });
    }
};

export const DELETE = async (request, { params }) => {
    try {
        // Log the request params to verify the ID
        console.log("Deleting prompt with ID:", params.id);

        // Connect to the database
        await connectToDB();

        // Check if the ID is a valid MongoDB ObjectId
        if (!mongoose.Types.ObjectId.isValid(params.id)) {
            console.log("Invalid ID format:", params.id);
            return new Response("Invalid prompt ID", { status: 400 });
        }

        // Try deleting the prompt
        const deletedPrompt = await Prompt.findByIdAndDelete(params.id);

        if (!deletedPrompt) {
            console.log("No prompt found for ID:", params.id);
            return new Response("Prompt not found", { status: 404 });
        }

        // Log successful deletion
        console.log("Prompt deleted successfully:", deletedPrompt);
        return new Response("Prompt deleted successfully", { status: 200 });
    } catch (error) {
        // Log the error
        console.error("Error deleting prompt:", error);

        // Return the error as a response
        return new Response(`Error deleting prompt: ${error.message}`, { status: 500 });
    }
};
