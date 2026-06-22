#!/usr/bin/env python3
"""교육 워크북 HTML → A4 PDF 빌드 (WeasyPrint).

사용법:
    python3 build.py <입력.html> [출력.pdf]
- template.css 의 @font-face 가 assets/fonts/ 를 상대경로로 참조합니다.
- base_url 은 입력 HTML이 있는 폴더로 잡으므로, HTML과 같은 위치에
  style.css(=template.css 복사본)와 assets/ 폴더를 두세요.
"""
import sys, os
from weasyprint import HTML

def main():
    if len(sys.argv) < 2:
        print("usage: python3 build.py <input.html> [output.pdf]"); sys.exit(1)
    src = sys.argv[1]
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.splitext(src)[0] + ".pdf"
    base = os.path.dirname(os.path.abspath(src)) or "."
    HTML(filename=src, base_url=base).write_pdf(out)
    print(f"✅ PDF 생성 완료: {out} ({os.path.getsize(out)/1024:.0f} KB)")

if __name__ == "__main__":
    main()
