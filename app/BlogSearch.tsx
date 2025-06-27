'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 博客搜索组件属性接口
 */
interface BlogSearchProps {
  /** 初始搜索关键词 */
  initialSearchTerm: string;
  /** 文章总数 */
  totalPosts: number;
}

/**
 * 博客搜索组件
 * 客户端组件，处理搜索功能并更新URL参数
 */
export default function BlogSearch({ initialSearchTerm, totalPosts }: BlogSearchProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm);
  const [isSearching, setIsSearching] = useState(false);

  /**
   * 更新URL参数
   */
  const updateURL = (newSearchTerm: string, newPage: number = 1) => {
    const params = new URLSearchParams(searchParams);
    
    if (newSearchTerm) {
      params.set('search', newSearchTerm);
    } else {
      params.delete('search');
    }
    
    if (newPage > 1) {
      params.set('page', newPage.toString());
    } else {
      params.delete('page');
    }
    
    const queryString = params.toString();
    const newURL = `/${queryString ? `?${queryString}` : ''}`;
    router.push(newURL);
  };

  /**
   * 处理搜索
   */
  const handleSearch = async () => {
    setIsSearching(true);
    updateURL(searchTerm);
    setIsSearching(false);
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
   * 处理回车键搜索
   */
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  /**
   * 清空搜索
   */
  const handleClearSearch = () => {
    setSearchTerm('');
    updateURL('');
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-300">
      <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        搜索文章
      </h2>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <input
            type="text"
            placeholder="输入关键词搜索..."
            value={searchTerm}
            onChange={handleSearchInputChange}
            onKeyDown={handleKeyPress}
            className="w-full px-4 py-3 pr-20 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow transition-all duration-300"
          />
          {/* 清空按钮 */}
          {searchTerm && (
            <button
              type="button"
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
            type="submit"
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
      </form>
      {/* 搜索提示 */}
      {searchTerm && (
        <div className="mt-3 text-sm text-gray-500">
          <span>搜索关键词: </span>
          <span className="font-medium text-indigo-600">"{searchTerm}"</span>
          <span className="ml-2">找到 {totalPosts} 篇文章</span>
        </div>
      )}
    </div>
  );
} 