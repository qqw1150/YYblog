'use client';

import { useState, useEffect, useMemo } from 'react';
import { PostStatus, PostStatusList } from '@/lib/supabase/db/posts';
import { getAllCategories, Category } from '@/lib/supabase/db/categories';

/**
 * 文章发布设置弹窗组件的属性接口
 */
export interface PostSettingsModalProps {
  // 文章标题 (可选，从编辑器传入)
  title?: string;
  // 文章内容 (可选，从编辑器传入)
  content?: string;
  // 初始数据（编辑模式使用）
  initialData?: Partial<PostSubmitData>;
  // 关闭弹窗的回调函数
  onClose: () => void;
  // 提交表单的回调函数
  onSubmit: (postData: PostSubmitData) => void;
}

/**
 * 文章提交数据接口
 */
export interface PostSubmitData {
  // 文章标题
  title: string;
  // 文章内容
  content: string;
  // 文章分类ID
  categoryId: string;
  // 文章标签列表
  tags: string[];
  // 是否允许评论
  allowComment: boolean;
  // 文章摘要
  excerpt: string;
  // 封面图片URL
  coverImage?: string;
  // 是否置顶
  isTop: boolean;
  // SEO关键词
  seoKeywords: string;
  // SEO描述
  seoDescription: string;
  // 状态
  status: PostStatus;
}

/**
 * 文章发布设置弹窗组件
 * 用于在发布文章前设置文章的分类、标签、SEO等信息
 */
