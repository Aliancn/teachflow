// 统一的教学大纲卡片生成请求接口
export interface SyllabusGenerateRequest {
    topic: string;
    section_count: number;
    total_duration: number;
    style?: string; // 教学风格（可选）
}

export interface SyllabusCardItem {
    title: string;
    description: string;
    type: '知识节点' | '互动节点';
    data: {
        content: string[];
        duration: string;
    };
}

export interface SyllabusGenerateResponse {
    result: {
        cards: SyllabusCardItem[];
    };
    conversation_id: string;
}

// 服务器端调用Dify API的方法（仅在API路由中使用）
export async function fetchDifyWorkflow(
    baseUrl: string,
    token: string,
    request: SyllabusGenerateRequest
): Promise<SyllabusGenerateResponse> {
    const requestBody = {
        inputs: {
            topic: request.topic,
            section_count: request.section_count,
            total_duration: request.total_duration,
            style: request.style || '',
        },
        query: '请按照要求生成教学大纲。',
        response_mode: 'blocking',
        user: 'cards_req',
    };

    console.log('Sending request to Dify:', baseUrl + '/workflows/run');
    console.log('Request body:', JSON.stringify(requestBody, null, 2));

    const response = await fetch(baseUrl + '/workflows/run', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
        const errorBody = await response.text();
        console.error('Dify API error:', errorBody);
        throw new Error(`HTTP错误 ${response.status}: ${errorBody}`);
    }

    const result = await response.json();
    console.log('Dify API response:', result);

    // 解析返回的卡片数据
    const cards = result.data.outputs.output.replace(/^```json\s*|\s*```$/g, '');
    const cards_json = JSON.parse(cards);

    return {
        result: cards_json,
        conversation_id: result.conversation_id || ''
    };
}

// 客户端调用本地API路由的方法（统一的客户端调用入口）
export async function generateSyllabusCards(
    request: SyllabusGenerateRequest
): Promise<SyllabusGenerateResponse> {
    console.log('开始生成大纲，参数:', request);

    const response = await fetch('/api/syllabus', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成失败');
    }

    const result = await response.json();
    console.log('API 响应:', result);
    return result;
}
