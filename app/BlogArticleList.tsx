import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatter';
import { DEFAULT_AVATAR_URL } from '@/lib/utils/avatarUtils';
import { getArticleFeaturedImage } from '@/lib/utils/articleImageUtils';

/**
 * 文章数据类型
 */
interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  is_top?: boolean;
  author?: {
    id: string;
    username: string;
    avatar_url: string;
  } | null;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

/**
 * 博客文章列表组件属性接口
 */
interface BlogArticleListProps {
  /** 文章列表 */
  posts: Post[];
  /** 置顶文章 */
  topPost: Post | null;
  /** 当前页码 */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 搜索关键词 */
  searchTerm: string;
}

/**
 * 博客文章列表组件
 * 服务端组件，渲染置顶文章和文章列表
 */
export default function BlogArticleList({
  posts,
  topPost,
  currentPage,
  totalPages,
  searchTerm
}: BlogArticleListProps) {
  /**
   * 生成分页链接
   */
  const generatePageLink = (page: number) => {
    const params = new URLSearchParams();
    if (searchTerm) {
      params.set('search', searchTerm);
    }
    if (page > 1) {
      params.set('page', page.toString());
    }
    const queryString = params.toString();
    return `/${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <div className="w-full md:w-2/3">
      {/* 置顶文章 */}
      {topPost && currentPage === 1 && (
        <div className="mb-12">
          <Link href={`/blog/${topPost.id}`} className="block group">
            <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-300">
              <Image 
                src={getArticleFeaturedImage(topPost.featured_image, topPost.categories?.slug, topPost.id)} 
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
                      src={topPost.author?.avatar_url || DEFAULT_AVATAR_URL} 
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
      {posts.length === 0 ? (
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
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-10">
          {posts.map(post => (
            <article key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-300">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-2/5 relative overflow-hidden">
                  <Link href={`/blog/${post.id}`} className="block relative h-60 md:h-full w-full">
                    <Image 
                      src={getArticleFeaturedImage(post.featured_image, post.categories?.slug, post.id)} 
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
                          src={post.author?.avatar_url || DEFAULT_AVATAR_URL} 
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
      )}
      
      {/* 分页 */}
      {posts.length > 0 && totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <nav className="flex space-x-3">
            {/* 上一页 */}
            <Link
              href={generatePageLink(currentPage - 1)}
              className={`px-5 py-2.5 border border-gray-200 rounded-lg text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-300 flex items-center ${
                currentPage === 1
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-500 bg-white hover:bg-gray-50'
              }`}
              aria-disabled={currentPage === 1}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              上一页
            </Link>

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
                <Link
                  key={pageNum}
                  href={generatePageLink(pageNum)}
                  className={`px-4 py-2.5 border rounded-lg shadow-md hover:shadow-lg transition-all duration-300 ${
                    pageNum === currentPage
                      ? 'border-transparent bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700'
                      : 'border-gray-200 text-gray-700 bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {/* 下一页 */}
            <Link
              href={generatePageLink(currentPage + 1)}
              className={`px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300 flex items-center disabled:opacity-50 disabled:cursor-not-allowed ${
                currentPage === totalPages
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-700 bg-white hover:bg-gray-50'
              }`}
              aria-disabled={currentPage === totalPages}
            >
              下一页
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
} 