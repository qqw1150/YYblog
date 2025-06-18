/**
 * 格式化日期为YYYY-MM-DD格式
 * @param dateString - 日期字符串或Date对象
 * @returns 格式化后的日期字符串
 */
export function formatDate(dateString: string | Date): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
}

/**
 * 格式化日期为YYYY-MM-DD HH:MM格式
 * @param dateString - 日期字符串或Date对象
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(dateString: string | Date): string {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * 计算相对时间（几天前、几小时前等）
 * @param dateString - 日期字符串或Date对象
 * @returns 相对时间描述
 */
export function getRelativeTimeString(dateString: string | Date): string {
  const date = new Date(dateString);
  const now = new Date();
  const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  
  // 不同时间间隔的秒数定义
  const minute = 60;
  const hour = minute * 60;
  const day = hour * 24;
  const week = day * 7;
  const month = day * 30;
  const year = day * 365;
  
  // 根据时间差返回适当的描述
  if (seconds < minute) {
    return '刚刚';
  } else if (seconds < hour) {
    const minutes = Math.floor(seconds / minute);
    return `${minutes}分钟前`;
  } else if (seconds < day) {
    const hours = Math.floor(seconds / hour);
    return `${hours}小时前`;
  } else if (seconds < week) {
    const days = Math.floor(seconds / day);
    return `${days}天前`;
  } else if (seconds < month) {
    const weeks = Math.floor(seconds / week);
    return `${weeks}周前`;
  } else if (seconds < year) {
    const months = Math.floor(seconds / month);
    return `${months}个月前`;
  } else {
    const years = Math.floor(seconds / year);
    return `${years}年前`;
  }
} 