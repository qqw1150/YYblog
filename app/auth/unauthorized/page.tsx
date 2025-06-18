'use client';

import Link from 'next/link';
import { Shield, Home, ArrowLeft } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="p-8 text-center">
            {/* 图标 */}
            <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6">
              <Shield className="w-8 h-8 text-red-600 dark:text-red-400" />
            </div>

            {/* 标题和描述 */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              访问被拒绝
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8">
              抱歉，您没有权限访问此页面。此页面仅对管理员开放。
            </p>

            {/* 操作按钮 */}
            <div className="space-y-4">
              <Link
                href="/"
                className="w-full flex items-center justify-center px-4 py-3 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                <Home className="w-4 h-4 mr-2" />
                返回首页
              </Link>
              
              <Link
                href="/auth/login"
                className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm text-sm font-medium text-gray-700 dark:text-white bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                重新登录
              </Link>
            </div>

            {/* 联系信息 */}
            <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                如果您认为这是一个错误，请联系网站管理员。
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 