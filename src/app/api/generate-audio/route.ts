import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { prompt } = await request.json()
    const apiKey = 'Bearer ' + process.env.NEXT_PUBLIC_SILICONFLOW_TOKEN;

    const options = {
      method: 'POST',
      headers: {
        Authorization: apiKey,
        'Content-Type': 'application/json',
        'Accept': 'audio/mpeg'
      },
      body: JSON.stringify({
        input: prompt,
        response_format: "mp3",
        stream: false,
        speed: 1,
        gain: 0,
        model: "FunAudioLLM/CosyVoice2-0.5B",
        voice: "FunAudioLLM/CosyVoice2-0.5B:alex"
      })
    }

    const response = await fetch('https://api.siliconflow.cn/v1/audio/speech', options)
    
    if (!response.ok) {
      throw new Error(`API 请求失败: ${response.status}`)
    }

    // 直接获取音频数据并转换为 Base64
    const audioBuffer = await response.arrayBuffer()
    const base64Audio = Buffer.from(audioBuffer).toString('base64')
    const audioUrl = `data:audio/mp3;base64,${base64Audio}`

    return NextResponse.json({ audioUrl })
  } catch (error) {
    console.error('语音生成失败:', error)
    return NextResponse.json({ error: '语音生成失败：' + (error as Error).message }, { status: 500 })
  }
}