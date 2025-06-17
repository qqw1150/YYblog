import { supabase } from '@/lib/supabase/client';
import { User, AuthError, Session } from '@supabase/supabase-js';

/**
 * 用户注册
 * @param email 用户邮箱
 * @param password 用户密码
 * @returns 注册结果，包含用户信息和可能的错误
 */
export async function registerUser(email: string, password: string): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  try {
    console.log("开始调用Supabase注册API...");
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/login`,
      }
    });

    console.log("Supabase注册响应:", { data, error });

    if (error) {
      console.error("Supabase注册错误:", error);
      return {
        user: null,
        error,
      };
    }

    if (!data.user) {
      console.error("注册成功但未返回用户数据");
      return {
        user: null,
        error: {
          message: "注册成功但未返回用户数据",
          status: 500,
        } as AuthError,
      };
    }

    console.log("注册成功，返回用户数据");
    return {
      user: data.user,
      error: null,
    };
  } catch (error) {
    console.error("注册过程发生异常:", error);
    return {
      user: null,
      error: error as AuthError,
    };
  }
}

/**
 * 用户登录
 * @param email 用户邮箱
 * @param password 用户密码
 * @returns 登录结果，包含用户信息和可能的错误
 */
export async function loginUser(email: string, password: string): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    return {
      user: data.user,
      error,
    };
  } catch (error) {
    return {
      user: null,
      error: error as AuthError,
    };
  }
}

/**
 * 重新发送验证邮件
 * @param email 用户邮箱
 * @returns 发送结果，包含可能的错误
 */
export async function resendVerificationEmail(email: string): Promise<{
  error: AuthError | null;
}> {
  try {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/login`,
      }
    });

    return { error };
  } catch (error) {
    return {
      error: error as AuthError,
    };
  }
}


/**
 * 用户登出
 * @returns 登出结果，包含可能的错误
 */
export async function logoutUser(): Promise<{
  error: AuthError | null;
}> {
  try {
    const { error } = await supabase.auth.signOut();
    return { error };
  } catch (error) {
    return {
      error: error as AuthError,
    };
  }
}

/**
 * 获取当前登录用户信息
 * @returns 当前用户信息
 */
export async function getCurrentUser(): Promise<{
  user: User | null;
  error: AuthError | null;
}> {
  try {
    const { data: { user }, error } = await supabase.auth.getUser();
    return {
      user,
      error,
    };
  } catch (error) {
    return {
      user: null,
      error: error as AuthError,
    };
  }
}

/**
 * 重置用户密码
 * @param email 用户邮箱
 * @returns 重置结果，包含可能的错误
 */
export async function resetPassword(email: string): Promise<{
  error: AuthError | null;
}> {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    return { error };
  } catch (error) {
    return {
      error: error as AuthError,
    };
  }
}

/**
 * 更新用户密码
 * @param newPassword 新密码
 * @returns 更新结果，包含可能的错误
 */
export async function updatePassword(newPassword: string): Promise<{
  error: AuthError | null;
}> {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });
    return { error };
  } catch (error) {
    return {
      error: error as AuthError,
    };
  }
}