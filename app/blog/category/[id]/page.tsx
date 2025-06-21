'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { formatDate } from '@/utils/dateFormatter';
import { getPosts, getCategoryById } from '@/lib/supabase/db';
import { getDefaultAvatarUrl, getDisplayUsername } from '@/lib/utils/avatarUtils';

// 默认图片常量
const DEFAULT_FEATURED_IMAGE = 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';

/**
 * 分类文章列表页面组件
 * 显示指定分类下的所有文章
 */
export default function CategoryPage() {
  // 获取路由参数
  const params = useParams();
  const categoryId = params.id as string; // 使用id参数，这是categoryId
  
  // 状态管理
  const [category, setCategory] = useState<{
    id: string;
    name: string;
    slug: string;
    description: string | null;
  } | null>(null);
  const [posts, setPosts] = useState<Array<any>>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // 搜索关键词状态
  const [isSearching, setIsSearching] = useState(false); // 搜索状态

  // 每页显示的文章数量
  const pageSize = 12; // 增加每页文章数量，因为现在是网格布局

  /**
   * 获取分类信息和文章列表
   */
  const fetchData = async (page = 1, search = '') => {
    try {
      setLoading(true);
      setError(null);
      
      console.log(`🔍 获取分类文章列表: ${categoryId}, 页码: ${page}, 搜索: ${search}`);
      
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
          searchTerm: search
        })
      ]);

      // 处理分类信息
      if (categoryResult.error) {
        console.error('获取分类信息失败:', categoryResult.error);
        setError('获取分类信息失败');
        return;
      }

      if (!categoryResult.data) {
        setError('分类不存在');
        return;
      }

      setCategory(categoryResult.data);

      // 处理文章列表
      if (postsResult.error) {
        console.error('获取文章列表失败:', postsResult.error);
        setError('获取文章列表失败');
        return;
      }

      setPosts(postsResult.data || []);
      setTotalPosts(postsResult.count || 0);
      setTotalPages(Math.ceil((postsResult.count || 0) / pageSize));
      
      console.log(`✅ 成功获取分类文章: ${postsResult.data?.length} 篇，总数: ${postsResult.count}`);
    } catch (err) {
      console.error('获取数据失败:', err);
      setError('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  /**
   * 处理搜索
   */
  const handleSearch = async () => {
    setIsSearching(true);
    setCurrentPage(1);
    await fetchData(1, searchTerm);
    setIsSearching(false);
  };

  /**
   * 处理分页
   */
  const handlePageChange = async (page: number) => {
    setCurrentPage(page);
    await fetchData(page, searchTerm);
  };

  /**
   * 处理搜索输入变化
   */
  const handleSearchInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  /**
   * 处理搜索表单提交
   */
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
  };

  /**
   * 清空搜索
   */
  const handleClearSearch = async () => {
    setSearchTerm('');
    setCurrentPage(1);
    await fetchData(1, '');
  };

  // 初始加载数据
  useEffect(() => {
    if (categoryId) {
      fetchData(1, '');
    }
  }, [categoryId]);

  // 如果正在加载
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="h-48 bg-gray-200 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 如果出现错误
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">出错了</h1>
            <p className="text-gray-600 mb-8">{error}</p>
            <Link 
              href="/"
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
            >
              返回博客首页
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* 页面标题 */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Link 
              href="/"
              className="inline-flex items-center text-indigo-600 hover:text-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              返回博客首页
            </Link>
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-indigo-100 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">{category?.name}</h1>
                {category?.description && (
                  <p className="text-gray-600 mt-2">{category.description}</p>
                )}
                <p className="text-sm text-gray-500 mt-1">
                  共 {totalPosts} 篇文章
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 搜索栏 */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
          <form onSubmit={handleSearchSubmit} className="flex gap-4">
            <div className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={handleSearchInputChange}
                placeholder="在分类中搜索文章..."
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <button
              type="submit"
              disabled={isSearching}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSearching ? '搜索中...' : '搜索'}
            </button>
            {searchTerm && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                清空
              </button>
            )}
          </form>
        </div>

        {/* 文章网格列表 */}
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📝</div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {searchTerm ? '没有找到相关文章' : '暂无文章'}
            </h2>
            <p className="text-gray-600">
              {searchTerm ? '请尝试其他关键词' : '这个分类还没有文章'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {posts.map(post => (
              <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
                {/* 文章封面图 */}
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={post.featured_image || DEFAULT_FEATURED_IMAGE}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {/* 分类标签 */}
                  <div className="absolute top-3 left-3">
                    <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded-full font-medium shadow-sm">
                      {category?.name}
                    </span>
                  </div>
                  {/* 发布日期 */}
                  <div className="absolute top-3 right-3">
                    <span className="text-xs bg-black/50 text-white px-2 py-1 rounded-full font-medium">
                      {post.published_at ? formatDate(post.published_at) : '未发布'}
                    </span>
                  </div>
                </div>

                {/* 文章内容 */}
                <div className="p-6">
                  <Link href={`/blog/${post.id}`} className="block">
                    <h2 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                  </Link>
                  
                  <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                    {post.excerpt}
                  </p>

                  {/* 作者信息 */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div className="flex items-center gap-2">
                      <div className="relative w-8 h-8 rounded-full overflow-hidden">
                        <Image
                          src={post.author?.avatar_url || getDefaultAvatarUrl('', post.author?.username || '')}
                          alt={post.author?.username || '作者'}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-700 truncate">
                        {post.author?.username || '匿名作者'}
                      </span>
                    </div>
                    
                    <Link 
                      href={`/blog/${post.id}`}
                      className="inline-flex items-center text-indigo-600 hover:text-indigo-700 font-medium text-sm transition-colors"
                    >
                      阅读
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* 分页 */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <nav className="flex items-center gap-2">
              {/* 上一页 */}
              <button
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                上一页
              </button>

              {/* 页码 */}
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }

                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                      currentPage === pageNum
                        ? 'bg-indigo-600 text-white'
                        : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              {/* 下一页 */}
              <button
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                下一页
              </button>
            </nav>
          </div>
        )}
      </div>
    </div>
  );
} 