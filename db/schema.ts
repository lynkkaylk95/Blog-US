import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const posts = sqliteTable("posts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  excerpt: text("excerpt").notNull(),
  category: text("category").notNull(),
  categories: text("categories").notNull().default("[]"),
  seriesTitle: text("series_title"),
  partNumber: integer("part_number"),
  imageUrl: text("image_url").notNull(),
  imageAlt: text("image_alt").notNull(),
  contentHtml: text("content_html").notNull(),
  readTime: text("read_time").notNull().default("5 min read"),
  status: text("status", { enum: ["draft", "published", "deleted"] }).notNull().default("draft"),
  featured: integer("featured", { mode: "boolean" }).notNull().default(false),
  author: text("author").notNull().default("Porchlight Editors"),
  views: integer("views").notNull().default(0),
  publishedAt: text("published_at"),
  createdAt: text("created_at").notNull(),
  updatedAt: text("updated_at").notNull(),
}, (table) => [
  index("idx_posts_series_title").on(table.seriesTitle),
  uniqueIndex("idx_posts_series_part").on(table.seriesTitle, table.partNumber),
]);

export const adminCredentials = sqliteTable("admin_credentials", {
  id: integer("id").primaryKey(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  updatedAt: text("updated_at").notNull(),
});

export const adminPasswordResets = sqliteTable("admin_password_resets", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  tokenHash: text("token_hash").notNull().unique(),
  expiresAt: text("expires_at").notNull(),
  usedAt: text("used_at"),
  createdAt: text("created_at").notNull(),
});

export const adminUsers = sqliteTable("admin_users", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  passwordSalt: text("password_salt").notNull(),
  active: integer("active", { mode: "boolean" }).notNull().default(true),
  createdAt: text("created_at").notNull(),
});
