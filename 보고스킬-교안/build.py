#!/usr/bin/env python3
"""교안 HTML → A4 PDF 빌드 (WeasyPrint).

사용법:
    python3 build.py [입력.html] [출력.pdf]
기본값: 교안.html → 보고스킬_실습_워크북.pdf
폰트는 style.css의 @font-face가 assets/fonts/ 를 상대경로로 참조합니다.
"""
import sys, os
from weasyprint import HTML

HERE = os.path.dirname(os.path.abspath(__file__))

def main():
    src = sys.argv[1] if len(sys.argv) > 1 else os.path.join(HERE, "교안.html")
    out = sys.argv[2] if len(sys.argv) > 2 else os.path.join(HERE, "보고스킬_실습_워크북.pdf")
    HTML(filename=src, base_url=HERE).write_pdf(out)
    size = os.path.getsize(out)
    print(f"✅ PDF 생성 완료: {out} ({size/1024:.0f} KB)")

if __name__ == "__main__":
    main()
