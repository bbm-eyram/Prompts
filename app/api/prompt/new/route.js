export const POST = async (request) => {
    try {
        const { userId, prompt, tag } = await request.json();

        console.log("Incoming Data:", { userId, prompt, tag }); // Log request payload

        await connectToDB();
        const newPrompt = new Prompt({ creator: userId, prompt, tag });

        await newPrompt.save();
        console.log("New Prompt Saved:", newPrompt); // Log saved prompt

        return new Response(JSON.stringify(newPrompt), { status: 201 });
    } catch (error) {
        console.error("Error in API:", error); // Log error details
        return new Response("Failed to create a new prompt", { status: 500 });
    }
};
