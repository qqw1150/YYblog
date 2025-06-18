'use client';

import MainContent from '@/components/admin/MainContent';

/**
 * 管理端首页组件
 * 注意：认证守卫和布局已移至 app/admin/layout.tsx
 * 通过 /admin 路径直接访问
 */
export default function AdminHome() {
  return <MainContent />;
} 