'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';
import { initializeAuthListener, initializeAuth } from '@/stores/authListener';

interface ZustandAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * 基于 Zustand 的管理员授权保护组件
 * 专用于保护管理端路由，确保只有管理员可以访问
 */
export default function ZustandAuthGuard({ children, requiredRole = 'admin' }: ZustandAuthGuardProps) {
  const { user, loading, isInitialized } = useAuthStore();
  const router = useRouter();
  const initRef = useRef(false);

  // 初始化认证监听器 - 优化版本，避免重复初始化
  useEffect(() => {
    // 使用 ref 确保即使在严格模式下也只初始化一次
    if (!initRef.current && !isInitialized) {
      console.log('🛡️ 管理员认证初始化...');
      initRef.current = true;
      
      // 初始化认证状态
      initializeAuth();
      
      // 设置认证监听器
      const cleanup = initializeAuthListener();
      
      return () => {
        console.log('🧹 清理认证监听器');
        cleanup();
      };
    }
  }, [isInitialized]); // 依赖 isInitialized 状态，确保状态变化时重新评估

  // 仅在开发环境输出日志
  if (process.env.NODE_ENV === 'development') {
    console.log('🛡️ 管理员认证状态 - loading:', loading, 'user:', user, 'requiredRole:', requiredRole, 'isInitialized:', isInitialized);
  }

  // 如果还未初始化，显示加载状态
  if (!isInitialized || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  // 检查用户是否已登录
  if (!user) {
    // 使用 replace 而不是 push，避免浏览器历史堆积
    router.replace('/auth/unauthorized');
    return null;
  }

  // 检查用户角色 - 默认要求管理员角色
  if (user.role !== requiredRole) {
    router.replace('/auth/unauthorized');
    return null;
  }

  // 认证通过，渲染子组件
  return <>{children}</>;
} 