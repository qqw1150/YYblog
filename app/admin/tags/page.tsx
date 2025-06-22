'use client';

import { useState, useEffect } from 'react';
import { 
  Search, 
  Plus, 
  Filter, 
  Edit, 
  Trash2, 
  ArrowUpDown,
  Loader2,
  Tag as TagIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  X
} from 'lucide-react';
import { 
  getTags, 
  createTag, 
  updateTag, 
  deleteTag, 
  getTagStats,
  Tag,
  TagCreate,
  TagUpdate
} from '@/lib/supabase/db';
import { useAuthStore } from '@/stores/authStore';

/**
 * 标签统计信息接口
 */
interface TagStats {
  id: string;
  name: string;
  slug: string;
  count: number;
}

/**
 * 标签管理页面组件
 * 提供标签的增删改查功能
 */
export default function TagsManagement() {
  // 获取当前用户
  const { user } = useAuthStore();
  
  // 标签列表数据
  const [tags, setTags] = useState<TagStats[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // 搜索和筛选状态
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(20);
  
  // 模态框状态
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTag, setEditingTag] = useState<Tag | null>(null);
  const [formData, setFormData] = useState<TagCreate>({
    name: '',
    slug: ''
  });
  const [formErrors, setFormErrors] = useState<{ name?: string; slug?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // 成功消息状态
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  /**
   * 加载标签数据
   */
  const loadTags = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 获取标签统计信息（包含文章数量）
      const { data: tagStats, error: statsError } = await getTagStats();
      
      if (statsError) {
        console.error('获取标签统计信息失败:', statsError);
        setError('获取标签列表失败，请稍后重试');
        return;
      }
      
      if (tagStats) {
        // 应用搜索过滤
        let filteredTags = tagStats;
        if (searchTerm) {
          filteredTags = tagStats.filter(tag => 
            tag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            tag.slug.toLowerCase().includes(searchTerm.toLowerCase())
          );
        }
        
        // 应用排序
        filteredTags.sort((a, b) => {
          let aValue: string | number;
          let bValue: string | number;
          
          switch (sortField) {
            case 'name':
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
              break;
            case 'slug':
              aValue = a.slug.toLowerCase();
              bValue = b.slug.toLowerCase();
              break;
            case 'count':
              aValue = a.count;
              bValue = b.count;
              break;
            default:
              aValue = a.name.toLowerCase();
              bValue = b.name.toLowerCase();
          }
          
          if (sortDirection === 'asc') {
            return aValue > bValue ? 1 : -1;
          } else {
            return aValue < bValue ? 1 : -1;
          }
        });
        
        // 应用分页
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const paginatedTags = filteredTags.slice(startIndex, endIndex);
        
        setTags(paginatedTags);
        setTotalCount(filteredTags.length);
      }
    } catch (err) {
      console.error('加载标签异常:', err);
      setError('加载标签时发生错误，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载和筛选/排序变化时重新加载
  useEffect(() => {
    loadTags();
  }, [currentPage, pageSize, sortField, sortDirection]);
  
  // 当搜索词变化时，重置页码并加载数据
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
      loadTags();
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchTerm]);
  
  /**
   * 处理排序变更
   */
  const handleSort = (field: string) => {
    if (sortField === field) {
      // 切换排序方向
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      // 设置新的排序字段，默认升序
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  /**
   * 打开新增标签模态框
   */
  const openCreateModal = () => {
    setIsEditing(false);
    setEditingTag(null);
    setFormData({ name: '', slug: '' });
    setFormErrors({});
    setIsModalOpen(true);
  };
  
  /**
   * 打开编辑标签模态框
   */
  const openEditModal = (tag: Tag) => {
    setIsEditing(true);
    setEditingTag(tag);
    setFormData({ name: tag.name, slug: tag.slug });
    setFormErrors({});
    setIsModalOpen(true);
  };
  
  /**
   * 关闭模态框
   */
  const closeModal = () => {
    setIsModalOpen(false);
    setIsEditing(false);
    setEditingTag(null);
    setFormData({ name: '', slug: '' });
    setFormErrors({});
    setIsSubmitting(false);
  };
  
  /**
   * 处理表单数据变化
   */
  const handleFormChange = (field: keyof TagCreate, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // 清除对应字段的错误
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: undefined }));
    }
    
    // 如果是名称变化，自动生成slug
    if (field === 'name' && !isEditing) {
      const slug = value.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9\-]/g, '');
      setFormData(prev => ({ ...prev, slug }));
    }
  };
  
  /**
   * 验证表单数据
   */
  const validateForm = (): boolean => {
    const errors: { name?: string; slug?: string } = {};
    
    if (!formData.name.trim()) {
      errors.name = '标签名称不能为空';
    } else if (formData.name.length > 50) {
      errors.name = '标签名称不能超过50个字符';
    }
    
    if (!formData.slug.trim()) {
      errors.slug = '标签别名不能为空';
    } else if (!/^[a-z0-9\-]+$/.test(formData.slug)) {
      errors.slug = '标签别名只能包含小写字母、数字和连字符';
    } else if (formData.slug.length > 50) {
      errors.slug = '标签别名不能超过50个字符';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  /**
   * 提交表单
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      if (isEditing && editingTag) {
        // 更新标签
        const { data, error } = await updateTag(editingTag.id, formData);
        
        if (error) {
          console.error('更新标签失败:', error);
          setError('更新标签失败，请稍后重试');
        } else {
          setSuccessMessage('标签更新成功');
          closeModal();
          loadTags();
        }
      } else {
        // 创建标签
        const { data, error } = await createTag(formData);
        
        if (error) {
          console.error('创建标签失败:', error);
          setError('创建标签失败，请稍后重试');
        } else {
          setSuccessMessage('标签创建成功');
          closeModal();
          loadTags();
        }
      }
    } catch (err) {
      console.error('提交标签异常:', err);
      setError('操作失败，请稍后重试');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  /**
   * 处理删除标签
   */
  const handleDeleteTag = async (id: string, name: string) => {
    if (confirm(`确定要删除标签"${name}"吗？此操作无法撤销。`)) {
      try {
        setIsLoading(true);
        const { success, error } = await deleteTag(id);
        
        if (error) {
          console.error('删除标签失败:', error);
          setError('删除标签失败，请稍后重试');
        } else if (success) {
          setSuccessMessage('标签删除成功');
          loadTags();
        }
      } catch (err) {
        console.error('删除标签异常:', err);
        setError('删除标签时发生错误，请稍后重试');
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  // 计算分页信息
  const totalPages = Math.ceil(totalCount / pageSize);
  const showPagination = totalPages > 1;
  
  /**
   * 处理页码变更
   */
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };
  
  /**
   * 清除成功消息
   */
  const clearSuccessMessage = () => {
    setSuccessMessage(null);
  };
  
  /**
   * 清除错误消息
   */
  const clearError = () => {
    setError(null);
  };

  return (
    <div className="space-y-6">
      {/* 页面标题和操作按钮 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">标签管理</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus size={18} className="mr-1" />
          <span>新建标签</span>
        </button>
      </div>
      
      {/* 搜索和筛选 */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="搜索标签名称或别名..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-600 placeholder-gray-500 bg-white"
          />
        </div>
      </div>
      
      {/* 成功消息 */}
      {successMessage && (
        <div className="flex items-center p-4 bg-green-50 border border-green-200 rounded-md">
          <CheckCircle size={20} className="text-green-500 mr-2" />
          <span className="text-green-700">{successMessage}</span>
          <button
            onClick={clearSuccessMessage}
            className="ml-auto text-green-500 hover:text-green-700"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* 错误提示 */}
      {error && (
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-md">
          <AlertCircle size={20} className="text-red-500 mr-2" />
          <span className="text-red-700">{error}</span>
          <button
            onClick={clearError}
            className="ml-auto text-red-500 hover:text-red-700"
          >
            <X size={16} />
          </button>
        </div>
      )}
      
      {/* 标签列表 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <Loader2 size={24} className="animate-spin text-blue-500" />
            <span className="ml-2 text-gray-600">加载中...</span>
          </div>
        ) : tags.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-8 text-gray-500">
            <TagIcon size={48} className="mb-4 text-gray-300" />
            <p className="text-lg font-medium mb-2">
              {searchTerm ? '没有找到匹配的标签' : '暂无标签'}
            </p>
            <p className="text-sm">
              {searchTerm ? '请尝试其他搜索关键词' : '点击"新建标签"开始创建'}
            </p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('name')}
                        className="flex items-center hover:text-gray-700"
                      >
                        标签名称
                        <ArrowUpDown size={14} className="ml-1" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('slug')}
                        className="flex items-center hover:text-gray-700"
                      >
                        别名
                        <ArrowUpDown size={14} className="ml-1" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      <button
                        onClick={() => handleSort('count')}
                        className="flex items-center hover:text-gray-700"
                      >
                        文章数量
                        <ArrowUpDown size={14} className="ml-1" />
                      </button>
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tags.map((tag) => (
                    <tr key={tag.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <TagIcon size={16} className="text-blue-500 mr-2" />
                          <span className="text-sm font-medium text-gray-900">
                            {tag.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-gray-500 font-mono">
                          {tag.slug}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <FileText size={14} className="text-gray-400 mr-1" />
                          <span className="text-sm text-gray-900">
                            {tag.count} 篇
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end space-x-2">
                          <button
                            onClick={() => openEditModal(tag)}
                            className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                            title="编辑标签"
                          >
                            <Edit size={16} />
                          </button>
                          <button
                            onClick={() => handleDeleteTag(tag.id, tag.name)}
                            className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                            title="删除标签"
                            disabled={tag.count > 0}
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {/* 分页 */}
            {showPagination && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    上一页
                  </button>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    下一页
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      显示第 <span className="font-medium">{(currentPage - 1) * pageSize + 1}</span> 到{' '}
                      <span className="font-medium">
                        {Math.min(currentPage * pageSize, totalCount)}
                      </span> 条，共{' '}
                      <span className="font-medium">{totalCount}</span> 条记录
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                      <button
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        上一页
                      </button>
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        const page = i + 1;
                        return (
                          <button
                            key={page}
                            onClick={() => handlePageChange(page)}
                            className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                              page === currentPage
                                ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                                : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                      <button
                        onClick={() => handlePageChange(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        下一页
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
      
      {/* 新增/编辑标签模态框 */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            {/* 背景遮罩 */}
            <div 
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            />
            
            {/* 模态框内容 */}
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <TagIcon size={24} className="text-blue-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {isEditing ? '编辑标签' : '新建标签'}
                    </h3>
                    <div className="mt-4 space-y-4">
                      {/* 标签名称 */}
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                          标签名称 *
                        </label>
                        <input
                          type="text"
                          id="name"
                          value={formData.name}
                          onChange={(e) => handleFormChange('name', e.target.value)}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formErrors.name ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="请输入标签名称"
                        />
                        {formErrors.name && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.name}</p>
                        )}
                      </div>
                      
                      {/* 标签别名 */}
                      <div>
                        <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
                          标签别名 *
                        </label>
                        <input
                          type="text"
                          id="slug"
                          value={formData.slug}
                          onChange={(e) => handleFormChange('slug', e.target.value)}
                          className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                            formErrors.slug ? 'border-red-300' : 'border-gray-300'
                          }`}
                          placeholder="请输入标签别名"
                        />
                        {formErrors.slug && (
                          <p className="mt-1 text-sm text-red-600">{formErrors.slug}</p>
                        )}
                        <p className="mt-1 text-xs text-gray-500">
                          别名用于URL，只能包含小写字母、数字和连字符
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 size={16} className="animate-spin mr-2" />
                      保存中...
                    </>
                  ) : (
                    '保存'
                  )}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
