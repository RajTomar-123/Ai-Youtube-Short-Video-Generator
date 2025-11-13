import { createClient } from "@deepgram/sdk";
import { inngest } from "./client";
import axios from "axios";
import { generateImageScript } from "../app/AiModel";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api";

const ImagePromptScript = `Generate Image prompt of {style} style with all detils for each scene for 30 seconds video : script: {script}
- Just Give specifing image prompt depends on the story line
- do not give camera angle image prompt
- Follow the following schema and return JSON data (Max 4-5 Images)
- [
    {
       imagePrompt:'',
       sceneContent:'<Script Content>'
    }
]`

export const helloWorld = inngest.createFunction(
    { id: "hello-world" },
    { event: "test/hello.world" },
    async ({ event, step }) => {
        await step.sleep("wait-a-moment", "1s");
        return { message: `Hello ${event.data.email}!` };
    },
);

const BASE_URL = 'https://aigurulab.tech';
export const GenerateVideoData = inngest.createFunction(
    { id: 'generate-video-data' },
    { event: 'generate-video-data' },
    async ({ event, step }) => {

        const { script, topic, caption, videoStyle, voice, recordId } = event?.data;
        const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

        //Generate Audio File MP3
        const GenerateAudioFile = await step.run(
            "GenerateAudioFile",
            async () => {
                const result = await axios.post(BASE_URL + '/api/text-to-speech',
                    {
                        input: script,
                        voice: voice
                    },
                    {
                        headers: {
                            'x-api-key': process.env.NEXT_PUBLIC_VOICE_KEY, // Your API Key
                            'Content-Type': 'application/json', // Content Type
                        },
                    })
                console.log(result.data.audio) //Output Result: Audio Mp3 Url

                return result.data.audio;
            }
        )

        //Generate Caption
        const GenerateCaptions = await step.run(
            "generateCaptions",
            async () => {
                const deepgram = createClient(process.env.NEXT_PUBLIC_DEEPGRAM_API_KEY);

                const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
                    {
                        url: GenerateAudioFile,
                    },
                    // STEP 3: Configure Deepgram options for audio analysis
                    {
                        model: "nova-3",
                        smart_format: true,
                    }
                );
                return result.results?.channels[0]?.alternatives[0]?.words;
            }
        )

        //Generate Image Prompt from Script
        const GenerateImagePrompts = await step.run(
            "generateImagePrompt",
            async () => {
                const FINAL_PROMPT = ImagePromptScript
                    .replace('{style}', videoStyle)
                    .replace('{script}', script);

                // FIX: pass the prompt as an argument
                const result = await generateImageScript.sendMessage([
                    { text: FINAL_PROMPT }
                ]);

                // Parse model response safely
                const responseText = result.response.text();
                let resp;
                try {
                    resp = JSON.parse(responseText);
                } catch (error) {
                    console.error("Invalid JSON from model:", responseText);
                    throw new Error("Model returned invalid JSON.");
                }

                return resp;
            }
        );

        //Generate Image using AI
        const GenerateImages = await step.run(
            "generateIMages",
            async () => {
                let images = [];
                images = await Promise.all(
                    GenerateImagePrompts.map(async (element) => {
                        const result = await axios.post(BASE_URL + '/api/generate-image',
                            {
                                width: 1024,
                                height: 1024,
                                input: element?.imagePrompt,
                                model: 'sdxl',//'flux'
                                aspectRatio: "1:1"//Applicable to Flux model only
                            },
                            {
                                headers: {
                                    'x-api-key': process.env.NEXT_PUBLIC_VOICE_KEY, // Your API Key
                                    'Content-Type': 'application/json', // Content Type
                                },
                            })
                        console.log(result.data.image) //Output Result: Base 64 Image
                        return result.data.image
                    })
                )
                return images;
            }
        )

        //Save all Data to DB
        const updateDB = await step.run("UpdateDB", async () => {
            const result = await convex.mutation(api.videoData.UpdateVideoRecord, {
                recordId: recordId,
                audioUrl: GenerateAudioFile,
                captionJson: GenerateCaptions,
                images: GenerateImages,
            });

            console.log("✅ Updated record:", result);
            return result;
        });


        return 'Executed Successfully'

    }
)