import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatter';
import { getArticleFeaturedImage } from '@/lib/utils/articleImageUtils';

/**
 * 分类数据类型
 */
interface Category {
  id: string;
  name: string;
  slug: string;
  count: number;
}

/**
 * 标签数据类型
 */
interface Tag {
  id: string;
  name: string;
  slug: string;
  count: number;
}

/**
 * 文章数据类型
 */
interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  featured_image: string | null;
  published_at: string | null;
  categories?: {
    id: string;
    name: string;
    slug: string;
  } | null;
}

/**
 * 博客侧边栏组件属性接口
 */
interface BlogSidebarProps {
  /** 分类列表 */
  categories: Category[];
  /** 标签列表 */
  tags: Tag[];
  /** 热门文章列表 */
  posts: Post[];
  /** 置顶文章ID（用于过滤） */
  topPostId?: string;
}

/**
 * 博客侧边栏组件
 * 服务端组件，渲染分类、标签和热门文章
 */
export default function BlogSidebar({ categories, tags, posts, topPostId }: BlogSidebarProps) {
  // 过滤掉置顶文章，只显示前3篇作为热门文章
  const popularPosts = posts
    .filter(post => !topPostId || post.id !== topPostId)
    .slice(0, 3);

  return (
    <div className="w-full md:w-1/3">
      <div className="sticky top-8">
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
            {popularPosts.map(post => (
              <div key={post.id} className="flex gap-4 group">
                <div className="flex-shrink-0">
                  <Link href={`/blog/${post.id}`} className="block relative h-20 w-20 overflow-hidden rounded-xl shadow-md border border-white">
                    <Image 
                      src={getArticleFeaturedImage(post.featured_image, post.categories?.slug, post.id)} 
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
  );
} 