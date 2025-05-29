// api/explanation/route.js
import { URL } from 'url'; // Required for URL parsing in Node.js environments

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  // Validate the presence of a search query
  if (!query) {
    return new Response(JSON.stringify({ explanation: '', quiz: [] }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
  const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

  try {
    // --- Step 1: Generate the Explanation ---
    const explanationResponse = await fetch(geminiApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: `Provide a clear, concise explanation of: ${query}. Keep it educational and under 200 words, suitable for someone learning about this topic for the first first time.`
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 300
        }
      })
    });

    const explanationData = await explanationResponse.json();
    console.log(
      'Gemini API explanation response:',
      JSON.stringify(explanationData, null, 2)
    );

    const explanation =
      explanationData.candidates?.[0]?.content?.parts?.[0]?.text ||
      'No explanation available.';

    // --- Step 2: Generate Four Quiz Questions based on the Explanation ---
    let quiz = [];
    if (explanation !== 'No explanation available.') {
      const quizPrompt = `Based on the following explanation, create four multiple-choice quiz questions. Each question should have 4 options, and you must indicate the correct option's index (0-indexed). The response must be a JSON array of objects, with each object having the following exact structure:
          [
            {
              "question": "Your first question here",
              "options": [
                "Option 1",
                "Option 2",
                "Option 3",
                "Option 4"
              ],
              "correctIndex": 0 // Example: 0 for Option 1, 1 for Option 2, etc.
            },
            {
              "question": "Your second question here",
              "options": [
                "Option A",
                "Option B",
                "Option C",
                "Option D"
              ],
              "correctIndex": 2
            },
            {
              "question": "Your third question here",
              "options": [
                "Choice X",
                "Choice Y",
                "Choice Z",
                "Choice W"
              ],
              "correctIndex": 3
            },
            {
              "question": "Your fourth question here",
              "options": [
                "Item Alpha",
                "Item Beta",
                "Item Gamma",
                "Item Delta"
              ],
              "correctIndex": 1
            }
          ]

          Explanation:
          ${explanation}
          `;

      const quizResponse = await fetch(geminiApiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: quizPrompt
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 0.7, // A slightly higher temperature for more diverse questions
            maxOutputTokens: 600 // Increased to allow for 4 questions
          }
        })
      });

      const quizData = await quizResponse.json();
      console.log(
        'Gemini API quiz response (raw):',
        JSON.stringify(quizData, null, 2)
      );

      try {
        const quizText = quizData.candidates?.[0]?.content?.parts?.[0]?.text;
        if (quizText) {
          // Attempt to extract JSON from markdown code block first
          const jsonMatch = quizText.match(/```json\n([\s\S]*?)\n```/);
          if (jsonMatch && jsonMatch[1]) {
            quiz = JSON.parse(jsonMatch[1]);
            console.log('Parsed quiz from markdown block.');
          } else if (
            quizText.trim().startsWith('[') &&
            quizText.trim().endsWith(']')
          ) {
            // If not in markdown, try to parse directly if it looks like a JSON array
            quiz = JSON.parse(quizText);
            console.log('Parsed quiz directly as JSON array.');
          } else {
            console.warn(
              'Quiz text is not a direct JSON array and no markdown block found:',
              quizText
            );
            // Optionally, set quiz to empty array if parsing failed unexpectedly
            quiz = [];
          }
        }
      } catch (parseError) {
        console.error(
          'Error parsing quiz JSON from Gemini response:',
          parseError
        );
        // Clear quiz on parsing error to prevent sending malformed data
        quiz = [];
      }
    }

    // --- Step 3: Send the Explanation and Quiz to the Frontend ---
    return new Response(JSON.stringify({ explanation, quiz }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('Gemini API request failed:', error);

    return new Response(
      JSON.stringify({ explanation: 'Error fetching data.', quiz: [] }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}
