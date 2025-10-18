import ReactMarkdown from "react-markdown";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";

function convertToLatexMarkdown(input: string): string {
    // This regex finds LaTeX expressions that are written as \(...\) or ... and converts them into $...$ format
    const inlineMathRegex = /\\\((.*?)\\\)/g;
    const displayMathRegex = /\\\[(.*?)\\\]/g;

    // Convert inline math (\( ... \)) to $...$
    let convertedContent = input.replace(inlineMathRegex, (match, p1) => `$${p1}$`);

    // Convert display math (\[ ... \]) to $$...$$
    convertedContent = convertedContent.replace(displayMathRegex, (match, p1) => `$$${p1}$$`);

    console.log(convertedContent); // Debugging: Print the converted content to see if it matches your expectatio
    return convertedContent;
}



export default function MathMarkdown({ content, className }: { content: string, className?: string }) {
    return (
        <div className={`prose max-w-none 
            prose-headings:font-semibold    // 标题加粗
            prose-code:before:content-none  // 移除代码块前导符号
            prose-code:after:content-none   // 移除代码块后置符号
            prose-code:bg-gray-100          // 代码背景色
            prose-code:px-1.5               // 代码水平内边距
            prose-code:rounded-md           // 代码圆角
            prose-code:border               // 代码边框
            prose-code:border-gray-200      // 代码边框颜色
            prose-code:font-mono            // 等宽字体
            prose-blockquote:border-l-4     // 引用块左边框
            prose-blockquote:border-purple-500  // 引用块颜色
            ${className}`}
        >
            <ReactMarkdown
                remarkPlugins={[remarkMath]}
                rehypePlugins={[[rehypeKatex, {
                    output: 'mathml',  
                    strict: false
                }]]}
            >
                {convertToLatexMarkdown(content)}
                {/* {content} */}
            </ReactMarkdown>
            <style jsx global>{`
                .katex { font-size: 1.2em; }
                .katex-html { display: none !important; }
            `}</style>
        </div>
    );
}