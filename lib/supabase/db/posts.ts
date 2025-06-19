import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';
import { Category } from './categories';
import { getDefaultAvatarUrl, getDisplayUsername } from '@/lib/utils/avatarUtils';

/**
 * 文章接口定义
 */
export interface Post {
  id: string; // UUID类型
  title: string;
  slug: string;
  content: any; // jsonb类型
  excerpt: string | null;
  featured_image: string | null; // 改为featured_image
  status: 'published' | 'draft';
  author_id: string; // UUID类型
  category_id: string | null; // UUID类型
  published_at: string | null; // 改为published_at
  seo_keywords: string | null; // SEO关键词
  seo_description: string | null; // SEO描述
  allow_comment: boolean; // 是否允许评论
  is_top: boolean; // 是否置顶
  created_at: string;
  updated_at: string;
  // 关联数据
  categories?: Category | null; // 关联的分类信息
}

/**
 * 文章状态
 */
export type PostStatus = 'published' | 'draft';

/**
 * 文章状态列表
 */
export const PostStatusList = function(){
  return [
    {label: '草稿', value: 'draft'},
    {label: '发布', value: 'published'},
  ];
};

/**
 * 文章创建接口
 */
export interface PostCreate {
  title: string;
  slug: string;
  content: any; // jsonb类型
  excerpt?: string | null;
  featured_image?: string | null; // 改为featured_image
  status: 'published' | 'draft';
  author_id: string; // UUID类型
  category_id?: string | null; // UUID类型
  published_at?: string | null; // 改为published_at
  seo_keywords?: string | null; // SEO关键词
  seo_description?: string | null; // SEO描述
  allow_comment?: boolean; // 是否允许评论
  is_top?: boolean; // 是否置顶
}

/**
 * 文章更新接口
 */
export interface PostUpdate {
  title?: string;
  slug?: string;
  content?: any; // jsonb类型
  excerpt?: string | null;
  featured_image?: string | null; // 改为featured_image
  status?: 'published' | 'draft';
  category_id?: string | null; // UUID类型
  published_at?: string | null; // 改为published_at
  seo_keywords?: string | null; // SEO关键词
  seo_description?: string | null; // SEO描述
  allow_comment?: boolean; // 是否允许评论
  is_top?: boolean; // 是否置顶
}

/**
 * 文章查询参数接口
 */
export interface PostQueryParams {
  page?: number;
  pageSize?: number;
  status?: 'published' | 'draft' | 'all';
  authorId?: string;
  categoryId?: string; // UUID类型
  searchTerm?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
  tagId?: string; // 新增标签过滤
  isTop?: boolean; // 是否置顶过滤
}

/**
 * 文章分页结果接口
 */
export interface PostPaginationResult {
  data: Post[] | null;
  count: number | null;
  error: PostgrestError | null;
}

// 定义联表查询结果接口
interface PostTagResult {
  posts: Post;
}

/**
 * 获取文章列表
 * @param params 查询参数
 * @returns 文章列表和分页信息
 */
