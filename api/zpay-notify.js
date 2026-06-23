// ZPay 支付回调 — 充值到账
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    const { out_trade_no, total_amount, attach, trade_status } = req.body;
    if (trade_status !== 'TRADE_SUCCESS') return res.send('fail');

    const meta = JSON.parse(attach || '{}');
    if (!meta.userId || !meta.words) return res.send('fail');

    const supabaseUrl = 'https://wvnwpradfjwjpzodsznp.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind2bndwcmFkZmp3anB6b2Rzem5wIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjA4Mzg3NSwiZXhwIjoyMDk3NjU5ODc1fQ.NcPMcz631x1HD5DFmK5Sg1nQ0kQMCvPJOOKVdxOt6q8';

    // 查当前 quota
    const qRes = await fetch(supabaseUrl + '/rest/v1/quotas?id=eq.' + meta.userId + '&select=quota,used', {
      headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey }
    });
    const qData = await qRes.json();
    const currentQuota = (qData[0] && qData[0].quota) || 5000;

    // 更新 quota
    await fetch(supabaseUrl + '/rest/v1/quotas?id=eq.' + meta.userId, {
      method: 'PATCH',
      headers: { 'apikey': supabaseKey, 'Authorization': 'Bearer ' + supabaseKey, 'Content-Type': 'application/json', 'Prefer': 'return=minimal' },
      body: JSON.stringify({ quota: currentQuota + meta.words })
    });

    res.send('success');
  } catch (e) {
    res.send('fail');
  }
}
