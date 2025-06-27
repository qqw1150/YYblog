import React from 'react';
import { notFound } from 'next/navigation';
import { getPosts, getCategoryById } from '@/lib/supabase/db';
import { FALLBACK_IMAGE_URL } from '@/lib/utils/articleImageUtils';
import CategorySearch from './CategorySearch';
import CategoryArticleList from './CategoryArticleList';

// 页面参数类型
interface PageProps {
  params: { id: string };
  searchParams: { 
    page?: string; 
    search?: string; 
  };
}

/**
 * 分类文章列表页面组件
 * 服务端组件，支持URL参数进行搜索和分页
 */
export default async function CategoryPage({ params, searchParams }: PageProps) {
  // 从 params 获取分类 ID
  const categoryId = params.id;
  
  // 从 URL 参数获取搜索和分页信息
  const page = parseInt(searchParams.page || '1');
  const searchTerm = searchParams.search || '';
  
  // 每页显示的文章数量
  const pageSize = 12;
  
  try {
    console.log(`🔍 服务端获取分类文章列表: ${categoryId}, 页码: ${page}, 搜索: ${searchTerm}`);
    
    // 并行获取分类信息和文章列表
    const [categoryResult, postsResult] = await Promise.all([
      getCategoryById(categoryId),
      getPosts({
        pageSize,
        page,
        orderBy: 'published_at',
        orderDirection: 'desc',
        status: 'published',
        categoryId: categoryId,
        searchTerm: searchTerm
      })
    ]);

    // 处理分类信息
    if (categoryResult.error || !categoryResult.data) {
      console.error('获取分类信息失败:', categoryResult.error);
      notFound();
    }

    // 处理文章列表
    if (postsResult.error) {
      console.error('获取文章列表失败:', postsResult.error);
      notFound();
    }

    const category = categoryResult.data;
    const posts = postsResult.data || [];
    const totalPosts = postsResult.count || 0;
    const totalPages = Math.ceil(totalPosts / pageSize);
    
    console.log(`✅ 服务端成功获取分类文章: ${posts.length} 篇，总数: ${totalPosts}`);
    
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* 页面标题 */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-4">
              <a 
                href="/"
                className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                返回博客首页
              </a>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-indigo-100 rounded-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">{category.name}</h1>
                  {category.description && (
                    <p className="text-gray-600 mt-2">{category.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-1">
                    共 {totalPosts} 篇文章
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* 搜索栏 - 客户端组件 */}
          <CategorySearch 
            categoryId={categoryId}
            initialSearchTerm={searchTerm}
          />

          {/* 文章列表 - 服务端渲染 */}
          <CategoryArticleList
            posts={posts}
            category={category}
            currentPage={page}
            totalPages={totalPages}
            totalPosts={totalPosts}
            searchTerm={searchTerm}
            defaultFeaturedImage={FALLBACK_IMAGE_URL}
          />
        </div>
      </div>
    );
    
  } catch (error) {
    console.error('服务端获取数据失败:', error);
    notFound();
  }
} 