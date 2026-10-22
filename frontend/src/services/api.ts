// Centralized API client with JWT attachment and response interception

export async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem('academiq_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  // Remove Content-Type if uploading FormData (browser will set boundary automatically)
  if (options.body instanceof FormData) {
    delete headers['Content-Type'];
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  if (response.status === 401) {
    // If token expired, clear and trigger event or fallback
    console.warn('Unauthorized request to', endpoint);
  }

  if (!response.ok) {
    const errorText = await response.text();
    let errorMessage = `HTTP ${response.status}: ${response.statusText}`;
    try {
      const parsed = JSON.parse(errorText);
      errorMessage = parsed.message || parsed.error || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  // Check if response has content
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }
  return response.text() as unknown as T;
}
