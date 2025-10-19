import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const requestId = searchParams.get('taskId')

    if (!requestId) {
      return NextResponse.json({ error: '缺少 taskId 参数' }, { status: 400 })
    }

    const apiKey = 'Bearer ' + process.env.VIDEO_API_KEY
    const response = await fetch(`https://api.siliconflow.cn/v1/video/query?requestId=${requestId}`, {
      headers: {
        Authorization: apiKey
      }
    })

    const text = await response.text()
    if (!response.ok) {
      console.error('查询失败响应:', text)
      return NextResponse.json({ error: '查询失败', detail: text }, { status: response.status })
    }

    const data = JSON.parse(text)

    return NextResponse.json({
      status: data.status,
      videoUrl: data.video_url
    })
  } catch (error) {
    console.error('视频查询失败:', error)
    return NextResponse.json({ error: '视频查询失败', detail: String(error) }, { status: 500 })
  }
}
