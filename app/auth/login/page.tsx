"use client";

import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  // 状态管理
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 表单提交处理
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // TODO: 实现登录逻辑
      console.log("登录请求:", { email, password });
      // 模拟登录延迟
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      // 这里应该调用实际的登录API
      // const { data, error } = await supabaseClient.auth.signInWithPassword({
      //   email,
      //   password,
      // });
      
      // if (error) throw error;
      // 登录成功后重定向
      // window.location.href = "/";
    } catch (err: any) {
      setError(err.message || "登录失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* 卡片容器 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* 头部 */}
          <div className="p-6 sm:p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">欢迎回来</h1>
              <p className="text-gray-500 dark:text-gray-400">请登录您的账户继续访问</p>
            </div>

            {/* 错误提示 */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm rounded-lg">
                {error}
              </div>
            )}

            {/* 登录表单 */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* 邮箱输入 */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  邮箱地址
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="your@email.com"
                  className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>

              {/* 密码输入 */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    密码
                  </label>
                  <Link href="/auth/reset-password" className="text-sm text-blue-600 hover:text-blue-500 dark:text-blue-400">
                    忘记密码?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="输入您的密码"
                    className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400"
                  >
                    {showPassword ? (
                      <span className="text-sm">隐藏</span>
                    ) : (
                      <span className="text-sm">显示</span>
                    )}
                  </button>
                </div>
              </div>

              {/* 记住我选项 */}
              <div className="flex items-center">
                <input
                  id="remember"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  记住我
                </label>
              </div>

              {/* 登录按钮 */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? "登录中..." : "登录"}
              </button>
            </form>

            {/* 社交登录选项 */}
            <div className="mt-6">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-600"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">或使用</span>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <span>Google</span>
                </button>
                <button
                  type="button"
                  className="w-full flex justify-center items-center px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm bg-white dark:bg-gray-700 text-gray-700 dark:text-white hover:bg-gray-50 dark:hover:bg-gray-600"
                >
                  <span>GitHub</span>
                </button>
              </div>
            </div>
          </div>

          {/* 底部注册链接 */}
          <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300">
              还没有账户?{" "}
              <Link href="/auth/register" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400">
                立即注册
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
