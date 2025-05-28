export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return new Response(JSON.stringify({ explanation: '', quiz: [] }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    // First call to get the explanation
    const explanationResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Provide a clear, concise explanation of: ${query}. Keep it educational and under 200 words, suitable for someone learning about this topic for the first time.`,
              },
            ],
          },
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 300,
        },
      }),
    });

    const explanationData = await explanationResponse.json();
    console.log(
      'Gemini API explanation response:',
      JSON.stringify(explanationData, null, 2)
    );

    const explanation =
      explanationData.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No explanation available.';

    // Second call to generate the quiz
    let quiz = [];
    if (explanation !== 'No explanation available.') {
      const quizPrompt = `Based on the following explanation, create a single multiple-choice quiz question with 4 options and indicate the correct option's index. The response should be a JSON object with the following structure:
      {
        "question": "Your question here",
        "options": [
          "Option 1",
          "Option 2",
          "Option 3",
          "Option 4"
        ],
        "correctIndex": 0 // 0-indexed
      }

      Explanation:
      ${explanation}
      `;

      const quizResponse = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: quizPrompt,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 200,
          },
        }),
      });

      const quizData = await quizResponse.json();
      console.log(
        'Gemini API quiz response:',
        JSON.stringify(quizData, null, 2)
      );

      try {
        const quizText = quizData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (quizText) {
          const jsonMatch = quizText.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            quiz.push(JSON.parse(jsonMatch[1]));
            console.log('---------');
            console.log(quiz);
            console.log('---------');
          } else {
            if (quizText.trim().startsWith('{')) {
              quiz.push(JSON.parse(quizText));
            } else {
              console.warn(
                'Quiz text is not a direct JSON object and no markdown block found:',
                quizText
              );
            }
          }
        }
      } catch (parseError) {
        console.error('Error parsing quiz JSON:', parseError);
      }
    }

    return new Response(JSON.stringify({ explanation, quiz }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Gemini API error:', error);

    return new Response(
      JSON.stringify({ explanation: 'Error fetching data.', quiz: [] }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
