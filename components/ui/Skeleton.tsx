import React from 'react';

/**
 * 骨架屏组件接口定义
 */
interface SkeletonProps {
  /** 骨架屏的类名 */
  className?: string;
  /** 是否显示动画效果 */
  animate?: boolean;
  /** 骨架屏的宽度 */
  width?: string | number;
  /** 骨架屏的高度 */
  height?: string | number;
  /** 骨架屏的形状 */
  variant?: 'rectangular' | 'circular' | 'text';
  /** 子元素 */
  children?: React.ReactNode;
}

/**
 * 通用骨架屏组件
 * 用于在内容加载时显示占位符，提升用户体验
 */
export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  animate = true,
  width,
  height,
  variant = 'rectangular',
  children,
  ...props
}) => {
  const baseClasses = 'bg-gray-200 rounded';
  const animationClasses = animate ? 'animate-pulse' : '';
  
  const variantClasses = {
    rectangular: 'rounded',
    circular: 'rounded-full',
    text: 'rounded h-4'
  };

  const style: React.CSSProperties = {};
  if (width) style.width = typeof width === 'number' ? `${width}px` : width;
  if (height) style.height = typeof height === 'number' ? `${height}px` : height;

  return (
    <div
      className={`${baseClasses} ${variantClasses[variant]} ${animationClasses} ${className}`}
      style={style}
      {...props}
    >
      {children}
    </div>
  );
};

/**
 * 文章卡片骨架屏组件
 * 用于显示文章列表加载时的占位符
 */
