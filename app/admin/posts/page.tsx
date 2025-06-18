'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpDown,
  Calendar,
  Tag,
  Loader2
} from 'lucide-react';
import Link from 'next/link';
import { getPosts, deletePost, Post } from '@/lib/supabase/db';
import { Category } from '@/lib/supabase/db/categories';
import { useAuthStore } from '@/stores/authStore';

// 标签接口
interface TagData {
  id: string;
  name: string;
  slug: string;
}

// 文章数据接口，扩展基础的Post接口
interface PostWithTags extends Post {
  tags?: TagData[];
}

/**
 * 文章管理页面组件
 * 展示所有文章并提供管理功能
 */
export default function PostsManagement() {
  // 获取当前用户
  const { user } = useAuthStore();
  
  // 文章列表数据
  const [posts, setPosts] = useState<PostWithTags[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortField, setSortField] = useState('published_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  
  // 加载文章数据
  const loadPosts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const { data, count, error } = await getPosts({
        page: currentPage,
        pageSize,
        status: statusFilter === 'all' ? 'all' : (statusFilter as 'published' | 'draft'),
        searchTerm: searchTerm || undefined,
        orderBy: sortField,
        orderDirection: sortDirection as 'asc' | 'desc'
      });
      
      if (error) {
        console.error('获取文章列表失败:', error);
        setError('获取文章列表失败，请稍后重试');
      } else {
        setPosts(data || []);
        setTotalCount(count || 0);
      }
    } catch (err) {
      console.error('加载文章异常:', err);
      setError('加载文章时发生错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载和筛选/排序变化时重新加载
  useEffect(() => {
    loadPosts();
  }, [currentPage, pageSize, statusFilter, sortField, sortDirection]);
  
  // 当搜索词变化时，重置页码并加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadPosts();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  // 处理排序变更
  const handleSort = (field: string) => {
    if (sortField === field) {
      // 切换排序方向
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 设置新的排序字段，默认降序
      setSortField(field);
      setSortDirection('desc');
    }
  };
  
  // 处理删除文章
  const handleDeletePost = async (id: string) => {
    if (confirm('确定要删除这篇文章吗？此操作无法撤销。')) {
      try {
        setIsLoading(true);
        const { success, error } = await deletePost(id);
        
        if (error) {
          console.error('删除文章失败:', error);
          setError('删除文章失败，请稍后重试');
        } else if (success) {
          // 更新状态，从列表中移除已删除的文章
          setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
          setTotalCount(prev => prev - 1);
        }
      } catch (err) {
        console.error('删除文章异常:', err);
        setError('删除文章时发生错误，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }
  };

  // 计算分页信息
  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalPages > 1;
  
  // 处理页码变更
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  // 格式化日期
  const formatDate = (dateString: string | null) => {
    if (!dateString) return '未发布';
    
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">文章管理</h1>
        <Link 
          href="/admin/posts/new" 
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          <span>新建文章</span>
        </Link>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索文章标题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-500 bg-white"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-gray-500" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 bg-white" 
          >
            <option value="all">所有状态</option>
            <option value="published">已发布</option>
            <option value="draft">草稿</option>
          </select>
        </div>
      </div>
      
      {/* 错误提示 */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}
      
      {/* 文章列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 focus:outline-none"
                    onClick={() => handleSort('title')}
                  >
                    <span>标题</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  状态
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <button 
                    className="flex items-center space-x-1 focus:outline-none"
                    onClick={() => handleSort('published_at')}
                  >
                    <span>发布日期</span>
                    <ArrowUpDown size={14} />
                  </button>
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  分类
                </th>
                <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center">
                    <div className="flex justify-center items-center">
                      <Loader2 size={24} className="mr-2 animate-spin text-blue-500" />
                      <span>加载中...</span>
                    </div>
                  </td>
                </tr>
              ) : posts.length > 0 ? (
                posts.map((post) => (
                  <tr key={post.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{post.title}</div>
                      {post.tags && post.tags.length > 0 && (
                        <div className="flex items-center mt-1 flex-wrap">
                          {post.tags.map((tag) => (
                            <span 
                              key={tag.id} 
                              className="inline-flex items-center mr-2 mb-1 px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                            >
                              <Tag size={12} className="mr-1" />
                              {tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        post.status === 'published' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? '已发布' : '草稿'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        {formatDate(post.published_at)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(() => {
                        // 处理不同的数据结构形式
                        if (post.categories?.name) {
                          return post.categories.name;
                        } else if (typeof post.categories === 'object' && post.categories !== null) {
                          // 日志输出查看实际结构
                          console.log('分类数据结构:', post.categories);
                        }
                        return '未分类';
                      })()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link 
                          href={`/blog/${post.slug}`} 
                          className="text-gray-500 hover:text-gray-700"
                          title="预览"
                        >
                          <Eye size={18} />
                        </Link>
                        <Link 
                          href={`/admin/posts/${post.id}`} 
                          className="text-blue-500 hover:text-blue-700"
                          title="编辑"
                        >
                          <Edit size={18} />
                        </Link>
                        <button 
                          onClick={() => handleDeletePost(post.id)}
                          className="text-red-500 hover:text-red-700"
                          title="删除"
                          disabled={isLoading}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                    未找到符合条件的文章
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* 分页 */}
      {showPagination && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-gray-500">
            共 {totalCount} 篇文章，当前显示第 {(currentPage - 1) * pageSize + 1} - {Math.min(currentPage * pageSize, totalCount)} 篇
          </div>
          <div className="flex space-x-1">
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1 || isLoading}
            >
              上一页
            </button>
            {/* 简化的分页按钮，只显示周围的页码 */}
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              // 计算要显示哪些页码
              let pageNum: number;
              if (totalPages <= 5) {
                // 总页数少于5，显示所有页码
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                // 当前在前3页，显示1-5
                pageNum = i + 1;
              } else if (currentPage >= totalPages - 2) {
                // 当前在后3页，显示最后5页
                pageNum = totalPages - 4 + i;
              } else {
                // 当前在中间，显示当前页前后各2页
                pageNum = currentPage - 2 + i;
              }
              
              return (
                <button
                  key={pageNum}
                  className={`px-3 py-1 rounded-md text-sm ${
                    currentPage === pageNum
                      ? 'bg-blue-600 text-white'
                      : 'border border-gray-300'
                  }`}
                  onClick={() => handlePageChange(pageNum)}
                  disabled={isLoading}
                >
                  {pageNum}
                </button>
              );
            })}
            <button 
              className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:opacity-50"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages || isLoading}
            >
              下一页
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
