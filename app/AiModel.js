const {
    GoogleGenerativeAI,
    HarmCategory,
    HarmBlockThreshold,
} = require("@google/generative-ai");


const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash",
})

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 40,
    maxOutputTokens: 8192,
    responseMimeType: "application/json",
}


export const generateScript = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    {text: "Write a two different script for 30 Seconds video on topic"}
                ],
            },
            {
                role: "model",
                parts: [
                    {text: "```json\n{\n  \"scripts\": [\n    {\n    \"content\" ]}```"}
                ],
            },
        ],
    })

export const generateImageScript = model.startChat({
        generationConfig,
        history: [
            {
                role: "user",
                parts: [
                    {text: "Generate Image prompt of Cinematic style video on topic"}
                ],
            },
            {
                role: "model",
                parts: [
                    {text: "```json\n{\n  \"scripts\": [\n    {\n    \"content\" ]}```"}
                ],
            },
        ],
    })
