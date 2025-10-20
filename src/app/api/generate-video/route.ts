import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    try {
      const { prompt } = await request.json()
      const apiKey = 'Bearer ' + process.env.NEXT_PUBLIC_SILICONFLOW_TOKEN
  
      const options = {
        method: 'POST',
        headers: {
          Authorization: apiKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: "Wan-AI/Wan2.1-T2V-14B",
          image_size: "1280x720",
          prompt: prompt
        })
      }
  
      const response = await fetch('https://api.siliconflow.cn/v1/video/submit', options)
  
      const text = await response.text()
      if (!response.ok) {
        console.error('视频 API 错误响应:', text)
        return NextResponse.json({ error: '视频生成 API 请求失败', detail: text }, { status: response.status })
      }
  
      const data = JSON.parse(text)
  
      if (!data.requestId) {
        return NextResponse.json({ error: '视频生成未返回 requestId' }, { status: 500 })
      }
  
      return NextResponse.json({ taskId: data.requestId })
  
    } catch (error) {
      console.error('视频生成接口异常:', error)
      return NextResponse.json({ error: '视频生成接口异常', detail: String(error) }, { status: 500 })
    }
  }
  