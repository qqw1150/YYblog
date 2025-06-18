# 用户管理 Edge Function

这个 Edge Function 用于同步 Supabase Auth 用户数据到 `public.users` 表。

## 功能

- 当用户在 `auth.users` 表中创建时，自动在 `public.users` 表中创建对应的记录
- 当用户在 `auth.users` 表中更新时，自动更新 `public.users` 表中的记录
- 当用户在 `auth.users` 表中删除时，自动删除 `public.users` 表中的记录

## 数据库表结构

```sql
create table public.users (
  id uuid not null,
  email text not null,
  username text null,
  avatar_url text null,
  role text not null default 'reader'::text,
  created_at timestamp with time zone not null default now(),
  constraint users_pkey primary key (id),
  constraint users_username_key unique (username),
  constraint users_id_fkey foreign KEY (id) references auth.users (id) on delete CASCADE,
  constraint users_role_check check (
    (
      role = any (
        array['admin'::text, 'author'::text, 'reader'::text]
      )
    )
  )
) TABLESPACE pg_default;
```

## 字段说明

- `id`: 用户ID，与 auth.users 表关联
- `email`: 用户邮箱
- `username`: 用户名（可选）
- `avatar_url`: 头像URL（可选）
- `role`: 用户角色，可选值为 'admin'、'author'、'reader'
- `created_at`: 创建时间

## 部署步骤

1. 部署 Edge Function：

```bash
supabase functions deploy auth-user-management
```

2. 设置环境变量：

```bash
supabase secrets set SUPABASE_URL=your-project-url
supabase secrets set SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

3. 在 Supabase Dashboard 中配置 Database Webhook：
   - 进入 Database > Webhooks
   - 创建新的 Webhook
   - 选择 `auth.users` 表
   - 设置事件类型为 INSERT, UPDATE, DELETE
   - 设置 Webhook URL 为你的 Edge Function URL
   - 保存配置

## 同步规则

1. 用户创建时：
   - 自动创建对应的 public.users 记录
   - 设置默认角色为 'reader'
   - username 和 avatar_url 初始为 null

2. 用户更新时：
   - 只同步 email 字段
   - username、avatar_url 和 role 字段由用户或管理员手动更新

3. 用户删除时：
   - 自动删除对应的 public.users 记录（通过外键约束）

## 测试

1. 注册新用户
2. 检查 `public.users` 表中是否创建了对应的记录
3. 更新用户信息
4. 检查 `public.users` 表中的记录是否更新
5. 删除用户
6. 检查 `public.users` 表中的记录是否删除

## 日志

Edge Function 会在控制台输出详细的日志，包括：
- 收到的 webhook 请求
- 处理的事件类型
- 操作结果
- 错误信息（如果有）

## 错误处理

如果发生错误，Edge Function 会返回 500 状态码和错误信息。常见的错误包括：
- 无效的请求数据
- 数据库操作失败
- 权限问题

## 注意事项

1. 确保 Edge Function 有正确的权限访问数据库
2. 确保环境变量正确设置
3. 确保 webhook 配置正确
4. 定期检查日志以确保功能正常
5. 用户角色只能为 'admin'、'author' 或 'reader'
6. username 字段是唯一的，不能重复 