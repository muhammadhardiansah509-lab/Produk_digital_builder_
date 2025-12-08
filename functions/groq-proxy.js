exports.handler = async (event) => {
  try {
    if (event.httpMethod !== 'POST') {
      return {
        statusCode: 405,
        body: 'Method Not Allowed'
      };
    }

    const body = JSON.parse(event.body || '{}');
    const { prompt } = body;

    const GROQ_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_KEY) {
      return {
        statusCode: 500,
        body: 'GROQ_API_KEY belum diisi di Netlify'
      };
    }

    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${GROQ_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-70b-8192',
        messages: [
          { role: 'user', content: prompt }
        ],
        max_tokens: 800,
        temperature: 0.7
      })
    });

    const data = await res.json();

    return {
      statusCode: 200,
      body: JSON.stringify({
        result: data.choices?.[0]?.message?.content || 'Tidak ada hasil'
      })
    };

  } catch (error) {
    return {
      statusCode: 500,
      body: error.toString()
    };
  }
};
        
