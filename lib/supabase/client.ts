import { createClient } from '@supabase/supabase-js';

// 从环境变量中获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 验证环境变量是否存在
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少必要的 Supabase 环境变量配置');
}

// 创建 Supabase 客户端实例（静态生成，无需 SSR）
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true, // 保持会话状态
    autoRefreshToken: true, // 自动刷新 token
    detectSessionInUrl: true, // 检测 URL 中的会话信息
  },
});

// 导出类型
export type { User, Session } from '@supabase/supabase-js';