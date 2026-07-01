// 一次性脚本：将所有用户的 weekly_limit 更新为 3000
export default async function handler(req, res) {
  const supabaseUrl = 'https://wvnwpradfjwjpzodsznp.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  try {
    const r = await fetch(supabaseUrl + '/rest/v1/quotas?select=id', {
      headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey }
    });
    const users = await r.json();
    let count = 0;
    for (const u of users) {
      await fetch(supabaseUrl + '/rest/v1/quotas?id=eq.' + u.id, {
        method: 'PATCH',
        headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
        body: JSON.stringify({ weekly_limit: 3000 })
      });
      count++;
    }
    res.json({ ok: true, updated: count });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
