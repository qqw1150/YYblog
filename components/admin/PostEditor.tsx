'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import RichTextEditor from '@/components/editor/RichTextEditor';
import PostSettingsModal, { PostSubmitData } from '@/components/editor/PostSettingsModal';
import { createPost, updatePost, setPostTags, isSlugAvailable, PostCreate, PostUpdate, getPostWithTags } from '@/lib/supabase/db/posts';
import { createTagsFromNames } from '@/lib/supabase/db/tags';
import { useAuthStore } from '@/stores/authStore';

/**
 * 文章编辑页面主组件
 * 结构严格分为header和body两部分，header左为标题输入，右为功能按钮
 * body为编辑器区域，占满整个屏幕
 * 
 * @param postId 文章ID，如果提供则为编辑模式，否则为新增模式
 */
interface PostEditorProps {
  postId?: string;
}

export default function PostEditor({ postId }: PostEditorProps) {
  const router = useRouter();
  const { user } = useAuthStore();
  
  // 标题状态
  const [title, setTitle] = useState('');
  // 编辑器内容状态
  const [content, setContent] = useState('');
  // 发布设置弹窗状态
  const [showSettings, setShowSettings] = useState(false);
  // 发布状态
  const [isPublishing, setIsPublishing] = useState(false);
  // 加载状态
  const [isLoading, setIsLoading] = useState(false);
  // 错误信息
  const [error, setError] = useState<string | null>(null);
  // 是否为编辑模式
  const isEditMode = !!postId;
  // 文章数据（编辑模式使用）
  const [postData, setPostData] = useState<any>(null);

  // 加载文章数据（编辑模式）
  useEffect(() => {
    if (isEditMode && postId) {
      loadPostData();
    }
  }, [postId, isEditMode]);

  /**
   * 加载文章数据
   */
  const loadPostData = async () => {
    if (!postId) return;

    setIsLoading(true);
    setError(null);

    try {
      console.log('📖 加载文章数据，ID:', postId);
      
      const { data: post, error: loadError } = await getPostWithTags(postId);
      
      if (loadError) {
        console.error('❌ 加载文章数据失败:', loadError);
        throw new Error(`加载文章数据失败: ${loadError.message}`);
      }

      if (!post) {
        throw new Error('文章不存在');
      }

      console.log('📋 加载到的文章数据结构:', {
        title: post.title,
        category: post.category,
        status: post.status,
        tags: post.tags,
        allow_comment: post.allow_comment,
        is_top: post.is_top
      });

      // 回显数据到表单
      setTitle(post.title);
      setContent(post.content);
      // 保存完整文章数据用于设置弹窗
      setPostData(post);
      
      console.log('✅ 文章数据加载成功');
      
    } catch (err: any) {
      console.error('❌ 加载文章数据失败:', err);
      setError(err.message || '加载文章数据失败，请重试');
    } finally {
      setIsLoading(false);
    }
  };

  // 处理发布按钮点击
  const handlePublishClick = () => {
    // 验证基本数据
    if (!title.trim()) {
      setError('请输入文章标题');
      return;
    }
    // 确保content是字符串类型
    const contentStr = typeof content === 'string' ? content : String(content || '');
    if (!contentStr.trim()) {
      setError('请输入文章内容');
      return;
    }
    if (!user) {
      setError('用户未登录，请重新登录');
      return;
    }
    
    setError(null);
    setShowSettings(true);
  };

  // 生成文章slug
  const generateSlug = (title: string): string => {
    return title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '') // 移除特殊字符
      .replace(/\s+/g, '-') // 空格替换为连字符
      .replace(/-+/g, '-') // 多个连字符替换为单个
      .replace(/^-+|-+$/g, ''); // 移除首尾连字符
  };

  // 处理文章提交
  const handlePostSubmit = async (postData: PostSubmitData) => {
    if (!user) {
      setError('用户未登录，请重新登录');
      return;
    }

    console.log('📝 开始处理文章提交:', {
      title: postData.title,
      tags: postData.tags,
      status: postData.status,
      isEditMode
    });

    setIsPublishing(true);
    setError(null);

    try {
      if (isEditMode) {
        // 编辑模式：更新文章
        await handleUpdatePost(postData);
      } else {
        // 新增模式：创建文章
        await handleCreatePost(postData);
      }

      // 发布成功，关闭弹窗并跳转
      setShowSettings(false);
      
      // 根据发布状态决定跳转页面
      if (postData.status === 'published') {
        console.log('🎉 文章发布成功，跳转到文章管理页面');
        router.push('/admin/posts');
      } else {
        console.log('💾 文章保存为草稿，跳转到文章管理页面');
        router.push('/admin/posts');
      }

    } catch (err: any) {
      console.error('❌ 发布文章失败:', err);
      setError(err.message || '发布文章失败，请重试');
    } finally {
      setIsPublishing(false);
    }
  };

  /**
   * 处理创建文章
   */
  const handleCreatePost = async (postData: PostSubmitData) => {
    if (!user) {
      throw new Error('用户未登录，请重新登录');
    }

    console.log('📝 开始创建文章:', postData.title);

    // 1. 生成文章slug
    let slug = generateSlug(postData.title);
    
    // 2. 检查slug是否可用，如果不可用则添加时间戳
    const { available } = await isSlugAvailable(slug);
    if (!available) {
      const timestamp = Date.now();
      slug = `${slug}-${timestamp}`;
    }

    // 3. 准备文章数据
    const articleData: PostCreate = {
      title: postData.title,
      slug,
      content: postData.content,
      excerpt: postData.excerpt || null,
      featured_image: postData.coverImage || null,
      status: postData.status,
      author_id: user.id,
      category_id: postData.categoryId || null,
      seo_keywords: postData.seoKeywords || null,
      seo_description: postData.seoDescription || null,
      allow_comment: postData.allowComment,
      is_top: postData.isTop,
    };

    // 4. 创建文章
    const { data: createdPost, error: createError } = await createPost(articleData);
    
    if (createError) {
      console.error('❌ 创建文章失败:', createError);
      throw new Error(`创建文章失败: ${createError.message}`);
    }

    if (!createdPost) {
      throw new Error('创建文章失败: 未返回文章数据');
    }

    console.log('✅ 文章创建成功，ID:', createdPost.id);

    // 5. 处理标签
    await handlePostTags(createdPost.id, postData.tags);
  };

  /**
   * 处理更新文章
   */
  const handleUpdatePost = async (postData: PostSubmitData) => {
    if (!postId) return;

    console.log('📝 开始更新文章:', {
      postId,
      title: postData.title,
      tags: postData.tags,
      status: postData.status
    });

    // 1. 准备更新数据
    const updateData: PostUpdate = {
      title: postData.title,
      content: postData.content,
      excerpt: postData.excerpt || null,
      featured_image: postData.coverImage || null,
      status: postData.status,
      category_id: postData.categoryId || null,
      seo_keywords: postData.seoKeywords || null,
      seo_description: postData.seoDescription || null,
      allow_comment: postData.allowComment,
      is_top: postData.isTop,
    };

    console.log('📋 文章更新数据:', updateData);

    // 2. 更新文章
    const { data: updatedPost, error: updateError } = await updatePost(postId, updateData);
    
    if (updateError) {
      console.error('❌ 更新文章失败:', updateError);
      throw new Error(`更新文章失败: ${updateError.message}`);
    }

    if (!updatedPost) {
      throw new Error('更新文章失败: 未返回文章数据');
    }

    console.log('✅ 文章更新成功，ID:', updatedPost.id);

    // 3. 处理标签
    console.log('🏷️ 开始处理标签更新，标签数量:', postData.tags.length);
    await handlePostTags(postId, postData.tags);
  };

  /**
   * 处理文章标签
   */
  const handlePostTags = async (postId: string, tags: string[]) => {
    console.log('🏷️ 处理文章标签，文章ID:', postId, '标签:', tags);
    
    if (tags.length > 0) {
      // 创建标签（如果不存在）
      const { data: createdTags, error: tagsError } = await createTagsFromNames(tags);
      
      if (tagsError) {
        console.error('❌ 创建标签失败:', tagsError);
        // 标签创建失败不影响文章发布，只记录错误
      } else if (createdTags) {
        // 设置文章标签关联
        const tagIds = createdTags.map(tag => tag.id);
        const { error: setTagsError } = await setPostTags(postId, tagIds);
        
        if (setTagsError) {
          console.error('❌ 设置文章标签失败:', setTagsError);
          // 标签设置失败不影响文章发布，只记录错误
        } else {
          console.log('✅ 文章标签设置成功');
        }
      }
    } else {
      // 标签数组为空，清空文章的所有标签
      console.log('🗑️ 清空文章标签');
      const { error: setTagsError } = await setPostTags(postId, []);
      
      if (setTagsError) {
        console.error('❌ 清空文章标签失败:', setTagsError);
        // 标签清空失败不影响文章发布，只记录错误
      } else {
        console.log('✅ 文章标签清空成功');
      }
    }
  };

  // 显示加载状态
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载文章数据...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Header 顶部栏 */}
      <header className="h-16 flex items-center justify-between px-6 bg-white border-b shadow-sm flex-shrink-0 z-10">
        {/* 左侧：标题输入框 */}
        <div className="flex-1 flex items-center min-w-0">
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="输入文章标题..."
            className="text-2xl text-gray-900 font-bold outline-none border-none bg-transparent placeholder-gray-400 w-full min-w-0"
          />
        </div>
        {/* 右侧：功能按钮区 */}
        <div className="flex items-center gap-4 ml-8">
          <span className="text-gray-400 text-sm">文章将自动保存至草稿箱</span>
          <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200">草稿箱</button>
          <button 
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handlePublishClick}
            disabled={isPublishing}
          >
            {isPublishing ? '发布中...' : (isEditMode ? '更新' : '发布')}
          </button>
        </div>
      </header>

      {/* 错误提示 */}
      {error && (
        <div className="px-6 py-3 bg-red-50 border-b border-red-200">
          <div className="flex items-center text-red-700">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <span>{error}</span>
            <button 
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Body 主体区域 */}
      <main className="flex-1 overflow-hidden">
        <RichTextEditor
          content={content}
          onChange={setContent}
          height="calc(100vh - 64px)" // 仅减去header高度
          placeholder="请输入正文内容..."
        />
      </main>

      {/* 发布设置弹窗 */}
      {showSettings && (
        <PostSettingsModal
          title={title}
          content={content}
          onClose={() => setShowSettings(false)}
          onSubmit={handlePostSubmit}
          initialData={postData ? {
            title: postData.title,
            content: postData.content,
            categoryId: postData.category?.id || '',
            tags: postData.tags?.map((tag: any) => tag.name) || [],
            allowComment: postData.allow_comment || true,
            excerpt: postData.excerpt || '',
            coverImage: postData.featured_image || '',
            isTop: postData.is_top || false,
            seoKeywords: postData.seo_keywords || '',
            seoDescription: postData.seo_description || '',
            status: postData.status || 'draft',
          } : undefined}
        />
      )}
    </div>
  );
} 