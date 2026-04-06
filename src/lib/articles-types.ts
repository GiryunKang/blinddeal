export const CATEGORY_MAP: Record<string, string> = {
  "시장 트렌드": "market_trend",
  "부동산 분석": "real_estate_analysis",
  "M&A 인사이트": "ma_insight",
  "산업 리포트": "industry_report",
  "전문가 칼럼": "expert_column",
  "딜 후기": "deal_review",
  가이드: "guide",
}

export const CATEGORY_LABELS: Record<string, string> = {
  market_trend: "시장 트렌드",
  real_estate_analysis: "부동산 분석",
  ma_insight: "M&A 인사이트",
  industry_report: "산업 리포트",
  expert_column: "전문가 칼럼",
  deal_review: "딜 후기",
  guide: "가이드",
}

export interface ArticleFilters {
  category?: string
  page?: number
  limit?: number
}
