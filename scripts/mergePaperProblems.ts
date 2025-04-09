const fs = require('fs');
const path = require('path');

const papersDir = path.join(process.cwd(), 'public', 'papers');

// 遍历 papers 目录下的所有试卷文件夹
fs.readdirSync(papersDir).forEach((paperDir: string) => {
  const paperPath = path.join(papersDir, paperDir);
  
  // 确保是目录
  if (fs.statSync(paperPath).isDirectory()) {
    // 读取该目录下的所有 JSON 文件
    const problems = fs.readdirSync(paperPath)
      .filter((file: string) => file.endsWith('.json'))
      .map((file: string) => {
        const content = fs.readFileSync(path.join(paperPath, file), 'utf-8');
        return JSON.parse(content);
      });

    // 将所有题目写入一个新的 JSON 文件
    const mergedFilePath = path.join(paperPath, `${paperDir}_all.json`);
    fs.writeFileSync(mergedFilePath, JSON.stringify(problems, null, 2), 'utf-8');
  }
});

console.log('合并完成！');