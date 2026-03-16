import Link from "next/link"
import { Star } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

const typeColorMap: Record<string, string> = {
  법무: "bg-blue-500/20 text-blue-400",
  회계: "bg-emerald-500/20 text-emerald-400",
  세무: "bg-amber-500/20 text-amber-400",
  감정: "bg-purple-500/20 text-purple-400",
  컨설팅: "bg-rose-500/20 text-rose-400",
}

interface ExpertCardProps {
  expert: {
    id: string
    specialty: string[]
    rating: number
    review_count: number
    years_of_experience: number
    hourly_rate: number | null
    introduction: string | null
    profile?: {
      display_name: string
      avatar_url: string | null
      company_name: string | null
    } | null
  }
}

export function ExpertCard({ expert }: ExpertCardProps) {
  const displayName =
    expert.profile?.display_name ?? "전문가"
  const initials = displayName.slice(0, 2).toUpperCase()

  return (
    <Link href={`/experts/${expert.id}`} className="group block">
      <Card className="overflow-hidden border-border/50 transition-all hover:border-border">
        <CardContent className="space-y-3 pt-4">
          {/* Header: avatar + name + firm */}
          <div className="flex items-start gap-3">
            <Avatar className="h-12 w-12">
              <AvatarImage
                src={expert.profile?.avatar_url ?? undefined}
                alt={displayName}
              />
              <AvatarFallback className="text-sm">{initials}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h3 className="truncate text-base font-semibold text-foreground transition-colors group-hover:text-primary">
                {displayName}
              </h3>
              {expert.profile?.company_name && (
                <p className="truncate text-sm text-muted-foreground">
                  {expert.profile.company_name}
                </p>
              )}
            </div>
          </div>

          {/* Type badges */}
          <div className="flex flex-wrap gap-1.5">
            {expert.specialty.map((spec) => (
              <Badge
                key={spec}
                className={typeColorMap[spec] ?? "bg-gray-500/20 text-gray-400"}
              >
                {spec}
              </Badge>
            ))}
          </div>

          {/* Introduction */}
          {expert.introduction && (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {expert.introduction}
            </p>
          )}

          {/* Footer: rating + experience */}
          <div className="flex items-center justify-between pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">
                {expert.rating.toFixed(1)}
              </span>
              <span>({expert.review_count})</span>
            </div>
            <span>경력 {expert.years_of_experience}년</span>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
