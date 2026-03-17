import type { Metadata } from "next"
import { MainLayout } from "@/components/layout/main-layout";

export const metadata: Metadata = { title: "개인정보처리방침" }

export default function PrivacyPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl py-12">
        <h1 className="text-3xl font-bold tracking-tight">
          개인정보처리방침
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          시행일: 2026년 3월 1일
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
          <p>
            주식회사 블라인드딜(이하 &ldquo;회사&rdquo;)은 개인정보
            보호법에 따라 이용자의 개인정보를 보호하고, 이와 관련한 고충을
            신속하고 원활하게 처리할 수 있도록 다음과 같이
            개인정보처리방침을 수립하여 공개합니다.
          </p>

          {/* 1. 수집 항목 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              1. 개인정보 수집 항목
            </h2>
            <div className="mt-3 space-y-4">
              <div>
                <h3 className="font-medium text-foreground">
                  필수 수집 항목
                </h3>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>회원가입: 이름, 이메일 주소, 비밀번호, 연락처</li>
                  <li>본인인증: 이름, 생년월일, 휴대폰 번호, CI/DI</li>
                  <li>
                    사업자 인증: 사업자등록번호, 상호명, 대표자명, 사업장
                    주소
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  선택 수집 항목
                </h3>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>프로필 사진, 회사명, 직책, 관심 분야</li>
                </ul>
              </div>
              <div>
                <h3 className="font-medium text-foreground">
                  자동 수집 항목
                </h3>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>
                    IP 주소, 쿠키, 접속 일시, 서비스 이용 기록, 브라우저
                    정보, 기기 정보
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 2. 수집 목적 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              2. 개인정보 수집 및 이용 목적
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>
                <span className="font-medium text-foreground">
                  회원 관리:
                </span>{" "}
                회원 식별, 본인인증, 회원자격 유지 및 관리, 부정이용 방지
              </li>
              <li>
                <span className="font-medium text-foreground">
                  서비스 제공:
                </span>{" "}
                딜 등록 및 검색, NDA 체결, 에스크로 결제, 전문가 매칭
              </li>
              <li>
                <span className="font-medium text-foreground">
                  거래 안전:
                </span>{" "}
                에스크로 결제 처리, 거래 당사자 신원 확인, 분쟁 해결
              </li>
              <li>
                <span className="font-medium text-foreground">
                  서비스 개선:
                </span>{" "}
                서비스 이용 통계, 신규 서비스 개발, 맞춤형 서비스 제공
              </li>
              <li>
                <span className="font-medium text-foreground">
                  고객 지원:
                </span>{" "}
                문의 및 민원 처리, 공지사항 전달
              </li>
              <li>
                <span className="font-medium text-foreground">
                  마케팅:
                </span>{" "}
                이벤트 및 프로모션 안내 (동의한 경우에 한함)
              </li>
            </ul>
          </section>

          {/* 3. 보유 기간 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              3. 개인정보 보유 및 이용 기간
            </h2>
            <p className="mt-3">
              회사는 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를
              지체 없이 파기합니다. 단, 관련 법령에 의해 보존할 필요가 있는
              경우 아래와 같이 관련 법령이 정한 기간 동안 보존합니다.
            </p>
            <div className="mt-4 overflow-hidden rounded-lg border border-border/50">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border/50 bg-muted/30">
                    <th className="px-4 py-3 font-medium text-foreground">
                      보존 항목
                    </th>
                    <th className="px-4 py-3 font-medium text-foreground">
                      보존 기간
                    </th>
                    <th className="px-4 py-3 font-medium text-foreground">
                      근거 법령
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/50">
                  <tr>
                    <td className="px-4 py-3">계약 또는 청약철회 기록</td>
                    <td className="px-4 py-3">5년</td>
                    <td className="px-4 py-3">전자상거래법</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      대금결제 및 재화 공급 기록
                    </td>
                    <td className="px-4 py-3">5년</td>
                    <td className="px-4 py-3">전자상거래법</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">
                      소비자 불만 또는 분쟁처리 기록
                    </td>
                    <td className="px-4 py-3">3년</td>
                    <td className="px-4 py-3">전자상거래법</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">접속 기록</td>
                    <td className="px-4 py-3">3개월</td>
                    <td className="px-4 py-3">통신비밀보호법</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* 4. 제3자 제공 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              4. 개인정보의 제3자 제공
            </h2>
            <p className="mt-3">
              회사는 원칙적으로 이용자의 개인정보를 외부에 제공하지 않습니다.
              다만, 다음의 경우에는 예외로 합니다.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-2">
              <li>이용자가 사전에 동의한 경우</li>
              <li>
                거래 성사 시 거래 상대방에게 필요한 최소한의 정보 (이름,
                연락처) 제공 (거래 진행 목적)
              </li>
              <li>
                에스크로 결제 서비스 이용 시 결제 대행사에 결제 처리에 필요한
                정보 제공
              </li>
              <li>
                법령의 규정에 의하거나, 수사기관의 요청에 의한 경우 (법적
                절차에 따름)
              </li>
            </ul>
          </section>

          {/* 5. 파기 절차 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              5. 개인정보 파기 절차 및 방법
            </h2>
            <div className="mt-3 space-y-3">
              <div>
                <h3 className="font-medium text-foreground">파기 절차</h3>
                <p className="mt-1">
                  이용자가 입력한 정보는 목적 달성 후 별도의 DB에 옮겨져
                  내부 방침 및 관련 법령에 따라 일정 기간 저장된 후
                  파기됩니다.
                </p>
              </div>
              <div>
                <h3 className="font-medium text-foreground">파기 방법</h3>
                <ul className="mt-1 list-inside list-disc space-y-1">
                  <li>
                    전자적 파일 형태: 기록을 재생할 수 없도록 기술적 방법을
                    사용하여 완전 삭제
                  </li>
                  <li>
                    종이 문서: 분쇄기로 분쇄하거나 소각하여 파기
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* 6. 이용자 권리 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              6. 이용자 및 법정대리인의 권리와 행사 방법
            </h2>
            <ul className="mt-3 list-inside list-disc space-y-2">
              <li>
                이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수
                있습니다.
              </li>
              <li>
                이용자는 개인정보의 처리 정지, 삭제를 요구할 수 있습니다.
              </li>
              <li>
                이용자는 회원 탈퇴를 통해 개인정보 수집 및 이용 동의를
                철회할 수 있습니다.
              </li>
              <li>
                위 권리 행사는 플랫폼 설정 메뉴 또는 이메일
                (privacy@blinddeal.com)을 통해 가능하며, 회사는 요청 접수
                후 10일 이내에 처리합니다.
              </li>
            </ul>
          </section>

          {/* 7. 개인정보 보호책임자 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              7. 개인정보 보호책임자
            </h2>
            <p className="mt-3">
              회사는 개인정보 처리에 관한 업무를 총괄하고, 이용자의 불만
              처리 및 피해 구제를 위해 아래와 같이 개인정보 보호책임자를
              지정하고 있습니다.
            </p>
            <div className="mt-4 rounded-lg border border-border/50 bg-card/50 p-4 space-y-1">
              <p>
                <span className="font-medium text-foreground">
                  개인정보 보호책임자:
                </span>{" "}
                강기륜
              </p>
              <p>
                <span className="font-medium text-foreground">직위:</span>{" "}
                대표이사
              </p>
              <p>
                <span className="font-medium text-foreground">
                  이메일:
                </span>{" "}
                privacy@blinddeal.com
              </p>
              <p>
                <span className="font-medium text-foreground">전화:</span>{" "}
                02-0000-0000
              </p>
            </div>
            <p className="mt-4">
              기타 개인정보 침해에 대한 신고나 상담이 필요하신 경우 아래
              기관에 문의하시기 바랍니다.
            </p>
            <ul className="mt-2 list-inside list-disc space-y-1">
              <li>
                개인정보침해신고센터 (privacy.kisa.or.kr / 국번없이 118)
              </li>
              <li>
                대검찰청 사이버수사과 (www.spo.go.kr / 국번없이 1301)
              </li>
              <li>
                경찰청 사이버안전국 (cyberbureau.police.go.kr / 국번없이
                182)
              </li>
            </ul>
          </section>

          <div className="border-t border-border/30 pt-8">
            <p className="text-xs text-muted-foreground">
              본 개인정보처리방침은 2026년 3월 1일부터 적용됩니다.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
