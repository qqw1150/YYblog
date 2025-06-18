import { supabase } from '@/lib/supabase/client';

// 用户信息接口
export interface User {
  id: string;
  email: string;
  username: string | null;
  avatar_url?: string | null;
  role: string;
  created_at: string;
}

// 用户数据接口
export interface UserData {
  id: string;
  email: string;
  username: string | null;
  avatar_url?: string | null;
  role: string;
  created_at: string;
}

// 用户资料更新接口
export interface UserProfileUpdate {
  username?: string;
  avatar_url?: string;
}

/**
 * 获取用户基本信息（包括角色）
 * @param userId 用户ID
 * @returns 用户数据
 */
export async function getUserData(userId: string): Promise<{
  data: UserData | null;
  error: any;
}> {
  try {
    console.log('🔍 获取用户数据:', userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('id, email, username, avatar_url, role, created_at')
      .eq('id', userId)
      .single();

    console.log('👤 用户数据结果:', { data, error });
    
    return { data, error };
  } catch (error) {
    console.error('❌ 获取用户数据失败:', error);
    return { data: null, error };
  }
}

/**
 * 获取用户资料信息
 * @param userId 用户ID
 * @returns 用户资料
 */
export async function getUserProfile(userId: string): Promise<{
  data: { username: string | null; avatar_url: string | null } | null;
  error: any;
}> {
  try {
    console.log('🔍 获取用户资料:', userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('username, avatar_url')
      .eq('id', userId)
      .single();

    console.log('👤 用户资料结果:', { data, error });
    
    return { data, error };
  } catch (error) {
    console.error('❌ 获取用户资料失败:', error);
    return { data: null, error };
  }
}

/**
 * 获取完整的用户信息
 * @param userId 用户ID
 * @returns 完整的用户信息
 */
export async function getCompleteUserInfo(userId: string): Promise<{
  data: User | null;
  error: any;
}> {
  try {
    console.log('🔍 获取完整用户信息:', userId);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error('用户数据不存在');
    }

    console.log('✅ 完整用户信息:', data);
    
    return { data, error: null };
  } catch (error) {
    console.error('❌ 获取完整用户信息失败:', error);
    return { data: null, error };
  }
}

/**
 * 更新用户资料
 * @param userId 用户ID
 * @param profile 用户资料
 * @returns 更新结果
 */
export async function updateUserProfile(
  userId: string, 
  profile: UserProfileUpdate
): Promise<{
  data: { username: string | null; avatar_url: string | null } | null;
  error: any;
}> {
  try {
    console.log('🔄 更新用户资料:', { userId, profile });
    
    const { data, error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', userId)
      .select('username, avatar_url')
      .single();

    console.log('✅ 更新用户资料结果:', { data, error });
    
    return { data, error };
  } catch (error) {
    console.error('❌ 更新用户资料失败:', error);
    return { data: null, error };
  }
}

/**
 * 创建用户资料
 * @param userId 用户ID
 * @param profile 用户资料
 * @returns 创建结果
 */
export async function createUserProfile(
  userId: string, 
  profile: UserProfileUpdate
): Promise<{
  data: { username: string | null; avatar_url: string | null } | null;
  error: any;
}> {
  try {
    console.log('➕ 创建用户资料:', { userId, profile });
    
    const { data, error } = await supabase
      .from('users')
      .update(profile)
      .eq('id', userId)
      .select('username, avatar_url')
      .single();

    console.log('✅ 创建用户资料结果:', { data, error });
    
    return { data, error };
  } catch (error) {
    console.error('❌ 创建用户资料失败:', error);
    return { data: null, error };
  }
} 