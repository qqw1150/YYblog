// @ts-ignore - Deno imports
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
// @ts-ignore - Deno imports
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
// Edge Function处理新用户注册和删除
serve(async (req: Request) => {
  // 创建Supabase客户端
  // @ts-ignore - Deno API
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  // @ts-ignore - Deno API
  const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!supabaseUrl || !supabaseServiceKey) {
    return new Response(JSON.stringify({
      error: '缺少环境变量'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  const supabase = createClient(supabaseUrl, supabaseServiceKey);
  // 解析请求
  const body = await req.json();
  const { type, record } = body;
  // 处理不同的webhook事件
  switch(type){
    case 'INSERT':
      // 新用户注册
      if (record?.id) {
        try {
          // 创建用户记录
          await supabase.from('users').insert({
            id: record.id,
            email: record.email,
            role: 'reader',
            created_at: new Date().toISOString()
          });
          // 创建资料记录
          await supabase.from('profiles').insert({
            id: record.id
          });
          return new Response(JSON.stringify({
            message: '用户创建成功'
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : '未知错误';
          return new Response(JSON.stringify({
            error: `创建用户资料失败: ${errorMessage}`
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      }
      break;
    case 'DELETE':
      // 用户删除
      if (record?.id) {
        try {
          // 注意：用户表和资料表的记录通过级联删除自动删除
          return new Response(JSON.stringify({
            message: '用户删除成功'
          }), {
            status: 200,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        } catch (error: unknown) {
          const errorMessage = error instanceof Error ? error.message : '未知错误';
          return new Response(JSON.stringify({
            error: `删除用户资料失败: ${errorMessage}`
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json'
            }
          });
        }
      }
      break;
    default:
      // 不支持的事件类型
      return new Response(JSON.stringify({
        message: `不支持的事件类型: ${type}`
      }), {
        status: 400,
        headers: {
          'Content-Type': 'application/json'
        }
      });
  }
  return new Response(JSON.stringify({
    message: '处理完成'
  }), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
});
