/**
 * 头像工具函数
 * 用于处理用户头像的默认值和生成逻辑
 */

// 默认头像URL常量
export const DEFAULT_AVATAR_URL = 'https://hxnargfvyjnogjzgohiy.supabase.co/storage/v1/object/public/avatars//default_avatar.png';



/**
 * 获取用户默认头像URL
 * @param email 用户邮箱
 * @param username 用户名
 * @returns 默认头像URL
 */
export function getDefaultAvatarUrl(): string {
  return DEFAULT_AVATAR_URL;
}

/**
 * 获取用户名显示文本
 * @param username 用户名
 * @param email 邮箱
 * @returns 显示的用户名
 */
export function getDisplayUsername(username?: string, email?: string): string {
  if (username) {
    return username;
  } else if (email) {
    // 如果注册了但没有用户名，使用邮箱前缀作为用户名
    const emailPrefix = email.split('@')[0];
    return emailPrefix;
  } else {
    return '匿名用户';
  }
} 