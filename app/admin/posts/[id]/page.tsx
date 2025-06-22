'use client';

import { useEffect, useState, useMemo } from 'react';

/**
 * 编辑文章页面
 * 复用编辑页面组件，传入文章ID进行数据回显
 */
import PostEditor from '@/components/admin/PostEditor';

interface EditPostPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function EditPostPage({ params }: EditPostPageProps) {
  const [postId, setPostId] = useState<string | null>(null);

  // 使用useMemo来稳定params的引用，避免无限循环
  const stableParams = useMemo(() => params, []);

  useEffect(() => {
    const resolveParams = async () => {
      const { id } = await stableParams;
      setPostId(id);
    };
    resolveParams();
  }, [stableParams]);

  if (!postId) {
    return <div>加载中...</div>;
  }

  return <PostEditor postId={postId} />;
}
