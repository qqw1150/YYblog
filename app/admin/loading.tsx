import React from 'react';

/**
 * 管理后台加载组件
 * 用于管理后台页面的加载状态
 */
export default function AdminLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* 侧边栏骨架屏 */}
        <div className="w-64 bg-white shadow-lg min-h-screen">
          <div className="p-6">
            <div className="h-8 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="h-10 bg-gray-200 rounded-lg animate-pulse"></div>
              ))}
            </div>
          </div>
        </div>
        
        {/* 主内容区域骨架屏 */}
        <div className="flex-1 p-8">
          <div className="max-w-7xl mx-auto">
            {/* 页面标题骨架屏 */}
            <div className="h-10 bg-gray-200 rounded-lg mb-8 animate-pulse"></div>
            
            {/* 内容区域骨架屏 */}
            <div className="bg-white rounded-lg shadow p-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map(i => (
                  <div key={i} className="h-16 bg-gray-200 rounded-lg animate-pulse"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 