'use client';

import { useState, useEffect } from 'react';
import { 
  Save, 
  Settings, 
  Globe, 
  MessageSquare, 
  Shield, 
  Loader2,
  CheckCircle,
  AlertCircle,
  X
} from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';

/**
 * 网站设置接口
 */
interface SiteSettings {
  // 基本信息
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  siteLogo?: string;
  siteFavicon?: string;
  
  // SEO设置
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  
  // 评论设置
  allowComments: boolean;
  commentModeration: boolean;
  
  // 其他设置
  postsPerPage: number;
  enableRSS: boolean;
  enableSitemap: boolean;
}

/**
 * 网站设置管理页面组件
 * 提供网站基本配置功能
 */
export default function SettingsManagement() {
  // 获取当前用户
  const { user } = useAuthStore();
  
  // 设置数据状态
  const [settings, setSettings] = useState<SiteSettings>({
    siteName: '',
    siteDescription: '',
    siteUrl: '',
    siteLogo: '',
    siteFavicon: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
    allowComments: true,
    commentModeration: false,
    postsPerPage: 10,
    enableRSS: true,
    enableSitemap: true
  });
  
  // 加载和保存状态
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  // 当前激活的标签页
  const [activeTab, setActiveTab] = useState<'basic' | 'seo' | 'comments' | 'advanced'>('basic');
  
  /**
   * 加载网站设置
   */
  const loadSettings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // 这里应该从数据库或配置文件加载设置
      // 目前使用默认值，实际项目中需要实现数据持久化
      const defaultSettings: SiteSettings = {
        siteName: '我的博客',
        siteDescription: '一个现代化的博客系统',
        siteUrl: 'https://example.com',
        siteLogo: '',
        siteFavicon: '',
        seoTitle: '我的博客 - 分享技术与生活',
        seoDescription: '一个专注于技术分享和生活感悟的博客',
        seoKeywords: '博客,技术,生活,分享',
        allowComments: true,
        commentModeration: false,
        postsPerPage: 10,
        enableRSS: true,
        enableSitemap: true
      };
      
      setSettings(defaultSettings);
    } catch (err) {
      console.error('加载设置失败:', err);
      setError('加载设置失败，请稍后重试');
    } finally {
      setIsLoading(false);
    }
  };
  
  // 初始加载
  useEffect(() => {
    loadSettings();
  }, []);
  
  /**
   * 处理设置变更
   */
  const handleSettingChange = (field: keyof SiteSettings, value: any) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  /**
   * 保存设置
   */
  const handleSaveSettings = async () => {
    try {
      setIsSaving(true);
      setError(null);
      
      // 这里应该将设置保存到数据库或配置文件
      // 目前只是模拟保存过程
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSuccessMessage('设置保存成功');
      
      // 3秒后清除成功消息
      setTimeout(() => {
        setSuccessMessage(null);
      }, 3000);
      
    } catch (err) {
      console.error('保存设置失败:', err);
      setError('保存设置失败，请稍后重试');
    } finally {
      setIsSaving(false);
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 size={24} className="animate-spin text-blue-500" />
        <span className="ml-2 text-gray-600">加载设置中...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold text-gray-800">网站设置</h1>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSaving ? (
            <>
              <Loader2 size={18} className="animate-spin mr-1" />
              <span>保存中...</span>
            </>
          ) : (
            <>
              <Save size={18} className="mr-1" />
              <span>保存设置</span>
            </>
          )}
        </button>
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
      
      {/* 设置内容 */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {/* 标签页导航 */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('basic')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'basic'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Globe size={16} className="inline mr-2" />
              基本信息
            </button>
            <button
              onClick={() => setActiveTab('seo')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'seo'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Settings size={16} className="inline mr-2" />
              SEO设置
            </button>
            <button
              onClick={() => setActiveTab('comments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'comments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <MessageSquare size={16} className="inline mr-2" />
              评论设置
            </button>
            <button
              onClick={() => setActiveTab('advanced')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'advanced'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Shield size={16} className="inline mr-2" />
              高级设置
            </button>
          </nav>
        </div>
        
        {/* 设置表单 */}
        <div className="p-6">
          {/* 基本信息 */}
          {activeTab === 'basic' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="siteName" className="block text-sm font-medium text-gray-700">
                  网站名称 *
                </label>
                <input
                  type="text"
                  id="siteName"
                  value={settings.siteName}
                  onChange={(e) => handleSettingChange('siteName', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入网站名称"
                />
              </div>
              
              <div>
                <label htmlFor="siteDescription" className="block text-sm font-medium text-gray-700">
                  网站描述
                </label>
                <textarea
                  id="siteDescription"
                  rows={3}
                  value={settings.siteDescription}
                  onChange={(e) => handleSettingChange('siteDescription', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="请输入网站描述"
                />
              </div>
              
              <div>
                <label htmlFor="siteUrl" className="block text-sm font-medium text-gray-700">
                  网站地址 *
                </label>
                <input
                  type="url"
                  id="siteUrl"
                  value={settings.siteUrl}
                  onChange={(e) => handleSettingChange('siteUrl', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="https://example.com"
                />
              </div>
              
              <div>
                <label htmlFor="siteLogo" className="block text-sm font-medium text-gray-700">
                  网站Logo
                </label>
                <input
                  type="url"
                  id="siteLogo"
                  value={settings.siteLogo}
                  onChange={(e) => handleSettingChange('siteLogo', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Logo图片URL"
                />
              </div>
              
              <div>
                <label htmlFor="siteFavicon" className="block text-sm font-medium text-gray-700">
                  网站图标
                </label>
                <input
                  type="url"
                  id="siteFavicon"
                  value={settings.siteFavicon}
                  onChange={(e) => handleSettingChange('siteFavicon', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Favicon图片URL"
                />
              </div>
            </div>
          )}
          
          {/* SEO设置 */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="seoTitle" className="block text-sm font-medium text-gray-700">
                  默认SEO标题
                </label>
                <input
                  type="text"
                  id="seoTitle"
                  value={settings.seoTitle}
                  onChange={(e) => handleSettingChange('seoTitle', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="默认的SEO标题"
                />
              </div>
              
              <div>
                <label htmlFor="seoDescription" className="block text-sm font-medium text-gray-700">
                  默认SEO描述
                </label>
                <textarea
                  id="seoDescription"
                  rows={3}
                  value={settings.seoDescription}
                  onChange={(e) => handleSettingChange('seoDescription', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="默认的SEO描述"
                />
              </div>
              
              <div>
                <label htmlFor="seoKeywords" className="block text-sm font-medium text-gray-700">
                  默认SEO关键词
                </label>
                <input
                  type="text"
                  id="seoKeywords"
                  value={settings.seoKeywords}
                  onChange={(e) => handleSettingChange('seoKeywords', e.target.value)}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="关键词用英文逗号分隔"
                />
              </div>
            </div>
          )}
          
          {/* 评论设置 */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">允许评论</label>
                  <p className="text-sm text-gray-500">是否允许访客在文章下发表评论</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.allowComments}
                    onChange={(e) => handleSettingChange('allowComments', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">评论审核</label>
                  <p className="text-sm text-gray-500">评论是否需要审核后才能显示</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.commentModeration}
                    onChange={(e) => handleSettingChange('commentModeration', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}
          
          {/* 高级设置 */}
          {activeTab === 'advanced' && (
            <div className="space-y-6">
              <div>
                <label htmlFor="postsPerPage" className="block text-sm font-medium text-gray-700">
                  每页文章数量
                </label>
                <select
                  id="postsPerPage"
                  value={settings.postsPerPage}
                  onChange={(e) => handleSettingChange('postsPerPage', parseInt(e.target.value))}
                  className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value={5}>5篇</option>
                  <option value={10}>10篇</option>
                  <option value={15}>15篇</option>
                  <option value={20}>20篇</option>
                  <option value={25}>25篇</option>
                </select>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">启用RSS</label>
                  <p className="text-sm text-gray-500">是否启用RSS订阅功能</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableRSS}
                    onChange={(e) => handleSettingChange('enableRSS', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <label className="text-sm font-medium text-gray-700">启用网站地图</label>
                  <p className="text-sm text-gray-500">是否自动生成网站地图</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={settings.enableSitemap}
                    onChange={(e) => handleSettingChange('enableSitemap', e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 