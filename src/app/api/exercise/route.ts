import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function POST(req: Request) {
  const formData = await req.formData();
  const data = JSON.parse(formData.get('data') as string);
  const image = formData.get('image') as File | null;

  // 处理图片上传
  if (image) {
    const buffer = Buffer.from(await image.arrayBuffer());
    const filename = Date.now() + '_' + image.name;
    const uploadDir = path.join(process.cwd(), 'public', 'exercises');
    
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(uploadDir, filename), buffer);
    data.image = `/exercises/${filename}`;
  }

  // 更新JSON文件
  const jsonPath = path.join(process.cwd(), 'public', 'mathProblems.json');
  const existingData = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
  existingData.push(data);
  
  fs.writeFileSync(jsonPath, JSON.stringify(existingData, null, 2));
  
  return NextResponse.json({ success: true });
}