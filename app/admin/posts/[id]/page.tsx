'use client';

/**
 * 编辑文章页面
 * 复用编辑页面组件，传入文章ID进行数据回显
 */
import PostEditor from '@/components/admin/PostEditor';

interface EditPostPageProps {
  params: {
    id: string;
  };
}

export default function EditPostPage({ params }: EditPostPageProps) {
  return <PostEditor postId={params.id} />;
}
