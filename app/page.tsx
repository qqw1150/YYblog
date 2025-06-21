'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatter';
import { getCategoryStats, getTagStats, getPosts, getTopPost } from '@/lib/supabase/db';
import { getDefaultAvatarUrl, getDisplayUsername } from '@/lib/utils/avatarUtils';

// 默认图片常量
const DEFAULT_FEATURED_IMAGE = 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';

/**
 * 博客页面组件
 * 使用客户端组件实现分页功能和搜索功能
 */
export default function BlogPage() {
  // 状态管理
  const [categories, setCategories] = useState<Array<{ id: string; name: string; slug: string; count: number }>>([]);
  const [tags, setTags] = useState<Array<{ id: string; name: string; slug: string; count: number }>>([]);
  const [posts, setPosts] = useState<Array<any>>([]);
  const [topPost, setTopPost] = useState<any>(null); // 置顶文章状态
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState(''); // 搜索关键词状态
  const [isSearching, setIsSearching] = useState(false); // 搜索状态

  // 每页显示的文章数量
  const pageSize = 10;

  // 获取数据的函数
  const fetchData = async (page = 1, search = '') => {
    try {
      setLoading(true);
      
      // 并行获取分类、标签和文章数据
      const [categoryStats, tagStats, postsResult] = await Promise.all([
        getCategoryStats(),
        getTagStats(),
        getPosts({ 
          status: 'published', 
          pageSize,
          page,
          orderBy: 'published_at', 
          orderDirection: 'desc',
          searchTerm: search // 添加搜索参数
        })
      ]);

      console.log('categoryStats',categoryStats);

      // 处理数据获取错误
      if (categoryStats.error) {
        console.error('获取分类数据失败:', categoryStats.error);
      }
      if (tagStats.error) {
        console.error('获取标签数据失败:', tagStats.error);
      }
      if (postsResult.error) {
        console.error('获取文章数据失败:', postsResult.error);
        setError('获取文章数据失败');
        return;
      }

      // 更新状态
      setCategories(categoryStats.data || []);
      setTags(tagStats.data || []);
      setPosts(postsResult.data || []);
      setTotalPosts(postsResult.count || 0);
      setTotalPages(Math.ceil((postsResult.count || 0) / pageSize));
      setError(null);
    } catch (err) {
      console.error('获取数据失败:', err);
      setError('获取数据失败');
    } finally {
      setLoading(false);
    }
  };

  // 获取置顶文章的函数
  const fetchTopPost = async () => {
    try {
      const { data, error } = await getTopPost();
      if (error) {
        console.error('获取置顶文章失败:', error);
      } else {
        setTopPost(data);
      }
    } catch (err) {
      console.error('获取置顶文章异常:', err);
    }
  };

  // 初始加载数据
  useEffect(() => {
    const loadInitialData = async () => {
      await Promise.all([
        fetchData(1, ''),
        fetchTopPost()
      ]);
    };
    loadInitialData();
  }, []);

  // 分页处理函数
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
      fetchData(page, searchTerm);
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // 搜索处理函数
  const handleSearch = async () => {
    if (isSearching) return; // 防止重复搜索
    
    try {
      setIsSearching(true);
      setCurrentPage(1); // 重置到第一页
      await fetchData(1, searchTerm.trim());
      // 滚动到页面顶部
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('搜索失败:', err);
      setError('搜索失败');
    } finally {
      setIsSearching(false);
    }
  };

  // 回车键搜索
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // 清空搜索
  const handleClearSearch = () => {
    setSearchTerm('');
    setCurrentPage(1);
    fetchData(1, '');
  };

  // 生成分页按钮
  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisiblePages = 5;
    
    // 计算显示的页码范围
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // 调整起始页，确保显示足够的按钮
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // 上一页按钮
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-300 flex items-center"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        上一页
      </button>
    );

    // 页码按钮
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2.5 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
            i === currentPage
              ? 'border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
              : 'border-gray-200 text-gray-700 bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
          }`}
        >
          {i}
        </button>
      );
    }

    // 下一页按钮
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed"
      >
        下一页
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return buttons;
  };

  // 加载状态
  if (loading && posts.length === 0) {
    return (
      <div className="min-h-screen relative bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">正在加载文章...</p>
        </div>
      </div>
    );
  }

  // 错误状态
  if (error) {
    return (
      <div className="min-h-screen relative bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">加载失败</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => fetchData(currentPage)}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            重试
          </button>
        </div>
      </div>
    );
  }

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
        <div className="flex flex-col md:flex-row gap-8">
          {/* 文章列表 */}
          <div className="w-full md:w-2/3">
            {/* 置顶文章 */}
            {topPost && currentPage === 1 && (
            <div className="mb-12">
                <Link href={`/blog/${topPost.id}`} className="block group">
                <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-300">
                  <Image 
                      src={topPost.featured_image || DEFAULT_FEATURED_IMAGE} 
                      alt={topPost.title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-10 text-white">
                      <div className="mb-4 flex items-center gap-3">
                        <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-4 py-2 rounded-full font-medium shadow-lg border border-white/30">
                          {topPost.categories?.name || '未分类'}
                        </span>
                        {topPost.is_top && (
                          <span className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-xs px-3 py-1.5 rounded-full font-medium shadow-lg border border-white/30 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            置顶
                          </span>
                        )}
                    </div>
                      <h2 className="text-3xl md:text-5xl font-bold mb-4 group-hover:text-indigo-300 transition-colors duration-300 drop-shadow-md">{topPost.title}</h2>
                      <p className="mb-6 text-white/90 text-xl max-w-3xl leading-relaxed drop-shadow-sm">{topPost.excerpt}</p>
                    <div className="flex items-center mt-6 bg-black/30 p-3 rounded-xl backdrop-blur-sm max-w-max border border-white/30">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-70"></div>
                        <Image 
                            src={topPost.author?.avatar_url || getDefaultAvatarUrl('', '作者')} 
                            alt={topPost.author?.username || '作者'}
                          width={50} 
                          height={50} 
                          className="rounded-full mr-4 border-2 border-white relative"
                        />
                      </div>
                      <div>
                          <p className="font-medium text-lg">{topPost.author?.username || '未知作者'}</p>
                          <p className="text-sm text-white/80">{topPost.published_at ? formatDate(topPost.published_at) : '未发布'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            )}
            
            {/* 文章列表 */}
            <div className="grid grid-cols-1 gap-10">
              {posts.map(post => (
                <article key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative overflow-hidden">
                      <Link href={`/blog/${post.id}`} className="block relative h-60 md:h-full w-full">
                        <Image 
                          src={post.featured_image || DEFAULT_FEATURED_IMAGE} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                    <div className="md:w-3/5 p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <Link 
                          href={`/blog/category/${post.categories?.id || 'uncategorized'}`}
                          className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-medium transition-all shadow-sm hover:shadow border border-indigo-300"
                        >
                          {post.categories?.name || '未分类'}
                        </Link>
                        <span className="flex items-center text-gray-500 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {post.published_at ? formatDate(post.published_at) : '未发布'}
                        </span>
                      </div>
                      <Link href={`/blog/${post.id}`} className="block">
                        <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">{post.title}</h2>
                      </Link>
                      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-300">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <Image 
                              src={post.author?.avatar_url || getDefaultAvatarUrl('', '作者')} 
                              alt={post.author?.username || '作者'}
                              width={36} 
                              height={36} 
                              className="rounded-full mr-3 border-2 border-white relative shadow-sm"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{post.author?.username || '未知作者'}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center group/views hover:text-indigo-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 group-hover/views:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            0
                          </div>
                          <div className="flex items-center group/comments hover:text-indigo-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 group-hover/comments:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            0
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {/* 分页 */}
            {posts.length > 0 && totalPages > 1 && (
            <div className="mt-16 flex justify-center">
              <div className="flex space-x-3">
                  {renderPaginationButtons()}
                </div>
              </div>
            )}

            {/* 无文章时的提示 */}
            {posts.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="text-gray-400 text-6xl mb-4">
                  {searchTerm ? '🔍' : '📝'}
                </div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  {searchTerm ? '未找到相关文章' : '暂无文章'}
                </h3>
                <p className="text-gray-600">
                  {searchTerm 
                    ? `没有找到包含"${searchTerm}"的文章，请尝试其他关键词。`
                    : '还没有发布任何文章，请稍后再来查看。'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={handleClearSearch}
                    className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    清空搜索
                </button>
                )}
              </div>
            )}
          </div>
          
          {/* 侧边栏 */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-8">
              {/* 搜索框 */}
              <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  搜索文章
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="输入关键词搜索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow transition-all duration-300"
                  />
                  {/* 清空按钮 */}
                  {searchTerm && (
                    <button
                      onClick={handleClearSearch}
                      className="absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                      title="清空搜索"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                  {/* 搜索按钮 */}
                  <button
                    onClick={handleSearch}
                    disabled={isSearching}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md border border-white/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    title="搜索文章"
                  >
                    {isSearching ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    )}
                  </button>
                </div>
                {/* 搜索提示 */}
                {searchTerm && (
                  <div className="mt-3 text-sm text-gray-500">
                    <span>搜索关键词: </span>
                    <span className="font-medium text-indigo-600">"{searchTerm}"</span>
                    <span className="ml-2">找到 {totalPosts} 篇文章</span>
                  </div>
                )}
              </div>
              
              {/* 分类 */}
              <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  文章分类
                </h2>
                <ul className="space-y-3">
                  {categories.map(category => (
                    <li key={category.id}>
                      <Link
                        href={`/blog/category/${category.id}`}
                        className="group flex justify-between items-center py-2.5 px-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 border border-transparent hover:border-indigo-300"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{category.name}</span>
                        {category.count > 0 ? (
                          <span className="inline-flex items-center justify-center min-w-[24px] h-[24px] px-2 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full border border-indigo-300 group-hover:bg-indigo-200 group-hover:text-indigo-700 group-hover:border-indigo-400 transition-all duration-300">
                          {category.count}
                        </span>
                        ) : (
                          <span className="inline-flex items-center justify-center min-w-[24px] h-[24px] px-2 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full border border-indigo-300 group-hover:bg-indigo-200 group-hover:text-indigo-700 group-hover:border-indigo-400 transition-all duration-300">0</span>
                        )}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* 标签云 */}
              <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  热门标签
                </h2>
                <div className="flex flex-wrap gap-2">
                  {tags.map(tag => (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.id}`}
                      className="group relative bg-gray-50 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 px-3 py-1.5 rounded-full text-sm border border-gray-300 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow hover:scale-105"
                    >
                      #{tag.name}
                      {tag.count > 0 && (
                        <span className="ml-1.5 inline-flex items-center justify-center min-w-[18px] h-[18px] px-1.5 text-xs font-medium bg-indigo-100 text-indigo-600 rounded-full border border-indigo-200 group-hover:bg-indigo-200 group-hover:text-indigo-700 group-hover:border-indigo-300 transition-all duration-300">
                          {tag.count}
                        </span>
                      )}
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* 热门文章 */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-xl shadow-xl border border-indigo-300">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  热门文章
                </h2>
                <div className="space-y-6">
                  {posts
                    .filter(post => !topPost || post.id !== topPost.id) // 过滤掉置顶文章
                    .slice(0, 3)
                    .map(post => (
                    <div key={post.id} className="flex gap-4 group">
                      <div className="flex-shrink-0">
                        <Link href={`/blog/${post.id}`} className="block relative h-20 w-20 overflow-hidden rounded-xl shadow-md border border-white">
                          <Image 
                            src={post.featured_image || DEFAULT_FEATURED_IMAGE} 
                            alt={post.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-110 duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                      </div>
                      <div className="flex-grow">
                        <Link href={`/blog/${post.id}`} className="block group-hover:text-indigo-600 transition-colors">
                          <h3 className="font-medium line-clamp-2 text-gray-900 group-hover:text-indigo-600">{post.title}</h3>
                        </Link>
                        <p className="text-gray-500 text-xs mt-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {post.published_at ? formatDate(post.published_at) : '未发布'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
