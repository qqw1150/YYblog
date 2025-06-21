import { supabase } from '@/lib/supabase/client';
import { PostgrestError } from '@supabase/supabase-js';

/**
 * 分类接口定义
 */
export interface Category {
  id: string; // UUID类型
  name: string;
  slug: string;
  description: string | null;
}

/**
 * 分类创建接口
 */
export interface CategoryCreate {
  name: string;
  slug: string;
  description?: string | null;
}

/**
 * 分类更新接口
 */
export interface CategoryUpdate {
  name?: string;
  slug?: string;
  description?: string | null;
}

/**
 * 分类查询参数接口
 */
export interface CategoryQueryParams {
  page?: number;
  pageSize?: number;
  searchTerm?: string;
  orderBy?: string;
  orderDirection?: 'asc' | 'desc';
}

/**
 * 分类分页结果接口
 */
export interface CategoryPaginationResult {
  data: Category[] | null;
  count: number | null;
  error: PostgrestError | null;
}

/**
 * 获取分类列表
 * @param params 查询参数
 * @returns 分类列表和分页信息
 */
export async function getCategories(params: CategoryQueryParams = {}): Promise<CategoryPaginationResult> {
  try {
    console.log('🔍 获取分类列表，参数:', params);
    
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
      .from('categories')
      .select('*', { count: 'exact' });
    
    // 应用搜索条件
    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`);
    }
    
    // 应用排序和分页
    const { data, error, count } = await query
      .order(orderBy, { ascending: orderDirection === 'asc' })
      .range(from, to);
    
    console.log(`📊 查询结果: 获取到 ${data?.length} 个分类，总数: ${count}`);
    
    if (error) {
      console.error('❌ 获取分类列表失败:', error);
    }
    
    return { data, count, error };
  } catch (error) {
    console.error('❌ 获取分类列表异常:', error);
    return { 
      data: null, 
      count: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 获取所有分类（不分页）
 * @returns 所有分类列表
 */
export async function getAllCategories(): Promise<{
  data: Category[] | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');
    
    if (error) {
      console.error('❌ 获取所有分类失败:', error);
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ 获取所有分类异常:', error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 通过ID获取分类
 * @param id 分类ID
 * @returns 分类信息
 */
export async function getCategoryById(id: string): Promise<{
  data: Category | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('id', id)
      .single();
    
    if (error) {
      console.error(`❌ 获取分类 ID:${id} 失败:`, error);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 获取分类 ID:${id} 异常:`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 通过slug获取分类
 * @param slug 分类slug
 * @returns 分类信息
 */
export async function getCategoryBySlug(slug: string): Promise<{
  data: Category | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();
    
    if (error) {
      console.error(`❌ 获取分类 slug:${slug} 失败:`, error);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 获取分类 slug:${slug} 异常:`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 创建分类
 * @param categoryData 分类数据
 * @returns 创建的分类
 */
export async function createCategory(categoryData: CategoryCreate): Promise<{
  data: Category | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .insert(categoryData)
      .select()
      .single();
    
    if (error) {
      console.error('❌ 创建分类失败:', error);
    } else {
      console.log('✅ 分类创建成功:', data.name);
    }
    
    return { data, error };
  } catch (error) {
    console.error('❌ 创建分类异常:', error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 更新分类
 * @param id 分类ID
 * @param categoryData 分类更新数据
 * @returns 更新后的分类
 */
export async function updateCategory(id: string, categoryData: CategoryUpdate): Promise<{
  data: Category | null;
  error: PostgrestError | null;
}> {
  try {
    const { data, error } = await supabase
      .from('categories')
      .update(categoryData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) {
      console.error(`❌ 更新分类 ID:${id} 失败:`, error);
    } else {
      console.log(`✅ 分类 ID:${id} 更新成功`);
    }
    
    return { data, error };
  } catch (error) {
    console.error(`❌ 更新分类 ID:${id} 异常:`, error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 删除分类
 * @param id 分类ID
 * @returns 操作结果
 */
export async function deleteCategory(id: string): Promise<{
  success: boolean;
  error: PostgrestError | null;
}> {
  try {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error(`❌ 删除分类 ID:${id} 失败:`, error);
      return { success: false, error };
    }
    
    console.log(`✅ 分类 ID:${id} 删除成功`);
    return { success: true, error: null };
  } catch (error) {
    console.error(`❌ 删除分类 ID:${id} 异常:`, error);
    return { 
      success: false, 
      error: error as PostgrestError 
    };
  }
}

/**
 * 获取分类统计信息（包含每个分类的文章数量）
 * @returns 分类统计信息
 */
export async function getCategoryStats(): Promise<{
  data: { id: string; name: string; slug: string; count: number }[] | null;
  error: PostgrestError | null;
}> {
  try {
    // 首先获取所有分类
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('id, name, slug')
      .order('name');
    
    if (categoriesError) {
      console.error('❌ 获取分类列表失败:', categoriesError);
      return { data: null, error: categoriesError };
    }

    if (!categories || categories.length === 0) {
      return { data: [], error: null };
    }

    // 获取每个分类的文章数量
    const categoryStats = await Promise.all(
      categories.map(async (category) => {
        const { count, error: countError } = await supabase
          .from('posts')
          .select('*', { count: 'exact', head: true })
          .eq('category_id', category.id)
          .eq('status', 'published');

        if (countError) {
          console.error(`❌ 获取分类 ${category.name} 文章数量失败:`, countError);
          return {
            id: category.id,
            name: category.name,
            slug: category.slug,
            count: 0
          };
        }

        return {
          id: category.id,
          name: category.name,
          slug: category.slug,
          count: count || 0
        };
      })
    );
    
    console.log(`✅ 成功获取 ${categoryStats.length} 个分类的统计信息:`, categoryStats);
    return { data: categoryStats, error: null };
  } catch (error) {
    console.error('❌ 获取分类统计信息异常:', error);
    return { 
      data: null, 
      error: error as PostgrestError 
    };
  }
}