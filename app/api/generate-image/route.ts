import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { prompt } = await request.json();

        if (!prompt) {
            return NextResponse.json({ error: 'Prompt is required' }, { status: 400 });
        }

      
        const apiKey = process.env.API_KEY;
        if (!apiKey) {
            console.error('API key is missing');
            return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
        }

       
        const response = await fetch('https://api.imagepig.com/flux', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Api-Key': apiKey,
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`Failed to generate image: ${response.statusText}`);
        }

        const json = await response.json();

        if (!json.image_data) {
            return NextResponse.json({ error: 'Failed to get image data' }, { status: 500 });
        }

       
        const imageUrl = `data:image/jpeg;base64,${json.image_data}`;

        return NextResponse.json({ imageUrl });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
