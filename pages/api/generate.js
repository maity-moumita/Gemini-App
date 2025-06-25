export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { topic } = JSON.parse(req.body);
  const prompt = `Generate 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting.`;

  const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=YOUR_API_KEY`, {
    method: 'POST',
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
    }),
    headers: { 'Content-Type': 'application/json' },
  });

  const data = await geminiRes.json();
  const output = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  const tasks = output.split('\n').filter(Boolean);

  res.status(200).json({ tasks });
}
