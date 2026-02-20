import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: 'API 키가 설정되지 않았습니다.' }, { status: 500 });
  }

  const { activity } = await req.json();

  if (!activity) {
    return NextResponse.json({ error: '활동 내용이 없습니다.' }, { status: 400 });
  }

  const prompt = `
      사용자가 한 일: "${activity}"
      위 내용에 대해 다음 두 가지 MBTI 인격으로 반응해줘.
      1. F-Angel (공감형 천사): 아주 감성적이고 따뜻하게 반응. 이모지 듬뿍.
      2. T-Devil (논리형 악마): 아주 냉철하고 사실 위주로 공격. 뼈 때리는 팩트 폭격.

      **가독성 가이드라인:**
      - 읽기 편하도록 적절한 위치에서 줄바꿈(\\n)을 적극적으로 사용해줘.
      - 2~3개의 짧은 단락으로 나누어 작성해줘.
      
      형식: JSON {"f": "내용", "t": "내용"} (추가 텍스트 없이 JSON만 반환해)
  `;

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: 'google/gemini-2.5-flash-lite',
      // model: 'openai/gpt-5-nano',
      messages: [{ role: 'user', content: prompt }],
    }),
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    console.error('OpenRouter error:', response.status, errorData);
    return NextResponse.json({ error: 'OpenRouter API 호출 실패', detail: errorData }, { status: response.status });
  }

  const data = await response.json();
  const raw = data.choices[0].message.content;

  // JSON 블록이 ```json ... ``` 로 감싸져 올 수 있으므로 추출
  const jsonMatch = raw.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    return NextResponse.json({ error: 'AI 응답을 파싱할 수 없습니다.' }, { status: 500 });
  }
  const content = JSON.parse(jsonMatch[0]);

  return NextResponse.json(content);
}
