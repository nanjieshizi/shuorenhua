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

    const prompt = `你是一位资深合同审查律师，精通《民法典》《劳动合同法》《消费者权益保护法》等中国法律法规。

请对以下合同的【每一条条款】逐一审查，找出所有违法、不合理或存在风险的条款。即使某条款看似无害，也要仔细检查是否存在隐藏陷阱或模糊措辞。

## 审查要点清单（每一项都必须检查）

- 法律合规性：是否违反现行法律法规
- 权利义务对等性：是否单方面加重对方责任
- 经济条款合理性：违约金、赔偿金、押金、费率是否过高
- 程序公平性：是否存在"甲方单方面决定"、"无需通知"、"视为同意"等陷阱
- 限制权利：是否剥夺对方的法定权利（仲裁、诉讼、解除合同等）
- 隐藏费用：是否存在模糊收费、捆绑销售、变相加价
- 免责条款：是否不合理地排除或限制自身责任
- 数据与隐私：是否存在过度收集或不当使用个人信息的条款

## 输出格式（严格 JSON，无 Markdown）

{
  "title": "根据合同内容判断的合同类型（如房屋租赁合同、劳动合同、贷款协议等）",
  "score": 根据问题数量和严重性综合评分(0-100),
  "clauses": [
    {
      "num": 条款序号(从1开始),
      "text": "该条款完整原文（逐字复制，保留所有标点和换行）",
      "annotations": [
        {
          "text": "条款中需要标注的具体问题词句（必须精确出现在原文中）",
          "type": "red",
          "label": "财务处罚",
          "level": "高",
          "title": "问题简明标题（不超过15字）",
          "desc": "详细法律分析，引用具体法条，说明为何该条款存在问题（50-150字）",
          "suggest": "具体可操作的修改建议（30-100字）"
        }
      ]
    }
  ]
}

## 规则

- 【重要】必须分析原文中的【每一条】，不可跳过任何条款。每个条款都必须出现在 clauses 数组中
- 条款的划分：原文中以"第X条"、"第X章"、换行分隔的段落，每个作为一个独立条款
- 无问题的条款保留 annotations 为空数组 []
- 一个条款可以有多个 annotations（如既有财务问题又有权利限制）
- type 可选值：red（违法/霸王条款）、orange（隐藏陷阱）、blue（限制权利）、amber（隐藏费用/不合理扣款）
- level 可选值：高（违法/严重损害权益）、中（不公平/隐藏风险）、轻微（微小瑕疵/措辞不当）
- label 可选值：财务处罚、合同陷阱、权利限制、隐藏费用
- 所有文字必须从原文逐字复制，不得改写
- 返回纯 JSON，不要用 \`\`\`json 包裹，不要加任何解释文字

## 审查示例

输入："第三条：乙方提前退租须支付月租金200%作为违约金，并赔偿甲方全部损失。"
正确输出：
{
  "title": "房屋租赁合同",
  "score": 82,
  "clauses": [{
    "num": 3,
    "text": "第三条：乙方提前退租须支付月租金200%作为违约金，并赔偿甲方全部损失。",
    "annotations": [{
      "text": "月租金200%",
      "type": "red",
      "label": "财务处罚",
      "level": "高",
      "title": "违约金比例违法",
      "desc": "200%月租金违约金远超合理范围。根据《民法典》第585条，约定的违约金过分高于造成的损失的，人民法院或者仲裁机构可以根据当事人的请求予以适当减少。司法实践中通常以实际损失的30%为上限。",
      "suggest": "建议将违约金修改为1-2个月租金，或不超过实际损失的30%。"
    }, {
      "text": "赔偿甲方全部损失",
      "type": "orange",
      "label": "合同陷阱",
      "level": "中",
      "title": "赔偿责任无限扩大",
      "desc": "\"全部损失\"一词过于模糊，甲方可任意解释扩大的损失范围。根据《民法典》第584条，损失赔偿额应相当于违约所造成的损失，且不得超过违约方订立合同时预见到或应当预见到的损失。",
      "suggest": "建议限定赔偿范围为\"直接经济损失\"，并设赔偿上限。"
    }]
  }]
}

合同类型参考：${type || '请根据合同内容自行判断'}
合同内容：
${text}`;

    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'deepseek-reasoner',
        messages: [
          { role: 'system', content: '你是一位合同审查专家。你必须只返回合法的纯 JSON，不要包含任何 Markdown、解释或额外文字。' },
          { role: 'user', content: prompt },
        ],
        response_format: { type: 'json_object' },
        temperature: 0,
        max_tokens: 16384,
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
