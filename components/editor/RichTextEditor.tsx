'use client';

import { useEffect, useRef } from 'react';
// @ts-ignore - toast-ui-editor类型声明问题
import Editor from '@toast-ui/editor';
import '@toast-ui/editor/dist/toastui-editor.css';

/**
 * 富文本编辑器组件属性接口
 */
interface RichTextEditorProps {
  /** 编辑器内容 */
  content?: string;
  /** 内容变化回调 */
  onChange?: (content: string) => void;
  /** 编辑器高度 */
  height?: string;
  /** 是否只读 */
  readOnly?: boolean;
  /** 占位符文本 */
  placeholder?: string;
}

/**
 * 富文本编辑器组件
 * 基于toast-ui-editor封装，提供Markdown和WYSIWYG编辑模式
 */
export default function RichTextEditor({
  content = '',
  onChange,
  height = '600px',
  readOnly = false,
  placeholder = '开始编写您的内容...'
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const editorInstanceRef = useRef<any>(null);

  // 初始化和只读切换时重建编辑器
  useEffect(() => {
    if (!editorRef.current) return;

    // 创建编辑器实例
    const editor = new Editor({
      el: editorRef.current,
      height,
      initialEditType: 'wysiwyg', // 默认使用所见即所得模式
      previewStyle: 'vertical', // 预览样式
      placeholder,
      language: 'zh-CN', // 中文界面
      toolbarItems: [
        ['heading', 'bold', 'italic', 'strike'],
        ['hr', 'quote'],
        ['ul', 'ol', 'task', 'indent', 'outdent'],
        ['table', 'image', 'link'],
        ['code', 'codeblock'],
        ['scrollSync']
      ],
      editable: !readOnly, // 只读控制
      hooks: {
        addImageBlobHook: (blob: File, callback: (url: string, altText: string) => void) => {
          // 这里可以添加图片上传逻辑
          // 暂时使用base64
          const reader = new FileReader();
          reader.onload = () => {
            callback(reader.result as string, blob.name);
          };
          reader.readAsDataURL(blob);
        }
      }
    });

    // 设置初始内容
    if (content) {
      editor.setMarkdown(content);
    }

    // 监听内容变化
    editor.on('change', () => {
      const markdown = editor.getMarkdown();
      onChange?.(markdown);
    });

    editorInstanceRef.current = editor;

    // 清理函数
    return () => {
      if (editorInstanceRef.current) {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, [readOnly]);

  // 当内容从外部更新时，同步到编辑器
  useEffect(() => {
    if (editorInstanceRef.current && content !== editorInstanceRef.current.getMarkdown()) {
      editorInstanceRef.current.setMarkdown(content);
    }
  }, [content]);

  return (
    <div className="rich-text-editor-container">
      <div ref={editorRef} className="w-full" />
    </div>
  );
} 