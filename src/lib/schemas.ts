import * as z from "zod";
import { SUPPORT_ITEM_ICON } from "./constants";

/**
 * newsletter schema
 */
export const NewsletterFormSchema = z.object({
  email: z.string().email({
    message: "Enter a valid email",
  }),
});

export type NewsletterFormData = z.infer<typeof NewsletterFormSchema>;

/**
 * WorkBuddy Hub community resource submission.
 * AI fields are suggestions only and remain editable during editorial review.
 */
export const ResourceSubmitSchema = z.object({
  url: z
    .string()
    .url({ message: "请输入有效的 http(s) 链接" })
    .refine((url) => /^https?:\/\//i.test(url), {
      message: "链接必须使用 http 或 https 协议",
    }),
  title: z
    .string()
    .min(2, { message: "标题至少需要 2 个字符" })
    .max(80, { message: "标题不能超过 80 个字符" }),
  description: z
    .string()
    .min(10, { message: "请用至少 10 个字符说明资源价值" })
    .max(500, { message: "简介不能超过 500 个字符" }),
  resourceType: z
    .enum([
      "tutorial",
      "recipe",
      "guide",
      "video",
      "course",
      "article",
      "case",
      "official-documentation",
      "community-resource",
    ])
    .optional(),
  difficulty: z.enum(["beginner", "intermediate", "advanced"]).optional(),
  language: z.enum(["chinese", "english", "bilingual"]).optional(),
  creator: z.string().max(80).optional(),
  qualityScore: z.number().min(0).max(100).optional(),
  seoDescription: z.string().max(180).optional(),
  suggestedFeatures: z.array(z.string().max(40)).max(8).optional(),
  suggestedUseCases: z.array(z.string().max(60)).max(8).optional(),
  suggestedTags: z.array(z.string().max(30)).max(12).optional(),
});

export type ResourceSubmitData = z.infer<typeof ResourceSubmitSchema>;

/**
 * submit item
 */
export const baseSubmitSchema = {
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be 32 or fewer characters long" }),
  link: z.string().url({ message: "Invalid url" }),
  description: z
    .string()
    .min(1, { message: "Description is required" })
    .max(256, { message: "Description must be 256 or fewer characters long" }),
  introduction: z
    .string()
    .min(1, { message: "Introduction is required" })
    .max(4096, {
      message: "Introduction must be 4096 or fewer characters long",
    }),
  tags: z.array(z.string()).min(1, { message: "Must select at least one tag" }),
  categories: z
    .array(z.string())
    .min(1, { message: "Must select at least one category" }),
  imageId: z.string().min(1, { message: "Must upload an image" }),
};

export const SubmitSchema = SUPPORT_ITEM_ICON
  ? z.object({
      ...baseSubmitSchema,
      iconId: z.string().min(1, { message: "Must upload an icon" }),
    })
  : z.object(baseSubmitSchema);

/**
 * edit item
 */
export const EditSchema = SubmitSchema.extend({
  id: z.string().min(1, { message: "ID is required" }),
  pricePlan: z.string().min(1, { message: "Price plan is required" }),
  planStatus: z.string().min(1, { message: "Plan status is required" }),
});

/**
 * account settings
 */
export const SettingsSchema = z
  .object({
    name: z.string().min(1, { message: "Name is required" }),
    link: z.string().optional(),
    password: z.optional(z.string().min(6)),
    newPassword: z.optional(z.string().min(6)),
  })
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required!",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required!",
      path: ["password"],
    },
  );

export const UserNameSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Name is required" })
    .max(32, { message: "Name must be 32 or fewer characters long" }),
});

export type UserNameData = z.infer<typeof UserNameSchema>;

export const UserLinkSchema = z.object({
  link: z
    .string()
    .min(0, { message: "Link is optional" })
    .max(128, { message: "Link must be 128 or fewer characters long" }),
});

export type UserLinkData = z.infer<typeof UserLinkSchema>;

export const UserPasswordSchema = z
  .object({
    password: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    newPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
    confirmPassword: z.string().min(6, {
      message: "Minimum of 6 characters required",
    }),
  })
  .refine(
    (data) => {
      if (data.newPassword && !data.password) {
        return false;
      }

      return true;
    },
    {
      message: "Password is required",
      path: ["password"],
    },
  )
  .refine(
    (data) => {
      if (data.password && !data.newPassword) {
        return false;
      }

      return true;
    },
    {
      message: "New password is required",
      path: ["newPassword"],
    },
  )
  .refine(
    (data) => {
      if (data.newPassword !== data.confirmPassword) {
        return false;
      }

      return true;
    },
    {
      message: "Passwords do not match",
      path: ["confirmPassword"],
    },
  );

export type UserPasswordData = z.infer<typeof UserPasswordSchema>;

/**
 * auth related schemas
 */
export const NewPasswordSchema = z.object({
  password: z.string().min(6, {
    message: "密码至少需要 6 个字符",
  }),
});

export const ResetSchema = z.object({
  email: z.string().email({
    message: "请输入有效的邮箱地址",
  }),
});

export const LoginSchema = z.object({
  email: z.string().email({
    message: "请输入有效的邮箱地址",
  }),
  password: z.string().min(1, {
    message: "请输入密码",
  }),
});

export const RegisterSchema = z.object({
  email: z.string().email({
    message: "请输入有效的邮箱地址",
  }),
  password: z.string().min(6, {
    message: "密码至少需要 6 个字符",
  }),
  name: z.string().min(1, {
    message: "请输入昵称",
  }),
});

/**
 * og image schema
 */
export const ogImageSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  type: z.string().optional(),
  mode: z.enum(["light", "dark"]).default("light"),
});
