// ZPay 支付 — 创建订单
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { plan, words, price, userId } = req.body;
    if (!plan || !price || !userId) return res.status(400).json({ error: '参数不全' });

    const ZPAY_KEY = process.env.ZPAY_KEY || 'NdZYyu1J5d5OiGoDPOJyJSFUkVp5Ok1E';
    const ZPAY_APP = process.env.ZPAY_APP || '2088442553483738';

    const response = await fetch('https://api.zpay.com/v1/order/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + ZPAY_KEY
      },
      body: JSON.stringify({
        app_id: ZPAY_APP,
        out_trade_no: 'SRH_' + Date.now() + '_' + userId.slice(0, 8),
        total_amount: price,
        subject: '说人话·' + ({ lite: '体验包', basic: '基础包', pro: '进阶包' })[plan] || plan,
        body: words + '字额度',
        notify_url: 'https://shuorenhua-6pv4.vercel.app/api/zpay-notify',
        return_url: 'https://shuorenhua-6pv4.vercel.app',
        attach: JSON.stringify({ plan, words, userId })
      })
    });

    const data = await response.json();
    if (data.code === 0 && data.data && data.data.pay_url) {
      return res.json({ ok: true, pay_url: data.data.pay_url });
    }
    return res.json({ ok: false, error: data.msg || '创建订单失败' });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
