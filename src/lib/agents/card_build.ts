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
export async function fetchDifyWorkflowCard(
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

// ==================== 详细教学内容生成接口 ====================

// 详细教学内容生成请求接口
export interface SyllabusContentRequest {
    card_content: SyllabusCardItem[]; // 之前生成的教学卡片内容
}

// 详细教学内容响应接口
export interface SyllabusContentResponse {
    text: string; // 详细的教学讲义内容（Markdown格式）
    goal: string; // 教学目标
}

// 教学内容+教学目标 服务器端调用Dify API的方法
export async function fetchDifyWorkflowContent(
    baseUrl: string,
    token: string,
    request: SyllabusContentRequest
): Promise<SyllabusContentResponse> {
    const requestBody = {
        inputs: {
            card_content: JSON.stringify(request.card_content),
        },
        query: '请按照要求生成详细教学内容。',
        response_mode: 'blocking',
        user: 'cards_word_req',
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

    return {
        text: result.data.outputs.text,
        goal: result.data.outputs.goals 
    };
}

// 客户端调用本地API路由生成详细教学内容（统一的客户端调用入口）
export async function generateSyllabusContent(
    request: SyllabusContentRequest
): Promise<SyllabusContentResponse> {
    console.log('开始生成详细教学内容，参数:', request);

    const response = await fetch('/api/syllabus/content', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成详细内容失败');
    }

    const result = await response.json();
    console.log('详细内容 API 响应:', result);
    return result;
}

// ==================== 试卷生成接口 ====================

// 试卷生成请求接口
export interface PaperGenerateRequest {
    title: string;              // 试卷标题
    subject: string;            // 学科
    knowledge_points: string[]; // 知识点列表
    difficulty: string;         // 难度: easy, medium, hard
    paper_type: string;         // 类型: unit, midterm, final, mock
    question_count: number;     // 题目数量
    include_answer: boolean;    // 是否包含答案
}

// 试卷生成响应接口
export interface PaperGenerateResponse {
    question: string;  // 试卷题目内容（Markdown格式）
    answer: string;    // 参考答案（Markdown格式）
    title: string;     // 试卷标题
}

// 服务器端调用Dify API生成试卷（仅在API路由中使用）
export async function fetchDifyWorkflowPaper(
    baseUrl: string,
    token: string,
    request: PaperGenerateRequest
): Promise<PaperGenerateResponse> {
    const requestBody = {
        inputs: {
            title: request.title,
            subject: request.subject,
            knowledge_points: JSON.stringify(request.knowledge_points),
            difficulty: request.difficulty,
            paper_type: request.paper_type,
            question_count: request.question_count,
            include_answer: request.include_answer,
        },
        query: '请根据要求生成试卷。',
        response_mode: 'blocking',
        user: 'paper_req',
    };

    console.log('Sending paper request to Dify:', baseUrl + '/workflows/run');
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

    // 解析返回的试卷数据
    return {
        question: result.data.outputs.question || result.data.outputs.text,
        answer: result.data.outputs.answer || '',
        title: request.title
    };
}

// 客户端调用本地API路由生成试卷（统一的客户端调用入口）
export async function generatePaper(
    request: PaperGenerateRequest
): Promise<PaperGenerateResponse> {
    console.log('开始生成试卷，参数:', request);

    const response = await fetch('/api/paper', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || '生成试卷失败');
    }

    const result = await response.json();
    console.log('试卷 API 响应:', result);
    return result;
}
