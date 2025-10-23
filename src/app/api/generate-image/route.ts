import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const { prompt } = await request.json()
  const apiKey = 'Bearer ' + process.env.NEXT_PUBLIC_SILICONFLOW_TOKEN;
  console.log(apiKey)
  const options = {
    method: 'POST',
    headers: {
      Authorization: apiKey,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: "Kwai-Kolors/Kolors",
      prompt: prompt,
      image_size: "1024x1024",
      batch_size: 1,
      num_inference_steps: 20,
      guidance_scale: 7.5
    })
  }

  try {
    const response = await fetch('https://api.siliconflow.cn/v1/images/generations', options)
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json({ error: '图像生成失败'+ error }, { status: 500 })
  }
}