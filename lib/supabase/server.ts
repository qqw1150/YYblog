import { createClient } from '@supabase/supabase-js';

// 从环境变量中获取 Supabase 配置
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 验证环境变量是否存在
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('缺少必要的 Supabase 环境变量配置');
}

// 创建 Supabase 服务端客户端实例（静态生成，无需 SSR）
export const supabaseServer = createClient(supabaseUrl, supabaseAnonKey);

// 获取用户信息示例（需传入 access_token）
export async function getUserSession(access_token: string) {
  const { data, error } = await supabaseServer.auth.getUser(access_token);
  if (error) throw error;
  return data.user;
}