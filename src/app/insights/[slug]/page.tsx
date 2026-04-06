import type { Metadata } from "next"

import { notFound } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Eye, Heart, Clock, Tag } from "lucide-react"

import { getArticleBySlug } from "@/lib/actions/articles"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { formatDate } from "@/lib/utils"
import { BASE_URL } from "@/lib/constants"

export const revalidate = 300

const categoryColors: Record<string, string> = {
  "시장 트렌드": "bg-blue-500/20 text-blue-400",
  "부동산 분석": "bg-emerald-500/20 text-emerald-400",
  "M&A 인사이트": "bg-purple-500/20 text-purple-400",
  "산업 리포트": "bg-amber-500/20 text-amber-400",
  "전문가 칼럼": "bg-rose-500/20 text-rose-400",
}

interface ArticleDetailPageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: ArticleDetailPageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    return { title: "인사이트를 찾을 수 없습니다" }
  }

  const description = article.summary || article.content?.slice(0, 150) || ""

  return {
    title: article.title,
    description,
    openGraph: {
      title: `${article.title} | BlindDeal 인사이트`,
      description,
      url: `${BASE_URL}/insights/${slug}`,
      type: "article",
      locale: "ko_KR",
      ...(article.cover_image_url && { images: [{ url: article.cover_image_url, width: 1200, height: 630, alt: article.title }] }),
    },
    alternates: {
      canonical: `${BASE_URL}/insights/${slug}`,
    },
  }
}

export default async function ArticleDetailPage({
  params,
}: ArticleDetailPageProps) {
  const { slug } = await params
  const article = await getArticleBySlug(slug)

  if (!article) {
    notFound()
  }

  const colorClass =
    categoryColors[article.category] ?? "bg-zinc-500/20 text-zinc-400"
  const authorName =
    article.author?.company_name || article.author?.display_name || "BlindDeal"
  const initials = authorName.slice(0, 2).toUpperCase()

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.summary || article.content?.slice(0, 200),
    url: `${BASE_URL}/insights/${slug}`,
    ...(article.cover_image_url && { image: article.cover_image_url }),
    datePublished: article.published_at,
    dateModified: article.updated_at,
    author: {
      "@type": "Person",
      name: authorName,
    },
    publisher: {
      "@type": "Organization",
      name: "BlindDeal",
      url: BASE_URL,
    },
    mainEntityOfPage: `${BASE_URL}/insights/${slug}`,
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Back link */}
      <Link
        href="/insights"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        인사이트 목록
      </Link>

      {/* Header */}
      <div className="mb-6">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <Badge className={colorClass}>{article.category}</Badge>
        </div>
        <h1 className="text-2xl font-bold text-foreground sm:text-3xl">
          {article.title}
        </h1>
        {article.summary && (
          <p className="mt-2 text-base text-muted-foreground">
            {article.summary}
          </p>
        )}

        {/* Meta */}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Avatar size="sm">
              <AvatarImage
                src={article.author?.avatar_url ?? undefined}
                alt={authorName}
              />
              <AvatarFallback className="text-[10px]">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-foreground">
              {authorName}
            </span>
          </div>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Clock className="size-3" />
              {formatDate(
                article.published_at || article.created_at,
                "yyyy년 MM월 dd일"
              )}
            </span>
            <span className="flex items-center gap-1">
              <Eye className="size-3" />
              {article.view_count}
            </span>
            <span className="flex items-center gap-1">
              <Heart className="size-3" />
              {article.like_count}
            </span>
          </div>
        </div>
      </div>

      {/* Cover image */}
      {article.cover_image_url && (
        <div className="relative mb-8 aspect-video overflow-hidden rounded-lg bg-muted">
          <Image
            src={article.cover_image_url}
            alt={article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      <Separator className="mb-8" />

      {/* Content */}
      <article className="prose prose-invert max-w-none prose-headings:text-foreground prose-p:text-muted-foreground prose-strong:text-foreground prose-a:text-primary">
        <div className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">
          {article.content}
        </div>
      </article>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="mt-8">
          <Separator className="mb-6" />
          <div className="flex flex-wrap items-center gap-2">
            <Tag className="size-4 text-muted-foreground" />
            {article.tags.map((tag: string) => (
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Author card */}
      {article.author && (
        <div className="mt-8">
          <Separator className="mb-6" />
          <div className="flex items-start gap-4 rounded-lg border border-border/50 bg-card p-4">
            <Avatar size="lg">
              <AvatarImage
                src={article.author.avatar_url ?? undefined}
                alt={authorName}
              />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold text-foreground">
                {authorName}
              </p>
              {article.author.bio && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {article.author.bio}
                </p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
