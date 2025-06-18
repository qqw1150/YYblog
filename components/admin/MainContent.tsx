'use client';

import Link from 'next/link';
import { FileText, Tag, FolderTree, Settings, ChevronRight } from 'lucide-react';

// 导航项配置
const navItems = [
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

// 主要内容区域组件
export default function MainContent() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto pt-16">
        <div className="py-6">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            <h1 className="text-2xl font-semibold text-gray-900 mb-6">管理控制台</h1>
          </div>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
            {/* 功能卡片区域 */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="block bg-white overflow-hidden rounded-lg shadow-sm hover:shadow-md transition-all duration-200"
                >
                  <div className="p-6">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 bg-blue-50 rounded-md p-3">
                        <item.icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <div className="ml-4">
                        <h3 className="text-lg font-medium text-gray-900">{item.title}</h3>
                      </div>
                    </div>
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <div className="mt-5 flex items-center text-sm text-blue-600">
                      <span>进入管理</span>
                      <ChevronRight className="ml-1 h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {/* 最近活动区域 */}
            <div className="mt-8">
              <h2 className="text-lg font-medium text-gray-900 mb-4">最近活动</h2>
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {[...Array(3)].map((_, i) => (
                    <li key={i}>
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <p className="text-sm font-medium text-blue-600 truncate">
                            {i === 0 ? '发布了新文章' : i === 1 ? '更新了网站设置' : '添加了新标签'}
                          </p>
                          <div className="ml-2 flex-shrink-0 flex">
                            <p className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                              {i === 0 ? '文章' : i === 1 ? '设置' : '标签'}
                            </p>
                          </div>
                        </div>
                        <div className="mt-2 flex justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              {i === 0 
                                ? '《如何优化网站性能》已发布' 
                                : i === 1 
                                  ? '更新了网站标题和描述' 
                                  : '添加了"性能优化"标签'}
                            </p>
                          </div>
                          <p className="mt-2 flex items-center text-sm text-gray-500 sm:mt-0">
                            {i === 0 ? '10分钟前' : i === 1 ? '1小时前' : '昨天'}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 