export async function getPosts(params: PostQueryParams = {}): Promise<PostPaginationResult> {
  try {
    console.log('🔍 获取文章列表，参数:', params);
    
    const {
      page = 1,
      pageSize = 10,
      status = 'all',
      authorId,
      categoryId,
      tagId,
      searchTerm,
      orderBy = 'created_at',
      orderDirection = 'desc',
      isTop
    } = params;
    
    // 计算分页偏移量
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // 如果需要根据标签过滤，使用不同的查询方式
    if (tagId) {
      // 使用联表查询获取带有特定标签的文章
      let query = supabase
        .from('post_tags')
        .select('posts!inner(*, categories(id, name))')
        .eq('tag_id', tagId);
      
      // 应用额外的过滤条件
      if (status !== 'all') {
        query = query.eq('posts.status', status);
      }
      
      if (authorId) {
        query = query.eq('posts.author_id', authorId);
      }
      
      if (categoryId) {
        query = query.eq('posts.category_id', categoryId);
      }
      
      if (searchTerm) {
        query = query.ilike('posts.title', `%${searchTerm}%`);
      }
      
      if (isTop !== undefined) {
        query = query.eq('posts.is_top', isTop);
      }
      
      // 应用排序和分页
      const { data: taggedPostsData, error, count } = await query
        .order(`posts.${orderBy}`, { ascending: orderDirection === 'asc' })
        .range(from, to);
      
      if (error) {
        console.error('❌ 获取标签文章列表失败:', error);
        return { data: null, count: null, error };
      }
      
      // 提取文章数据，使用unknown进行类型转换
      const posts = ((taggedPostsData as unknown) as PostTagResult[]).map(item => item.posts);
      console.log(`📊 查询结果: 获取到 ${posts.length} 篇标签文章`);
      
      return { data: posts, count, error };
    } else {
      // 常规文章查询
      let query = supabase
        .from('posts')
        .select('*, categories(id, name)', { count: 'exact' });
      
      // 应用过滤条件
      if (status !== 'all') {
        query = query.eq('status', status);
      }
      
      if (authorId) {
        query = query.eq('author_id', authorId);
      }
      
      if (categoryId) {
        query = query.eq('category_id', categoryId);
      }
      
      if (searchTerm) {
        query = query.ilike('title', `%${searchTerm}%`);
      }
      
      if (isTop !== undefined) {
        query = query.eq('is_top', isTop);
      }
      
      // 应用排序和分页
      const { data, error, count } = await query
        .order(orderBy, { ascending: orderDirection === 'asc' })
        .range(from, to);
      
      console.log(`📊 查询结果: 获取到 ${data?.length} 篇文章，总数: ${count}`);
      if (data && data.length > 0) {
        console.log('🔍 查询结果: 第一篇文章数据结构:', JSON.stringify(data[0], null, 2));
      }
      
      if (error) {
        console.error('❌ 获取文章列表失败:', error);
      }
      
      return { data, count, error };
    }
  } catch (error) {
    console.error('❌ 获取文章列表异常:', error);
    return { 
      data: null, 
      count: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 获取单篇文章详情（通过ID）
 * @param id 文章ID
 * @returns 文章详情
 */
export async function getPostById(id: string): Promise<{
  data: Post | null;
  error: PostgrestError | null;
}> {
  try {
    console.log(`🔍 获取文章详情，ID: ${id}`);
    
    const { data, error } = await supabase
      .from('posts')
      .select('*, categories(id, name)')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`❌ 获取文章详情失败，ID: ${id}`, error);
    } else {
      console.log(`✅ 成功获取文章详情，ID: ${id}`);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 获取文章详情异常，ID: ${id}`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 获取带标签的文章详情（联表作者、分类、标签，结构与前端mock一致）
 * @param id 文章ID
 * @returns 文章详情（包含author、category、tags）
 */
export async function getPostWithTags(id: string): Promise<{
  data: any | null;
  error: PostgrestError | null;
}> {
  try {
    console.log(`🔍 获取带标签的文章详情，ID: ${id}`);
    
    // 联表查询作者、分类、标签
    const { data: post, error } = await supabase
      .from('posts')
      .select(`
        id, title, content, excerpt, featured_image, status, published_at,
        seo_keywords, seo_description, allow_comment, is_top,
        users!posts_author_id_fkey(id, username, avatar_url, email),
        categories!posts_category_id_fkey(id, name),
        post_tags(tags(id, name))
      `)
      .eq('id', id)
      .single();

    if (error) {
      console.error(`❌ 获取带标签的文章详情失败，ID: ${id}`, error);
      return { data: null, error };
    }

    if (!post) {
      console.log(`❌ 未找到文章，ID: ${id}`);
      return { data: null, error: null };
    }

    // 扁平化标签数组
    const tags = post?.post_tags?.map((pt: any) => pt.tags) ?? [];

    // 处理作者信息，确保结构与前端期望一致
    // Supabase 返回的关联数据可能是数组，取第一个元素
    const authorData = Array.isArray(post.users) ? post.users[0] : post.users;
    const categoryData = Array.isArray(post.categories) ? post.categories[0] : post.categories;

    // 使用工具函数处理用户名和头像
    const username = getDisplayUsername(authorData?.username, authorData?.email);
    const avatarUrl = authorData?.avatar_url || getDefaultAvatarUrl(authorData?.email, username);

    const processedPost = {
      ...post,
      author: {
        id: authorData?.id || '',
        username: username,
        avatar_url: avatarUrl
      },
      category: {
        id: categoryData?.id || '',
        name: categoryData?.name || '未分类'
      },
      tags,
      // 添加默认的统计信息（如果数据库中没有这些字段）
      views: 0,
      likes: 0,
      comments_count: 0
    };

    console.log(`✅ 成功获取带标签的文章详情，ID: ${id}`, {
      title: processedPost.title,
      author: processedPost.author.username,
      category: processedPost.category.name,
      tagsCount: processedPost.tags.length
    });

    return {
      data: processedPost,
      error: null
    };
  } catch (error) {
    console.error(`❌ 获取带标签的文章详情异常，ID: ${id}`, error);
    return {
      data: null,
      error: error as PostgrestError
    };
  }
}

/**
 * 获取单篇文章详情（通过slug）
 * @param slug 文章slug
 * @returns 文章详情
 */
export async function getPostBySlug(slug: string): Promise<{
  data: Post | null;
  error: PostgrestError | null;
}> {
  try {
    console.log(`🔍 获取文章详情，Slug: ${slug}`);
    
    const { data, error } = await supabase
      .from('posts')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`❌ 获取文章详情失败，Slug: ${slug}`, error);
    } else {
      console.log(`✅ 成功获取文章详情，Slug: ${slug}`);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 获取文章详情异常，Slug: ${slug}`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 创建文章
 * @param postData 文章数据
 * @returns 创建的文章
 */
export async function createPost(postData: PostCreate): Promise<{
  data: Post | null;
  error: PostgrestError | null;
}> {
  try {
    console.log('📝 创建新文章:', postData.title);
    
    // 如果是已发布状态但没有发布日期，则设置为当前日期
    if (postData.status === 'published' && !postData.published_at) {
      postData.published_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('posts')
      .insert(postData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ 创建文章失败:', error);
    } else {
      console.log(`✅ 文章创建成功，ID: ${data.id}`);
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ 创建文章异常:', error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 更新文章
 * @param id 文章ID
 * @param postData 更新的文章数据
 * @returns 更新后的文章
 */
export async function updatePost(id: string, postData: PostUpdate): Promise<{
  data: Post | null;
  error: PostgrestError | null;
}> {
  try {
    console.log(`📝 更新文章，ID: ${id}`);
    
    // 如果状态从草稿改为已发布，且没有发布日期，则设置为当前日期
    if (postData.status === 'published' && !postData.published_at) {
      postData.published_at = new Date().toISOString();
    }
    
    // 更新时间会通过触发器自动更新
    
    const { data, error } = await supabase
      .from('posts')
      .update(postData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`❌ 更新文章失败，ID: ${id}`, error);
    } else {
      console.log(`✅ 文章更新成功，ID: ${id}`);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 更新文章异常，ID: ${id}`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 删除文章
 * @param id 文章ID
 * @returns 操作结果
 */
export async function deletePost(id: string): Promise<{
  success: boolean;
  error: PostgrestError | null;
}> {
  try {
    console.log(`🗑️ 删除文章，ID: ${id}`);
    
    const { error } = await supabase
      .from('posts')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`❌ 删除文章失败，ID: ${id}`, error);
      return { success: false, error };
    } else {
      console.log(`✅ 文章删除成功，ID: ${id}`);
      return { success: true, error: null };
    }
  } catch (error) {
    console.error(`❌ 删除文章异常，ID: ${id}`, error);
    return { 
      success: false, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 更新文章状态
 * @param id 文章ID
 * @param status 新状态
 * @returns 更新后的文章
 */
export async function updatePostStatus(id: string, status: 'published' | 'draft'): Promise<{
  data: Post | null;
  error: PostgrestError | null;
}> {
  try {
    console.log(`📊 更新文章状态，ID: ${id}, 新状态: ${status}`);
    
    // 准备更新数据
    const updateData: any = {
      status
    };
    
    // 如果发布文章，设置发布日期
    if (status === 'published') {
      updateData.published_at = new Date().toISOString();
    }
    
    const { data, error } = await supabase
      .from('posts')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`❌ 更新文章状态失败，ID: ${id}`, error);
    } else {
      console.log(`✅ 文章状态更新成功，ID: ${id}, 新状态: ${status}`);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 更新文章状态异常，ID: ${id}`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 获取作者的文章统计
 * @param authorId 作者ID
 * @returns 文章统计信息
 */
export async function getAuthorPostStats(authorId: string): Promise<{
  data: {
    total: number;
    published: number;
    draft: number;
  } | null;
  error: PostgrestError | null;
}> {
  try {
    console.log(`📊 获取作者文章统计，作者ID: ${authorId}`);
    
    // 获取所有文章
    const { data, error } = await supabase
      .from('posts')
      .select('id, status')
      .eq('author_id', authorId);
    
    if (error) {
      console.error(`❌ 获取作者文章统计失败，作者ID: ${authorId}`, error);
      return { data: null, error };
    }
    
    // 计算统计信息
    const stats = {
      total: data.length,
      published: data.filter(post => post.status === 'published').length,
      draft: data.filter(post => post.status === 'draft').length
    };
    
    console.log(`✅ 获取作者文章统计成功，作者ID: ${authorId}`, stats);
    
    return { data: stats, error: null };
  } catch (error) {
    console.error(`❌ 获取作者文章统计异常，作者ID: ${authorId}`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 检查文章slug是否可用
 * @param slug 要检查的slug
 * @param excludeId 排除的文章ID（用于更新时检查）
 * @returns slug是否可用
 */
export async function isSlugAvailable(slug: string, excludeId?: string): Promise<{
  available: boolean;
  error: PostgrestError | null;
}> {
  try {
    console.log(`🔍 检查slug是否可用: ${slug}`);
    
    let query = supabase
      .from('posts')
      .select('id')
      .eq('slug', slug);
    
    // 如果提供了excludeId，排除该ID的文章
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`❌ 检查slug可用性失败: ${slug}`, error);
      return { available: false, error };
    }
    
    // 如果没有找到匹配的记录，则slug可用
    const available = data.length === 0;
    console.log(`✅ slug "${slug}" ${available ? '可用' : '已存在'}`);
    
    return { available, error: null };
  } catch (error) {
    console.error(`❌ 检查slug可用性异常: ${slug}`, error);
    return { 
      available: false, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 设置文章标签
 * @param postId 文章ID
 * @param tagIds 标签ID数组
 * @returns 操作结果
 */
export async function setPostTags(postId: string, tagIds: string[]): Promise<{
  success: boolean;
  error: PostgrestError | null;
}> {
  try {
    console.log(`🏷️ 设置文章标签，文章ID: ${postId}, 标签数: ${tagIds.length}`);
    
    // 开始事务操作
    // 1. 删除所有现有标签
    const { error: deleteError } = await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', postId);
    
    if (deleteError) {
      console.error(`❌ 删除现有标签失败，文章ID: ${postId}`, deleteError);
      return { success: false, error: deleteError };
    }
    
    // 如果没有新标签，则直接返回成功
    if (tagIds.length === 0) {
      console.log(`✅ 文章标签清空成功，文章ID: ${postId}`);
      return { success: true, error: null };
    }
    
    // 2. 添加新标签
    const postTags = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }));
    
    const { error: insertError } = await supabase
      .from('post_tags')
      .insert(postTags);
    
    if (insertError) {
      console.error(`❌ 添加新标签失败，文章ID: ${postId}`, insertError);
      return { success: false, error: insertError };
    }
    
    console.log(`✅ 文章标签设置成功，文章ID: ${postId}`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`❌ 设置文章标签异常，文章ID: ${postId}`, error);
    return { 
      success: false, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 获取文章标签
 * @param postId 文章ID
 * @returns 文章标签
 */
export async function getPostTags(postId: string): Promise<{
  data: any[] | null;
  error: PostgrestError | null;
}> {
  try {
    console.log(`🔍 获取文章标签，文章ID: ${postId}`);
    
    const { data, error } = await supabase
      .from('post_tags')
      .select('tags(*)')
      .eq('post_id', postId);
    
    if (error) {
      console.error(`❌ 获取文章标签失败，文章ID: ${postId}`, error);
      return { data: null, error };
    }
    
    // 提取标签信息
    const tags = data.map(item => item.tags);
    
    console.log(`✅ 获取文章标签成功，文章ID: ${postId}, 标签数: ${tags.length}`);
    return { data: tags, error: null };
  } catch (error) {
    console.error(`❌ 获取文章标签异常，文章ID: ${postId}`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}