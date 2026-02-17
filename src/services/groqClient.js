const MODEL = 'llama-3.3-70b-versatile';

export async function groqChat(messages, { temperature = 0.7, max_tokens = 1024 } = {}) {
  const formattedMessages = Array.isArray(messages)
    ? messages
    : [{ role: 'user', content: messages }];

  const res = await fetch('/api/groq/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: MODEL,
      temperature,
      max_tokens,
      messages: formattedMessages,
    }),
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Groq API error (${res.status}): ${text}`);
  }

  const json = await res.json();
  const content = json.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error('Empty response from AI');
  }

  return content;
}
