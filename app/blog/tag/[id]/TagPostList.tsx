import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatter';
import { DEFAULT_AVATAR_URL } from '@/lib/utils/avatarUtils';
import { getArticleFeaturedImage } from '@/lib/utils/articleImageUtils';

/**
 * 标签数据类型
 */
interface Tag {
  id: string;
  name: string;
  slug: string;
}

/**
 * 文章数据类型 - 与数据库返回的类型保持一致
 */
interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
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
 * 标签文章列表组件属性接口
 */
interface TagPostListProps {
  /** 文章列表 */
  posts: Post[];
  /** 标签信息 */
  tag: Tag;
  /** 当前页码 */
  currentPage: number;
  /** 总页数 */
  totalPages: number;
  /** 文章总数 */
  totalPosts: number;
  /** 搜索关键词 */
  searchTerm: string;
}

/**
 * 标签文章列表组件
 * 服务端组件，渲染文章列表和分页
 */
export default function TagPostList({
  posts,
  tag,
  currentPage,
  totalPages,
  totalPosts,
  searchTerm
}: TagPostListProps) {
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
    return `/blog/tag/${tag.id}${queryString ? `?${queryString}` : ''}`;
  };

  return (
    <>
      {/* 文章网格列表 */}
      {posts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">📝</div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? '没有找到相关文章' : '暂无文章'}
          </h2>
          <p className="text-gray-600">
            {searchTerm ? '请尝试其他关键词' : `标签 #${tag.name} 还没有文章`}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {posts.map(post => (
            <article key={post.id} className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group">
              {/* 文章封面图 */}
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={getArticleFeaturedImage(post.featured_image, post.categories?.slug, post.id)}
                  alt={post.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {/* 标签 */}
                <div className="absolute top-3 left-3">
                  <span className="text-xs bg-purple-600 text-white px-2 py-1 rounded-full font-medium shadow-sm">
                    #{tag.name}
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
                  <h2 className="text-lg font-bold mb-3 text-gray-900 group-hover:text-purple-600 transition-colors line-clamp-2">
                    {post.title}
                  </h2>
                </Link>
                
                <p className="text-gray-600 mb-4 line-clamp-3 text-sm leading-relaxed">
                  {post.excerpt}
                </p>

                {/* 作者信息 */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2">
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/40 to-indigo-500/40 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                      <Image
                        src={post.author?.avatar_url || DEFAULT_AVATAR_URL}
                        alt={post.author?.username || '作者'}
                        width={32}
                        height={32}
                        className="rounded-full border-2 border-white relative shadow-sm"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 truncate">
                      {post.author?.username || '匿名作者'}
                    </span>
                  </div>
                  
                  <Link 
                    href={`/blog/${post.id}`}
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 font-medium text-sm transition-colors"
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
            <Link
              href={generatePageLink(currentPage - 1)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === 1
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              aria-disabled={currentPage === 1}
            >
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
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-purple-600 text-white'
                      : 'text-gray-700 bg-white border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {pageNum}
                </Link>
              );
            })}

            {/* 下一页 */}
            <Link
              href={generatePageLink(currentPage + 1)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                currentPage === totalPages
                  ? 'text-gray-400 bg-gray-100 cursor-not-allowed'
                  : 'text-gray-500 bg-white border border-gray-300 hover:bg-gray-50'
              }`}
              aria-disabled={currentPage === totalPages}
            >
              下一页
            </Link>
          </nav>
        </div>
      )}
    </>
  );
} 