'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/stores/authStore';

interface ZustandAuthGuardProps {
  children: React.ReactNode;
  requiredRole?: string;
}

/**
 * 简化的管理员认证保护组件
 * 每次访问时检查token是否过期，无需复杂的监听器
 */
export default function ZustandAuthGuard({ children, requiredRole = 'admin' }: ZustandAuthGuardProps) {
  const { user, loading, initializeAuth, checkTokenExpiry } = useAuthStore();
  const router = useRouter();
  const [isInitialized, setIsInitialized] = useState(false);
  const [shouldRedirect, setShouldRedirect] = useState(false);
  const [redirectPath, setRedirectPath] = useState('');

  // 初始化认证状态
  useEffect(() => {
    const initAuth = async () => {
      console.log('🛡️ 初始化管理员认证...');
      await initializeAuth();
      setIsInitialized(true);
    };

    initAuth();
  }, [initializeAuth]);

  // 检查认证状态并决定跳转
  useEffect(() => {
    if (isInitialized && !loading) {
      const isExpired = checkTokenExpiry();
      
      // 检查用户是否已登录
      if (!user) {
        console.log('🚫 用户未登录，准备跳转到未授权页面');
        setRedirectPath('/auth/unauthorized');
        setShouldRedirect(true);
        return;
      }

      // 检查token是否过期
      if (isExpired) {
        console.log('❌ Token已过期，准备跳转到未授权页面');
        setRedirectPath('/auth/unauthorized');
        setShouldRedirect(true);
        return;
      }

      // 检查用户角色
      if (user.role !== requiredRole) {
        console.log('🚫 用户角色不匹配，准备跳转到未授权页面');
        setRedirectPath('/auth/unauthorized');
        setShouldRedirect(true);
        return;
      }

      console.log('✅ 认证通过，可以渲染管理端内容');
    }
  }, [isInitialized, loading, checkTokenExpiry, user, requiredRole]);

  // 处理路由跳转
  useEffect(() => {
    if (shouldRedirect && redirectPath) {
      console.log(`🔄 执行跳转: ${redirectPath}`);
      router.replace(redirectPath);
      setShouldRedirect(false);
      setRedirectPath('');
    }
  }, [shouldRedirect, redirectPath, router]);

  // 如果还在加载中或未初始化，显示加载状态
  if (loading || !isInitialized) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证身份...</p>
        </div>
      </div>
    );
  }

  // 如果需要跳转，显示加载状态
  if (shouldRedirect) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在跳转...</p>
        </div>
      </div>
    );
  }

  // 如果用户未登录或token过期或角色不匹配，显示加载状态直到跳转
  if (!user || checkTokenExpiry() || (user && user.role !== requiredRole)) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">正在验证权限...</p>
        </div>
      </div>
    );
  }

  // 认证通过，渲染子组件
  return <>{children}</>;
} 