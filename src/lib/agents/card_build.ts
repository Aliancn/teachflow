import { DifyMessage } from "@/lib/agents/dify_chat";
interface DifyRequestBodyBlocking {
    inputs: {
        topic :string;
        section_count: number;
        total_duration: number;
    };
    query: string;
    response_mode: 'blocking';
    conversation_id: string;
    user: string;
    files?: Array<{
        type: string;
        transfer_method: string;
        url: string;
    }>;
}

export interface DifyCardReq {
    messages: DifyMessage[];
    topic: string;
    section_count: number;
    total_duration: number;
    conversation_id: string;
    user?: string;
    files?: Array<{ type: string; transfer_method: string; url: string }>;
}

export async function fetchDifyCard(req : DifyCardReq): Promise<{ result: any; conversation_id: string }> {
    const baseUrl = process.env.NEXT_PUBLIC_DIFY_URL;
    if (!baseUrl) {
        throw new Error('DIFY_URL未在环境变量中定义');
    }

    const lastMessage = req.messages[req.messages.length - 1].content;
    const requestBody: DifyRequestBodyBlocking = {
        inputs: {
            topic: req.topic,
            section_count: req.section_count,
            total_duration: req.total_duration,
        },
        query: lastMessage,
        response_mode: 'blocking',
        conversation_id: req.conversation_id,
        user: req.user || 'cards_req',
        files : req.files
    };

    const token = process.env.NEXT_PUBLIC_DIFY_TOKEN_03;
    if (!token) {
        throw new Error('DIFY_TOKEN未在环境变量中定义');
    }

    const options: RequestInit = {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
    };

    try {
        const response = await fetch(baseUrl + '/chat-messages', options);
        if (!response.ok) {
            const errorBody = await response.text();
            throw new Error(`HTTP错误 ${response.status}: ${errorBody}`);
        }

        const result = await response.json();
        const cards = result.answer.replace(/^```json\s*|\s*```$/g, '');
        const cards_json = JSON.parse(cards);
        return {
            result: cards_json,
            conversation_id: result.conversation_id
        };
    } catch (err) {
        console.error('请求异常:', err);
        throw err;
    }
}
