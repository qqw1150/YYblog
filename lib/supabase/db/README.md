# 数据库操作模块

本目录包含了所有与 Supabase 数据库相关的操作，采用模块化设计，便于维护和复用。

## 目录结构

```
lib/supabase/db/
├── index.ts          # 统一导出入口
├── auth.ts           # 认证相关操作
├── users.ts          # 用户相关操作
├── session.ts        # 会话管理操作
└── README.md         # 说明文档
```

## 模块说明

### 1. auth.ts - 认证操作
包含用户注册、登录、登出、密码重置等认证相关操作。

**主要函数：**
- `registerUser()` - 用户注册
- `loginUser()` - 用户登录
- `logoutUser()` - 用户登出
- `getCurrentUser()` - 获取当前用户
- `resetPassword()` - 重置密码
- `updatePassword()` - 更新密码
- `resendVerificationEmail()` - 重新发送验证邮件

### 2. users.ts - 用户操作
包含用户信息查询、资料管理等用户相关操作。

**主要函数：**
- `getUserData()` - 获取用户基本信息
- `getUserProfile()` - 获取用户资料
- `getCompleteUserInfo()` - 获取完整用户信息
- `updateUserProfile()` - 更新用户资料
- `createUserProfile()` - 创建用户资料

### 3. session.ts - 会话管理
包含会话状态检查、用户登录状态验证等操作。

**主要函数：**
- `getCurrentSession()` - 获取当前会话
- `isUserLoggedIn()` - 检查用户是否已登录
- `getCurrentUserId()` - 获取当前用户ID
- `isSessionValid()` - 检查会话是否有效

## 使用方式

### 导入方式
```typescript
// 导入所有数据库操作
import { 
  loginUser, 
  getUserData, 
  getCurrentSession,
  type User 
} from '@/lib/supabase/db';

// 或者按模块导入
import { loginUser } from '@/lib/supabase/db/auth';
import { getUserData } from '@/lib/supabase/db/users';
```

### 使用示例
```typescript
// 用户登录
const { user, error } = await loginUser(email, password);

// 获取用户信息
const { data: userInfo, error } = await getCompleteUserInfo(userId, email);

// 检查登录状态
const { isLoggedIn, userId } = await isUserLoggedIn();
```

## 设计原则

1. **模块化设计** - 按功能划分模块，便于维护
2. **统一错误处理** - 所有函数都返回统一的错误格式
3. **类型安全** - 使用 TypeScript 提供完整的类型支持
4. **日志记录** - 包含详细的中文日志，便于调试
5. **可复用性** - 函数设计考虑复用性，避免重复代码

## 错误处理

所有数据库操作函数都遵循统一的错误处理模式：

```typescript
{
  data: T | null,    // 成功时返回数据，失败时返回 null
  error: any | null  // 失败时返回错误信息，成功时返回 null
}
```

## 注意事项

1. 所有函数都是异步的，需要使用 `await` 调用
2. 错误处理应该检查 `error` 字段
3. 数据可能为 `null`，使用时需要做空值检查
4. 日志使用中文，便于调试和问题排查 