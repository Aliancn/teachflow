import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  // 实际实现应调用AI生成服务
  const { original } = await req.json();
  
  // 模拟生成逻辑
  // const results = Array(3).fill('').map((_, i) => 
  //   `生成题目 ${i+1}（基于：${original}）\n\n1. 若 \\( \\sin \\theta = \\frac{4}{5} \\)，且 \\( \\theta \\) 在第二象限，则 \\( \\tan \\theta = \\)（ ）  \n   A. \\( \\frac{4}{3} \\)  \n   B. \\( -\\frac{4}{3} \\)  \n   C. \\( \\frac{3}{4} \\)  \n   D. \\( -\\frac{3}{4} \\)\n\n`
  // );
  const results = [
    `1. 若 \\( \\sin \\theta = \\frac{4}{5} \\)，且 \\( \\theta \\) 在第二象限，则 \\( \\tan \\theta = \\)（ ）  \n   A. \\( \\frac{4}{3} \\)  \n   B. \\( -\\frac{4}{3} \\)  \n   C. \\( \\frac{3}{4} \\)  \n   D. \\( -\\frac{3}{4} \\)\n\n`,
    `2. 已知 \\( \\tan \\theta = \\frac{3}{4} \\)，且 \\( \\theta \\) 在第三象限，则 \\( \\cos \\theta = \\)（ ）  \n A. \\( \\frac{4}{5} \\)  \nB. \\( -\\frac{4}{5} \\)  \nC. \\( \\frac{3}{5} \\)  \nD. \\( -\\frac{3}{5} \\)\n\n答案：D\n\n`,
    `3. 若 \\( \\sin \\theta = -\\frac{7}{25} \\)，且 \\( \\theta \\) 在第四象限，则 \\( \\tan \\theta = \\)（ ）  \nA. \\( \\frac{24}{7} \\)  \nB. \\( -\\frac{24}{7} \\)  \nC. \\( \\frac{7}{24} \\)  \nD. \\( -\\frac{7}{24} \\)\n\n答案：B\n\n`
  ];


  return NextResponse.json({ results });
}