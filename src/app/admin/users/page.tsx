import { getUsers } from "@/lib/actions/admin"
import { Badge } from "@/components/ui/badge"
import { formatDate } from "@/lib/utils"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface AdminUsersPageProps {
  searchParams: Promise<{
    page?: string
  }>
}

export default async function AdminUsersPage({
  searchParams,
}: AdminUsersPageProps) {
  const params = await searchParams
  const page = params.page ? parseInt(params.page, 10) : 1
  const { users, count } = await getUsers(page)

  const totalPages = Math.ceil(count / 20)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">사용자 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          총 {count}명의 사용자
        </p>
      </div>

      <div className="rounded-xl border border-border/50 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>사용자</TableHead>
              <TableHead>이메일</TableHead>
              <TableHead>유형</TableHead>
              <TableHead>인증</TableHead>
              <TableHead>멤버십</TableHead>
              <TableHead>가입일</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => {
                const initials = (user.display_name ?? "U")
                  .slice(0, 2)
                  .toUpperCase()
                return (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={user.avatar_url ?? undefined}
                            alt={user.display_name}
                          />
                          <AvatarFallback className="text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {user.display_name}
                          </p>
                          {user.company_name && (
                            <p className="text-xs text-muted-foreground">
                              {user.company_name}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {user.user_type === "corporation"
                          ? "법인"
                          : "개인"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {user.is_verified ? (
                        <Badge className="bg-green-500/20 text-green-400">
                          인증됨
                        </Badge>
                      ) : (
                        <Badge className="bg-gray-500/20 text-gray-400">
                          미인증
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {user.membership_tier}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(user.created_at)}
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-12 text-center text-muted-foreground"
                >
                  사용자가 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          {page > 1 && (
            <a
              href={`/admin/users?page=${page - 1}`}
              className="rounded-lg border border-border/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              이전
            </a>
          )}
          <span className="text-sm text-muted-foreground">
            {page} / {totalPages}
          </span>
          {page < totalPages && (
            <a
              href={`/admin/users?page=${page + 1}`}
              className="rounded-lg border border-border/50 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              다음
            </a>
          )}
        </div>
      )}
    </div>
  )
}
