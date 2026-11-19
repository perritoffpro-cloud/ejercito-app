async function req(method, url, body) {
  const r = await fetch('/api' + url, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await r.json().catch(() => ({}));
  if (!r.ok) throw new Error(data.error || 'Error de comunicación con el servidor');
  return data;
}

export const api = {
  list: (u) => req('GET', u),
  create: (u, b) => req('POST', u, b),
  update: (u, id, b) => req('PUT', `${u}/${id}`, b),
  remove: (u, id) => req('DELETE', `${u}/${id}`),
  action: (u, id, a) => req('POST', `${u}/${id}/${a}`),
  upload: (data) => req('POST', '/uploads', { data }),
};
