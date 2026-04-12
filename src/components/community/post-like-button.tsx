"use client"

import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { togglePostLike } from "@/lib/actions/community"

interface PostLikeButtonProps {
  postId: string
  likeCount: number
  userLiked: boolean
  isAuthenticated: boolean
}

export function PostLikeButton({
  postId,
  likeCount,
  userLiked,
  isAuthenticated,
}: PostLikeButtonProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  function handleToggleLike() {
    if (!isAuthenticated) {
      router.push("/auth/login")
      return
    }
    startTransition(async () => {
      const result = await togglePostLike(postId)
      if (result.error) return
      router.refresh()
    })
  }

  return (
    <Button
      variant={userLiked ? "default" : "outline"}
      size="sm"
      onClick={handleToggleLike}
      disabled={isPending}
    >
      <Heart
        className={`mr-1 size-4 ${userLiked ? "fill-current" : ""}`}
      />
      좋아요 {likeCount}
    </Button>
  )
}
