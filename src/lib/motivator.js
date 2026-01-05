export async function fetchMotivator() {
  try {
    const res = await fetch('/api/motivator');
    if (!res.ok) return null;
    const json = await res.json();
    return json.fact || null;
  } catch (e) {
    console.error('Motivator fetch error', e);
    return null;
  }
}
