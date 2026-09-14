"use server";

import { NewsletterWelcomeEmail } from "@/emails/newsletter-welcome";
import { getResend } from "@/lib/mail";
import { type NewsletterFormData, NewsletterFormSchema } from "@/lib/schemas";

export type ServerActionResponse = {
  status: "success" | "error";
  message?: string;
};

export async function subscribeToNewsletter(
  formdata: NewsletterFormData,
): Promise<ServerActionResponse> {
  try {
    const validatedInput = NewsletterFormSchema.safeParse(formdata);
    if (!validatedInput.success) {
      return { status: "error", message: "请输入有效的邮箱地址" };
    }

    const resend = getResend();
    const subscribedResult = await resend.contacts.create({
      email: validatedInput.data.email,
      unsubscribed: false,
      audienceId: process.env.RESEND_AUDIENCE_ID,
    });
    console.log("subscribeToNewsletter, subscribedResult", subscribedResult);
    const subscribed = !subscribedResult.error;

    if (subscribed) {
      const emailSentResult = await resend.emails.send({
        from: process.env.RESEND_EMAIL_FROM,
        to: validatedInput.data.email,
        subject: "欢迎加入 WorkBuddy Weekly",
        react: NewsletterWelcomeEmail({ email: validatedInput.data.email }),
      });
      console.log("subscribeToNewsletter, emailSentResult", emailSentResult);
      const emailSent = !emailSentResult.error;
      if (emailSent) {
        return { status: "success", message: "订阅成功" };
      }
    }

    return {
      status: "error",
      message: "订阅失败，请稍后重试",
    };
  } catch (error) {
    console.error("subscribeToNewsletter, error:", error);
    return {
      status: "error",
      message: "订阅失败，请稍后重试",
    };
  }
}
