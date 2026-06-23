// ZPay 支付 — 生成签名并返回支付参数
import crypto from 'crypto';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { plan, words, price, userId } = req.body;
    if (!plan || !price || !userId) return res.status(400).json({ error: '参数不全' });

    const ZPAY_KEY = process.env.ZPAY_KEY || 'NdZYyu1J5d5OiGoDPOJyJSFUkVp5Ok1E';
    const ZPAY_PID = process.env.ZPAY_APP || '2088442553483738';
    const NOTIFY_URL = 'https://shuorenhua-6pv4.vercel.app/api/zpay-notify';
    const RETURN_URL = 'https://shuorenhua-6pv4.vercel.app';

    const outTradeNo = 'SRH_' + Date.now() + '_' + userId.slice(0, 6);
    const name = '说人话·' + ({ lite: '体验包', basic: '基础包', pro: '进阶包' })[plan] || plan;
    const money = price.toFixed(2);

    // ZPay MD5 签名: pid + money + name + out_trade_no + notify_url + return_url + key
    const signStr = ZPAY_PID + money + name + outTradeNo + NOTIFY_URL + RETURN_URL + ZPAY_KEY;
    const sign = crypto.createHash('md5').update(signStr).digest('hex');

    return res.json({
      ok: true,
      params: {
        pid: ZPAY_PID,
        type: 'alipay',
        out_trade_no: outTradeNo,
        notify_url: NOTIFY_URL,
        return_url: RETURN_URL,
        name: name,
        money: money,
        sign: sign,
        sign_type: 'MD5'
      },
      url: 'https://zpayz.cn/submit.php'
    });
  } catch (e) {
    return res.status(500).json({ ok: false, error: e.message });
  }
}
