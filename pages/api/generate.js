export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: "Method not allowed" });

  const { topic } = req.body;  // No JSON.parse needed

  if (!topic) return res.status(400).json({ error: "Topic is required" });

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: `Generate 5 concise, actionable tasks to learn about ${topic}. Return only the tasks, no numbering or formatting.` }] }],
        }),
      }
    );

    const data = await response.json();
    const output = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    const tasks = output.split('\n').filter(Boolean);

    res.status(200).json({ tasks });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
}
