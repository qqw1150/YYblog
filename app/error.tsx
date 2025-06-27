'use client';

import React from 'react';
import Link from 'next/link';

/**
 * 全局错误处理页面
 * 当应用发生运行时错误时显示
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-6xl font-bold text-red-300 mb-4">⚠️</div>
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">出现了一些问题</h1>
        <p className="text-gray-600 mb-4 max-w-md">
          抱歉，应用遇到了一个意外错误。我们的团队已经收到通知，正在努力修复这个问题。
        </p>
        {process.env.NODE_ENV === 'development' && (
          <details className="mb-6 text-left max-w-md mx-auto">
            <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
              错误详情（仅开发环境显示）
            </summary>
            <pre className="mt-2 p-3 bg-gray-100 rounded text-xs text-red-600 overflow-auto">
              {error.message}
              {error.stack && (
                <>
                  {'\n'}
                  {error.stack}
                </>
              )}
            </pre>
          </details>
        )}
        <div className="space-x-4">
          <button 
            onClick={reset}
            className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            重试
          </button>
          <Link 
            href="/"
            className="inline-flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            返回首页
          </Link>
        </div>
      </div>
    </div>
  );
} 