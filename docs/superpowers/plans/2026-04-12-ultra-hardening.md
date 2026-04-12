# BlindDeal 울트라 강화 계획

> 울트라평가 1차/2차 결과 기반. 모든 항목 수행, 생략 불가.

## Phase 1: 컴포넌트 에러 핸들링 정합성 (9곳)

throw→return 전환 후 컴포넌트 호출부가 미대응인 9곳 수정.

| # | 파일 | 함수 | 수정 내용 |
|---|------|------|----------|
| 1 | comment-section.tsx | createComment | try-catch → result.success 체크 |
| 2 | post-like-button.tsx | togglePostLike | return 무시 → result.success 체크 |
| 3 | checklist-item.tsx | updateChecklistItem | catch rollback → result.success rollback |
| 4 | visibility-control.tsx | updateDealVisibility | 빈 catch → result.success 체크 + toast |
| 5 | escrow-panel.tsx | updateEscrowStatus | catch → result.success 체크 |
| 6 | notification-list.tsx | markNotificationRead/All | return 무시 → result.success 체크 |
| 7 | loi-card.tsx | respondToLOI | 빈 catch → result.success 체크 |
| 8 | loi-form.tsx | createLOI | catch → result.success 체크 |
| 9 | matches/page.tsx | saveMatchPreferences | return 무시 → result.success 체크 |

## Phase 2: 딜 라이프사이클 무결성 (4건)

| # | 문제 | 수정 |
|---|------|------|
| 1 | 완료된 딜에 새 문의 가능 | deals.ts getDeals에서 closed/cancelled 딜 제외 또는 UI에서 문의 버튼 숨기기 |
| 2 | 딜 상태-룸 상태 비동기화 | rooms.ts updateRoomStatus에서 completed 시 deals.status도 closed로 업데이트 |
| 3 | 셀러가 자기 딜에 관심등록 | deal-mutations.ts toggleDealInterest에서 owner_id === user.id 차단 |
| 4 | 상태 변경 시 알림 미발송 | rooms.ts updateRoomStatus에서 notifications INSERT 추가 |

## Phase 3: 빌드 검증 + 커밋

- 빌드 (lint 포함) 통과 확인
- 단일 커밋으로 push
