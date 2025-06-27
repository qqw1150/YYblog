import React from 'react';
import { notFound } from 'next/navigation';
import { getPosts, getTagById } from '@/lib/supabase/db';
import TagHeader from './TagHeader';
import TagSearchBox from './TagSearchBox';
import TagPostList from './TagPostList';

/**
 * 页面参数接口
 */
interface PageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ search?: string; page?: string }>;
}

/**
 * 标签文章列表页面
 * 服务端组件，负责数据获取和页面渲染
 */
export default async function TagPage({ params, searchParams }: PageProps) {
  // 解包参数
  const { id: tagId } = await params;
  const { search: searchTerm = '', page: pageParam = '1' } = await searchParams;
  
  // 解析页码
  const currentPage = parseInt(pageParam, 10) || 1;
  const pageSize = 12; // 每页显示的文章数量

  try {
    console.log(`🔍 获取标签文章列表: ${tagId}, 页码: ${currentPage}, 搜索: ${searchTerm}`);
    
    // 并行获取标签信息和文章列表
    const [tagResult, postsResult] = await Promise.all([
      getTagById(tagId),
      getPosts({
        pageSize,
        page: currentPage,
        orderBy: 'published_at',
        orderDirection: 'desc',
        status: 'published',
        tagId: tagId,
        searchTerm: searchTerm || undefined
      })
    ]);

    // 处理标签信息
    if (tagResult.error) {
      console.error('获取标签信息失败:', tagResult.error);
      notFound();
    }

    if (!tagResult.data) {
      console.error('标签不存在:', tagId);
      notFound();
    }

    const tag = tagResult.data;

    // 处理文章列表
    if (postsResult.error) {
      console.error('获取文章列表失败:', postsResult.error);
      throw new Error('获取文章列表失败');
    }

    const posts = postsResult.data || [];
    const totalPosts = postsResult.count || 0;
    const totalPages = Math.ceil(totalPosts / pageSize);
    
    console.log(`✅ 成功获取标签文章: ${posts.length} 篇，总数: ${totalPosts}`);

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面头部 */}
          <TagHeader 
            tagName={tag.name} 
            totalPosts={totalPosts} 
          />

          {/* 搜索栏 - 客户端组件 */}
          <TagSearchBox 
            tagId={tagId}
            tagName={tag.name}
            initialSearchTerm={searchTerm}
          />

          {/* 文章列表 - 服务端渲染 */}
          <TagPostList
            posts={posts}
            tag={tag}
            currentPage={currentPage}
            totalPages={totalPages}
            totalPosts={totalPosts}
            searchTerm={searchTerm}
          />
        </div>
      </div>
    );
  } catch (error) {
    console.error('标签页面加载失败:', error);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">出错了</h1>
            <p className="text-gray-600 mb-8">加载标签页面时发生错误</p>
            <a 
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              返回博客首页
            </a>
          </div>
        </div>
      </div>
    );
  }
} 