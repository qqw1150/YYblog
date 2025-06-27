'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

/**
 * 标签搜索组件属性接口
 */
interface TagSearchBoxProps {
  /** 标签ID */
  tagId: string;
  /** 标签名称 */
  tagName: string;
  /** 初始搜索关键词 */
  initialSearchTerm: string;
}

/**
 * 标签搜索组件
 * 客户端组件，处理搜索功能并更新URL参数
 */
export default function TagSearchBox({ tagId, tagName, initialSearchTerm }: TagSearchBoxProps) {
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
    
    const newURL = `/blog/tag/${tagId}?${params.toString()}`;
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
   * 清空搜索
   */
  const handleClearSearch = () => {
    setSearchTerm('');
    updateURL('');
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200">
      <form onSubmit={handleSearchSubmit} className="flex gap-4">
        <div className="flex-1 relative">
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearchInputChange}
            placeholder={`在标签 #${tagName} 中搜索文章...`}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
          />
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <button
          type="submit"
          disabled={isSearching}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
  );
} 