'use client';

import { useState } from 'react';
import ZustandAuthGuard from '@/components/admin/ZustandAuthGuard';
import Header from '@/components/admin/Header';
import Sidebar from '@/components/admin/Sidebar';
import { usePathname } from 'next/navigation';

/**
 * 管理端布局组件
 * 使用 ZustandAuthGuard 保护所有管理端页面
 * 只有管理员角色可以访问
 */
export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // 控制移动端侧边栏显示状态
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // 获取当前路由路径
  const pathname = usePathname();

  // 判断是否为新增或编辑文章页
  const isPostEditPage =
    pathname === '/admin/posts/new' ||
    /^\/admin\/posts\/[^/]+$/.test(pathname);

  // 切换侧边栏显示状态
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <ZustandAuthGuard requiredRole="admin">
      {isPostEditPage ? (
        // 新增或编辑文章页只渲染内容
        <div className="min-h-screen bg-gray-100 flex flex-col">
          <main className="flex-1">{children}</main>
        </div>
      ) : (
        <div className="flex h-screen bg-gray-100">
          <Sidebar isSidebarOpen={isSidebarOpen} />
          <div className="flex flex-col flex-1 overflow-hidden">
            <Header isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            <main className="flex-1 overflow-y-auto p-4 pt-16 mt-4">
              {children}
            </main>
          </div>
        </div>
      )}
    </ZustandAuthGuard>
  );
}