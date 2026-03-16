import { MainLayout } from "@/components/layout/main-layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  Briefcase,
  Building2,
  Handshake,
} from "lucide-react";
import { formatKRW } from "@/lib/utils";

const stats = [
  {
    label: "거래량",
    value: "₩2.4T",
    change: "+12.5%",
    trend: "up" as const,
    icon: BarChart3,
  },
  {
    label: "신규 딜",
    value: "847",
    change: "+8.2%",
    trend: "up" as const,
    icon: Briefcase,
  },
  {
    label: "활성 M&A",
    value: "156",
    change: "-3.1%",
    trend: "down" as const,
    icon: Building2,
  },
  {
    label: "성사 거래",
    value: "₩890B",
    change: "+24.7%",
    trend: "up" as const,
    icon: Handshake,
  },
];

const recentDeals = [
  {
    id: "1",
    title: "판교 물류센터",
    category: "부동산",
    categoryColor: "blue" as const,
    amount: 45000000000,
    status: "공개",
    statusColor: "emerald" as const,
    date: "2026.03.15",
  },
  {
    id: "2",
    title: "바이오텍 인수",
    category: "M&A",
    categoryColor: "purple" as const,
    amount: 120000000000,
    status: "NDA",
    statusColor: "amber" as const,
    date: "2026.03.14",
  },
  {
    id: "3",
    title: "제주 리조트 개발",
    category: "부동산",
    categoryColor: "blue" as const,
    amount: 78000000000,
    status: "공개",
    statusColor: "emerald" as const,
    date: "2026.03.13",
  },
];

export default function HomePage() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-6">
        {/* Stat Cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card
                key={stat.label}
                className="border-border/50 bg-gradient-to-br from-card to-card/50"
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.label}
                  </CardTitle>
                  <Icon className="size-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="mt-1 flex items-center gap-1 text-xs">
                    {stat.trend === "up" ? (
                      <TrendingUp className="size-3 text-emerald-500" />
                    ) : (
                      <TrendingDown className="size-3 text-red-500" />
                    )}
                    <span
                      className={
                        stat.trend === "up"
                          ? "text-emerald-500"
                          : "text-red-500"
                      }
                    >
                      {stat.change}
                    </span>
                    <span className="text-muted-foreground">전월 대비</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recent Deals */}
        <Card className="border-border/50 bg-gradient-to-br from-card to-card/50">
          <CardHeader>
            <CardTitle>최근 딜</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border/50 hover:bg-transparent">
                  <TableHead>딜 이름</TableHead>
                  <TableHead>유형</TableHead>
                  <TableHead>규모</TableHead>
                  <TableHead>상태</TableHead>
                  <TableHead>등록일</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentDeals.map((deal) => (
                  <TableRow
                    key={deal.id}
                    className="border-border/50 hover:bg-muted/30"
                  >
                    <TableCell className="font-medium">
                      {deal.title}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          deal.categoryColor === "blue"
                            ? "bg-blue-500/10 text-blue-400"
                            : "bg-purple-500/10 text-purple-400"
                        }
                      >
                        {deal.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatKRW(deal.amount)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          deal.statusColor === "emerald"
                            ? "bg-emerald-500/10 text-emerald-400"
                            : "bg-amber-500/10 text-amber-400"
                        }
                      >
                        {deal.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {deal.date}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
