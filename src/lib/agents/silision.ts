interface Message {
    role: string;
    content: string;
}

interface AIRequestBody {
    model: string;
    messages: Message[];
    stream: boolean;
    max_tokens: number;
    stop: string | null;
    temperature: number;
    top_p: number;
    top_k: number;
    frequency_penalty: number;
    n: number;
    response_format: { type: string };
}

async function* fetchAIStreamResult(message: Message[]): AsyncGenerator<{word : string, thinking : boolean}> {
    const apiUrl = 'https://api.siliconflow.cn/v1/chat/completions';
    const requestBody: AIRequestBody = {
        model: 'Qwen/QwQ-32B',
        messages: message,
        stream: true, // Enable streaming
        max_tokens: 24576,
        stop: null,
        temperature: 0.6,
        top_p: 0.95,
        top_k: 40,
        frequency_penalty: 0.0,
        n: 1,
        response_format: { type: 'text' },
    };

    const token = process.env.NEXT_PUBLIC_SILICONFLOW_TOKEN;
    if (!token) { 
        throw new Error('SILICONFLOW_TOKEN is not defined in environment variables');
    }

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Authorization': 'Bearer ' + token,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(apiUrl, options);

        // 检查HTTP状态码
        if (!response.ok) {
            const errorBody = await response.text();
            console.error('HTTP错误状态码:', response.status);
            console.error('错误响应内容:', errorBody);
            throw new Error(`HTTP错误 ${response.status}: ${errorBody}`);
        }

        // Make sure the response is a stream
        if (!response.body) {
            throw new Error('Response body is missing');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunks = decoder.decode(value).split('\n\n');
            for (const chunk of chunks) {
                const data = chunk.replace('data: ', '');
                if (data === '[DONE]') {
                    break;
                }
                if (data) {
                    const json = JSON.parse(data);
                    console.log("json", json);
                    let thinking = json.choices[0].delta.reasoning_content == null ? false : true;
                    if (thinking) {
                        yield {
                            'word': json.choices[0].delta.reasoning_content || '',
                            'thinking':thinking
                        };
                    }
                    yield {
                        'word' : json.choices[0].delta.content || '',
                        'thinking' :thinking
                    };
                }
            }  
        }
    } catch (err) {
        console.error('Error:', err);
        throw err;  // Re-throw the error after logging
    }
}


export { fetchAIStreamResult }
