"use client"

import { useEffect, useState, useTransition } from "react"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  getMatchPreferences,
  saveMatchPreferences,
  type MatchPreferencesData,
} from "@/lib/actions/matching"

const dealCategoryOptions = [
  { value: "real_estate", label: "부동산" },
  { value: "mna", label: "M&A" },
  { value: "investment", label: "투자" },
  { value: "startup", label: "스타트업" },
  { value: "other", label: "기타" },
]

const regionOptions = [
  "서울",
  "경기",
  "인천",
  "부산",
  "대구",
  "광주",
  "대전",
  "울산",
  "세종",
  "강원",
  "충북",
  "충남",
  "전북",
  "전남",
  "경북",
  "경남",
  "제주",
]

const industryOptions = [
  "IT/소프트웨어",
  "제조업",
  "유통/물류",
  "건설/부동산",
  "금융/보험",
  "의료/헬스케어",
  "교육",
  "F&B",
  "엔터테인먼트",
  "기타",
]

export default function MatchPreferencesPage() {
  const [isPending, startTransition] = useTransition()
  const [saved, setSaved] = useState(false)
  const [form, setForm] = useState<MatchPreferencesData>({
    deal_categories: [],
    min_price: null,
    max_price: null,
    regions: [],
    industries: [],
    keywords: [],
    notify_new_deals: true,
    notify_price_changes: true,
    notify_matching: true,
  })
  const [keywordsText, setKeywordsText] = useState("")

  useEffect(() => {
    async function load() {
      try {
        const prefs = await getMatchPreferences()
        if (prefs) {
          setForm({
            deal_categories: prefs.deal_categories ?? [],
            min_price: prefs.min_price ?? null,
            max_price: prefs.max_price ?? null,
            regions: prefs.regions ?? [],
            industries: prefs.industries ?? [],
            keywords: prefs.keywords ?? [],
            notify_new_deals: prefs.notify_new_deals ?? true,
            notify_price_changes: prefs.notify_price_changes ?? true,
            notify_matching: prefs.notify_matching ?? true,
          })
          setKeywordsText((prefs.keywords ?? []).join(", "))
        }
      } catch {
        // Not authenticated or no preferences yet
      }
    }
    load()
  }, [])

  function toggleArrayItem(
    key: "deal_categories" | "regions" | "industries",
    value: string
  ) {
    setForm((prev) => {
      const arr = prev[key]
      const next = arr.includes(value)
        ? arr.filter((v) => v !== value)
        : [...arr, value]
      return { ...prev, [key]: next }
    })
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const keywords = keywordsText
      .split(",")
      .map((k) => k.trim())
      .filter(Boolean)

    startTransition(async () => {
      await saveMatchPreferences({ ...form, keywords })
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      {/* Back link */}
      <Link
        href="/profile"
        className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        프로필
      </Link>

      <h1 className="mb-6 text-2xl font-bold text-foreground">매칭 설정</h1>
      <p className="mb-6 text-sm text-muted-foreground">
        관심 있는 딜 조건을 설정하면 맞춤 딜을 추천받을 수 있습니다.
      </p>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Deal Categories */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">관심 딜 카테고리</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {dealCategoryOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() =>
                    toggleArrayItem("deal_categories", opt.value)
                  }
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    form.deal_categories.includes(opt.value)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Price Range */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">희망 가격대</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <div className="flex-1 space-y-1">
                <Label htmlFor="min_price" className="text-xs">
                  최소 금액 (원)
                </Label>
                <Input
                  id="min_price"
                  type="number"
                  placeholder="0"
                  value={form.min_price ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      min_price: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    }))
                  }
                />
              </div>
              <span className="mt-5 text-sm text-muted-foreground">~</span>
              <div className="flex-1 space-y-1">
                <Label htmlFor="max_price" className="text-xs">
                  최대 금액 (원)
                </Label>
                <Input
                  id="max_price"
                  type="number"
                  placeholder="0"
                  value={form.max_price ?? ""}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      max_price: e.target.value
                        ? parseInt(e.target.value, 10)
                        : null,
                    }))
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Regions */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">관심 지역</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {regionOptions.map((region) => (
                <button
                  key={region}
                  type="button"
                  onClick={() => toggleArrayItem("regions", region)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    form.regions.includes(region)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {region}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Industries */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">관심 산업</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {industryOptions.map((industry) => (
                <button
                  key={industry}
                  type="button"
                  onClick={() => toggleArrayItem("industries", industry)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    form.industries.includes(industry)
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {industry}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Keywords */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">관심 키워드</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              placeholder="예: 역세권, 수익형, 학교 근처 (쉼표로 구분)"
              value={keywordsText}
              onChange={(e) => setKeywordsText(e.target.value)}
            />
          </CardContent>
        </Card>

        <Separator />

        {/* Notification Toggles */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="text-sm">알림 설정</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">새 딜 알림</span>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    notify_new_deals: !prev.notify_new_deals,
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.notify_new_deals ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform ${
                    form.notify_new_deals
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">가격 변동 알림</span>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    notify_price_changes: !prev.notify_price_changes,
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.notify_price_changes ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform ${
                    form.notify_price_changes
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-sm text-foreground">매칭 딜 알림</span>
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    notify_matching: !prev.notify_matching,
                  }))
                }
                className={`relative h-6 w-11 rounded-full transition-colors ${
                  form.notify_matching ? "bg-primary" : "bg-muted"
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 size-5 rounded-full bg-white transition-transform ${
                    form.notify_matching
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </label>
          </CardContent>
        </Card>

        {/* Submit */}
        <div className="flex items-center gap-3">
          <Button type="submit" disabled={isPending}>
            <Save className="mr-1 size-4" />
            {isPending ? "저장 중..." : "설정 저장"}
          </Button>
          {saved && (
            <span className="text-sm text-emerald-400">
              설정이 저장되었습니다.
            </span>
          )}
        </div>
      </form>
    </div>
  )
}
