export interface DifyMessage {
  role: 'user' | 'assistant';
  content: string;
}

// 01 
interface DifyRequestBodyW {
  inputs: {
    query: string;
  };
  response_mode: 'streaming';
  user: string;
}

export async function* fetchDifyStreamResultW(messages: DifyMessage[]): AsyncGenerator<{ word: string, thinking: boolean }> {
  const baseUrl = process.env.NEXT_PUBLIC_DIFY_URL;
  if (!baseUrl) {
    throw new Error('DIFY_URL未在环境变量中定义');
  }
  const apiUrl = baseUrl + '/completion-messages';
  const lastMessage = messages[messages.length - 1].content;

  const requestBody: DifyRequestBodyW = {
    inputs: {
      query: lastMessage
    },
    response_mode: 'streaming',
    user: 'abc-123'
  };

  const token = process.env.NEXT_PUBLIC_DIFY_TOKEN_01;
  if (!token) {
    throw new Error('DIFY_TOKEN未在环境变量中定义');
  }

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody)
  };

  try {
    const response = await fetch(apiUrl, options);

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP错误 ${response.status}: ${errorBody}`);
    }

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;

      const chunks = decoder.decode(value).split('\n\n');
      for (const chunk of chunks) {
        const data = chunk.replace('data: ', '');
        if (data === '[DONE]') break;

        try {
          if (data === '') continue;
          const json = JSON.parse(data);
          if (json.answer == '' || json.answer == undefined) continue;
          yield {
            word: json.answer,
            thinking: false
          };
        } catch (e) {
          console.error('解析错误:', e);
        }
      }
    }
  } catch (err) {
    console.error('请求异常:', err);
    throw err;
  }
}

// 02 
interface DifyRequestBodyAgent {
  inputs: object;
  query: string;
  response_mode: 'streaming';
  conversation_id: string;
  user: string;
}

export async function* fetchDifyStreamResultAgent(messages: DifyMessage[] , conversation_id: string): AsyncGenerator<{ word: string, thinking: boolean }> {
  const baseUrl = process.env.NEXT_PUBLIC_DIFY_URL;
  if (!baseUrl) {
    throw new Error('DIFY_URL未在环境变量中定义');
  }

  const lastMessage = messages[messages.length - 1].content;
  const requestBody: DifyRequestBodyAgent = {
    inputs: {},
    query: lastMessage,
    response_mode: 'streaming',
    conversation_id: conversation_id,
    user: 'abc-123'
  };
  const token = process.env.NEXT_PUBLIC_DIFY_TOKEN_02;
  if (!token) {
    throw new Error('DIFY_TOKEN未在环境变量中定义');
  }
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(requestBody),
  }
  try {
    const response = await fetch(baseUrl + '/chat-messages', options);
    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`HTTP错误 ${response.status}: ${errorBody}`);
    }
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    while (true) {
      const { done, value } = await reader!.read();
      if (done) break;
      const chunks = decoder.decode(value).split('\n\n');
      for (const chunk of chunks) {
        const data = chunk.replace('data: ', '');
        if (data === '[DONE]') break;
        try {
          if (data === '') continue;
          const json = JSON.parse(data);
          if (json.answer == '' || json.answer == undefined) continue;
          yield {
            word: json.answer,
            thinking: false
          };
        }
        catch (e) {
          console.error('解析错误:', e);
        }
      }
    }
  }
  catch (err) {
    console.error('请求异常:', err);
    throw err;
  }
}

// workflow api
