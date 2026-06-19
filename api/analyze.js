// Vercel Serverless Function — 合同 AI 分析
// 部署后自动变成：你的域名.com/api/analyze

export default async function handler(req, res) {
  // 只接受 POST 请求
  if (req.method !== 'POST') {
    return res.status(405).json({ error: '只支持 POST 请求' });
  }

  try {
    const { text, type } = req.body;

    if (!text || text.trim().length < 10) {
      return res.status(400).json({ error: '合同内容太短，请粘贴完整条款' });
    }

    // PDF/图片 base64 数据无法直接分析，需要先 OCR 识别
    if (text.startsWith('JVBER') || text.startsWith('iVBOR') || text.startsWith('/9j/') || text.length > 5000 && /^[A-Za-z0-9+/=]+$/.test(text.substring(0, 100))) {
      return res.status(400).json({ error: 'PDF/图片文件需要 OCR 识别后才能分析，请粘贴合同文字内容' });
    }

    const prompt = `你是一位资深劳动法与合同审查专家。请逐条分析以下合同内容，找出其中违法、不合理、或存在风险的条款。

你必须严格按照以下 JSON 格式和规则返回，不允许任何偏差。

## 输出格式（严格 JSON，不要 Markdown 标记）

{
  "title": "合同类型名称",
  "score": 82,
  "clauses": [
    {
      "num": 3,
      "text": "该条款完整原文...",
      "annotations": [
        {
          "text": "需要高亮的问题词句",
          "type": "red",
          "label": "财务处罚",
          "level": "高",
          "title": "违约金比例违法",
          "desc": "详细法律分析...",
          "suggest": "具体修改建议..."
        }
      ]
    }
  ]
}

## 必须遵守的规则

1. text 字段：必须从原文中逐字复制，不得修改任何字符
2. annotations.text：必须是 text 字段中出现的连续文字，不得改写
3. 每个 annotation 的 7 个字段（text, type, label, level, title, desc, suggest）缺一不可
4. 无问题的条款：annotations 为空数组 []
5. 返回纯 JSON，不要用 \`\`\`json 包裹

## 风险等级判定

- 高：违法条款（违反劳动法/合同法/民法典）、霸王条款
- 中：不公平约定、隐藏陷阱、不合理限制权利
- 低：微小争议点、格式瑕疵、措辞不够友好

## 颜色分类

- red：违法、霸王条款、严重损害权益
- orange：隐藏陷阱、不公平约定
- blue：限制/剥夺合法权利
- amber：隐藏费用、不合理扣款
- green：安全条款风险

## 示例

输入："乙方提前退租须支付月租金200%作为违约金。"
正确输出：
{
  "title": "房屋租赁合同",
  "score": 75,
  "clauses": [{
    "num": 1,
    "text": "乙方提前退租须支付月租金200%作为违约金。",
    "annotations": [{
      "text": "月租金200%",
      "type": "red",
      "label": "财务处罚",
      "level": "高",
      "title": "违约金比例违法",
      "desc": "200%月租金违约金远超法律合理范围。根据民法典第585条，违约金过高的可予以减少。",
      "suggest": "建议修改为不超过1个月租金，或改为实际损失的30%。"
    }]
  }]
}

合同类型：${type || '未指定'}
合同内容：
${text}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          { role: 'system', content: '你是一位合同审查专家。你必须只返回合法的纯 JSON，不要包含任何 Markdown、解释或额外文字。' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
        max_tokens: 8192,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error('DeepSeek API 错误:', response.status, err);
      return res.status(502).json({ error: 'AI 服务暂时不可用，请稍后重试' });
    }

    const data = await response.json();
    const content = data.choices[0].message.content;

    // 尝试解析 JSON（兜底处理 AI 偶尔输出不纯的情况）
    let result;
    try {
      result = JSON.parse(content);
    } catch {
      // 如果 AI 包裹了 ```json 标记，尝试提取
      const cleaned = content.replace(/```json\s*|```\s*/g, '').trim();
      result = JSON.parse(cleaned);
    }

    return res.status(200).json(result);
  } catch (err) {
    console.error('分析失败:', err);
    return res.status(500).json({ error: '分析过程出错，请重试' });
  }
}
