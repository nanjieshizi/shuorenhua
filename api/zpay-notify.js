// ZPay 支付回调 — 充值到账
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).send('Method not allowed');

  try {
    const { out_trade_no, total_amount, attach, trade_status } = req.body;
    if (trade_status !== 'TRADE_SUCCESS') return res.send('fail');

    const meta = JSON.parse(attach || '{}');
    if (!meta.userId || !meta.words) return res.send('fail');

    const supabaseUrl = 'https://wvnwpradfjwjpzodsznp.supabase.co';
    const supabaseKey = 'sb_secret_Q6kEs-7drjf_epEeh_wj1A_53byg2VC';

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
