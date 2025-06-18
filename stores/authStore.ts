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
  isInitialized: boolean;
  
  // 操作方法
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  clearUser: () => void;
}

// 创建授权状态管理
export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  loading: false,
  isInitialized: false,

  // 设置加载状态
  setLoading: (loading: boolean) => {
    set({ loading });
  },

  // 清除用户信息
  clearUser: () => {
    set({ user: null });
  },

  // 检查用户认证状态
  checkAuth: async () => {
    console.log('🔍 开始检查认证状态...');
    
    try {
      set({ loading: true });
      
      // 获取当前会话
      const { session, error } = await getCurrentSession();
      
      if (error) {
        throw error;
      }

      if (session?.user) {
        console.log('✅ 用户已登录，获取用户信息...');
        
        // 获取完整用户信息
        const { data: userInfo, error: userError } = await getCompleteUserInfo(
          session.user.id, 
          session.user.email || ''
        );

        if (userError) {
          throw userError;
        }

        if (userInfo) {
          console.log('✅ 设置用户信息:', userInfo);
          set({ user: userInfo, loading: false, isInitialized: true });
        } else {
          console.log('❌ 用户信息不存在');
          set({ user: null, loading: false, isInitialized: true });
        }
      } else {
        console.log('❌ 用户未登录');
        set({ user: null, loading: false, isInitialized: true });
      }
    } catch (error) {
      console.error('❌ 认证检查失败:', error);
      set({ user: null, loading: false, isInitialized: true });
    }
  },

  // 用户登录
  login: async (email: string, password: string) => {
    console.log('🔐 开始登录流程...');
    
    try {
      set({ loading: true });
      
      // 先检查这个邮箱是否已经登录
      const { session, error: sessionError } = await getCurrentSession();
      
      if (sessionError) {
        console.error("获取会话失败:", sessionError);
        throw sessionError;
      }

      if (session?.user) {
        console.log("✅ 用户已登录，检查是否是同一账号...");
        
        // 检查是否是同一邮箱
        if (session.user.email === email) {
          console.log("📧 同一邮箱已登录，获取用户信息...");
          
          // 获取完整用户信息
          const { data: userInfo, error: userError } = await getCompleteUserInfo(
            session.user.id, 
            session.user.email || ''
          );

          if (userError) {
            console.error("获取用户信息失败:", userError);
            throw userError;
          }

          if (userInfo) {
            console.log("👤 用户信息:", userInfo);
            set({ user: userInfo, loading: false });
            return;
          }
        } else {
          console.log("📧 不同邮箱，先登出当前用户");
          // 如果是不同邮箱，先登出当前用户
          await logoutUser();
        }
      }

      // 正常登录流程
      console.log("🔐 开始正常登录...");
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
          user.id, 
          user.email || ''
        );

        if (userError) {
          console.error("获取用户信息失败:", userError);
          throw userError;
        }

        if (userInfo) {
          console.log("👤 用户信息:", userInfo);
          set({ user: userInfo, loading: false });
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
      set({ user: null, loading: false });
    } catch (error) {
      console.error('❌ 登出失败:', error);
      set({ loading: false });
      throw error;
    }
  },
}));

// 导出类型
export type { User, AuthState }; 