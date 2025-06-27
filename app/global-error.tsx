'use client';

import React from 'react';

/**
 * 根级别错误处理页面
 * 当根布局发生错误时显示
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl font-bold text-red-300 mb-4">🚨</div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">应用出现严重错误</h1>
            <p className="text-gray-600 mb-8 max-w-md">
              抱歉，应用遇到了一个严重错误，无法正常加载。请尝试刷新页面或联系技术支持。
            </p>
            <button 
              onClick={reset}
              className="inline-flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              重新加载应用
            </button>
          </div>
        </div>
      </body>
    </html>
  );
} 