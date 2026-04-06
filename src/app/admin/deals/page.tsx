import { getPendingDeals } from "@/lib/actions/admin"
import { Badge } from "@/components/ui/badge"
import { formatKRW, formatDate } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AdminDealActions } from "./deal-actions"

export default async function AdminDealsPage() {
  const deals = await getPendingDeals()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">딜 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          승인 대기중인 딜 {deals.length}건
        </p>
      </div>

      <div className="rounded-xl border border-border/50 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>제목</TableHead>
              <TableHead>등록자</TableHead>
              <TableHead>카테고리</TableHead>
              <TableHead>가격</TableHead>
              <TableHead>등록일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {deals.length > 0 ? (
              deals.map((deal) => (
                <TableRow key={deal.id}>
                  <TableCell className="max-w-[200px] truncate font-medium">
                    {deal.title}
                  </TableCell>
                  <TableCell>
                    {deal.owner?.display_name ?? "알 수 없음"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        deal.deal_category === "real_estate"
                          ? "bg-blue-500/20 text-blue-400"
                          : "bg-purple-500/20 text-purple-400"
                      }
                    >
                      {deal.deal_category === "real_estate"
                        ? "부동산"
                        : "M&A"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {deal.asking_price
                      ? formatKRW(deal.asking_price)
                      : "가격 협의"}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(deal.created_at)}
                  </TableCell>
                  <TableCell className="text-right">
                    <AdminDealActions dealId={deal.id} />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground"
                >
                  승인 대기중인 딜이 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