export default function PostSettingsModal({ 
  title = '', 
  content = '', 
  initialData = {},
  onClose, 
  onSubmit 
}: PostSettingsModalProps) {
  // 表单数据状态
  const [formData, setFormData] = useState<PostSubmitData>({
    title: title || '',
    content: content || '',
    categoryId: '',
    tags: [],
    allowComment: true,
    excerpt: '',
    coverImage: '',
    isTop: false,
    seoKeywords: '',
    seoDescription: '',
    status: 'draft',
  });

  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState<'basic' | 'seo'>('basic');

  // 分类数据状态
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [categoriesError, setCategoriesError] = useState<string | null>(null);

  // 使用useMemo来稳定依赖项，避免无限循环
  const stableInitialData = useMemo(() => initialData, []);
  const stableTitle = useMemo(() => title, []);
  const stableContent = useMemo(() => content, []);

  // 处理初始数据（编辑模式）
  useEffect(() => {
    if (stableInitialData && Object.keys(stableInitialData).length > 0) {
      console.log('📋 PostSettingsModal 接收到初始数据:', stableInitialData);
      console.log('📋 状态字段:', stableInitialData.status);
      setFormData(prev => {
        const newData = {
          ...prev,
          ...stableInitialData,
          // 确保标题和内容优先使用传入的值
          title: stableTitle || stableInitialData.title || prev.title,
          content: stableContent || stableInitialData.content || prev.content,
        };
        console.log('📋 PostSettingsModal 更新后的表单数据:', newData);
        console.log('📋 更新后的状态字段:', newData.status);
        return newData;
      });
    }
  }, [stableInitialData, stableTitle, stableContent]);

  // 获取分类数据
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        setCategoriesError(null);
        
        const { data, error } = await getAllCategories();
        
        if (error) {
          console.error('获取分类失败:', error);
          setCategoriesError('获取分类失败，请稍后重试');
          return;
        }
        
        if (data) {
          setCategories(data);
        }
      } catch (error) {
        console.error('获取分类异常:', error);
        setCategoriesError('获取分类失败，请稍后重试');
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // 更新表单字段
  const handleChange = (field: keyof PostSubmitData, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // 处理标签输入
  const handleTagInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && e.currentTarget.value.trim()) {
      e.preventDefault();
      const newTag = e.currentTarget.value.trim();
      if (!formData.tags.includes(newTag)) {
        handleChange('tags', [...formData.tags, newTag]);
      }
      e.currentTarget.value = '';
    }
  };

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
  };

  // 处理表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('📝 PostSettingsModal 表单提交，当前数据:', formData);
    
    // 表单验证
    if (!formData.title.trim()) {
      alert('请输入文章标题');
      return;
    }
    
    if (!formData.categoryId) {
      alert('请选择文章分类');
      return;
    }
    
    if (!formData.content.trim()) {
      alert('请输入文章内容');
      return;
    }
    
    // 如果没有填写摘要，自动提取正文前150字
    if (!formData.excerpt.trim() && formData.content.trim()) {
      const excerpt = formData.content.replace(/<[^>]*>/g, '').substring(0, 150);
      formData.excerpt = excerpt + (excerpt.length === 150 ? '...' : '');
    }
    
    console.log('📤 PostSettingsModal 提交最终数据:', formData);
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* 弹窗标题 */}
        <div className="px-6 py-4 border-b flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">发布设置</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* 标签页切换 */}
        <div className="flex border-b">
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'basic' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('basic')}
          >
            基本设置
          </button>
          <button
            className={`px-6 py-3 font-medium ${activeTab === 'seo' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
            onClick={() => setActiveTab('seo')}
          >
            SEO设置
          </button>
        </div>

        {/* 表单内容 */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6">
          {/* 基本设置 */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              {/* 分类选择 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文章分类</label>
                <select
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={formData.categoryId}
                  onChange={e => handleChange('categoryId', e.target.value)}
                  required
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading ? '加载中...' : categoriesError ? '加载失败' : '请选择分类'}
                  </option>
                  {categories.map(category => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {categoriesError && (
                  <p className="text-red-500 text-sm mt-1">{categoriesError}</p>
                )}
              </div>

              {/* 标签输入 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文章标签</label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags.map(tag => (
                    <span key={tag} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-md text-sm flex items-center">
                      {tag}
                      <button 
                        type="button" 
                        className="ml-1 text-blue-600 hover:text-blue-800"
                        onClick={() => removeTag(tag)}
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  placeholder="输入标签后按回车添加"
                  onKeyDown={handleTagInput}
                />
              </div>

              {/* 文章摘要 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">文章摘要</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={3}
                  value={formData.excerpt}
                  onChange={e => handleChange('excerpt', e.target.value)}
                  placeholder="请输入文章摘要，如不填写将自动提取正文前150字"
                />
              </div>

             {/* 状态选择 */}
             <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">文章状态</label>
              <select
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={formData.status}
                onChange={e => handleChange('status', e.target.value)}
              >
                {PostStatusList().map(status => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
             </div>

              {/* 其他选项 */}
              <div className="flex items-center space-x-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                    checked={formData.allowComment}
                    onChange={e => handleChange('allowComment', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">允许评论</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="rounded text-blue-600 focus:ring-blue-500 h-4 w-4 mr-2"
                    checked={formData.isTop}
                    onChange={e => handleChange('isTop', e.target.checked)}
                  />
                  <span className="text-sm text-gray-700">置顶文章</span>
                </label>
              </div>
            </div>
          )}

          {/* SEO设置 */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              {/* SEO关键词 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO关键词</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  value={formData.seoKeywords}
                  onChange={e => handleChange('seoKeywords', e.target.value)}
                  placeholder="多个关键词用英文逗号分隔"
                />
              </div>

              {/* SEO描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SEO描述</label>
                <textarea
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                  rows={4}
                  value={formData.seoDescription}
                  onChange={e => handleChange('seoDescription', e.target.value)}
                  placeholder="请输入SEO描述，建议不超过200字"
                />
              </div>
            </div>
          )}
        </form>

        {/* 底部按钮 */}
        <div className="px-6 py-4 border-t flex items-center justify-end space-x-4">
          <button
            type="button"
            className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
            onClick={onClose}
          >
            取消
          </button>
          <button
            type="button"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            onClick={handleSubmit}
          >
            确认发布
          </button>
        </div>
      </div>
    </div>
  );
} 