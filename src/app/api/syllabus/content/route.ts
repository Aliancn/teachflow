import { NextResponse } from "next/server";
import {
  fetchDifyWorkflowContent,
  SyllabusContentRequest,
} from "@/lib/agents/card_build";

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as SyllabusContentRequest;

    // 验证请求参数
    if (
      !body.card_content ||
      !Array.isArray(body.card_content) ||
      body.card_content.length === 0
    ) {
      return NextResponse.json(
        { error: "card_content 参数缺失或为空" },
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

    const token = process.env.NEXT_PUBLIC_DIFY_TOKEN_content;
    if (!token) {
      return NextResponse.json(
        { error: "DIFY_TOKEN未在环境变量中定义" },
        { status: 500 }
      );
    }

    // 使用统一的方法调用Dify API生成详细教学内容
    const result = await fetchDifyWorkflowContent(baseUrl, token, body);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Content API route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "未知错误" },
      { status: 500 }
    );
  }
}
