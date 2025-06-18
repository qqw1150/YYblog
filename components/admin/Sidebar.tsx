'use client';

import Link from 'next/link';
import { FileText, Tag, FolderTree, Settings, LogOut, Home } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { useRouter } from 'next/navigation';

// 侧边栏导航项配置
const navItems = [
  {
    title: '管理首页',
    icon: Home,
    href: '/admin',
    description: '管理系统首页和概览'
  },
  {
    title: '文章管理',
    icon: FileText,
    href: '/admin/posts',
    description: '管理博客文章、发布和编辑'
  },
  {
    title: '标签管理',
    icon: Tag,
    href: '/admin/tags',
    description: '创建和管理文章标签'
  },
  {
    title: '分类管理',
    icon: FolderTree,
    href: '/admin/categories',
    description: '创建和管理文章分类'
  },
  {
    title: '网站管理',
    icon: Settings,
    href: '/admin/settings',
    description: '管理网站基本设置和配置'
  }
];

interface SidebarProps {
  isSidebarOpen: boolean;
}

// 侧边栏组件
export default function Sidebar({ isSidebarOpen }: SidebarProps) {
  const { user, logout } = useAuthStore();
  const router = useRouter();

  // 处理登出
  const handleLogout = async () => {
    try {
      await logout();
      router.push('/auth/login');
    } catch (error) {
      console.error('登出失败:', error);
    }
  };

  return (
    <>
      {/* 侧边栏背景遮罩 - 仅在移动端显示 */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 transition-opacity md:hidden"
        />
      )}

      {/* 侧边栏 */}
      <div
        className={`fixed inset-y-0 left-0 z-40 w-64 transform transition duration-300 ease-in-out md:translate-x-0 md:relative md:flex-shrink-0 ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ top: '4rem' }}
      >
        <div className="h-[calc(100vh-4rem)] flex flex-col bg-white shadow-lg">
          <div className="flex-1 flex flex-col overflow-y-auto">
            <nav className="flex-1 px-2 py-4 space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="group flex items-center px-3 py-3 text-sm font-medium rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                >
                  <item.icon className="mr-3 h-5 w-5 text-gray-500 group-hover:text-gray-700" />
                  {item.title}
                </Link>
              ))}
            </nav>
          </div>
          <div className="flex-shrink-0 px-4 py-4 bg-gray-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
                    {user?.avatar_url ? (
                      <img
                        src={user.avatar_url}
                        alt={user.username || '用户'}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <span className="text-sm font-medium text-gray-500">
                        {user?.username?.charAt(0)?.toUpperCase() || 'U'}
                      </span>
                    )}
                  </div>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-700">{user?.username}</p>
                  <p className="text-xs font-medium text-gray-500">{user?.role}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-md"
              >
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
} 