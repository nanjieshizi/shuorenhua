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

以严格的 JSON 格式返回（不要包含任何 markdown 标记、代码块或其他解释文字）：

{
  "score": 数字(0-100的风险评分),
  "clauses": [
    {
      "num": 数字(条款序号),
      "text": "该条款的完整原文",
      "annotations": [
        {
          "text": "需要高亮标注的问题词句（必须在text字段中精确出现）",
          "type": "red或orange或blue或amber或green",
          "label": "财务处罚或合同陷阱或权利限制或隐藏费用或安全条款",
          "level": "高或中或低",
          "title": "问题的简短总结",
          "desc": "详细的法律分析与风险说明",
          "suggest": "具体的修改建议"
        }
      ]
    }
  ]
}

颜色分类规则：
- red(红色)：涉及违法条款、霸王条款、严重损害合法权益
- orange(橙色)：隐藏的陷阱条款、不公平约定
- blue(蓝色)：限制或剥夺合法权利
- amber(琥珀色)：隐藏费用、不合理扣款、经济处罚
- green(绿色)：安全条款相关风险

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
        temperature: 0.3,
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
