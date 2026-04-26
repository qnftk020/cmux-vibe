# STATUS.md — 에이전트 간 상태 공유

## Frontend
- [ ] 현재 작업: (업데이트)
- [ ] 완료된 작업: (업데이트)
- [ ] 블로커: (있으면 기록)

## Backend
- [ ] 현재 작업: (업데이트)
- [ ] 완료된 작업: (업데이트)
- [ ] 블로커: (있으면 기록)

## Research
- [x] Phase 1: Corpus Collection 완료 (630+ injections, 50k normal sentences)
- [x] Phase 2: PMI Learning 완료 (src/pmi/learn.py -> data/signatures.json)
- [x] Task 1: PMI 시그니처 품질 개선 (주제어 노이즈 제거, 명령어 패턴 강화)
- [x] Task 2: 한국어 우회 패턴 조사 (RESEARCH_NOTES.md에 반영)
- [x] Task 3: Judge Prompt 다변화 (data/judge_prompts.json 생성)
- [x] 발견 사항: "instructions+previous"가 최상위 시그니처로 부상. 한국어 경어체 우회(Evasion)를 위한 정규식 패턴 도출.

## Package 요청
> Frontend/Backend가 패키지 추가가 필요하면 여기에 기록. Lead만 package.json 수정.

(없음)
