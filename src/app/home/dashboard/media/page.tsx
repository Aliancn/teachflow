'use client'
import '@ant-design/v5-patch-for-react-19'
import { useState } from 'react'
import { Input, Select, Button, Space, List, message } from 'antd'
import { PictureOutlined, VideoCameraOutlined, FileTextOutlined, DownloadOutlined } from '@ant-design/icons'
import { Card } from "@/components/ui/Card"
import { DeleteOutlined } from '@ant-design/icons'

const { TextArea } = Input

export default function MediaGenerationPage() {
  const MAX_HISTORY_LENGTH = 10;

  const [prompt, setPrompt] = useState('')
  const [mediaType, setMediaType] = useState('image')
  const [loading, setLoading] = useState(false)
  const [generatedImage, setGeneratedImage] = useState<string | null>(null)
  const [generationHistory, setGenerationHistory] = useState<Array<{
    type: string;
    prompt: string;
    result: string;
    timestamp: number;
  }>>(() => {
    if (typeof window !== 'undefined') {
      const savedHistory = localStorage.getItem('mediaGenerationHistory')
      return savedHistory ? JSON.parse(savedHistory) : []
    }
    return []
  })

  const mediaTypes = [
    { value: 'image', label: '图片', icon: <PictureOutlined /> },
    { value: 'video', label: '视频', icon: <VideoCameraOutlined /> },
    { value: 'text', label: '文本', icon: <FileTextOutlined /> },
  ]

  const handleGenerate = async () => {
    if (!prompt) {
      message.error('请输入提示词')
      return
    }

    setLoading(true)
    try {
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ prompt })
      })
      
      const data = await response.json()
      
      if (data.error) {
        throw new Error(data.error)
      }

      if (data.images && data.images[0].url) {
        const imageUrl = data.images[0].url
        setGeneratedImage(imageUrl)
        
        const newHistory = {
          type: mediaType,
          prompt: prompt,
          result: imageUrl,
          timestamp: Date.now()
        }
        
        const updatedHistory = [newHistory, ...generationHistory].slice(0, MAX_HISTORY_LENGTH)
        setGenerationHistory(updatedHistory)
        if (typeof window !== 'undefined') {
          localStorage.setItem('mediaGenerationHistory', JSON.stringify(updatedHistory))
        }
      }
    } catch (error) {
      console.error('生成失败:', error)
      message.error('生成失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const handleExportImage = async (imageUrl: string) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `generated-image-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      message.success('导出成功');
    } catch (error) {
      console.error('导出失败:', error);
      message.error('导出失败，请稍后重试');
    }
  };

  const handleDeleteHistory = (timestamp: number) => {
    const updatedHistory = generationHistory.filter(item => item.timestamp !== timestamp)
    setGenerationHistory(updatedHistory)
    if (typeof window !== 'undefined') {
      localStorage.setItem('mediaGenerationHistory', JSON.stringify(updatedHistory))
    }
    message.success('删除成功')
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">多媒体资源生成</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">智能生成</h2>
            <Card padding="xs">
              <div className="p-4">
                <Space direction="vertical" className="w-full">
                  <Select
                    value={mediaType}
                    onChange={setMediaType}
                    options={mediaTypes}
                    className="w-full"
                    placeholder="选择媒体类型"
                  />
                  <TextArea
                    rows={4}
                    value={prompt}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setPrompt(e.target.value)}
                    placeholder="请输入提示词，描述您想要生成的教学资源内容..."
                    className="w-full"
                  />
                  <Button 
                    type="primary"
                    onClick={handleGenerate}
                    loading={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
                  >
                    开始生成
                  </Button>
                </Space>
              </div>
            </Card>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">生成结果</h2>
            <Card padding="xs">
              <div className="p-4">
                <div className="min-h-[300px] flex flex-col items-center justify-center text-gray-400">
                  {generatedImage ? (
                    <>
                      <img 
                        src={generatedImage} 
                        alt="生成的图片" 
                        className="max-w-full max-h-[500px] object-contain" 
                      />
                      <Button
                        icon={<DownloadOutlined />}
                        onClick={() => handleExportImage(generatedImage)}
                        className="mt-4"
                      >
                        导出图片
                      </Button>
                    </>
                  ) : (
                    '生成的内容将在这里显示'
                  )}
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">生成历史</h2>
          <Card padding="xs">
            <div className="p-4">
              <List
                itemLayout="vertical"
                dataSource={generationHistory}
                renderItem={(item) => (
                  <List.Item
                    actions={[
                      item.type === 'image' && (
                        <>
                          <Button
                            key="export"
                            type="link"
                            icon={<DownloadOutlined />}
                            onClick={() => handleExportImage(item.result)}
                          >
                            导出
                          </Button>
                          <Button
                            key="delete"
                            type="link"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => handleDeleteHistory(item.timestamp)}
                          >
                            删除
                          </Button>
                        </>
                      )
                    ]}
                  >
                    <div className="flex flex-col gap-2">
                      <div className="text-sm text-gray-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </div>
                      <div className="text-sm">{item.prompt}</div>
                      {item.type === 'image' && (
                        <img 
                          src={item.result} 
                          alt="历史记录" 
                          className="w-full h-32 object-cover rounded"
                        />
                      )}
                    </div>
                  </List.Item>
                )}
              />
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}