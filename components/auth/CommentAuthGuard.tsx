'use client';

import { useState, useEffect, useRef } from 'react';
import { useAuthStore } from '@/stores/authStore';
import { initializeAuthListener, initializeAuth } from '@/stores/authListener';

interface CommentAuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

/**
 * 评论功能认证守卫
 * 用于保护评论功能，确保用户已登录才能评论
 * 不限制用户角色，任何登录用户都可以评论
 */
export default function CommentAuthGuard({ 
  children, 
  fallback 
}: CommentAuthGuardProps) {
  const { user, loading, isInitialized } = useAuthStore();
  const initRef = useRef(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);

  // 初始化认证状态 - 优化版本，避免重复初始化
  useEffect(() => {
    // 使用 ref 确保即使在严格模式下也只初始化一次
    if (!initRef.current && !isInitialized) {
      initRef.current = true;
      
      // 初始化认证状态
      initializeAuth();
      
      // 设置认证监听器
      const cleanup = initializeAuthListener();
      
      return () => {
        cleanup();
      };
    }
  }, [isInitialized]);

  // 标记认证检查完成
  useEffect(() => {
    if (!loading && isInitialized) {
      setIsAuthChecked(true);
    }
  }, [loading, isInitialized]);

  // 如果还在加载中，显示加载状态
  if (!isAuthChecked) {
    return (
      <div className="flex items-center justify-center py-4">
        <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-gray-500"></div>
      </div>
    );
  }

  // 如果用户未登录且提供了后备UI，则显示后备UI
  if (!user && fallback) {
    return <>{fallback}</>;
  }

  // 如果用户已登录，显示子组件（评论功能）
  if (user) {
    return <>{children}</>;
  }

  // 默认情况：用户未登录且没有提供后备UI
  return (
    <div className="p-4 border rounded-md bg-gray-50">
      <p className="text-center text-gray-600">请先登录后再评论</p>
    </div>
  );
} 