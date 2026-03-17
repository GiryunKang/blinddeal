"use client"

import { useEffect, useState, useCallback } from "react"
import Link from "next/link"
import { MapPin, Building, List, Map, Filter } from "lucide-react"
import { NaverMap, type MapMarker } from "@/components/map/naver-map"
import { getDealsWithLocation, type MapDeal } from "@/lib/actions/map-deals"
import { formatKRW } from "@/lib/utils"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

type CategoryFilter = "all" | "real_estate" | "ma"

const PRICE_RANGES = [
  { label: "전체", min: undefined, max: undefined },
  { label: "100억 이하", min: undefined, max: 10_000_000_000 },
  { label: "100억 ~ 500억", min: 10_000_000_000, max: 50_000_000_000 },
  { label: "500억 이상", min: 50_000_000_000, max: undefined },
]

export default function MapPage() {
  const [deals, setDeals] = useState<MapDeal[]>([])
  const [category, setCategory] = useState<CategoryFilter>("all")
  const [priceRange, setPriceRange] = useState(0)
  const [selectedDealId, setSelectedDealId] = useState<string | null>(null)
  const [mobileView, setMobileView] = useState<"map" | "list">("map")
  const [showFilters, setShowFilters] = useState(false)

  const fetchDeals = useCallback(async () => {
    const range = PRICE_RANGES[priceRange]
    const result = await getDealsWithLocation({
      category: category === "all" ? "all" : category,
      minPrice: range.min,
      maxPrice: range.max,
    })
    setDeals(result)
  }, [category, priceRange])

  useEffect(() => {
    fetchDeals()
  }, [fetchDeals])

  const markers: MapMarker[] = deals.map((deal) => ({
    id: deal.id,
    lat: deal.lat,
    lng: deal.lng,
    title: deal.title,
    price: deal.asking_price ? formatKRW(deal.asking_price) : "협의",
    category: deal.deal_category,
    slug: deal.slug,
  }))

  const handleMarkerClick = (id: string) => {
    setSelectedDealId(id)
    setMobileView("list")
  }

  return (
    <div className="flex h-[calc(100vh-64px)] flex-col">
      {/* Filter Bar */}
      <div className="border-b border-border bg-card px-4 py-3">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <MapPin className="size-4 text-primary" />
            <h1 className="text-base font-semibold">지도로 보기</h1>
          </div>

          {/* Desktop filters */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex rounded-lg border border-border">
              {(["all", "real_estate", "ma"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3 py-1.5 text-xs font-medium transition-colors ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  } ${cat === "all" ? "rounded-l-lg" : ""} ${cat === "ma" ? "rounded-r-lg" : ""}`}
                >
                  {cat === "all" ? "전체" : cat === "real_estate" ? "부동산" : "M&A"}
                </button>
              ))}
            </div>

            <select
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="rounded-lg border border-border bg-card px-3 py-1.5 text-xs text-foreground"
            >
              {PRICE_RANGES.map((range, i) => (
                <option key={i} value={i}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>

          {/* Mobile filter toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="ml-auto flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs text-muted-foreground md:hidden"
          >
            <Filter className="size-3.5" />
            필터
          </button>

          {/* Mobile view toggle */}
          <div className="flex rounded-lg border border-border md:hidden">
            <button
              onClick={() => setMobileView("map")}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-l-lg transition-colors ${
                mobileView === "map"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <Map className="size-3.5" />
              지도
            </button>
            <button
              onClick={() => setMobileView("list")}
              className={`flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-r-lg transition-colors ${
                mobileView === "list"
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground"
              }`}
            >
              <List className="size-3.5" />
              목록
            </button>
          </div>

          <span className="hidden text-xs text-muted-foreground md:inline">
            {deals.length}개의 매물
          </span>
        </div>

        {/* Mobile filters (collapsible) */}
        {showFilters && (
          <div className="mt-3 flex flex-col gap-2 md:hidden">
            <div className="flex rounded-lg border border-border">
              {(["all", "real_estate", "ma"] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`flex-1 px-3 py-1.5 text-xs font-medium transition-colors ${
                    category === cat
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  } ${cat === "all" ? "rounded-l-lg" : ""} ${cat === "ma" ? "rounded-r-lg" : ""}`}
                >
                  {cat === "all" ? "전체" : cat === "real_estate" ? "부동산" : "M&A"}
                </button>
              ))}
            </div>
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(Number(e.target.value))}
              className="w-full rounded-lg border border-border bg-card px-3 py-2 text-xs text-foreground"
            >
              {PRICE_RANGES.map((range, i) => (
                <option key={i} value={i}>
                  {range.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar — deal list */}
        <div
          className={`w-full flex-shrink-0 overflow-y-auto border-r border-border bg-background md:block md:w-80 lg:w-96 ${
            mobileView === "list" ? "block" : "hidden"
          }`}
        >
          <div className="p-3">
            <p className="mb-3 text-xs text-muted-foreground md:hidden">
              {deals.length}개의 매물
            </p>
            <div className="flex flex-col gap-2">
              {deals.length === 0 && (
                <div className="flex flex-col items-center gap-2 py-12 text-muted-foreground">
                  <Building className="size-8 opacity-30" />
                  <p className="text-sm">조건에 맞는 매물이 없습니다</p>
                </div>
              )}
              {deals.map((deal) => (
                <Link key={deal.id} href={`/deals/${deal.slug}`}>
                  <Card
                    className={`cursor-pointer transition-all hover:border-primary/50 ${
                      selectedDealId === deal.id
                        ? "border-primary ring-1 ring-primary/30"
                        : "border-border/50"
                    }`}
                    size="sm"
                    onClick={(e) => {
                      e.preventDefault()
                      setSelectedDealId(deal.id)
                      setMobileView("map")
                    }}
                    onDoubleClick={() => {
                      window.location.href = `/deals/${deal.slug}`
                    }}
                  >
                    <CardContent className="space-y-1.5">
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="line-clamp-1 text-sm font-semibold text-foreground">
                          {deal.title}
                        </h3>
                        <Badge
                          className={
                            deal.deal_category === "real_estate"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-purple-500/20 text-purple-400"
                          }
                        >
                          {deal.deal_category === "real_estate" ? "부동산" : "M&A"}
                        </Badge>
                      </div>
                      <p className="line-clamp-2 text-xs text-muted-foreground">
                        {deal.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-bold text-primary">
                          {deal.asking_price
                            ? formatKRW(deal.asking_price)
                            : "가격 협의"}
                        </span>
                        <span className="flex items-center gap-1 text-xs text-muted-foreground">
                          <MapPin className="size-3" />
                          {deal.address}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Map */}
        <div
          className={`flex-1 md:block ${mobileView === "map" ? "block" : "hidden"}`}
        >
          <NaverMap
            center={{ lat: 37.5665, lng: 126.978 }}
            zoom={11}
            markers={markers}
            onMarkerClick={handleMarkerClick}
            selectedMarkerId={selectedDealId}
          />
        </div>
      </div>
    </div>
  )
}
