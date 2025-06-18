import { supabase } from '@/lib/supabase/client';
import { Session } from '@supabase/supabase-js';

/**
 * 获取当前会话
 * @returns 当前会话信息
 */
export async function getCurrentSession(): Promise<{
  session: Session | null;
  error: any;
}> {
  try {
    console.log('🔍 获取当前会话...');
    
    const { data: { session }, error } = await supabase.auth.getSession();
    
    console.log('📡 会话信息:', session);
    console.log('❌ 会话错误:', error);
    
    return { session, error };
  } catch (error) {
    console.error('❌ 获取会话失败:', error);
    return { session: null, error };
  }
}

/**
 * 检查用户是否已登录
 * @returns 登录状态
 */
export async function isUserLoggedIn(): Promise<{
  isLoggedIn: boolean;
  userId: string | null;
  error: any;
}> {
  try {
    const { session, error } = await getCurrentSession();
    
    if (error) {
      return { isLoggedIn: false, userId: null, error };
    }
    
    return {
      isLoggedIn: !!session?.user,
      userId: session?.user?.id || null,
      error: null
    };
  } catch (error) {
    console.error('❌ 检查登录状态失败:', error);
    return { isLoggedIn: false, userId: null, error };
  }
}

/**
 * 获取当前用户ID
 * @returns 当前用户ID
 */
export async function getCurrentUserId(): Promise<{
  userId: string | null;
  error: any;
}> {
  try {
    const { session, error } = await getCurrentSession();
    
    if (error) {
      return { userId: null, error };
    }
    
    return {
      userId: session?.user?.id || null,
      error: null
    };
  } catch (error) {
    console.error('❌ 获取用户ID失败:', error);
    return { userId: null, error };
  }
}

/**
 * 检查会话是否有效
 * @returns 会话有效性
 */
export async function isSessionValid(): Promise<{
  isValid: boolean;
  error: any;
}> {
  try {
    const { session, error } = await getCurrentSession();
    
    if (error) {
      return { isValid: false, error };
    }
    
    if (!session) {
      return { isValid: false, error: null };
    }
    
    // 检查会话是否过期
    const now = Math.floor(Date.now() / 1000);
    const expiresAt = session.expires_at;
    
    const isValid = expiresAt ? now < expiresAt : true;
    
    return { isValid, error: null };
  } catch (error) {
    console.error('❌ 检查会话有效性失败:', error);
    return { isValid: false, error };
  }
} 