import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 实际实现应调用AI生成服务
  const { original } = await req.json();
  
  // 模拟生成逻辑
  const results = Array(3).fill('').map((_, i) => 
    `生成题目 ${i+1}（基于：${original}）\n\n1. 若 \\( \\sin \\theta = \\frac{4}{5} \\)，且 \\( \\theta \\) 在第二象限，则 \\( \\tan \\theta = \\)（ ）  \n   A. \\( \\frac{4}{3} \\)  \n   B. \\( -\\frac{4}{3} \\)  \n   C. \\( \\frac{3}{4} \\)  \n   D. \\( -\\frac{3}{4} \\)\n\n`
  );

  return NextResponse.json({ results });
}