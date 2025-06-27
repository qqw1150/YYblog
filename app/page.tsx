import React from 'react';
import { getCategoryStats, getTagStats, getPosts, getTopPost } from '@/lib/supabase/db';
import BlogSearch from './BlogSearch';
import BlogArticleList from './BlogArticleList';
import BlogSidebar from './BlogSidebar';

/**
 * 页面参数接口
 */
interface PageProps {
  searchParams: Promise<{ search?: string; page?: string }>;
}

/**
 * 博客首页
 * 服务端组件，负责数据获取和页面渲染
 */
export default async function BlogPage({ searchParams }: PageProps) {
  // 解包参数
  const { search: searchTerm = '', page: pageParam = '1' } = await searchParams;
  
  // 解析页码
  const currentPage = parseInt(pageParam, 10) || 1;
  const pageSize = 10; // 每页显示的文章数量

  try {
    console.log(`🔍 获取博客首页数据: 页码: ${currentPage}, 搜索: ${searchTerm}`);
    
    // 并行获取所有数据
    const [categoryStats, tagStats, postsResult, topPostResult] = await Promise.all([
      getCategoryStats(),
      getTagStats(),
      getPosts({
        status: 'published',
        pageSize,
        page: currentPage,
        orderBy: 'published_at',
        orderDirection: 'desc',
        searchTerm: searchTerm || undefined
      }),
      getTopPost()
    ]);

    // 处理数据获取错误
    if (categoryStats.error) {
      console.error('获取分类数据失败:', categoryStats.error);
    }
    if (tagStats.error) {
      console.error('获取标签数据失败:', tagStats.error);
    }
    if (postsResult.error) {
      console.error('获取文章数据失败:', postsResult.error);
      throw new Error('获取文章数据失败');
    }

    const categories = categoryStats.data || [];
    const tags = tagStats.data || [];
    const posts = postsResult.data || [];
    const totalPosts = postsResult.count || 0;
    const totalPages = Math.ceil(totalPosts / pageSize);
    const topPost = topPostResult.data;
    
    console.log(`✅ 成功获取博客首页数据: ${posts.length} 篇文章，总数: ${totalPosts}`);

    return (
      <div className="min-h-screen relative bg-gray-50">
        {/* 页面头部 */}
        <div className="relative py-20 z-10">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 mix-blend-overlay"></div>
          <div className="max-w-7xl mx-auto px-4 relative z-10">
            <div className="relative">
              <div className="absolute -left-8 -top-8 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6 drop-shadow-sm relative">博客文章</h1>
              <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-xl"></div>
            </div>
            <p className="text-gray-700 text-xl max-w-3xl font-medium">探索最新的Web开发技术、教程和最佳实践，提升您的开发技能和知识</p>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
          {/* 搜索框 */}
          <BlogSearch 
            initialSearchTerm={searchTerm} 
            totalPosts={totalPosts}
          />
          
          <div className="flex flex-col md:flex-row gap-8">
            {/* 文章列表 */}
            <BlogArticleList
              posts={posts}
              topPost={topPost}
              currentPage={currentPage}
              totalPages={totalPages}
              searchTerm={searchTerm}
            />
            
            {/* 侧边栏 */}
            <BlogSidebar
              categories={categories}
              tags={tags}
              posts={posts}
              topPostId={topPost?.id}
            />
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('博客首页加载失败:', error);
    
    return (
      <div className="min-h-screen relative bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-4">加载博客首页时发生错误</p>
          <a
            href="/"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            刷新页面
          </a>
        </div>
      </div>
    );
  }
}
