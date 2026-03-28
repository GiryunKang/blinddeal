"use server"

import { createClient } from "@/lib/supabase/server"
import { getUser, requireAuth } from "@/lib/supabase/auth"
import { sanitizeText, sanitizeHtml, truncate } from "@/lib/sanitize"

export async function getPosts(board?: string, page: number = 1) {
  const supabase = await createClient()
  const limit = 20

  let query = supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!author_id (
        id,
        display_name,
        avatar_url,
        company_name
      )
    `,
      { count: "exact" }
    )
    .order("is_pinned", { ascending: false })
    .order("created_at", { ascending: false })

  if (board && board !== "전체") {
    query = query.eq("board", board)
  }

  const from = (page - 1) * limit
  const to = from + limit - 1
  query = query.range(from, to)

  const { data, error, count } = await query

  if (error) {
    console.error("Error fetching posts:", error)
    return { posts: [], count: 0 }
  }

  return { posts: data ?? [], count: count ?? 0 }
}

export async function getPost(id: string) {
  const supabase = await createClient()
  const user = await getUser()

  const { data: post, error } = await supabase
    .from("posts")
    .select(
      `
      *,
      author:profiles!author_id (
        id,
        display_name,
        avatar_url,
        company_name,
        bio
      )
    `
    )
    .eq("id", id)
    .single()

  if (error || !post) {
    return null
  }

  // Increment view count
  await supabase
    .from("posts")
    .update({ view_count: (post.view_count ?? 0) + 1 })
    .eq("id", post.id)

  // Fetch comments with authors
  const { data: comments } = await supabase
    .from("comments")
    .select(
      `
      *,
      author:profiles!author_id (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("post_id", id)
    .order("created_at", { ascending: true })

  // Check if user has liked this post
  let userLiked = false
  if (user) {
    const { data: like } = await supabase
      .from("post_likes")
      .select("id")
      .eq("post_id", id)
      .eq("user_id", user.id)
      .single()
    userLiked = !!like
  }

  return {
    ...post,
    comments: comments ?? [],
    userLiked,
  }
}

export async function createPost(formData: FormData) {
  const user = await requireAuth()
  const supabase = await createClient()

  const title = truncate(sanitizeText(formData.get("title") as string ?? ""), 200)
  const content = truncate(sanitizeHtml(formData.get("content") as string ?? ""), 10000)
  const category = sanitizeText(formData.get("category") as string ?? "")
  const tagsStr = formData.get("tags") as string

  if (!title || !content) {
    return { success: false, error: "제목과 내용을 입력해주세요." }
  }

  const tags = tagsStr
    ? tagsStr
        .split(",")
        .map((t) => sanitizeText(t))
        .filter(Boolean)
        .slice(0, 10)
    : []

  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      title,
      content,
      board: category,
      tags,
    })
    .select("id")
    .single()

  if (error) {
    console.error("Error creating post:", error)
    return { success: false, error: "게시글 작성에 실패했습니다: " + error.message }
  }

  return { success: true, id: data.id }
}

export async function createComment(
  postId: string,
  content: string,
  parentId?: string
) {
  const user = await requireAuth()
  const supabase = await createClient()

  const sanitizedContent = truncate(sanitizeText(content), 5000)

  if (!sanitizedContent) {
    throw new Error("댓글 내용을 입력해주세요.")
  }

  const { error } = await supabase.from("comments").insert({
    post_id: postId,
    author_id: user.id,
    content: sanitizedContent,
    parent_id: parentId || null,
  })

  if (error) {
    console.error("Error creating comment:", error)
    throw new Error("댓글 작성에 실패했습니다.")
  }

  // Increment comment count on the post
  const { data: post } = await supabase
    .from("posts")
    .select("comment_count")
    .eq("id", postId)
    .single()

  if (post) {
    await supabase
      .from("posts")
      .update({ comment_count: (post.comment_count ?? 0) + 1 })
      .eq("id", postId)
  }

  return { success: true }
}

export async function togglePostLike(postId: string) {
  const user = await requireAuth()
  const supabase = await createClient()

  // Check if already liked
  const { data: existing } = await supabase
    .from("post_likes")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .single()

  if (existing) {
    // Remove like
    await supabase
      .from("post_likes")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id)

    // Decrement like count
    const { data: post } = await supabase
      .from("posts")
      .select("like_count")
      .eq("id", postId)
      .single()

    if (post) {
      await supabase
        .from("posts")
        .update({ like_count: Math.max(0, (post.like_count ?? 1) - 1) })
        .eq("id", postId)
    }

    return { liked: false }
  } else {
    // Add like
    const { error } = await supabase.from("post_likes").insert({
      post_id: postId,
      user_id: user.id,
    })

    if (error) {
      console.error("Error toggling like:", error)
      throw new Error("좋아요 처리에 실패했습니다.")
    }

    // Increment like count
    const { data: post } = await supabase
      .from("posts")
      .select("like_count")
      .eq("id", postId)
      .single()

    if (post) {
      await supabase
        .from("posts")
        .update({ like_count: (post.like_count ?? 0) + 1 })
        .eq("id", postId)
    }

    return { liked: true }
  }
}
