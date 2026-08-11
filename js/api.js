// API helper functions for visitor and employee check‑ins
export async function submitCheckin(visitorData) {
  await fetch(window.CONFIG.API_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(visitorData) });
}

export async function submitEmployeeCheckin(data) {
  await fetch(window.CONFIG.API_URL, { method: 'POST', mode: 'no-cors', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
}
