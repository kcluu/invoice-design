import { vi } from 'vitest';

// minimal stand-in for a fetch response, enough for our api client
export const jsonResponse = (body: unknown, status = 200) => ({
  ok: status >= 200 && status < 300,
  status,
  json: async () => body,
});

export const mockFetch = () => {
  const fetchMock = vi.fn();
  vi.stubGlobal('fetch', fetchMock);
  return fetchMock;
};
