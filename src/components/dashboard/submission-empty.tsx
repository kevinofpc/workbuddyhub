import { EmptyPlaceholder } from "@/components/shared/empty-placeholder";
import { Button } from "@/components/ui/button";
import { UploadIcon } from "lucide-react";
import Link from "next/link";

export default function EmptySubmission() {
  return (
    <EmptyPlaceholder>
      <EmptyPlaceholder.Icon name="submit" className="size-8" />
      <EmptyPlaceholder.Title>还没有投稿</EmptyPlaceholder.Title>
      <EmptyPlaceholder.Description>
        分享一份真正帮到你的 WorkBuddy 教程、案例或视频。
      </EmptyPlaceholder.Description>
      <Button asChild size="lg" className="group whitespace-nowrap">
        <Link
          href="/submit"
          prefetch={false}
          className="flex items-center justify-center space-x-2"
        >
          <UploadIcon className="w-4 h-4" />
          <span>提交资源</span>
        </Link>
      </Button>
    </EmptyPlaceholder>
  );
}
