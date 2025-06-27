import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import MarkdownRenderer from '@/components/blog/MarkdownRenderer';
import { formatDateTime } from '@/utils/dateFormatter';
import { getPostWithTags } from '@/lib/supabase/db/posts';
import { DEFAULT_AVATAR_URL } from '@/lib/utils/avatarUtils';
import { getArticleFeaturedImage } from '@/lib/utils/articleImageUtils';
import { notFound } from 'next/navigation';

// 定义文章详情页面的数据类型
interface PostWithTags {
  id: string;
  title: string;
  content: string;
  excerpt: string | null;
  featured_image: string | null;
  status: string;
  published_at: string;
  seo_keywords: string | null;
  seo_description: string | null;
  allow_comment: boolean;
  is_top: boolean;
  author: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
  category: {
    id: string;
    name: string;
  };
  tags: Array<{
    id: string;
    name: string;
  }>;
  views?: number;
  likes?: number;
  comments_count?: number;
}

/**
 * 博客文章详情页面组件
 * 服务端组件，在服务端获取文章数据并渲染
 */
export default async function BlogPostPage({ params }: { params: { id: string } }) {
  // 从 params 直接获取文章 ID
  const { id } = params;
  
  // 在服务端获取文章数据
  const { data: post, error } = await getPostWithTags(id);
  
  // 如果获取失败或文章不存在，返回 404
  if (error || !post) {
    console.error('获取文章失败:', error);
    notFound();
  }
  
  // 确保作者信息有默认值
  const authorName = post.author.username || '匿名用户';
  const authorAvatar = post.author.avatar_url || DEFAULT_AVATAR_URL;

  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* 文章头部背景 */}
      <div className="relative pt-20 pb-24 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          <Link 
            href="/" 
            className="inline-flex items-center text-indigo-600 hover:text-indigo-800 mb-8 transition bg-white/90 px-4 py-1.5 rounded-full shadow-md hover:shadow-lg transform hover:translate-x-1 hover:scale-105 duration-300"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            返回文章列表
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mb-6 drop-shadow-sm leading-tight">{post.title}</h1>
          
          {/* 文章元信息 */}
          <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-8 gap-3 sm:gap-4 bg-white/90 p-4 rounded-xl shadow-md backdrop-blur-sm border border-gray-300">
            <div className="flex items-center">
              <div className="relative mr-3">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
                <Image 
                  src={authorAvatar} 
                  alt={authorName}
                  width={44} 
                  height={44} 
                  className="rounded-full border-2 border-white shadow-md relative"
                />
              </div>
              <span className="font-medium">{authorName}</span>
            </div>
            <span className="hidden sm:inline text-gray-400">•</span>
            <time dateTime={post.published_at} className="flex items-center text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              {formatDateTime(post.published_at)}
            </time>
            <span className="hidden sm:inline text-gray-400">•</span>
            <span className="bg-gradient-to-r from-indigo-500/90 to-purple-500/90 text-white px-3 py-1 rounded-md text-sm shadow-md border border-white/30">{post.category.name}</span>
          </div>
          
          {/* 标签 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {post.tags.map((tag: { id: string; name: string }) => (
              <Link 
                key={tag.id} 
                href={`/blog/tag/${tag.id}`}
                className="bg-white/90 hover:bg-white text-gray-700 px-4 py-1.5 rounded-full text-sm border border-gray-300 transition-all duration-300 shadow-md hover:shadow-lg hover:scale-105 hover:text-indigo-600 hover:border-indigo-400"
              >
                #{tag.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        {/* 特色图片 */}
        <div className="mb-8 relative h-[400px] w-full rounded-xl overflow-hidden shadow-xl transform transition-all duration-300 hover:scale-[1.01] hover:shadow-2xl border border-gray-300">
          <Image 
            src={getArticleFeaturedImage(post.featured_image, post.category?.slug, post.id)}
            alt={post.title}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
        </div>
        
        {/* 文章内容 */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl mb-10 border border-gray-300 relative">
          <div className="absolute top-4 right-4 md:top-6 md:right-6 bg-gradient-to-r from-indigo-100 to-purple-100 p-2 rounded-lg shadow-sm border border-indigo-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </div>
          <article className="prose prose-lg md:prose-xl max-w-none 
            prose-headings:text-gray-900 prose-headings:font-bold prose-headings:mb-6
            prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-5 prose-h2:border-b prose-h2:border-gray-300 prose-h2:pb-2
            prose-h3:text-xl prose-h3:text-indigo-800 prose-h3:mt-8
            prose-p:text-gray-700 prose-p:leading-relaxed 
            prose-a:text-indigo-600 prose-a:no-underline hover:prose-a:underline prose-a:font-medium
            prose-img:rounded-xl prose-img:shadow-lg prose-img:my-10
            prose-code:text-pink-600 prose-code:bg-pink-50 prose-code:px-2 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
            prose-pre:bg-gray-900 prose-pre:text-gray-100 prose-pre:rounded-xl prose-pre:p-6 prose-pre:shadow-lg
            prose-blockquote:border-l-indigo-500 prose-blockquote:border-l-4 prose-blockquote:pl-6 prose-blockquote:italic prose-blockquote:bg-indigo-50/50 prose-blockquote:py-2 prose-blockquote:pr-4 prose-blockquote:rounded-r-lg
            prose-strong:text-indigo-700 prose-strong:font-semibold
            prose-ul:marker:text-indigo-600 prose-li:my-2
          ">
            <MarkdownRenderer content={post.content} />
          </article>
        </div>
        
        {/* 文章底部信息 */}
        <div className="bg-white rounded-xl p-6 shadow-xl mb-8 border border-gray-300 transform transition-all duration-300 hover:shadow-2xl">
          <div className="border-t border-gray-300 pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <div className="flex items-center text-gray-700 group hover:text-indigo-600 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 group-hover:text-indigo-500 mr-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  <span>{post.views || 0} 阅读</span>
                </div>
                <div className="flex items-center text-gray-700 group hover:text-rose-600 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-rose-400 group-hover:text-rose-500 mr-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  <span>{post.likes || 0} 赞</span>
                </div>
                <div className="flex items-center text-gray-700 group hover:text-indigo-600 transition-all">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-400 group-hover:text-indigo-500 mr-1 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                  </svg>
                  <span>{post.comments_count || 0} 评论</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:shadow-md border border-indigo-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                  分享
                </button>
                <button className="bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 rounded-lg flex items-center transition-all duration-300 hover:shadow-md border border-rose-200">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  点赞
                </button>
              </div>
            </div>
          </div>
        </div>
        
        {/* 作者信息 */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 mb-12 shadow-xl border border-indigo-300 transform transition-all duration-300 hover:shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="relative">
              <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-30"></div>
              <Image 
                src={authorAvatar} 
                alt={authorName}
                width={90} 
                height={90} 
                className="rounded-full relative border-4 border-white shadow-lg"
              />
            </div>
            <div className="text-center sm:text-left">
              <h3 className="font-bold text-2xl text-gray-900 mb-2">{authorName}</h3>
              <p className="text-gray-700 mb-4 max-w-md">资深前端开发工程师，热衷于分享Web开发技术和最佳实践。</p>
              <button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2 rounded-lg text-sm transition-all duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-white/30">
                关注作者
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
