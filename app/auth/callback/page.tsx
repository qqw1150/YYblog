"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Mail, RefreshCw, AlertCircle } from "lucide-react";
import Link from "next/link";
import { resendVerificationEmail } from "@/lib/supabase/db/auth";

function CallbackContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [isValidEmail, setIsValidEmail] = useState(false);

  // 验证email参数
  useEffect(() => {
    if (!email) {
      setError("邮箱地址无效，请重新注册");
      return;
    }
    
    // 验证邮箱格式
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("邮箱格式不正确");
      return;
    }

    setIsValidEmail(true);
  }, [email]);

  // 处理重发邮件
  const handleResendEmail = async () => {
    if (!email) {
      setError("邮箱地址无效，请重新注册");
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error } = await resendVerificationEmail(email);
      
      if (error) {
        throw error;
      }

      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "重发邮件失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  // 如果没有email参数或邮箱格式不正确，显示错误状态
  if (!isValidEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-4">
        <div className="w-full max-w-md">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden p-8">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-8 h-8 text-red-600 dark:text-red-400" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                邮箱验证失败
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {error || "邮箱地址无效，请重新注册"}
              </p>
              <Link
                href="/auth/register"
                className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                返回注册页面
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <div className="w-full max-w-md">
        {/* 卡片容器 */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          {/* 头部图标区域 */}
          <div className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30">
            <div className="mx-auto w-16 h-16 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center shadow-lg">
              <Mail className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
          </div>

          {/* 内容区域 */}
          <div className="p-8">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                验证邮件已发送
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                我们已向{" "}
                <span className="font-medium text-blue-600 dark:text-blue-400">
                  {email}
                </span>{" "}
                发送了一封验证邮件
              </p>

              {/* 提示信息 */}
              <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-700 dark:text-blue-300">
                  请查收邮件并点击验证链接完成注册。验证完成后，您将自动跳转到登录页面。
                </p>
              </div>

              {/* 错误提示 */}
              {error && (
                <div className="bg-red-50 dark:bg-red-900/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}

              {/* 成功提示 */}
              {success && (
                <div className="bg-green-50 dark:bg-green-900/30 rounded-xl p-4 mb-6">
                  <p className="text-sm text-green-700 dark:text-green-300">
                    验证邮件已重新发送，请查收
                  </p>
                </div>
              )}

              {/* 常见问题 */}
              <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-4 mb-6">
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    没有收到邮件？
                  </h3>
                </div>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-2">
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                    请检查垃圾邮件文件夹
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                    确认邮箱地址是否正确
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full"></span>
                    稍等几分钟后重试
                  </li>
                </ul>
              </div>

              {/* 操作按钮 */}
              <div className="space-y-3">
                <button
                  onClick={handleResendEmail}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      发送中...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="w-4 h-4" />
                      重新发送验证邮件
                    </>
                  )}
                </button>
                <Link
                  href="/auth/login"
                  className="block w-full text-center px-4 py-2.5 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                >
                  返回登录页面
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div>加载中...</div>}>
      <CallbackContent />
    </Suspense>
  );
} 