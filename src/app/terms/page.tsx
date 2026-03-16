import { MainLayout } from "@/components/layout/main-layout";

export default function TermsPage() {
  return (
    <MainLayout>
      <div className="mx-auto max-w-3xl py-12">
        <h1 className="text-3xl font-bold tracking-tight">이용약관</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          최종 수정일: 2026년 3월 1일
        </p>

        <div className="mt-10 space-y-10 text-sm leading-relaxed text-muted-foreground">
          {/* 제1조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제1조 (목적)
            </h2>
            <p className="mt-3">
              이 약관은 주식회사 블라인드딜(이하 &ldquo;회사&rdquo;)이
              운영하는 BlindDeal 플랫폼(이하 &ldquo;플랫폼&rdquo;)에서
              제공하는 부동산 및 M&amp;A 거래 중개 서비스(이하
              &ldquo;서비스&rdquo;)의 이용과 관련하여, 회사와 이용자 간의
              권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로
              합니다.
            </p>
          </section>

          {/* 제2조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제2조 (용어의 정의)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                &ldquo;플랫폼&rdquo;이란 회사가 운영하는 웹사이트
                (blinddeal.com) 및 관련 애플리케이션을 의미합니다.
              </li>
              <li>
                &ldquo;회원&rdquo;이란 본 약관에 동의하고 회원가입을 완료한
                자를 의미합니다.
              </li>
              <li>
                &ldquo;딜&rdquo;이란 플랫폼에 등록된 부동산 또는 M&amp;A
                거래 건을 의미합니다.
              </li>
              <li>
                &ldquo;에스크로&rdquo;란 거래 안전을 위해 회사가 제공하는
                제3자 예치 결제 서비스를 의미합니다.
              </li>
              <li>
                &ldquo;NDA&rdquo;란 딜의 상세 정보 열람 시 체결하는
                비밀유지계약을 의미합니다.
              </li>
              <li>
                &ldquo;전문가&rdquo;란 플랫폼에서 인증을 받고 자문 서비스를
                제공하는 공인중개사, 변호사, 세무사, 회계사 등을 의미합니다.
              </li>
            </ol>
          </section>

          {/* 제3조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제3조 (약관의 효력 및 변경)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                본 약관은 플랫폼에 게시하거나 기타의 방법으로 회원에게
                공지함으로써 효력이 발생합니다.
              </li>
              <li>
                회사는 관련 법령을 위배하지 않는 범위에서 본 약관을 변경할 수
                있으며, 변경 시 적용일자 7일 전부터 공지합니다.
              </li>
              <li>
                회원은 변경된 약관에 동의하지 않을 경우 회원 탈퇴를 할 수
                있으며, 변경된 약관의 효력 발생일 이후에도 서비스를 계속
                이용할 경우 약관 변경에 동의한 것으로 간주합니다.
              </li>
            </ol>
          </section>

          {/* 제4조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제4조 (서비스의 제공)
            </h2>
            <p className="mt-3">
              회사는 다음과 같은 서비스를 제공합니다.
            </p>
            <ol className="mt-2 list-inside list-decimal space-y-2">
              <li>부동산 및 M&amp;A 딜 정보 등록 및 검색 서비스</li>
              <li>비공개 딜 매칭 및 NDA 체결 서비스</li>
              <li>에스크로 결제 서비스</li>
              <li>전문가 자문 연결 서비스</li>
              <li>시장 인사이트 및 데이터 분석 서비스</li>
              <li>커뮤니티 및 네트워킹 서비스</li>
              <li>기타 회사가 정하는 서비스</li>
            </ol>
          </section>

          {/* 제5조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제5조 (회원가입)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                이용자는 회사가 정한 양식에 따라 필요한 정보를 기입하고, 본
                약관과 개인정보처리방침에 동의한 후 회원가입을 신청합니다.
              </li>
              <li>
                회사는 다음 각 호에 해당하는 경우 회원가입을 거부할 수
                있습니다.
                <ul className="ml-5 mt-1 list-disc space-y-1">
                  <li>타인의 정보를 이용하여 신청한 경우</li>
                  <li>필수 정보를 허위로 기재한 경우</li>
                  <li>
                    이전에 회원 자격을 상실한 적이 있는 경우 (단, 회사의
                    재가입 승인을 받은 경우 예외)
                  </li>
                  <li>기타 회원으로 등록하는 것이 부적절하다고 판단되는 경우</li>
                </ul>
              </li>
              <li>
                회원가입 시점은 회사의 승낙이 회원에게 도달한 시점으로
                합니다.
              </li>
            </ol>
          </section>

          {/* 제6조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제6조 (회원의 의무)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                회원은 관계법령, 본 약관의 규정, 이용안내 및 서비스와
                관련하여 공지한 주의사항을 준수하여야 합니다.
              </li>
              <li>
                회원은 자신의 계정 정보를 안전하게 관리할 책임이 있으며,
                타인에게 자신의 계정을 이용하게 해서는 안 됩니다.
              </li>
              <li>
                회원은 플랫폼에 허위 딜 정보를 등록하거나, 거래 상대방을
                기만하는 행위를 해서는 안 됩니다.
              </li>
              <li>
                회원은 NDA를 통해 열람한 비공개 정보를 제3자에게 유출해서는
                안 됩니다.
              </li>
            </ol>
          </section>

          {/* 제7조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제7조 (딜 등록 및 관리)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                회원은 플랫폼을 통해 부동산 또는 M&amp;A 딜을 등록할 수
                있으며, 등록 시 정확하고 충분한 정보를 제공해야 합니다.
              </li>
              <li>
                회사는 다음에 해당하는 딜 등록을 거부하거나 삭제할 수
                있습니다.
                <ul className="ml-5 mt-1 list-disc space-y-1">
                  <li>허위 또는 과장된 정보를 포함한 경우</li>
                  <li>관련 법령에 위반되는 경우</li>
                  <li>타인의 권리를 침해하는 경우</li>
                  <li>기타 플랫폼의 운영 정책에 위배되는 경우</li>
                </ul>
              </li>
              <li>
                딜 등록자는 거래 상황의 변동 시 즉시 딜 정보를 수정하거나
                삭제할 의무가 있습니다.
              </li>
            </ol>
          </section>

          {/* 제8조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제8조 (비공개 딜 및 NDA)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                딜 등록자는 딜의 전부 또는 일부를 비공개로 설정할 수
                있습니다.
              </li>
              <li>
                비공개 딜의 상세 정보를 열람하고자 하는 회원은 플랫폼이
                제공하는 전자 NDA에 서명해야 합니다.
              </li>
              <li>
                NDA 위반 시 위반 회원은 민사상 손해배상 책임을 부담하며,
                플랫폼 이용이 제한될 수 있습니다.
              </li>
            </ol>
          </section>

          {/* 제9조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제9조 (에스크로 결제)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                거래 당사자는 안전한 거래를 위해 플랫폼의 에스크로 결제
                서비스를 이용할 수 있습니다.
              </li>
              <li>
                에스크로 서비스 이용 시 매수자가 결제한 금액은 회사가 지정한
                에스크로 계좌에 예치되며, 거래 완료 조건 충족 시 매도자에게
                지급됩니다.
              </li>
              <li>
                거래 취소 시 에스크로 금액은 회사의 환불 정책에 따라
                처리됩니다.
              </li>
              <li>
                에스크로 서비스에 대해 별도의 수수료가 부과될 수 있으며,
                수수료율은 플랫폼에 사전 공지됩니다.
              </li>
            </ol>
          </section>

          {/* 제10조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제10조 (수수료)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                회사는 서비스 이용에 대해 수수료를 부과할 수 있으며,
                수수료율 및 부과 기준은 플랫폼에 별도로 공지합니다.
              </li>
              <li>
                수수료 변경 시 회사는 변경 적용일 30일 전에 회원에게
                공지합니다.
              </li>
              <li>
                회원이 수수료 변경에 동의하지 않을 경우 서비스 이용을 중단할
                수 있습니다.
              </li>
            </ol>
          </section>

          {/* 제11조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제11조 (면책)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                회사는 회원 간 또는 회원과 제3자 간에 서비스를 매개로 발생한
                분쟁에 대해 개입할 의무가 없으며, 이로 인한 손해를 배상할
                책임이 없습니다.
              </li>
              <li>
                회사는 천재지변, 전쟁, 기간통신사업자의 서비스 중지 등
                불가항력으로 인해 서비스를 제공할 수 없는 경우 면책됩니다.
              </li>
              <li>
                회사는 회원이 등록한 딜 정보의 정확성, 진실성에 대해 보증하지
                않습니다.
              </li>
            </ol>
          </section>

          {/* 제12조 */}
          <section>
            <h2 className="text-lg font-semibold text-foreground">
              제12조 (분쟁해결)
            </h2>
            <ol className="mt-3 list-inside list-decimal space-y-2">
              <li>
                본 약관과 관련한 분쟁은 대한민국 법령을 적용하며,
                관할법원은 회사의 본사 소재지를 관할하는 법원으로 합니다.
              </li>
              <li>
                회사와 회원 간의 분쟁 발생 시 양 당사자는 우선적으로 상호
                협의를 통해 해결하도록 노력합니다.
              </li>
              <li>
                협의가 이루어지지 않을 경우, 관련 법령에 따라 설치된
                분쟁조정기구에 조정을 신청할 수 있습니다.
              </li>
            </ol>
          </section>

          <div className="border-t border-border/30 pt-8">
            <p className="text-xs text-muted-foreground">
              부칙: 본 약관은 2026년 3월 1일부터 시행합니다.
            </p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
