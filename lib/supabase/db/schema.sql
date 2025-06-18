-- 文章表
CREATE TABLE IF NOT EXISTS public.posts (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  title text NOT NULL,
  slug text NOT NULL,
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  excerpt text NULL,
  featured_image text NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  author_id uuid NOT NULL,
  category_id uuid NULL,
  published_at timestamp with time zone NULL,
  seo_keywords text NULL,
  seo_description text NULL,
  allow_comment boolean NOT NULL DEFAULT true,
  is_top boolean NOT NULL DEFAULT false,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  CONSTRAINT posts_pkey PRIMARY KEY (id),
  CONSTRAINT posts_slug_key UNIQUE (slug),
  CONSTRAINT posts_author_id_fkey FOREIGN KEY (author_id) REFERENCES users (id) ON DELETE CASCADE,
  CONSTRAINT posts_category_id_fkey FOREIGN KEY (category_id) REFERENCES categories (id) ON DELETE SET NULL,
  CONSTRAINT posts_status_check CHECK (
    (status = ANY (ARRAY['draft'::text, 'published'::text]))
  )
);

-- 标签表
CREATE TABLE IF NOT EXISTS public.tags (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL,
  CONSTRAINT tags_pkey PRIMARY KEY (id),
  CONSTRAINT tags_slug_key UNIQUE (slug)
);

-- 文章-标签关联表
CREATE TABLE IF NOT EXISTS public.post_tags (
  post_id uuid NOT NULL,
  tag_id uuid NOT NULL,
  CONSTRAINT post_tags_pkey PRIMARY KEY (post_id, tag_id),
  CONSTRAINT post_tags_post_id_fkey FOREIGN KEY (post_id) REFERENCES posts (id) ON DELETE CASCADE,
  CONSTRAINT post_tags_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
);

-- 分类表
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid NOT NULL DEFAULT extensions.uuid_generate_v4(),
  name text NOT NULL,
  slug text NOT NULL,
  description text NULL,
  CONSTRAINT categories_pkey PRIMARY KEY (id),
  CONSTRAINT categories_slug_key UNIQUE (slug)
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_posts_author_id ON public.posts USING btree (author_id);
CREATE INDEX IF NOT EXISTS idx_posts_category_id ON public.posts USING btree (category_id);
CREATE INDEX IF NOT EXISTS idx_posts_status ON public.posts USING btree (status);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON public.posts USING btree (created_at);
CREATE INDEX IF NOT EXISTS idx_posts_published_at ON public.posts USING btree (published_at);
CREATE INDEX IF NOT EXISTS idx_post_tags_post_id ON public.post_tags USING btree (post_id);
CREATE INDEX IF NOT EXISTS idx_post_tags_tag_id ON public.post_tags USING btree (tag_id);
CREATE INDEX IF NOT EXISTS idx_categories_name ON public.categories USING btree (name);
CREATE INDEX IF NOT EXISTS idx_tags_name ON public.tags USING btree (name);

-- 创建更新时间触发器函数（如果不存在）
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now(); 
   RETURN NEW;
END;
$$ language 'plpgsql';

-- 为文章表添加自动更新时间触发器
DROP TRIGGER IF EXISTS update_posts_updated_at ON posts;
CREATE TRIGGER update_posts_updated_at
BEFORE UPDATE ON posts
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column(); 