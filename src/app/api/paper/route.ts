import { NextResponse } from "next/server";
import {
    fetchDifyWorkflowPaper,
    PaperGenerateRequest,
} from "@/lib/agents/card_build";

export async function POST(req: Request) {
    try {
        const body = (await req.json()) as PaperGenerateRequest;

        // 验证请求参数
        if (!body.title || !body.subject) {
            return NextResponse.json(
                { error: "title 和 subject 参数不能为空" },
                { status: 400 }
            );
        }

        const baseUrl = process.env.NEXT_PUBLIC_DIFY_URL;
        if (!baseUrl) {
            return NextResponse.json(
                { error: "DIFY_URL未在环境变量中定义" },
                { status: 500 }
            );
        }

        const token = process.env.NEXT_PUBLIC_DIFY_TOKEN_paper;
        if (!token) {
            return NextResponse.json(
                { error: "DIFY_TOKEN_paper未在环境变量中定义" },
                { status: 500 }
            );
        }

        // 使用统一的方法调用Dify API生成试卷
        const result = await fetchDifyWorkflowPaper(baseUrl, token, body);

        return NextResponse.json(result);
    } catch (error) {
        console.error("Paper API route error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : "未知错误" },
            { status: 500 }
        );
    }
}
