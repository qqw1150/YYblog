import { create } from 'zustand';
import { 
  getCurrentSession, 
  getCompleteUserInfo, 
  loginUser, 
  logoutUser,
  type User 
} from '@/lib/supabase/db';

// 授权状态接口
interface AuthState {
  user: User | null;
  loading: boolean;
  token: string | null;
  tokenExpiresAt: number | null; // token过期时间戳
  
  // 操作方法
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkTokenExpiry: () => boolean; // 检查token是否过期
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
  initializeAuth: () => Promise<void>; // 初始化认证状态
}

// 创建授权状态管理
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  token: null,
  tokenExpiresAt: null,

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  // 清除用户信息
  clearUser: () => {
    set({ user: null, token: null, tokenExpiresAt: null });
  },

  // 检查token是否过期
  checkTokenExpiry: () => {
    const { tokenExpiresAt } = get();
    if (!tokenExpiresAt) return true; // 没有token视为过期
    
    const now = Date.now();
    const isExpired = now >= tokenExpiresAt;
    
    if (isExpired) {
      console.log('❌ Token已过期');
      // 清除过期状态
      set({ user: null, token: null, tokenExpiresAt: null });
    }
    
    return isExpired;
  },

  // 初始化认证状态
  initializeAuth: async () => {
    console.log('🔍 初始化认证状态...');
    
    try {
      set({ loading: true });
      
      // 获取当前会话
      const { session, error } = await getCurrentSession();
      
      if (error) {
        console.error('❌ 获取会话失败:', error);
        set({ loading: false });
        return;
      }

      if (session?.user) {
        console.log('✅ 用户已登录，获取用户信息...');
        
        // 获取完整用户信息
        const { data: userInfo, error: userError } = await getCompleteUserInfo(
          session.user.id
        );

        if (userError) {
          console.error('❌ 获取用户信息失败:', userError);
          set({ loading: false });
          return;
        }

        if (userInfo) {
          // 计算token过期时间（假设token有效期为1小时）
          const expiresAt = Date.now() + (60 * 60 * 1000); // 1小时后过期
          
          console.log('✅ 设置用户信息和token');
          set({ 
            user: userInfo, 
            token: session.access_token,
            tokenExpiresAt: expiresAt,
            loading: false 
          });
        } else {
          console.log('❌ 用户信息不存在');
          set({ loading: false });
        }
      } else {
        console.log('❌ 用户未登录');
        set({ loading: false });
      }
    } catch (error) {
      console.error('❌ 初始化认证状态失败:', error);
      set({ loading: false });
    }
  },

  // 用户登录
  login: async (email: string, password: string) => {
    console.log('🔐 开始登录流程...');
    
    try {
      set({ loading: true });
      
      // 正常登录流程
      const { user, error } = await loginUser(email, password);

      if (error) {
        // 检查是否是邮箱未验证错误
        if (error.message.includes("Email not confirmed")) {
          throw new Error("请先验证您的邮箱，我们已发送验证邮件到您的邮箱");
        }
        throw error;
      }

      if (user) {
        // 检查邮箱是否已验证
        if (!user.email_confirmed_at) {
          throw new Error("请先验证您的邮箱，我们已发送验证邮件到您的邮箱");
        }

        // 登录成功，获取完整用户信息
        console.log("✅ 登录成功，获取用户信息...");
        const { data: userInfo, error: userError } = await getCompleteUserInfo(
          user.id
        );

        if (userError) {
          console.error("获取用户信息失败:", userError);
          throw userError;
        }

        if (userInfo) {
          // 计算token过期时间（假设token有效期为1小时）
          const expiresAt = Date.now() + (60 * 60 * 1000); // 1小时后过期
          
          console.log("👤 用户信息:", userInfo);
          set({ 
            user: userInfo, 
            token: user.id, // 简化处理，使用用户ID作为token
            tokenExpiresAt: expiresAt,
            loading: false 
          });
        } else {
          throw new Error("获取用户信息失败");
        }
      }
    } catch (error) {
      console.error('❌ 登录失败:', error);
      set({ loading: false });
      throw error;
    }
  },

  // 用户登出
  logout: async () => {
    console.log('🚪 开始登出流程...');
    
    try {
      set({ loading: true });
      
      const { error } = await logoutUser();
      
      if (error) {
        console.error('❌ 登出失败:', error);
        throw error;
      }
      
      console.log('✅ 登出成功');
      set({ user: null, token: null, tokenExpiresAt: null, loading: false });
    } catch (error) {
      console.error('❌ 登出失败:', error);
      set({ loading: false });
      throw error;
    }
  },
}));

// 导出类型
export type { User, AuthState }; 