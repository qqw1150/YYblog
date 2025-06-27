import React from 'react';
import { ArticleListSkeleton, SidebarSkeleton } from '@/components/ui/Skeleton';

/**
 * 分类页面加载组件
 * 用于分类文章列表页面的加载状态
 */
export default function CategoryLoading() {
  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* 页面头部骨架屏 */}
      <div className="relative py-20 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="relative">
            <div className="absolute -left-8 -top-8 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            <div className="h-16 bg-gray-200 rounded-lg mb-6 animate-pulse"></div>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-xl"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded-lg max-w-3xl animate-pulse"></div>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 文章列表骨架屏 */}
          <ArticleListSkeleton />
          
          {/* 侧边栏骨架屏 */}
          <SidebarSkeleton />
        </div>
      </div>
    </div>
  );
} 