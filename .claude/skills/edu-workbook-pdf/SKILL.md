---
name: edu-workbook-pdf
description: 한국어 교육 교안·워크북을 인쇄용 A4 PDF로 디자인해 생성한다. 신입사원 교육, 사내 강의, 실습 워크북, 핸드아웃처럼 "교안/워크북/교재를 (예쁜) PDF로 만들어줘"라는 요청에 사용. HTML+CSS 디자인 시스템(표지·디바이더·실습 카드·Before/After·대화·체크리스트·정답박스 등)과 NanumGothic 한글 폰트를 WeasyPrint로 렌더링한다.
---

# 교육 워크북 PDF 디자인 시스템

읽고 끝나는 교재가 아니라 **손으로 쓰고 입으로 말하며 익히는 실습형 워크북**을, 일관된 비주얼로
A4 인쇄용 PDF로 만든다. 텍스트 원고만 있으면 이 디자인 시스템에 얹어 완성한다.

## 산출물 파이프라인

```
content.html  +  style.css(=template.css 복사본)  +  assets/fonts/*.ttf
        └──────────────── build.py (WeasyPrint) ───────────────→  output.pdf
```

1. 작업 폴더에 `template.css`를 **`style.css`** 라는 이름으로 복사하고, `assets/fonts/`(이 스킬의 폰트 3종)도 복사한다.
2. 원고를 아래 컴포넌트 마크업으로 작성해 `content.html`로 저장한다(`<link rel="stylesheet" href="style.css">`).
3. `python3 build.py content.html 결과.pdf` 로 빌드한다.
4. 검수: PyMuPDF(`fitz`)로 일부 페이지를 PNG로 렌더해 눈으로 확인한다(아래 검수 스니펫).

### 환경 준비(최초 1회)
```bash
pip3 install weasyprint pymupdf            # 시스템에 pango/cairo 필요(대개 기존 설치됨)
# 폰트는 이 스킬의 assets/fonts/ 에 NanumGothic 3종(Regular/Bold/ExtraBold)이 포함됨
```
WeasyPrint 69+ 기준. 시스템에 libpango/libcairo/libharfbuzz 가 있어야 한다(`ldconfig -p | grep pango`).

### 검수 스니펫
```python
import fitz
d = fitz.open("결과.pdf"); print("pages", d.page_count)
for i in [0,1,4]:
    d[i].get_pixmap(dpi=96).save(f"/tmp/page{i+1}.png")
```

## 디자인 원칙(이 시스템의 "분석된 디자인")

- **A4 세로 / 여백 20·17·18·17mm.** 하단 중앙에 워크북 제목, 우측에 페이지 번호(파란 굵게).
- **폰트:** NanumGothic 한 패밀리, 굵기 3단(400/700/800)으로 위계만으로 정돈된 인상.
- **컬러 토큰**(`:root` 변수): 진한 네이비 잉크(`--ink`), 메인 블루(`--primary`), 강조 코랄(`--accent`,
  주의·Before), 성공 틸(`--teal`, After·정답), 앰버(`--amber`, 팁). 의미가 색에 1:1로 매핑된다.
- **모듈 = 디바이더(큰 번호+목표) → 모듈 본문(핵심개념 → 실습 카드 → 정답박스 → 요약리본)** 의 반복 리듬.
- **실습 우선:** 이론은 파란 박스로 2분 분량, 나머지는 직접 쓰는 칸/Before·After/역할극/체크리스트.
- **이모지 금지(중요):** 한글 폰트에 컬러 이모지가 없어 빈 네모(tofu)로 깨진다. 아이콘은 색·테두리·
  텍스트 배지로 표현하고, 기호는 NanumGothic이 가진 `✓ ✕ ① ②` 정도만 사용한다.
- **`break-inside: avoid`** 가 카드·박스·표에 걸려 있어 페이지 경계에서 컴포넌트가 잘리지 않는다.
  새 장 시작은 `.module`(자동 `break-before:page`)과 `.divider`로 제어한다.

## 컴포넌트 마크업 치트시트

`template.css`가 정의하는 클래스. 원고를 이 패턴에 끼워 넣으면 된다.

