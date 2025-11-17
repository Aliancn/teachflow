import { NextResponse } from 'next/server';
import { fetchDifyWorkflow, SyllabusGenerateRequest } from '@/lib/agents/card_build';

export async function POST(req: Request) {
    try {
        const body = await req.json() as SyllabusGenerateRequest;

        const baseUrl = process.env.NEXT_PUBLIC_DIFY_URL;
        if (!baseUrl) {
            return NextResponse.json(
                { error: 'DIFY_URL未在环境变量中定义' },
                { status: 500 }
            );
        }

        const token = process.env.NEXT_PUBLIC_DIFY_TOKEN_03;
        if (!token) {
            return NextResponse.json(
                { error: 'DIFY_TOKEN未在环境变量中定义' },
                { status: 500 }
            );
        }

        // 使用统一的方法调用Dify API
        const result = await fetchDifyWorkflow(baseUrl, token, body);

        return NextResponse.json(result);
    } catch (error) {
        console.error('API route error:', error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : '未知错误' },
            { status: 500 }
        );
    }
}
