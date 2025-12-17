// Gemini API 서비스
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

interface ReportData {
  title: string;
  members: string;
  situation: string;
  definition: string;
  cause: string;
  solution: string;
  prevention: string;
  schedule: string;
}

interface AnalyzedReport {
  // 요약
  summary: string;

  // 현황 분석 (파이차트용)
  situationChart: {
    labels: string[];
    values: number[];
  };

  // 문제점 목록
  problems: string[];

  // 원인 분석 (5 Whys 구조화)
  rootCauses: {
    why1: string;
    why2: string;
    why3: string;
    why4: string;
    why5: string;
  };

  // 해결방안 우선순위 (바차트용)
  solutionPriority: {
    items: string[];
    urgency: number[];
    impact: number[];
  };

  // 일정 (간트차트용)
  timeline: {
    task: string;
    start: string;
    end: string;
  }[];

  // 기대효과
  expectedResults: string[];
}

export async function analyzeReportWithGemini(data: ReportData): Promise<AnalyzedReport> {
  const prompt = `
당신은 기업 보고서 분석 전문가입니다. 다음 화재사고 분석 보고서 내용을 바탕으로 인포그래픽 보고서에 들어갈 데이터를 JSON 형식으로 생성해주세요.

## 입력된 보고서 내용:
- 제목: ${data.title}
- 팀원: ${data.members}
- 현상 파악: ${data.situation}
- 문제 정의: ${data.definition}
- 원인 분석: ${data.cause}
- 해결 방안: ${data.solution}
- 재발 방지: ${data.prevention}
- 일정 계획: ${data.schedule}

## 출력 형식 (반드시 이 JSON 구조를 따라주세요):
{
  "summary": "전체 보고서 내용을 2-3문장으로 요약",
  "situationChart": {
    "labels": ["항목1", "항목2", "항목3", "항목4"],
    "values": [30, 25, 25, 20]
  },
  "problems": ["문제점1", "문제점2", "문제점3"],
  "rootCauses": {
    "why1": "첫 번째 Why 질문과 답변",
    "why2": "두 번째 Why 질문과 답변",
    "why3": "세 번째 Why 질문과 답변",
    "why4": "네 번째 Why 질문과 답변",
    "why5": "다섯 번째 Why - 근본 원인"
  },
  "solutionPriority": {
    "items": ["해결방안1", "해결방안2", "해결방안3"],
    "urgency": [90, 70, 50],
    "impact": [85, 80, 60]
  },
  "timeline": [
    {"task": "즉시 조치", "start": "1일차", "end": "3일차"},
    {"task": "단기 대책", "start": "1주차", "end": "2주차"},
    {"task": "중장기 대책", "start": "1개월", "end": "3개월"}
  ],
  "expectedResults": ["기대효과1", "기대효과2", "기대효과3"]
}

입력 내용이 비어있거나 부족한 경우, 화재사고 시나리오에 맞는 합리적인 예시 데이터를 생성해주세요.
반드시 유효한 JSON만 출력하세요. 다른 설명은 넣지 마세요.
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 2048,
          },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`API 요청 실패: ${response.status}`);
    }

    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // JSON 파싱 (마크다운 코드 블록 제거)
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('JSON 응답을 찾을 수 없습니다');
    }

    const parsed = JSON.parse(jsonMatch[0]) as AnalyzedReport;
    return parsed;

  } catch (error) {
    console.error('Gemini API 오류:', error);
    // 기본 데이터 반환
    return getDefaultAnalysis(data);
  }
}

function getDefaultAnalysis(data: ReportData): AnalyzedReport {
  return {
    summary: data.situation || '제3공장에서 화재가 발생하여 인명 피해와 설비 손상이 발생했습니다. 근본 원인 분석을 통해 재발 방지 대책을 수립했습니다.',
    situationChart: {
      labels: ['설비 노후화', '안전교육 부족', '점검 미흡', '기타'],
      values: [35, 25, 25, 15]
    },
    problems: [
      data.definition?.split('\n')[0] || '전력 과부하로 인한 화재 발생',
      '소화기 미작동',
      '안전 매뉴얼 부재'
    ],
    rootCauses: {
      why1: data.cause?.split('\n')[0] || '왜 화재가 발생했는가? → 전력 과부하',
      why2: '왜 과부하가 발생했는가? → 설비 노후화',
      why3: '왜 설비가 노후화되었는가? → 정기 점검 미실시',
      why4: '왜 점검을 하지 않았는가? → 점검 일정 관리 부재',
      why5: '왜 관리가 안 되었는가? → 안전관리 시스템 미구축'
    },
    solutionPriority: {
      items: ['소화설비 교체', '안전교육 실시', '설비 증설'],
      urgency: [95, 80, 60],
      impact: [90, 85, 70]
    },
    timeline: [
      { task: '소화기 교체', start: '즉시', end: '3일' },
      { task: '안전 교육', start: '1주차', end: '2주차' },
      { task: '설비 증설', start: '1개월', end: '3개월' }
    ],
    expectedResults: [
      '화재 재발 방지율 95%',
      '안전사고 감소 80%',
      '설비 가동률 향상 20%'
    ]
  };
}

export type { ReportData, AnalyzedReport };
