import React from 'react';
import { ArticleDetailSkeleton } from '@/components/ui/Skeleton';

/**
 * 博客文章详情页面加载组件
 * 在服务端组件加载时显示骨架屏
 */
export default function BlogPostLoading() {
  return <ArticleDetailSkeleton />;
} 