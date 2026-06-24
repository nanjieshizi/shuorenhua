// 测试充值 — 直接加额度
export default async function handler(req, res) {
  const { user } = req.query;
  if (!user) return res.json({ error: '请传 user=你的用户ID' });

  const supabaseUrl = 'https://wvnwpradfjwjpzodsznp.supabase.co';
  const supabaseKey = process.env.SUPABASE_SERVICE_KEY;

  try {
    // 查当前
    const qRes = await fetch(supabaseUrl + '/rest/v1/quotas?id=eq.' + user + '&select=quota', {
      headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey }
    });
    const qData = await qRes.json();
    const cur = (qData[0] && qData[0].quota) || 0;

    // 加 25000
    await fetch(supabaseUrl + '/rest/v1/quotas?id=eq.' + user, {
      method: 'PATCH',
      headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ quota: cur + 25000 })
    });

    res.json({ ok: true, msg: '已加 25000 字额度', quota: cur + 25000 });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
}
