# 보고 스킬 실습 워크북 (교안)

신입사원을 위한 보고 스킬 교육 교안. 강의 + 실습 + 자가진단 + 정답 예시로 구성된
실습 중심 A4 워크북(22페이지)입니다.

## 파일
- `교안.html` — 워크북 본문(콘텐츠)
- `style.css` — 디자인 시스템 (`.claude/skills/edu-workbook-pdf` 의 template.css와 동일)
- `assets/fonts/` — NanumGothic 3종 (OFL 1.1)
- `build.py` — HTML → PDF 빌드 스크립트
- `보고스킬_실습_워크북.pdf` — 완성 산출물

## 빌드
```bash
pip3 install weasyprint        # 최초 1회 (pango/cairo 필요)
python3 build.py               # 교안.html → 보고스킬_실습_워크북.pdf
```

## 디자인 재사용
이 디자인은 `.claude/skills/edu-workbook-pdf` 스킬로 패키징되어 있습니다.
다른 주제의 교안/워크북도 같은 비주얼로 만들 수 있습니다.

## 구성
1. 표지 · 사용법 · 학습목표
2. 모듈1 상사의 말 번역하기 — 질문의 기술
3. 모듈2 구두 보고 & 과제 프레이밍
4. 모듈3 이메일 보고 & 보고서 보고
5. 모듈4 보고의 자세 — 메신저 vs 플레이어
6. 모듈5 상사 유형 파악 & 맞춤 소통
7. 종합 실습 · 자가진단 · 강사 가이드
