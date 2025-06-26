export default async function handler(request, response) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  const { input_value, output_type, input_type } = request.body;
  const apiToken = process.env.VITE_ASTRA_DB_APPLICATION_TOKEN;
  const apiUrl = 'https://9363e1f2-6063-4866-88a4-fd87f601a4c4.astra.datastax.com/api/v1/run/74f55130-bb9c-47b5-b3d7-af3ca14158cc';

  if (!apiToken) {
    return response.status(500).json({ message: 'API token is not configured.' });
  }

  try {
    const apiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiToken}`,
      },
      body: JSON.stringify({ input_value, output_type, input_type }),
    });

    if (!apiResponse.ok) {
      const errorBody = await apiResponse.text();
      console.error('API Error:', errorBody);
      return response.status(apiResponse.status).json({ message: `External API Error: ${errorBody}` });
    }

    const data = await apiResponse.json();
    return response.status(200).json(data);

  } catch (error) {
    console.error('Internal Server Error:', error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}
