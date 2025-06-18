'use client';

import { Menu, X } from 'lucide-react';

interface HeaderProps {
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
}

// 顶部导航栏组件
export default function Header({ isSidebarOpen, toggleSidebar }: HeaderProps) {
  return (
    <div className="fixed top-0 left-0 right-0 h-16 z-50">
      <div className="h-full bg-gradient-to-r from-blue-600 to-blue-800">
        <div className="px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex items-center justify-between h-full">
            <div className="flex items-center">
              <button
                type="button"
                onClick={toggleSidebar}
                className="inline-flex items-center justify-center p-2 rounded-md text-blue-100 hover:text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 md:hidden"
              >
                <span className="sr-only">打开侧边栏</span>
                {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <h1 className="text-xl font-bold text-white">博客管理系统</h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 