```html
<!-- 표지 -->
<section class="cover">
  <div class="kicker">KICKER</div>
  <h1>제목<br>두 줄</h1><div class="rule"></div>
  <div class="sub">부제</div>
  <div class="meta">
    <div class="chips"><span class="chip">대상·…</span><span class="chip">소요·…</span></div>
    <div class="foot">하단 설명</div>
  </div>
</section>

<!-- 섹션 디바이더(장 표지) -->
<section class="divider">
  <div class="dnum">01</div><div class="dlabel">MODULE 01</div>
  <h2>모듈 제목</h2><div class="ddesc">한 문단 소개</div>
  <div class="dgoals"><div class="g">학습목표1</div><div class="g">학습목표2</div></div>
</section>

<!-- 모듈 본문 시작(자동 페이지 분리) -->
<section class="module">
  <div class="mhead">
    <div class="badge">1</div>
    <div class="mt"><div class="mlabel">MODULE 01</div><h2>제목</h2>
      <div class="mgoal">한 줄 목표</div></div>
  </div>

  <!-- 핵심개념(파랑=primary, 초록=teal로 변형: style="background:var(--teal-sf);border-color:var(--teal)") -->
  <div class="concept"><div class="ctag">핵심개념 · 부제</div><p>…</p></div>

  <!-- 실습 카드 -->
  <div class="ex">
    <div class="exhead"><span class="extag">실습 1-1</span>
      <span class="extitle">제목</span><span class="exmeta">개인 · 5분</span></div>
    <div class="exbody">
      <div class="goal"><b>목표.</b> …</div>
      <div class="write"><div class="label">작성 라벨</div><div class="wl"></div><div class="wl"></div></div>
      <div class="box-answer"></div>            <!-- 자유 작성 박스 -->
    </div>
  </div>

  <!-- Before / After (빨강→초록) -->
  <div class="ba">
    <div class="col before"><div class="btag">BEFORE</div><p>나쁜 예</p></div>
    <div class="col after"><div class="btag">AFTER — 직접 작성</div><div class="box-answer"></div></div>
  </div>

  <!-- 대화/역할극(상사=기본, 신입=.junior) -->
  <div class="dlg">
    <div class="line"><div class="who">박 차장</div><div class="say">대사 <span class="inner">속마음</span></div></div>
    <div class="line junior"><div class="who">정 사원</div><div class="say">대사</div></div>
  </div>

  <!-- 팁/주의 콜아웃 -->
  <div class="callout tip"><p><span class="ct">팁.</span> …</p></div>
  <div class="callout warn"><p><span class="ct">주의.</span> …</p></div>

  <!-- 체크리스트 / 2x2 매트릭스 / 표 -->
  <div class="checklist"><div class="ci">항목</div></div>
  <table class="matrix"><tr><td class="q1">…</td><td class="q2">…</td></tr>
     <tr><td class="q3">…</td><td class="q4">…</td></tr></table>
  <table class="tb"><tr><th>머리</th></tr><tr><td>칸</td></tr></table>

  <!-- 정답·예시 박스 / 요약 리본 -->
  <div class="answer-key"><div class="akt">정답·예시</div><p>…</p></div>
  <div class="summary"><div class="st">정리</div><ul><li>…</li></ul></div>
</section>
```

유틸: `.hl`(형광펜 하이라이트), `.muted`/`.note`(보조 텍스트), `<b>`/`<strong>`(강조), `.write.lg`(넓은 작성칸).

## 새 워크북을 만들 때 작업 순서

1. 원고(텍스트)를 **모듈 단위**로 쪼갠다. 모듈마다: 디바이더 → 핵심개념(1~2개) → 실습 2~3개 → 정답박스 → 요약.
2. 실습은 가능한 한 **직접 쓰게** 만든다(빈칸/Before·After/역할극/체크리스트). 강의식 나열을 피한다.
3. 표지·사용법·종합실습·자가진단·강사가이드(시간 배분)를 앞뒤에 배치하면 완성도가 높다.
4. 색은 의미대로만: 주의/Before=코랄, 정답/After/성공=틸, 팁=앰버, 일반강조=블루.
5. 빌드 후 반드시 PNG 검수로 **줄바꿈·페이지 넘침·tofu(이모지)** 를 확인한다.

## 참고 / 라이선스
- 폰트: **NanumGothic** (SIL Open Font License 1.1) — 재배포·임베딩 허용.
- 완성 예시: 이 스킬로 만든 `보고스킬-교안/`(신입사원 보고 스킬 실습 워크북, 22p)을 레퍼런스로 참고.
