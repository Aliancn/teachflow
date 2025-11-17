import { NextResponse } from 'next/server';
import {
    fetchDifyWorkflowEnhance,
    ExerciseEnhanceRequest,
} from '@/lib/agents/card_build';

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as ExerciseEnhanceRequest;

        // 验证请求参数
        if (!body.original) {
            return NextResponse.json(
                { error: 'original 参数不能为空' },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_DIFY_URL;
        if (!baseUrl) {
            return NextResponse.json(
                { error: 'DIFY_URL未在环境变量中定义' },
                { status: 500 }
            );
        }

        const token = process.env.NEXT_PUBLIC_DIFY_TOKEN_enhance;
        if (!token) {
            return NextResponse.json(
                { error: 'DIFY_TOKEN_enhance未在环境变量中定义' },
                { status: 500 }
            );
        }

        // 使用统一的方法调用Dify API生成增强习题
        const result = await fetchDifyWorkflowEnhance(baseUrl, token, body);

        return NextResponse.json(result);
    } catch (error) {
        console.error('Enhance exercise API route error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '未知错误' },
            { status: 500 }
        );
    }
}
