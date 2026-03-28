"use client"

import { useState, useTransition, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import Image from "next/image"
import { Loader2, ChevronDown, ImagePlus, X } from "lucide-react"
import { createDeal } from "@/lib/actions/deal-mutations"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const realEstateDealTypes = [
  { value: "office", label: "오피스" },
  { value: "retail", label: "상가" },
  { value: "logistics", label: "물류" },
  { value: "land", label: "토지" },
  { value: "development", label: "개발" },
  { value: "residential", label: "주거" },
]

const maDealTypes = [
  { value: "full_acquisition", label: "완전 인수" },
  { value: "partial_stake", label: "지분 인수" },
  { value: "division_sale", label: "사업부 매각" },
  { value: "merger", label: "합병" },
]

export function DealForm() {
  const [category, setCategory] = useState<"real_estate" | "ma">("real_estate")
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [imagePreviews, setImagePreviews] = useState<string[]>([])
  const [optionalOpen, setOptionalOpen] = useState(false)
  const optionalRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Progress tracking
  const [filledFields, setFilledFields] = useState({
    title: false,
    description: false,
    dealType: false,
    askingPrice: false,
  })

  const progressPercent =
    (Number(filledFields.title) +
      Number(filledFields.description) +
      Number(filledFields.dealType) +
      Number(filledFields.askingPrice)) *
    25

  const handleFieldChange = useCallback(() => {
    // Defer read to let React flush updates
    requestAnimationFrame(() => {
      const form = document.querySelector<HTMLFormElement>("form")
      if (!form) return
      const title = (form.querySelector<HTMLInputElement>('[name="title"]')?.value ?? "").trim()
      const description = (form.querySelector<HTMLTextAreaElement>('[name="description"]')?.value ?? "").trim()
      const dealType = (form.querySelector<HTMLInputElement>('[name="deal_type"]')?.value ?? "").trim()
      const askingPrice = (form.querySelector<HTMLInputElement>('[name="asking_price"]')?.value ?? "").trim()
      setFilledFields({
        title: title.length > 0,
        description: description.length > 0,
        dealType: dealType.length > 0,
        askingPrice: askingPrice.length > 0,
      })
    })
  }, [])

  function handleImageSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    const validFiles = files.filter((f) => {
      if (!f.type.startsWith("image/")) {
        toast.error("이미지 파일만 업로드 가능합니다.")
        return false
      }
      if (f.size > 5 * 1024 * 1024) {
        toast.error("파일 크기는 5MB 이하여야 합니다.")
        return false
      }
      return true
    })

    const total = images.length + validFiles.length
    if (total > 5) {
      toast.error("이미지는 최대 5장까지 업로드 가능합니다.")
      return
    }

    setImages((prev) => [...prev, ...validFiles])
    validFiles.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        setImagePreviews((prev) => [...prev, ev.target?.result as string])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ""
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index))
    setImagePreviews((prev) => prev.filter((_, i) => i !== index))
  }

  function handleSubmit(formData: FormData) {
    setError(null)

    images.forEach((file, i) => {
      formData.append(`image_${i}`, file)
    })
    formData.set("image_count", String(images.length))

    startTransition(async () => {
      const result = await createDeal(formData)

      if (!result.success) {
        setError(result.error || "딜 등록에 실패했습니다.")
        toast.error(result.error || "딜 등록에 실패했습니다.")
        return
      }

      toast.success("딜이 성공적으로 등록되었습니다.", {
        action: {
          label: "대시보드 보기",
          onClick: () => router.push("/dashboard")
        }
      })
      router.push(`/deals/${result.slug}`)
    })
  }

  return (
    <form action={handleSubmit} className="space-y-6" onChange={handleFieldChange} onClick={handleFieldChange}>
      {/* Progress bar */}
      <div className="h-1 w-full overflow-hidden rounded-full bg-white/[0.06]">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Error display */}
      {error && (
        <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3">
          <p className="text-sm text-destructive">{error}</p>
        </div>
      )}

      {/* Category Tabs */}
      <Tabs
        value={category}
        onValueChange={(v) => setCategory(v as "real_estate" | "ma")}
      >
        <TabsList className="w-full">
          <TabsTrigger value="real_estate" className="flex-1">
            부동산
          </TabsTrigger>
          <TabsTrigger value="ma" className="flex-1">
            M&A
          </TabsTrigger>
        </TabsList>

        {/* Hidden input for category */}
        <input type="hidden" name="deal_category" value={category} />

        {/* Basic Info */}
        <Card className="mt-6 border-border/50">
          <CardHeader>
            <CardTitle>기본 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">딜 제목</Label>
              <Input
                id="title"
                name="title"
                placeholder="딜 제목을 입력하세요"
                required
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">상세 설명</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="딜에 대한 상세 설명을 입력하세요"
                rows={5}
                required
                disabled={isPending}
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="deal_type">딜 유형</Label>
                <Select name="deal_type" required disabled={isPending}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="유형 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {(category === "real_estate"
                      ? realEstateDealTypes
                      : maDealTypes
                    ).map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="asking_price">매각 희망가 (원)</Label>
                <Input
                  id="asking_price"
                  name="asking_price"
                  type="number"
                  placeholder="미입력 시 '가격 협의'"
                  disabled={isPending}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="visibility">공개 여부</Label>
                <Select name="visibility" defaultValue="public" disabled={isPending}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="공개 여부" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">공개</SelectItem>
                    <SelectItem value="private">비공개</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="required_verification_level">
                  필요 인증 등급
                </Label>
                <Select
                  name="required_verification_level"
                  defaultValue="0"
                  disabled={isPending}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="인증 등급" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">없음</SelectItem>
                    <SelectItem value="1">레벨 1 (휴대폰 인증)</SelectItem>
                    <SelectItem value="2">레벨 2 (사업자 확인)</SelectItem>
                    <SelectItem value="3">레벨 3 (자산 증빙)</SelectItem>
                    <SelectItem value="4">레벨 4 (전문 검증)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Category-specific Fields — Collapsible */}
        <div className="mt-6">
          <button
            type="button"
            onClick={() => setOptionalOpen(!optionalOpen)}
            className="flex w-full items-center justify-between rounded-xl border border-border/50 bg-card px-4 py-3 text-sm font-medium transition-colors hover:bg-accent"
          >
            <span>추가 정보 입력 (선택)</span>
            <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform duration-200 ${optionalOpen ? "rotate-180" : ""}`} />
          </button>
          <div
            ref={optionalRef}
            className="overflow-hidden"
            style={{
              maxHeight: optionalOpen ? (optionalRef.current?.scrollHeight ?? 2000) + "px" : "0px",
              opacity: optionalOpen ? 1 : 0,
              transition: "max-height 0.4s cubic-bezier(0.34, 1.56, 0.64, 1), opacity 0.3s ease",
            }}
          >
            <div className="pt-4 space-y-6">
              {category === "real_estate" && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>부동산 상세 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="address">주소</Label>
                        <Input
                          id="address"
                          name="address"
                          placeholder="상세 주소"
                          disabled={isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="city">도시</Label>
                        <Input id="city" name="city" placeholder="서울, 부산 등" disabled={isPending} />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="district">구/군</Label>
                        <Input
                          id="district"
                          name="district"
                          placeholder="강남구 등"
                          disabled={isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="zoning">용도지역</Label>
                        <Input
                          id="zoning"
                          name="zoning"
                          placeholder="상업지역, 주거지역 등"
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="property_area_sqm">대지면적 (m2)</Label>
                        <Input
                          id="property_area_sqm"
                          name="property_area_sqm"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          disabled={isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="building_area_sqm">건축면적 (m2)</Label>
                        <Input
                          id="building_area_sqm"
                          name="building_area_sqm"
                          type="number"
                          step="0.01"
                          placeholder="0.00"
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="floor_count">층수</Label>
                        <Input
                          id="floor_count"
                          name="floor_count"
                          type="number"
                          placeholder="0"
                          disabled={isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="built_year">준공연도</Label>
                        <Input
                          id="built_year"
                          name="built_year"
                          type="number"
                          placeholder="2020"
                          disabled={isPending}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {category === "ma" && (
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>기업 상세 정보</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="industry">업종</Label>
                        <Input
                          id="industry"
                          name="industry"
                          placeholder="IT, 제조, 유통 등"
                          disabled={isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="founded_year">설립연도</Label>
                        <Input
                          id="founded_year"
                          name="founded_year"
                          type="number"
                          placeholder="2010"
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="annual_revenue">연매출 (원)</Label>
                        <Input
                          id="annual_revenue"
                          name="annual_revenue"
                          type="number"
                          placeholder="0"
                          disabled={isPending}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="annual_profit">연이익 (원)</Label>
                        <Input
                          id="annual_profit"
                          name="annual_profit"
                          type="number"
                          placeholder="0"
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="employee_count">직원 수</Label>
                      <Input
                        id="employee_count"
                        name="employee_count"
                        type="number"
                        placeholder="0"
                        disabled={isPending}
                      />
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Highlights & Risks */}
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle>매력 포인트 & 리스크</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="highlight_points">
                      핵심 매력 포인트 (줄바꿈으로 구분)
                    </Label>
                    <Textarea
                      id="highlight_points"
                      name="highlight_points"
                      placeholder={"역세권 도보 3분\n최근 리모델링 완료\n안정적 임대 수익"}
                      rows={3}
                      disabled={isPending}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="risk_factors">
                      리스크 요소 (줄바꿈으로 구분)
                    </Label>
                    <Textarea
                      id="risk_factors"
                      name="risk_factors"
                      placeholder={"노후 건물\n공실 위험\n주변 재개발 불확실"}
                      rows={3}
                      disabled={isPending}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </Tabs>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">딜 이미지 (선택)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-3">
            {imagePreviews.map((src, i) => (
              <div key={i} className="group relative size-24 overflow-hidden rounded-lg border border-border">
                <Image src={src} alt={`이미지 ${i + 1}`} fill className="object-cover" />
                <button
                  type="button"
                  onClick={() => removeImage(i)}
                  className="absolute right-1 top-1 flex size-5 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100"
                >
                  <X className="size-3" />
                </button>
              </div>
            ))}
            {images.length < 5 && (
              <label className="flex size-24 cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-border/50 text-muted-foreground transition-colors hover:border-blue-500/50 hover:text-blue-400">
                <ImagePlus className="size-6" />
                <span className="mt-1 text-[10px]">추가</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  className="hidden"
                  onChange={handleImageSelect}
                />
              </label>
            )}
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            최대 5장, 각 5MB 이하 (JPG, PNG, WebP)
          </p>
        </CardContent>
      </Card>

      {/* Submit */}
      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isPending}>
          {isPending && <Loader2 className="mr-2 size-4 animate-spin" />}
          {isPending ? "등록 중..." : "딜 등록하기"}
        </Button>
      </div>
    </form>
  )
}
