import { supabase } from '@/lib/supabase/client';
import { useAuthStore } from './authStore';

// 单例模式标记，避免重复初始化
let isListenerInitialized = false;
let currentSubscription: { unsubscribe: () => void } | null = null;

/**
 * 认证状态监听器 - 单例模式
 * 确保在整个应用中只初始化一次
 */
export function initializeAuthListener() {
  // 如果已经初始化，直接返回现有的清理函数
  if (isListenerInitialized && currentSubscription) {
    console.log('🔄 认证监听器已初始化，跳过重复初始化');
    return () => {
      console.log('🧹 清理认证监听器 (重用)');
      currentSubscription?.unsubscribe();
      isListenerInitialized = false;
      currentSubscription = null;
    };
  }

  console.log('🚀 初始化认证监听器...');
  isListenerInitialized = true;
  
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('🔄 认证状态变化:', event, session);
    }
    
    const { checkAuth, clearUser } = useAuthStore.getState();
    
    switch (event) {
      case 'SIGNED_IN':
        if (session?.user) {
          console.log('✅ 用户登录，更新状态...');
          await checkAuth();
        }
        break;
        
      case 'SIGNED_OUT':
        console.log('🚪 用户登出，清除状态...');
        clearUser();
        break;
        
      case 'TOKEN_REFRESHED':
        console.log('🔄 Token 刷新...');
        await checkAuth();
        break;
        
      case 'USER_UPDATED':
        console.log('👤 用户信息更新...');
        await checkAuth();
        break;
        
      case 'INITIAL_SESSION':
        if (process.env.NODE_ENV === 'development') {
          console.log('📝 初始会话事件:', event);
        }
        break;
        
      default:
        if (process.env.NODE_ENV === 'development') {
          console.log('📝 其他认证事件:', event);
        }
        break;
    }
  });

  // 保存当前订阅
  currentSubscription = subscription;

  // 返回清理函数
  return () => {
    console.log('🧹 清理认证监听器');
    subscription.unsubscribe();
    isListenerInitialized = false;
    currentSubscription = null;
  };
}

/**
 * 初始化认证状态 - 防抖版本
 * 避免短时间内多次调用
 */
let authInitPromise: Promise<void> | null = null;

export async function initializeAuth() {
  // 如果已经有一个初始化过程在进行中，直接返回该Promise
  if (authInitPromise) {
    console.log('🔄 认证状态初始化已在进行中，复用现有Promise');
    return authInitPromise;
  }

  console.log('🔍 初始化认证状态...');
  
  // 创建新的初始化Promise
  authInitPromise = new Promise<void>(async (resolve) => {
    try {
      const { checkAuth } = useAuthStore.getState();
      await checkAuth();
    } catch (error) {
      console.error('❌ 初始化认证状态失败:', error);
    } finally {
      // 延迟清除Promise，避免短时间内重复初始化
      setTimeout(() => {
        authInitPromise = null;
      }, 1000);
      resolve();
    }
  });

  return authInitPromise;
} 