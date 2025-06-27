/**
 * 文章图片工具函数
 * 用于处理文章特色图片的默认值和分类逻辑
 */

// 默认图片基础URL
const DEFAULT_IMAGE_BASE_URL = 'https://hxnargfvyjnogjzgohiy.supabase.co/storage/v1/object/public/avatars/blog';

// 分类默认图片配置
const CATEGORY_IMAGES = {
  // 技术分类 - 5张图片
  tech: [
    `${DEFAULT_IMAGE_BASE_URL}/code_1.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/code_2.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/code_3.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/code_4.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/code_5.jpg`,
  ],
  // 生活分类 - 5张图片
  life: [
    `${DEFAULT_IMAGE_BASE_URL}/life_1.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/life_2.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/life_3.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/life_4.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/life_5.jpg`,
  ],
  // 项目分类 - 5张图片
  projects: [
    `${DEFAULT_IMAGE_BASE_URL}/project_1.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/project_2.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/project_3.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/project_4.jpg`,
    `${DEFAULT_IMAGE_BASE_URL}/project_5.jpg`,
  ],
};

// 通用默认图片（当分类不存在或图片加载失败时使用）
export const FALLBACK_IMAGE_URL = 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80';

/**
 * 获取分类的默认图片列表
 * @param categorySlug 分类标识符
 * @returns 该分类的默认图片数组
 */
export function getCategoryDefaultImages(categorySlug: string): string[] {
  const normalizedSlug = categorySlug.toLowerCase();
  
  if (normalizedSlug in CATEGORY_IMAGES) {
    return [...CATEGORY_IMAGES[normalizedSlug as keyof typeof CATEGORY_IMAGES]];
  }
  
  // 如果分类不存在，返回技术分类的图片作为默认
  return [...CATEGORY_IMAGES.tech];
}

/**
 * 根据文章ID获取分类默认图片（用于确保同一文章始终使用相同图片）
 * @param categorySlug 分类标识符
 * @param articleId 文章ID
 * @returns 默认图片URL
 */
export function getArticleDefaultImage(categorySlug: string, articleId: string | number): string {
  const images = getCategoryDefaultImages(categorySlug);
  
  if (images.length === 0) {
    return FALLBACK_IMAGE_URL;
  }
  
  // 使用文章ID的哈希值来选择图片，确保同一文章始终使用相同图片
  const hash = String(articleId).split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  
  const imageIndex = hash % images.length;
  return images[imageIndex];
}

/**
 * 获取文章的特色图片URL
 * @param featuredImage 文章的特色图片URL
 * @param categorySlug 分类标识符
 * @param articleId 文章ID
 * @returns 处理后的图片URL
 */
export function getArticleFeaturedImage(
  featuredImage?: string | null,
  categorySlug?: string,
  articleId?: string | number
): string {
  // 如果文章有特色图片，直接使用
  if (featuredImage && featuredImage.trim() !== '') {
    return featuredImage;
  }
  
  // 如果没有特色图片，使用分类默认图片
  if (categorySlug && articleId) {
    return getArticleDefaultImage(categorySlug, articleId);
  }
  
  // 如果连分类信息都没有，使用通用默认图片
  return FALLBACK_IMAGE_URL;
}

/**
 * 获取所有可用的分类标识符
 * @returns 分类标识符数组
 */
export function getAvailableCategories(): string[] {
  return Object.keys(CATEGORY_IMAGES);
}

/**
 * 验证图片URL是否有效
 * @param imageUrl 图片URL
 * @returns 是否为有效的图片URL
 */
export function isValidImageUrl(imageUrl?: string | null): boolean {
  if (!imageUrl || imageUrl.trim() === '') {
    return false;
  }
  
  try {
    const url = new URL(imageUrl);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
} 