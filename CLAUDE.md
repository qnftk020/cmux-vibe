# CLAUDE.md — 멀티 에이전트 해커톤 프로젝트 규칙

@AGENTS.md

## 프로젝트
- CMUX x AIM 해커톤 (2026-04-26)
- Next.js 15 + TypeScript + Tailwind CSS + App Router

## 에이전트 역할 및 디렉토리 경계 (절대 규칙)

### Lead (이 Claude)
- 수정 가능: `TASKS.md`, `README.md`, `API_CONTRACT.md`, `STATUS.md`, `package.json`, `tsconfig.json`
- 통합 시 모든 파일 수정 가능
- 역할: PM/아키텍트/최종 통합

### Frontend 에이전트
- 수정 가능: `src/app/`, `src/components/`, `src/styles/`, `public/`
- 읽기만: `API_CONTRACT.md`, `STATUS.md`
- 역할: UI, 컴포넌트, UX 구현

### Backend 에이전트
- 수정 가능: `src/app/api/`, `src/lib/server/`, `prisma/`, `src/db/`
- 읽기만: `API_CONTRACT.md`, `STATUS.md`
- 역할: API, DB, 인증, 상태관리

### Research 에이전트 (Gemini CLI)
- 수정 가능: `RESEARCH_NOTES.md`
- 역할: 문서/API 조사, 오류 원인 탐색, 대안 검토

## 충돌 방지 규칙
- 공유 설정 파일 (`package.json`, `tsconfig.json`)은 Lead만 수정
- 패키지 추가 필요 시 STATUS.md에 요청 기록 → Lead가 통합
- merge 충돌은 Lead만 해결

## 통합 주기
- 09:00–10:30: 통합 없음 (기반 작업)
- 10:30–16:30: 30분마다 통합
- 16:30–17:00: 최종 통합
- 17:00–18:00: 코드 동결 (데모 준비만)

## 명령어
- `npm run dev` — 개발 서버
- `npm run build` — 빌드
- `npm run lint` — 린트
