"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useCallback } from "react"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function DealFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const currentCategory = searchParams.get("category") ?? ""
  const currentVisibility = searchParams.get("visibility") ?? ""
  const currentSort = searchParams.get("sortBy") ?? "latest"
  const currentSearch = searchParams.get("search") ?? ""

  const updateParams = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value && value !== "all") {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      // Reset to page 1 on filter change
      params.delete("page")
      router.push(`/deals?${params.toString()}`)
    },
    [router, searchParams]
  )

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
      {/* Search */}
      <div className="relative flex-1">
        <Search className="absolute left-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="딜 검색..."
          defaultValue={currentSearch}
          className="pl-8"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              updateParams("search", e.currentTarget.value)
            }
          }}
        />
      </div>

      {/* Category */}
      <Select
        value={currentCategory || "all"}
        onValueChange={(v) => updateParams("category", v ?? "all")}
      >
        <SelectTrigger className="w-full sm:w-[130px]">
          <SelectValue placeholder="카테고리" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="real_estate">부동산</SelectItem>
          <SelectItem value="ma">M&A</SelectItem>
        </SelectContent>
      </Select>

      {/* Visibility */}
      <Select
        value={currentVisibility || "all"}
        onValueChange={(v) => updateParams("visibility", v ?? "all")}
      >
        <SelectTrigger className="w-full sm:w-[120px]">
          <SelectValue placeholder="공개 여부" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="public">공개</SelectItem>
          <SelectItem value="private">비공개</SelectItem>
        </SelectContent>
      </Select>

      {/* Sort */}
      <Select
        value={currentSort}
        onValueChange={(v) => updateParams("sortBy", v ?? "latest")}
      >
        <SelectTrigger className="w-full sm:w-[140px]">
          <SelectValue placeholder="정렬" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="latest">최신순</SelectItem>
          <SelectItem value="popular">인기순</SelectItem>
          <SelectItem value="price_high">가격높은순</SelectItem>
          <SelectItem value="price_low">가격낮은순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
