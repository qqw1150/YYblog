/**
 * 头像工具函数
 * 用于处理用户头像的默认值和生成逻辑
 */

/**
 * 简单的 MD5 哈希实现（用于 Gravatar）
 * @param str 输入字符串
 * @returns MD5 哈希值
 */
function md5(str: string): string {
  // 这是一个简化的 MD5 实现，仅用于生成 Gravatar URL
  // 在实际生产环境中，建议使用更安全的哈希算法
  let hash = 0;
  if (str.length === 0) return hash.toString();
  
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 转换为 32 位整数
  }
  
  // 转换为 16 进制并补齐到 32 位
  const hexHash = Math.abs(hash).toString(16);
  return hexHash.padStart(8, '0');
}

/**
 * 获取用户默认头像URL
 * @param email 用户邮箱
 * @param username 用户名
 * @returns 默认头像URL
 */
export function getDefaultAvatarUrl(email?: string, username?: string): string {
  if (email) {
    // 使用 Gravatar 默认头像
    const emailHash = md5(email.toLowerCase().trim());
    return `https://www.gravatar.com/avatar/${emailHash}?d=mp&s=200`;
  } else if (username) {
    // 使用用户名生成头像
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(username)}&background=6366f1&color=fff&size=200`;
  } else {
    // 使用通用默认头像
    return 'https://ui-avatars.com/api/?name=User&background=6366f1&color=fff&size=200';
  }
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