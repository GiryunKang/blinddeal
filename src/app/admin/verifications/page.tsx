import {
  getPendingVerifications,
} from "@/lib/actions/admin"
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
import { VerificationActions } from "./verification-actions"

export default async function AdminVerificationsPage() {
  const verifications = await getPendingVerifications()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">인증 관리</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          대기중인 인증 요청 {verifications.length}건
        </p>
      </div>

      <div className="rounded-xl border border-border/50 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>사용자</TableHead>
              <TableHead>인증 유형</TableHead>
              <TableHead>제출 서류</TableHead>
              <TableHead>요청일</TableHead>
              <TableHead className="text-right">관리</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {verifications.length > 0 ? (
              verifications.map((record) => {
                const displayName =
                  record.profile?.display_name ?? "알 수 없음"
                const initials = displayName.slice(0, 2).toUpperCase()
                return (
                  <TableRow key={record.id}>
                    <TableCell>
                      <div className="flex items-center gap-2.5">
                        <Avatar className="h-8 w-8">
                          <AvatarImage
                            src={record.profile?.avatar_url ?? undefined}
                            alt={displayName}
                          />
                          <AvatarFallback className="text-xs">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {displayName}
                          </p>
                          {record.profile?.email && (
                            <p className="text-xs text-muted-foreground">
                              {record.profile.email}
                            </p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary">
                        {record.verification_type ?? "일반"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {record.document_url ? (
                        <a
                          href={record.document_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary underline-offset-4 hover:underline"
                        >
                          서류 확인
                        </a>
                      ) : (
                        "없음"
                      )}
                    </TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDate(record.created_at)}
                    </TableCell>
                    <TableCell className="text-right">
                      <VerificationActions recordId={record.id} />
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="py-12 text-center text-muted-foreground"
                >
                  대기중인 인증 요청이 없습니다
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
