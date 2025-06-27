import React from 'react';
import Link from 'next/link';

/**
 * 标签头部组件属性接口
 */
interface TagHeaderProps {
  /** 标签名称 */
  tagName: string;
  /** 文章总数 */
  totalPosts: number;
}

/**
 * 标签页面头部组件
 * 显示标签信息和返回链接
 */
export default function TagHeader({ tagName, totalPosts }: TagHeaderProps) {
  return (
    <div className="mb-8">
      {/* 返回链接 */}
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
      
      {/* 标签信息卡片 */}
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">#{tagName}</h1>
            <p className="text-sm text-gray-500 mt-1">
              共 {totalPosts} 篇文章
            </p>
          </div>
        </div>
      </div>
    </div>
  );
} 