import { HfInference } from '@huggingface/inference';
import { HuggingFaceStream, StreamingTextResponse } from 'ai';
import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';

import { ApiConfig } from '@/types/app';

export const runtime = 'edge';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    const {
        messages,
        config,
        stream,
    }: {
        messages: any[];
        config: ApiConfig;
        stream: boolean;
    } = await req.json();

    const huggingface = new HfInference(config.provider?.apiKey ?? process.env.HUGGINGFACE_API_KEY ?? '');

    const response = huggingface.textGenerationStream({
        model: config.model.model_id,
        inputs: experimental_buildOpenAssistantPrompt(messages),
        parameters: {
            max_new_tokens: 200,
            typical_p: 0.2,
            repetition_penalty: 1,
            truncate: 1000,
            return_full_text: false,
        },
    });

    const output = HuggingFaceStream(response);

    return new StreamingTextResponse(output);
}



// import { HfInference } from '@huggingface/inference';
// import { HuggingFaceStream, StreamingTextResponse } from 'ai';
// import { experimental_buildOpenAssistantPrompt } from 'ai/prompts';
// import { ApiConfig } from '@/types/app';

// export const runtime = 'edge';
// export const dynamic = 'force-dynamic';

// // Define supported generation types
// type GenerationType = 'text' | 'image';

// interface RequestBody {
//     messages: any[];
//     config: ApiConfig;
//     stream: boolean;
//     type: GenerationType;
//     imagePrompt?: string; // Optional prompt for image generation
// }

// export async function POST(req: Request) {
//     const { messages, config, stream, type, imagePrompt }: RequestBody = await req.json();

//     const huggingface = new HfInference(config.provider?.apiKey ?? process.env.HUGGINGFACE_API_KEY ?? '');

//     // Handle image generation
//     if (type === 'image') {
//         try {
//             const image = await huggingface.textToImage({
//                 model: 'stabilityai/stable-diffusion-2-1',  // You can change this to your preferred model
//                 inputs: imagePrompt || '',
//                 parameters: {
//                     negative_prompt: 'blurry, bad quality, worst quality',
//                     num_inference_steps: 30,
//                     guidance_scale: 7.5,
//                 }
//             });

//             // Convert blob to base64
//             const imageBuffer = await image.arrayBuffer();
//             const base64Image = Buffer.from(imageBuffer).toString('base64');
            
//             return new Response(JSON.stringify({ 
//                 image: `data:image/jpeg;base64,${base64Image}`
//             }), {
//                 headers: {
//                     'Content-Type': 'application/json'
//                 }
//             });
//         } catch (error) {
//             return new Response(
//                 JSON.stringify({ error: 'Failed to generate image' }),
//                 { status: 500 }
//             );
//         }
//     }

//     // Handle text generation (existing functionality)
//     const response = huggingface.textGenerationStream({
//         model: config.model.model_id,
//         inputs: experimental_buildOpenAssistantPrompt(messages),
//         parameters: {
//             max_new_tokens: 200,
//             typical_p: 0.2,
//             repetition_penalty: 1,
//             truncate: 1000,
//             return_full_text: false,
//         },
//     });

//     const output = HuggingFaceStream(response);
//     return new StreamingTextResponse(output);
// }