import { NextResponse, type NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  // 静态生成（SSG）不需要会话刷新，直接返回响应
  return NextResponse.next();
}

// 配置中间件匹配的路由
export const config = {
  matcher: [
    /*
     * 匹配所有请求路径，除了：
     * - _next/static (静态文件)
     * - _next/image (图片优化)
     * - favicon.ico (浏览器图标)
     * - public 文件夹
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 