export const ArticleCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-300">
      <div className="flex flex-col md:flex-row">
        {/* 图片骨架屏 */}
        <div className="md:w-2/5 relative overflow-hidden">
          <Skeleton className="h-60 md:h-full w-full" />
        </div>
        
        {/* 内容骨架屏 */}
        <div className="md:w-3/5 p-8">
          {/* 分类和日期 */}
          <div className="flex items-center gap-3 mb-3">
            <Skeleton className="w-20 h-6" />
            <Skeleton className="w-32 h-4" />
          </div>
          
          {/* 标题 */}
          <Skeleton className="w-full h-8 mb-3" />
          <Skeleton className="w-3/4 h-6 mb-3" />
          
          {/* 摘要 */}
          <div className="space-y-2 mb-6">
            <Skeleton className="w-full h-4" />
            <Skeleton className="w-2/3 h-4" />
          </div>
          
          {/* 作者信息和统计 */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-300">
            <div className="flex items-center">
              <Skeleton className="w-9 h-9 rounded-full mr-3" />
              <Skeleton className="w-20 h-4" />
            </div>
            <div className="flex items-center gap-4">
              <Skeleton className="w-8 h-4" />
              <Skeleton className="w-8 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 置顶文章骨架屏组件
 * 用于显示置顶文章加载时的占位符
 */
export const TopArticleSkeleton: React.FC = () => {
  return (
    <div className="mb-12">
      <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-300">
        <Skeleton className="h-full w-full" />
        <div className="absolute bottom-0 left-0 p-10 w-full">
          {/* 分类标签 */}
          <div className="mb-4 flex items-center gap-3">
            <Skeleton className="w-24 h-8 rounded-full" />
            <Skeleton className="w-16 h-6 rounded-full" />
          </div>
          
          {/* 标题 */}
          <Skeleton className="w-3/4 h-12 mb-4" />
          <Skeleton className="w-1/2 h-8 mb-4" />
          
          {/* 摘要 */}
          <div className="space-y-2 mb-6">
            <Skeleton className="w-full h-6" />
            <Skeleton className="w-2/3 h-6" />
          </div>
          
          {/* 作者信息 */}
          <div className="flex items-center mt-6 bg-black/30 p-3 rounded-xl backdrop-blur-sm max-w-max border border-white/30">
            <Skeleton className="w-12 h-12 rounded-full mr-4" />
            <div>
              <Skeleton className="w-24 h-5 mb-1" />
              <Skeleton className="w-32 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 侧边栏骨架屏组件
 * 用于显示侧边栏加载时的占位符
 */
export const SidebarSkeleton: React.FC = () => {
  return (
    <div className="w-full md:w-1/3">
      <div className="sticky top-8 space-y-8">
        {/* 搜索框骨架屏 */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-300">
          <Skeleton className="w-32 h-6 mb-4" />
          <Skeleton className="w-full h-12 rounded-lg" />
        </div>
        
        {/* 分类骨架屏 */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-300">
          <Skeleton className="w-24 h-6 mb-4" />
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="flex justify-between items-center py-2.5 px-3">
                <Skeleton className="w-20 h-4" />
                <Skeleton className="w-8 h-6 rounded-full" />
              </div>
            ))}
          </div>
        </div>
        
        {/* 标签云骨架屏 */}
        <div className="bg-white p-6 rounded-xl shadow-xl border border-gray-300">
          <Skeleton className="w-20 h-6 mb-4" />
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
              <Skeleton key={i} className="w-16 h-8 rounded-full" />
            ))}
          </div>
        </div>
        
        {/* 热门文章骨架屏 */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-xl shadow-xl border border-indigo-300">
          <Skeleton className="w-24 h-6 mb-6" />
          <div className="space-y-6">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex gap-4">
                <Skeleton className="w-20 h-20 rounded-xl flex-shrink-0" />
                <div className="flex-grow">
                  <Skeleton className="w-full h-4 mb-2" />
                  <Skeleton className="w-3/4 h-4 mb-2" />
                  <Skeleton className="w-24 h-3" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * 文章列表骨架屏组件
 * 用于显示文章列表加载时的占位符
 */
export const ArticleListSkeleton: React.FC = () => {
  return (
    <div className="w-full md:w-2/3">
      {/* 置顶文章骨架屏 */}
      <TopArticleSkeleton />
      
      {/* 文章列表骨架屏 */}
      <div className="grid grid-cols-1 gap-10">
        {[1, 2, 3, 4, 5].map(i => (
          <ArticleCardSkeleton key={i} />
        ))}
      </div>
    </div>
  );
};

/**
 * 文章详情页骨架屏组件
 * 用于显示文章详情页加载时的占位符
 */
export const ArticleDetailSkeleton: React.FC = () => {
  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* 文章头部背景骨架屏 */}
      <div className="relative pt-20 pb-24 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 mix-blend-overlay"></div>
        <div className="max-w-4xl mx-auto px-4 relative z-10">
          {/* 返回按钮骨架屏 */}
          <Skeleton className="w-32 h-10 rounded-full mb-8" />
          
          {/* 标题骨架屏 */}
          <div className="space-y-3 mb-6">
            <Skeleton className="w-full h-12" />
            <Skeleton className="w-3/4 h-12" />
            <Skeleton className="w-1/2 h-8" />
          </div>
          
          {/* 文章元信息骨架屏 */}
          <div className="bg-white/90 p-4 rounded-xl shadow-md backdrop-blur-sm border border-gray-300 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <div className="flex items-center">
                <Skeleton className="w-11 h-11 rounded-full mr-3" />
                <Skeleton className="w-24 h-5" />
              </div>
              <span className="hidden sm:inline text-gray-400">•</span>
              <Skeleton className="w-32 h-4" />
              <span className="hidden sm:inline text-gray-400">•</span>
              <Skeleton className="w-20 h-6 rounded-md" />
            </div>
          </div>
          
          {/* 标签骨架屏 */}
          <div className="flex flex-wrap gap-2 mb-8">
            {[1, 2, 3, 4].map(i => (
              <Skeleton key={i} className="w-16 h-8 rounded-full" />
            ))}
          </div>
        </div>
      </div>
      
      <div className="max-w-4xl mx-auto px-4 -mt-16 relative z-20">
        {/* 特色图片骨架屏 */}
        <Skeleton className="h-[400px] w-full rounded-xl mb-8" />
        
        {/* 文章内容骨架屏 */}
        <div className="bg-white rounded-2xl p-8 sm:p-10 shadow-xl mb-10 border border-gray-300 relative">
          {/* 书签图标骨架屏 */}
          <div className="absolute top-4 right-4 md:top-6 md:right-6">
            <Skeleton className="w-9 h-9 rounded-lg" />
          </div>
          
          {/* 文章内容段落骨架屏 */}
          <div className="space-y-6">
            <div className="space-y-3">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-3/4 h-6" />
            </div>
            
            <Skeleton className="w-1/2 h-8" />
            
            <div className="space-y-3">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-5/6 h-6" />
            </div>
            
            <Skeleton className="w-1/3 h-8" />
            
            <div className="space-y-3">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-4/5 h-6" />
            </div>
            
            <Skeleton className="w-2/5 h-8" />
            
            <div className="space-y-3">
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-full h-6" />
              <Skeleton className="w-3/4 h-6" />
            </div>
          </div>
        </div>
        
        {/* 文章底部信息骨架屏 */}
        <div className="bg-white rounded-xl p-6 shadow-xl mb-8 border border-gray-300">
          <div className="border-t border-gray-300 pt-6">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                <Skeleton className="w-16 h-5" />
                <Skeleton className="w-12 h-5" />
                <Skeleton className="w-16 h-5" />
              </div>
              <div className="flex gap-2">
                <Skeleton className="w-16 h-10 rounded-lg" />
                <Skeleton className="w-16 h-10 rounded-lg" />
              </div>
            </div>
          </div>
        </div>
        
        {/* 作者信息骨架屏 */}
        <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl p-8 mb-12 shadow-xl border border-indigo-300">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Skeleton className="w-22 h-22 rounded-full" />
            <div className="text-center sm:text-left flex-1">
              <Skeleton className="w-32 h-8 mb-2" />
              <Skeleton className="w-full h-5 mb-2" />
              <Skeleton className="w-3/4 h-5 mb-4" />
              <Skeleton className="w-24 h-10 rounded-lg" />
            </div>
          </div>
        </div>
        
        {/* 相关文章推荐骨架屏 */}
        <div className="mb-12">
          <div className="flex items-center mb-6">
            <Skeleton className="w-6 h-1 rounded-full mr-2" />
            <Skeleton className="w-24 h-8" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {[1, 2].map(i => (
              <div key={i} className="bg-white rounded-xl overflow-hidden shadow-xl border border-gray-300">
                <Skeleton className="h-48 w-full" />
                <div className="p-6">
                  <Skeleton className="w-16 h-6 rounded-full mb-2" />
                  <Skeleton className="w-full h-6 mb-2" />
                  <Skeleton className="w-3/4 h-6 mb-3" />
                  <div className="flex items-center mb-3 gap-4">
                    <Skeleton className="w-20 h-4" />
                    <Skeleton className="w-12 h-4" />
                  </div>
                  <div className="space-y-2 mb-4">
                    <Skeleton className="w-full h-4" />
                    <Skeleton className="w-2/3 h-4" />
                  </div>
                  <Skeleton className="w-20 h-6" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Skeleton; 