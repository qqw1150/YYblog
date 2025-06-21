import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * 标签接口定义
 */
export interface Tag {
  id: string; // UUID类型
  name: string;
  slug: string;
}

/**
 * 标签创建接口
 */
export interface TagCreate {
  name: string;
  slug: string;
}

/**
 * 标签更新接口
 */
export interface TagUpdate {
  name?: string;
  slug?: string;
}

/**
 * 标签查询参数接口
 */
export interface TagQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * 标签分页结果接口
 */
export interface TagPaginationResult {
  data: Tag[] | null;
  count: number | null;
  error: PostgrestError | null;
}

/**
 * 获取标签列表
 * @param params 查询参数
 * @returns 标签列表和分页信息
 */
export async function getTags(params: TagQueryParams = {}): Promise<TagPaginationResult> {
  try {
    console.log('🔍 获取标签列表，参数:', params);
    
    const {
      page = 1,
      pageSize = 50,
      searchTerm,
      orderBy = 'name',
      orderDirection = 'asc'
    } = params;
    
    // 计算分页偏移量
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    
    // 构建查询
    let query = supabase
      .from('tags')
      .select('*', { count: 'exact' });
    
    // 应用搜索条件
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    // 应用排序和分页
    const { data, error, count } = await query
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);
    
    console.log(`📊 查询结果: 获取到 ${data?.length} 个标签，总数: ${count}`);
    
    if (error) {
      console.error('❌ 获取标签列表失败:', error);
    }
    
    return { data, count, error };
  } catch (error) {
    console.error('❌ 获取标签列表异常:', error);
    return { 
      data: null, 
      count: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 获取所有标签（不分页）
 * @returns 所有标签列表
 */
export async function getAllTags(): Promise<{
  data: Tag[] | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ 获取所有标签失败:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ 获取所有标签异常:', error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 通过ID获取标签
 * @param id 标签ID
 * @returns 标签信息
 */
export async function getTagById(id: string): Promise<{
  data: Tag | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`❌ 获取标签 ID:${id} 失败:`, error);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 获取标签 ID:${id} 异常:`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 通过slug获取标签
 * @param slug 标签slug
 * @returns 标签信息
 */
export async function getTagBySlug(slug: string): Promise<{
  data: Tag | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`❌ 获取标签 slug:${slug} 失败:`, error);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 获取标签 slug:${slug} 异常:`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 创建标签
 * @param tagData 标签数据
 * @returns 创建的标签
 */
export async function createTag(tagData: TagCreate): Promise<{
  data: Tag | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .insert(tagData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ 创建标签失败:', error);
    } else {
      console.log('✅ 标签创建成功:', data.name);
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ 创建标签异常:', error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 批量创建标签
 * @param tagNames 标签名称数组
 * @returns 创建的标签数组
 */
export async function createTagsFromNames(tagNames: string[]): Promise<{
  data: Tag[] | null;
  error: PostgrestError | null;
}> {
  try {
    // 过滤掉空值并转换为小写
    const validTagNames = tagNames
      .map(name => name.trim())
      .filter(name => name.length > 0);
    
    if (validTagNames.length === 0) {
      return { data: [], error: null };
    }
    
    console.log('🏷️ 开始处理标签:', validTagNames);
    
    // 1. 先查询已存在的标签
    const { data: existingTags, error: fetchError } = await supabase
      .from('tags')
      .select('*')
      .in('name', validTagNames);
    
    if (fetchError) {
      console.error('❌ 查询已存在标签失败:', fetchError);
      return { data: null, error: fetchError };
    }
    
    // 2. 找出需要创建的新标签
    const existingTagNames = existingTags?.map(tag => tag.name) || [];
    const newTagNames = validTagNames.filter(name => !existingTagNames.includes(name));
    
    console.log('📋 已存在标签:', existingTagNames);
    console.log('🆕 需要创建的新标签:', newTagNames);
    
    let newlyCreatedTags: Tag[] = [];
    
    // 3. 创建新标签
    if (newTagNames.length > 0) {
      const tagsToCreate = newTagNames.map(name => ({
        name,
        slug: name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9\-]/g, '')
      }));
      
      const { data: createdTags, error: createError } = await supabase
        .from('tags')
        .insert(tagsToCreate)
        .select();
      
      if (createError) {
        console.error('❌ 创建新标签失败:', createError);
        return { data: null, error: createError };
      }
      
      newlyCreatedTags = createdTags || [];
      console.log('✅ 成功创建新标签:', newlyCreatedTags.map(tag => tag.name));
    }
    
    // 4. 合并所有标签（已存在的 + 新创建的）
    const allTags = [...(existingTags || []), ...newlyCreatedTags];
    
    console.log(`✅ 成功处理 ${allTags.length} 个标签`);
    return { data: allTags, error: null };
  } catch (error) {
    console.error('❌ 批量创建标签异常:', error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 更新标签
 * @param id 标签ID
 * @param tagData 标签更新数据
 * @returns 更新后的标签
 */
export async function updateTag(id: string, tagData: TagUpdate): Promise<{
  data: Tag | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('tags')
      .update(tagData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`❌ 更新标签 ID:${id} 失败:`, error);
    } else {
      console.log(`✅ 标签 ID:${id} 更新成功`);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 更新标签 ID:${id} 异常:`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 删除标签
 * @param id 标签ID
 * @returns 操作结果
 */
export async function deleteTag(id: string): Promise<{
  success: boolean;
  error: PostgrestError | null;
}> {
  try {
    const { error } = await supabase
      .from('tags')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`❌ 删除标签 ID:${id} 失败:`, error);
      return { success: false, error };
    }
    
    console.log(`✅ 标签 ID:${id} 删除成功`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`❌ 删除标签 ID:${id} 异常:`, error);
    return { 
      success: false, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 检查slug是否可用
 * @param slug 要检查的slug
 * @param excludeId 排除的标签ID（用于更新时检查）
 * @returns 是否可用
 */
export async function isTagSlugAvailable(slug: string, excludeId?: string): Promise<{
  available: boolean;
  error: PostgrestError | null;
}> {
  try {
    let query = supabase
      .from('tags')
      .select('id')
      .eq('slug', slug);
    
    // 如果提供了excludeId，排除当前标签
    if (excludeId) {
      query = query.neq('id', excludeId);
    }
    
    const { data, error } = await query;
    
    if (error) {
      console.error(`❌ 检查标签slug可用性失败:`, error);
      return { available: false, error };
    }
    
    // 如果没有找到记录，则slug可用
    const available = data.length === 0;
    return { available, error: null };
  } catch (error) {
    console.error(`❌ 检查标签slug可用性异常:`, error);
    return { 
      available: false, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 获取标签统计信息（包含每个标签的文章数量）
 * @returns 标签统计信息
 */
export async function getTagStats(): Promise<{
  data: { id: string; name: string; slug: string; count: number }[] | null;
  error: PostgrestError | null;
}> {
  try {
    // 首先获取所有标签
    const { data: tags, error: tagsError } = await supabase
      .from('tags')
      .select('id, name, slug')
      .order('name');
    
    if (tagsError) {
      console.error('❌ 获取标签列表失败:', tagsError);
      return { data: null, error: tagsError };
    }

    if (!tags || tags.length === 0) {
      return { data: [], error: null };
    }

    // 获取每个标签的文章数量
    const tagStats = await Promise.all(
      tags.map(async (tag) => {
        const { count, error: countError } = await supabase
          .from('post_tags')
          .select('*', { count: 'exact', head: true })
          .eq('tag_id', tag.id);

        if (countError) {
          console.error(`❌ 获取标签 ${tag.name} 文章数量失败:`, countError);
          return {
            id: tag.id,
            name: tag.name,
            slug: tag.slug,
            count: 0
          };
        }

        return {
          id: tag.id,
          name: tag.name,
          slug: tag.slug,
          count: count || 0
        };
      })
    );
    
    console.log(`✅ 成功获取 ${tagStats.length} 个标签的统计信息:`, tagStats);
    return { data: tagStats, error: null };
  } catch (error) {
    console.error('❌ 获取标签统计信息异常:', error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 根据文章ID获取文章标签
 * @param postId 文章ID
 * @returns 标签列表
 */
export async function getTagsByPostId(postId: string): Promise<{
  data: Tag[] | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('post_tags')
      .select('tags(*)')
      .eq('post_id', postId);
    
    if (error) {
      console.error(`❌ 获取文章 ID:${postId} 的标签失败:`, error);
      return { data: null, error };
    }
    
    // 将结果转换为标签数组
    const tags = data.map((item: any) => item.tags);
    return { data: tags, error: null };
  } catch (error) {
    console.error(`❌ 获取文章 ID:${postId} 的标签异常:`, error);
    return { 
      data: null, 
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
    // 删除现有的文章-标签关联
    const { error: deleteError } = await supabase
      .from('post_tags')
      .delete()
      .eq('post_id', postId);
    
    if (deleteError) {
      console.error(`❌ 删除文章 ID:${postId} 的现有标签失败:`, deleteError);
      return { success: false, error: deleteError };
    }
    
    // 如果没有新标签，则直接返回成功
    if (tagIds.length === 0) {
      return { success: true, error: null };
    }
    
    // 创建新的文章-标签关联
    const postTags = tagIds.map(tagId => ({
      post_id: postId,
      tag_id: tagId
    }));
    
    const { error: insertError } = await supabase
      .from('post_tags')
      .insert(postTags);
    
    if (insertError) {
      console.error(`❌ 为文章 ID:${postId} 添加标签失败:`, insertError);
      return { success: false, error: insertError };
    }
    
    console.log(`✅ 文章 ID:${postId} 标签设置成功`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`❌ 设置文章 ID:${postId} 标签异常:`, error);
    return { 
      success: false, 
      error: error as PostgrestError 
    };
  }
}
