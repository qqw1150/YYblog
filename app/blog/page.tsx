import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { formatDate } from '@/utils/dateFormatter';

// 模拟博客列表数据
const mockPosts = [
  {
    id: '1',
    title: '探索现代Web开发：Next.js 与 React 的最佳实践',
    excerpt: '在当今快速发展的Web开发领域，选择合适的技术栈对于构建高性能、可维护的应用程序至关重要。Next.js作为一个基于React的全栈框架，提供了许多开箱即用的功能。',
    author: {
      id: '101',
      name: '张三',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80'
    },
    category: {
      id: '201',
      name: '前端开发'
    },
    tags: [
      { id: '301', name: 'React' },
      { id: '302', name: 'Next.js' }
    ],
    published_at: '2023-08-15T08:30:00Z',
    featured_image: 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    views: 1234,
    comments_count: 23
  },
  {
    id: '2',
    title: 'TypeScript高级类型技巧：提升代码质量与开发效率',
    excerpt: 'TypeScript的类型系统提供了强大的工具来确保代码质量和提高开发效率。本文将探讨一些高级类型技巧，帮助你充分利用TypeScript的类型系统。',
    author: {
      id: '102',
      name: '李四',
      avatar: 'https://images.unsplash.com/photo-1599566150163-29194dcaad36?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80'
    },
    category: {
      id: '202',
      name: 'TypeScript'
    },
    tags: [
      { id: '304', name: 'TypeScript' },
      { id: '305', name: '前端开发' }
    ],
    published_at: '2023-07-22T10:15:00Z',
    featured_image: 'https://images.unsplash.com/photo-1627398242454-45a1465c2479?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1774&q=80',
    views: 856,
    comments_count: 15
  },
  {
    id: '3',
    title: '深入理解React Hooks：自定义Hook的设计与实践',
    excerpt: 'React Hooks改变了我们编写React组件的方式。通过自定义Hooks，我们可以将组件逻辑提取到可重用的函数中。本文将深入探讨自定义Hook的设计原则和最佳实践。',
    author: {
      id: '101',
      name: '张三',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80'
    },
    category: {
      id: '201',
      name: '前端开发'
    },
    tags: [
      { id: '301', name: 'React' },
      { id: '306', name: 'Hooks' }
    ],
    published_at: '2023-06-18T14:45:00Z',
    featured_image: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    views: 1542,
    comments_count: 31
  },
  {
    id: '4',
    title: '现代CSS布局技巧：Grid与Flexbox实战指南',
    excerpt: 'CSS Grid和Flexbox为Web布局提供了强大而灵活的工具。本文将通过实际案例，展示如何结合使用这两种布局技术来创建复杂而响应式的界面。',
    author: {
      id: '103',
      name: '王五',
      avatar: 'https://images.unsplash.com/photo-1603415526960-f7e0328c63b1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=120&q=80'
    },
    category: {
      id: '203',
      name: 'CSS'
    },
    tags: [
      { id: '307', name: 'CSS' },
      { id: '308', name: '响应式设计' }
    ],
    published_at: '2023-05-10T09:20:00Z',
    featured_image: 'https://images.unsplash.com/photo-1507721999472-8ed4421c4af2?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80',
    views: 2105,
    comments_count: 42
  }
];

// 模拟分类数据
const mockCategories = [
  { id: '201', name: '前端开发', count: 23 },
  { id: '202', name: 'TypeScript', count: 12 },
  { id: '203', name: 'CSS', count: 18 },
  { id: '204', name: 'JavaScript', count: 27 },
  { id: '205', name: '后端开发', count: 15 }
];

