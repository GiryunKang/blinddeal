import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { timingSafeEqual } from "crypto"

const INQUIRY_TYPE_LABELS: Record<string, string> = {
  buy: "딜 탐색",
  sell: "딜 등록",
  meeting: "미팅 요청",
  partnership: "파트너 제휴",
  other: "기타",
}

const CATEGORY_LABELS: Record<string, string> = {
  real_estate: "부동산",
  ma: "M&A(인수합병)",
  both: "부동산 & M&A",
}

function getTypeBadgeColor(type: string): string {
  switch (type) {
    case "buy": return "#3b82f6"
    case "sell": return "#8b5cf6"
    case "meeting": return "#06b6d4"
    case "partnership": return "#f59e0b"
    default: return "#6b7280"
  }
}

function verifyCronSecret(authHeader: string | null): boolean {
  const expected = process.env.CRON_SECRET
  if (!expected || !authHeader) return false
  const received = authHeader.replace("Bearer ", "")
  if (expected.length !== received.length) return false
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(received))
  } catch {
    return false
  }
}

export async function GET(request: Request) {
  if (!verifyCronSecret(request.headers.get("authorization"))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  // Calculate time range: last 24h based on 22:00 KST (13:00 UTC)
  const now = new Date()
  const endTime = new Date(now)
  const startTime = new Date(now)
  startTime.setHours(startTime.getHours() - 24)

  const { data: inquiries, error } = await supabase
    .from("inquiries")
    .select("*")
    .gte("created_at", startTime.toISOString())
    .lte("created_at", endTime.toISOString())
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Failed to fetch inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }

  if (!inquiries || inquiries.length === 0) {
    console.info("[Daily Inquiries] No inquiries in the last 24 hours.")
    return NextResponse.json({ message: "No inquiries", count: 0 })
  }

  // Build type breakdown
  const typeBreakdown: Record<string, number> = {}
  for (const inq of inquiries) {
    typeBreakdown[inq.inquiry_type] = (typeBreakdown[inq.inquiry_type] || 0) + 1
  }

  const dateStr = now.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: "Asia/Seoul",
  })

  const subject = `[BlindDeal] 일일 문의 리포트 — ${dateStr}`

  // Build HTML email
  const breakdownHtml = Object.entries(typeBreakdown)
    .map(([type, count]) =>
      `<span style="display:inline-block;background:${getTypeBadgeColor(type)};color:#fff;border-radius:12px;padding:2px 10px;font-size:12px;margin-right:6px;">${INQUIRY_TYPE_LABELS[type] || type}</span> ${count}건`
    )
    .join("&nbsp;&nbsp;|&nbsp;&nbsp;")

  const inquiryRows = inquiries
    .map((inq) => {
      const badgeColor = getTypeBadgeColor(inq.inquiry_type)
      return `
      <tr>
        <td style="padding:20px 24px;border-bottom:1px solid #e5e7eb;">
          <div style="margin-bottom:8px;">
            <span style="display:inline-block;background:${badgeColor};color:#fff;border-radius:12px;padding:2px 10px;font-size:12px;font-weight:600;">${INQUIRY_TYPE_LABELS[inq.inquiry_type] || inq.inquiry_type}</span>
            ${inq.deal_category ? `<span style="display:inline-block;background:#f3f4f6;color:#374151;border-radius:12px;padding:2px 10px;font-size:12px;margin-left:4px;">${CATEGORY_LABELS[inq.deal_category] || inq.deal_category}</span>` : ""}
            ${inq.budget_range ? `<span style="display:inline-block;background:#f3f4f6;color:#374151;border-radius:12px;padding:2px 10px;font-size:12px;margin-left:4px;">${inq.budget_range}</span>` : ""}
          </div>
          <div style="margin-bottom:6px;">
            <strong style="color:#111827;">${inq.name}</strong>
            ${inq.company ? `<span style="color:#6b7280;margin-left:8px;">${inq.company}</span>` : ""}
          </div>
          <div style="font-size:13px;color:#6b7280;margin-bottom:8px;">
            ${inq.email}${inq.phone ? ` | ${inq.phone}` : ""}
          </div>
          <div style="font-size:14px;color:#374151;line-height:1.6;background:#f9fafb;border-radius:8px;padding:12px;margin-bottom:6px;">
            ${inq.description.replace(/\n/g, "<br/>")}
          </div>
          ${inq.preferences ? `<div style="font-size:13px;color:#6b7280;line-height:1.5;"><strong>희망 사항:</strong> ${inq.preferences.replace(/\n/g, "<br/>")}</div>` : ""}
          <div style="font-size:11px;color:#9ca3af;margin-top:8px;">
            ${new Date(inq.created_at).toLocaleString("ko-KR", { timeZone: "Asia/Seoul" })}
          </div>
        </td>
      </tr>`
    })
    .join("")

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="max-width:640px;margin:0 auto;padding:20px;">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a8a,#4f46e5,#7c3aed);border-radius:16px 16px 0 0;padding:32px 24px;text-align:center;">
      <h1 style="color:#fff;font-size:22px;margin:0 0 8px;">BlindDeal 일일 문의 리포트</h1>
      <p style="color:rgba(255,255,255,0.7);font-size:14px;margin:0;">${dateStr}</p>
    </div>

    <!-- Summary -->
    <div style="background:#fff;padding:24px;border-bottom:1px solid #e5e7eb;">
      <div style="text-align:center;margin-bottom:16px;">
        <span style="font-size:36px;font-weight:700;color:#111827;">${inquiries.length}</span>
        <span style="font-size:14px;color:#6b7280;margin-left:4px;">건의 문의</span>
      </div>
      <div style="text-align:center;font-size:13px;color:#6b7280;">
        ${breakdownHtml}
      </div>
    </div>

    <!-- Inquiry List -->
    <table style="width:100%;background:#fff;border-collapse:collapse;">
      ${inquiryRows}
    </table>

    <!-- Footer -->
    <div style="background:#f9fafb;border-radius:0 0 16px 16px;padding:20px 24px;text-align:center;border-top:1px solid #e5e7eb;">
      <p style="font-size:12px;color:#9ca3af;margin:0;">
        이 메일은 BlindDeal 플랫폼에서 자동 발송되었습니다.
      </p>
    </div>
  </div>
</body>
</html>`

  const recipientEmail = process.env.INQUIRY_NOTIFICATION_EMAIL || "83482@daum.net"

  // Try Resend if API key exists
  if (process.env.RESEND_API_KEY) {
    try {
      const { Resend } = await import("resend")
      const resend = new Resend(process.env.RESEND_API_KEY)

      const { error: sendError } = await resend.emails.send({
        from: "BlindDeal <onboarding@resend.dev>",
        to: recipientEmail,
        subject,
        html,
      })

      if (sendError) {
        console.error("Failed to send email via Resend:", sendError)
        return NextResponse.json({ error: "Failed to send email" }, { status: 500 })
      }

      return NextResponse.json({
        message: "Email sent successfully",
        count: inquiries.length,
      })
    } catch (err) {
      console.error("Resend error:", err)
    }
  }

  // Fallback: log to console (Resend not configured)
  console.info("=== DAILY INQUIRY REPORT ===")
  console.info(`Subject: ${subject}`)
  console.info(`To: ${recipientEmail}`)
  console.info(`Total inquiries: ${inquiries.length}`)
  console.info("Breakdown:", typeBreakdown)
  console.info("HTML email content generated (Resend not configured)")
  console.info("============================")

  return NextResponse.json({
    message: "Email logged to console (RESEND_API_KEY not configured)",
    count: inquiries.length,
  })
}
