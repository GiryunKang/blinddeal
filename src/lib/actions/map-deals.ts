"use server"

export interface MapDeal {
  id: string
  slug: string
  title: string
  description: string
  deal_category: "real_estate" | "ma"
  asking_price: number | null
  thumbnail_url: string | null
  lat: number
  lng: number
  address: string
}

// Mock data with Seoul area coordinates for demo purposes
const MOCK_MAP_DEALS: MapDeal[] = [
  {
    id: "map-1",
    slug: "pangyo-office-building",
    title: "판교 테크노밸리 오피스 빌딩",
    description: "판교 중심 상업지구 내 프라임 오피스 빌딩. 연면적 12,000평, 주차 300대.",
    deal_category: "real_estate",
    asking_price: 85_000_000_000,
    thumbnail_url: null,
    lat: 37.3947,
    lng: 127.1112,
    address: "경기도 성남시 분당구 판교역로",
  },
  {
    id: "map-2",
    slug: "gangnam-commercial",
    title: "강남역 초역세권 상업빌딩",
    description: "강남역 도보 2분, 대로변 코너 상업빌딩. 1층 리테일 + 상층부 오피스.",
    deal_category: "real_estate",
    asking_price: 120_000_000_000,
    thumbnail_url: null,
    lat: 37.4979,
    lng: 127.0276,
    address: "서울특별시 강남구 강남대로",
  },
  {
    id: "map-3",
    slug: "jeju-resort-hotel",
    title: "제주 해안 리조트 호텔",
    description: "제주 서귀포 해안가 리조트 호텔. 객실 150실, 부대시설 완비.",
    deal_category: "real_estate",
    asking_price: 45_000_000_000,
    thumbnail_url: null,
    lat: 33.4996,
    lng: 126.5312,
    address: "제주특별자치도 서귀포시",
  },
  {
    id: "map-4",
    slug: "yeouido-fintech-ma",
    title: "여의도 핀테크 기업 M&A",
    description: "여의도 소재 핀테크 스타트업. 매출 50억, 영업이익률 15%.",
    deal_category: "ma",
    asking_price: 30_000_000_000,
    thumbnail_url: null,
    lat: 37.5219,
    lng: 126.9245,
    address: "서울특별시 영등포구 여의대로",
  },
  {
    id: "map-5",
    slug: "seongsu-warehouse",
    title: "성수동 물류 창고 매각",
    description: "성수동 대형 물류 창고. 부지 5,000평, 냉동/냉장 시설 보유.",
    deal_category: "real_estate",
    asking_price: 28_000_000_000,
    thumbnail_url: null,
    lat: 37.5443,
    lng: 127.0557,
    address: "서울특별시 성동구 성수동",
  },
  {
    id: "map-6",
    slug: "gangnam-it-company",
    title: "강남 IT 서비스 기업 인수",
    description: "B2B SaaS 기업. ARR 80억, 고객사 200+.",
    deal_category: "ma",
    asking_price: 50_000_000_000,
    thumbnail_url: null,
    lat: 37.5045,
    lng: 127.0498,
    address: "서울특별시 강남구 테헤란로",
  },
]

export async function getDealsWithLocation(filters?: {
  category?: "real_estate" | "ma" | "all"
  minPrice?: number
  maxPrice?: number
}): Promise<MapDeal[]> {
  // In production, this would query Supabase for deals with lat/lng columns.
  // For now, return mock data filtered by category and price range.
  let deals = [...MOCK_MAP_DEALS]

  if (filters?.category && filters.category !== "all") {
    deals = deals.filter((d) => d.deal_category === filters.category)
  }

  if (filters?.minPrice !== undefined) {
    deals = deals.filter(
      (d) => d.asking_price !== null && d.asking_price >= filters.minPrice!
    )
  }

  if (filters?.maxPrice !== undefined) {
    deals = deals.filter(
      (d) => d.asking_price !== null && d.asking_price <= filters.maxPrice!
    )
  }

  return deals
}