// 模拟标签数据
const mockTags = [
  { id: '301', name: 'React', count: 18 },
  { id: '302', name: 'Next.js', count: 12 },
  { id: '303', name: '开发最佳实践', count: 8 },
  { id: '304', name: 'TypeScript', count: 14 },
  { id: '305', name: '前端开发', count: 25 },
  { id: '306', name: 'Hooks', count: 10 },
  { id: '307', name: 'CSS', count: 16 },
  { id: '308', name: '响应式设计', count: 9 }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen relative bg-gray-50">
      {/* 页面头部 */}
      <div className="relative py-20 z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10 mix-blend-overlay"></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10">
          <div className="relative">
            <div className="absolute -left-8 -top-8 w-24 h-24 bg-gradient-to-r from-indigo-400/20 to-purple-400/20 rounded-full blur-xl"></div>
            <h1 className="text-5xl font-bold text-gray-900 mb-6 drop-shadow-sm relative">博客文章</h1>
            <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-gradient-to-r from-pink-400/20 to-rose-400/20 rounded-full blur-xl"></div>
          </div>
          <p className="text-gray-700 text-xl max-w-3xl font-medium">探索最新的Web开发技术、教程和最佳实践，提升您的开发技能和知识</p>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 py-12 relative z-10">
        <div className="flex flex-col md:flex-row gap-8">
          {/* 文章列表 */}
          <div className="w-full md:w-2/3">
            {/* 特色文章 */}
            <div className="mb-12">
              <Link href={`/blog/${mockPosts[0].id}`} className="block group">
                <div className="relative h-[500px] w-full overflow-hidden rounded-2xl shadow-2xl border border-gray-300">
                  <Image 
                    src={mockPosts[0].featured_image} 
                    alt={mockPosts[0].title}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-10 text-white">
                    <div className="mb-4">
                      <span className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xs px-4 py-2 rounded-full font-medium shadow-lg border border-white/30">{mockPosts[0].category.name}</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4 group-hover:text-indigo-300 transition-colors duration-300 drop-shadow-md">{mockPosts[0].title}</h2>
                    <p className="mb-6 text-white/90 text-xl max-w-3xl leading-relaxed drop-shadow-sm">{mockPosts[0].excerpt}</p>
                    <div className="flex items-center mt-6 bg-black/30 p-3 rounded-xl backdrop-blur-sm max-w-max border border-white/30">
                      <div className="relative">
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full blur opacity-70"></div>
                        <Image 
                          src={mockPosts[0].author.avatar} 
                          alt={mockPosts[0].author.name}
                          width={50} 
                          height={50} 
                          className="rounded-full mr-4 border-2 border-white relative"
                        />
                      </div>
                      <div>
                        <p className="font-medium text-lg">{mockPosts[0].author.name}</p>
                        <p className="text-sm text-white/80">{formatDate(mockPosts[0].published_at)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
            
            {/* 文章列表 */}
            <div className="grid grid-cols-1 gap-10">
              {mockPosts.slice(1).map(post => (
                <article key={post.id} className="group bg-white rounded-xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-300">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-2/5 relative overflow-hidden">
                      <Link href={`/blog/${post.id}`} className="block relative h-60 md:h-full w-full">
                        <Image 
                          src={post.featured_image} 
                          alt={post.title}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </Link>
                    </div>
                    <div className="md:w-3/5 p-8">
                      <div className="flex items-center gap-3 mb-3">
                        <Link 
                          href={`/blog/category/${post.category.id}`}
                          className="text-xs bg-indigo-50 hover:bg-indigo-100 text-indigo-700 px-3 py-1.5 rounded-full font-medium transition-all shadow-sm hover:shadow border border-indigo-300"
                        >
                          {post.category.name}
                        </Link>
                        <span className="flex items-center text-gray-500 text-sm">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(post.published_at)}
                        </span>
                      </div>
                      <Link href={`/blog/${post.id}`} className="block">
                        <h2 className="text-xl md:text-2xl font-bold mb-3 text-gray-900 group-hover:text-indigo-600 transition-colors">{post.title}</h2>
                      </Link>
                      <p className="text-gray-600 mb-6 line-clamp-2 leading-relaxed">{post.excerpt}</p>
                      
                      <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-300">
                        <div className="flex items-center">
                          <div className="relative">
                            <div className="absolute -inset-0.5 bg-gradient-to-r from-indigo-500/40 to-purple-500/40 rounded-full blur opacity-50 group-hover:opacity-100 transition-opacity"></div>
                            <Image 
                              src={post.author.avatar} 
                              alt={post.author.name}
                              width={36} 
                              height={36} 
                              className="rounded-full mr-3 border-2 border-white relative shadow-sm"
                            />
                          </div>
                          <span className="text-sm font-medium text-gray-700">{post.author.name}</span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-500">
                          <div className="flex items-center group/views hover:text-indigo-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 group-hover/views:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {post.views}
                          </div>
                          <div className="flex items-center group/comments hover:text-indigo-600 transition-colors">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-gray-400 group-hover/comments:text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                            </svg>
                            {post.comments_count}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            
            {/* 分页 */}
            <div className="mt-16 flex justify-center">
              <div className="flex space-x-3">
                <button className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-500 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  上一页
                </button>
                <button className="px-4 py-2.5 border border-transparent rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:from-indigo-700 hover:to-purple-700 shadow-md hover:shadow-lg transition-all duration-300">
                  1
                </button>
                <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300">
                  2
                </button>
                <button className="px-4 py-2.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-200 shadow-md hover:shadow-lg transition-all duration-300">
                  3
                </button>
                <button className="px-5 py-2.5 border border-gray-200 rounded-lg text-gray-700 bg-white hover:bg-gray-50 shadow-md hover:shadow-lg transition-all duration-300 flex items-center">
                  下一页
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
          
          {/* 侧边栏 */}
          <div className="w-full md:w-1/3">
            <div className="sticky top-8">
              {/* 搜索框 */}
              <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  搜索文章
                </h2>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="输入关键词搜索..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow transition-all duration-300"
                  />
                  <button className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2 rounded-md hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 shadow-md border border-white/30">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                </div>
              </div>
              
              {/* 分类 */}
              <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  文章分类
                </h2>
                <ul className="space-y-3">
                  {mockCategories.map(category => (
                    <li key={category.id}>
                      <Link
                        href={`/blog/category/${category.id}`}
                        className="flex justify-between items-center py-2.5 px-3 rounded-lg text-gray-700 hover:text-indigo-600 hover:bg-indigo-50 transition-all duration-300 group border border-transparent hover:border-indigo-300"
                      >
                        <span className="group-hover:translate-x-1 transition-transform duration-300">{category.name}</span>
                        <span className="bg-indigo-100 text-indigo-600 text-xs px-2.5 py-1 rounded-full font-medium border border-indigo-300">
                          {category.count}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
              
              {/* 标签云 */}
              <div className="bg-white p-6 rounded-xl shadow-xl mb-8 border border-gray-300">
                <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                  </svg>
                  热门标签
                </h2>
                <div className="flex flex-wrap gap-2">
                  {mockTags.map(tag => (
                    <Link
                      key={tag.id}
                      href={`/blog/tag/${tag.id}`}
                      className="bg-gray-50 hover:bg-indigo-100 text-gray-700 hover:text-indigo-700 px-3 py-1.5 rounded-full text-sm border border-gray-300 hover:border-indigo-400 transition-all duration-300 shadow-sm hover:shadow hover:scale-105"
                    >
                      #{tag.name} <span className="font-medium">{tag.count}</span>
                    </Link>
                  ))}
                </div>
              </div>
              
              {/* 热门文章 */}
              <div className="bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6 rounded-xl shadow-xl border border-indigo-300">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                  热门文章
                </h2>
                <div className="space-y-6">
                  {mockPosts.slice(0, 3).map(post => (
                    <div key={post.id} className="flex gap-4 group">
                      <div className="flex-shrink-0">
                        <Link href={`/blog/${post.id}`} className="block relative h-20 w-20 overflow-hidden rounded-xl shadow-md border border-white">
                          <Image 
                            src={post.featured_image} 
                            alt={post.title}
                            fill
                            className="object-cover transition-transform group-hover:scale-110 duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </Link>
                      </div>
                      <div className="flex-grow">
                        <Link href={`/blog/${post.id}`} className="block group-hover:text-indigo-600 transition-colors">
                          <h3 className="font-medium line-clamp-2 text-gray-900 group-hover:text-indigo-600">{post.title}</h3>
                        </Link>
                        <p className="text-gray-500 text-xs mt-2 flex items-center">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {formatDate(post.published_at)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
