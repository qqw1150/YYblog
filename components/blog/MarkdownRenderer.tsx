'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
// @ts-expect-error: 缺少类型声明但实际可用
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
// @ts-expect-error: 缺少类型声明但实际可用
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

// Markdown渲染器组件属性接口
interface MarkdownRendererProps {
  content: string;
  className?: string;
  // 控制是否将反引号文本转换为斜体文本
  convertBackticksToEmphasis?: boolean;
}

/**
 * Markdown渲染器组件
 * 用于将Markdown格式的文本渲染为HTML
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ 
  content, 
  className = '',
  convertBackticksToEmphasis = true
}) => {
  // 预处理内容，将反引号包裹的文本转换为斜体格式
  const processedContent = React.useMemo(() => {
    if (!convertBackticksToEmphasis) return content;
    
    // 将单反引号包裹的文本转换为斜体格式（*文本*）
    // 使用正则表达式匹配单反引号包裹的文本，但不匹配代码块(```)
    return content.replace(
      /(?<!`)`([^`\n]+)`(?!`)/g, 
      '*$1*' // 转换为斜体格式
    );
  }, [content, convertBackticksToEmphasis]);

  return (
    <div className={`prose prose-lg max-w-none ${className}
      prose-h1:text-indigo-700 prose-h1:font-extrabold prose-h1:tracking-tight prose-h1:mb-6 prose-h1:mt-10
      prose-h2:text-purple-700 prose-h2:font-bold prose-h2:border-b prose-h2:border-purple-200 prose-h2:pb-2 prose-h2:mb-5 prose-h2:mt-8
      prose-h3:text-rose-700 prose-h3:font-semibold prose-h3:mb-4 prose-h3:mt-6
      prose-h4:text-amber-700 prose-h4:font-semibold prose-h4:mb-3 prose-h4:mt-5
      prose-p:text-gray-900 prose-p:leading-relaxed prose-p:mb-4
      prose-ul:marker:text-indigo-500 prose-ul:pl-6 prose-li:text-gray-800 prose-li:mb-2
      prose-ol:marker:text-purple-500 prose-ol:pl-6 prose-li:mb-2
      prose-blockquote:border-l-4 prose-blockquote:border-amber-400 prose-blockquote:bg-amber-50 prose-blockquote:text-amber-900 prose-blockquote:italic prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:my-6
      prose-strong:text-rose-700 prose-strong:font-semibold
      prose-em:text-indigo-600 prose-em:not-italic
      prose-a:text-blue-600 prose-a:underline hover:prose-a:text-blue-800 prose-a:font-medium
      prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
      prose-pre:p-0 prose-pre:m-0 prose-pre:overflow-hidden
      prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10
    `}>
      <ReactMarkdown 
        remarkPlugins={[remarkGfm]} 
        rehypePlugins={[rehypeRaw]}
        components={{
          pre: ({ children }) => {
            return <div className="not-prose my-6">{children}</div>;
          },
          code: ((props: any) => {
            const { inline, className, children, ...rest } = props;
            const match = /language-(\w+)/.exec(className || '');
            const language = match ? match[1] : 'javascript';
            
            if (!inline) {
              // 获取代码内容
              const codeContent = Array.isArray(children)
                ? children.join('')
                : (children as string) || '';
              
              // 代码块高亮渲染
              return (
                <SyntaxHighlighter
                  style={oneDark} // 采用流行的oneDark高亮主题
                  language={language}
                  showLineNumbers // 显示行号
                  customStyle={{
                    borderRadius: '0.5rem', // 圆角
                    fontSize: '0.95rem',
                    margin: 0,
                    padding: '1.25rem',
                    tabSize: 2,
                  }}
                  {...rest}
                >
                  {codeContent}
                </SyntaxHighlighter>
              );
            } else {
              return (
                <code className="bg-pink-50 text-pink-600 px-2 py-0.5 rounded text-sm font-mono" {...rest}>
                  {Array.isArray(children)
                    ? children.join('')
                    : typeof children === 'string'
                      ? children
                      : ''}
                </code>
              );
            }
          })
        }}
      >
        {processedContent}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownRenderer; 