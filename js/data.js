/**
 * data.js - Mock数据层
 * 包含2-3周的模拟数据，其中W21的站外数据为空（用于测试自动隐藏功能）
 */

const MOCK_DATA = {
  // ===== W21 数据 =====
  W21: {
    weekLabel: "W21 (5.18-5.24)",
    dateRange: "5.18-5.24",
    // OKR完成情况
    okr: [
      { title: "Q2整体GMV达成", target: "500万", current: "320万", progress: 64 },
      { title: "站内转化率提升", target: "8%", current: "6.5%", progress: 81 },
      { title: "拉新用户数", target: "10000", current: "7200", progress: 72 }
    ],
    // 2.1 总售卖数据
    salesOverview: {
      totalRevenue: 1250000,
      revenueChange: 12.5, // 环比变化百分比
      totalOrders: 3200,
      totalOrderUV: 2800,
      avgOrdersPerUser: 1.14,
      avgPrice: 390.6,
      refundRate: 3.2
    },
    // 2.2 总下载拉新数据
    downloadData: {
      redeemNewUsers: 1500,
      redeemRate: 45.2,
      newUsers: 2200,
      conversionRate: 12.8,
      totalGMV: 680000,
      avgPrice: 309.1
    },
    // 2.3 站内周数据
    internalData: {
      // (1) 销售数据
      sales: {
        revenue: 980000,
        orders: 2500,
        orderUV: 2200,
        avgOrdersPerUser: 1.14,
        avgPrice: 392,
        refundRate: 2.8
      },
      // (2) 商城曝光数据
      exposure: {
        mallPV: 125000,
        mallUV: 85000,
        productCardPV: 320000,
        productCardUV: 180000,
        clickUsers: 45000,
        orderRate: 4.9
      },
      // (3) TOP-SKU
      topSKU: {
        totalCount: 42,
        list: [
          { name: "斑马百科·恐龙世界", sales: 580, gmv: 231420 },
          { name: "斑马百科·海洋探秘", sales: 420, gmv: 167580 },
          { name: "斑马百科·太空冒险", sales: 380, gmv: 151620 },
          { name: "斑马百科·人体奥秘", sales: 320, gmv: 127680 },
          { name: "斑马百科·地球故事", sales: 280, gmv: 111720 }
        ]
      },
      // (4) 图书预约数据
      bookReservation: {
        totalReservations: 5600,
        newReservations: 1200,
        conversionRate: 18.5,
        topBook: "斑马百科·昆虫记"
      }
    },
    // 2.4 站外曝光数据 —— W21为空，测试自动隐藏
    externalData: null,
    // 三、本周重点（Quill Delta格式）
    weekHighlights: {
      ops: [
        { insert: "本周重点工作总结", attributes: { header: 2 } },
        { insert: "\n" },
        { insert: "1. 完成了恐龙世界系列的新一轮营销推广", attributes: { bold: true } },
        { insert: "\n" },
        { insert: "覆盖微信公众号、小红书、抖音三大平台，总曝光超过200万次\n" },
        { insert: "2. 优化了商城首页推荐算法", attributes: { bold: true } },
        { insert: "\n" },
        { insert: "点击率提升15%，转化率提升8%\n" },
        { insert: "3. 启动暑期促销活动策划\n" }
      ]
    },
    // 四、下周重点
    nextWeekPlan: [
      { id: 1, task: "暑期活动页面设计定稿", deliverable: "活动页H5完稿", deadline: "5.28" },
      { id: 2, task: "KOL合作方案确认", deliverable: "签约3位KOL", deadline: "5.30" },
      { id: 3, task: "新品上架准备", deliverable: "5个SKU完成上架", deadline: "5.31" }
    ]
  },

  // ===== W22 数据 =====
  W22: {
    weekLabel: "W22 (5.25-5.31)",
    dateRange: "5.25-5.31",
    okr: [
      { title: "Q2整体GMV达成", target: "500万", current: "380万", progress: 76 },
      { title: "站内转化率提升", target: "8%", current: "7.2%", progress: 90 },
      { title: "拉新用户数", target: "10000", current: "8500", progress: 85 }
    ],
    salesOverview: {
      totalRevenue: 1420000,
      revenueChange: 13.6,
      totalOrders: 3600,
      totalOrderUV: 3100,
      avgOrdersPerUser: 1.16,
      avgPrice: 394.4,
      refundRate: 2.9
    },
    downloadData: {
      redeemNewUsers: 1800,
      redeemRate: 48.5,
      newUsers: 2600,
      conversionRate: 14.2,
      totalGMV: 820000,
      avgPrice: 315.4
    },
    internalData: {
      sales: {
        revenue: 1120000,
        orders: 2850,
        orderUV: 2450,
        avgOrdersPerUser: 1.16,
        avgPrice: 392.9,
        refundRate: 2.5
      },
      exposure: {
        mallPV: 142000,
        mallUV: 96000,
        productCardPV: 358000,
        productCardUV: 198000,
        clickUsers: 52000,
        orderRate: 5.5
      },
      topSKU: {
        totalCount: 45,
        list: [
          { name: "斑马百科·恐龙世界", sales: 620, gmv: 247380 },
          { name: "斑马百科·太空冒险", sales: 480, gmv: 191520 },
          { name: "斑马百科·海洋探秘", sales: 450, gmv: 179550 },
          { name: "斑马百科·人体奥秘", sales: 390, gmv: 155610 },
          { name: "斑马百科·昆虫记", sales: 340, gmv: 135660 }
        ]
      },
      bookReservation: {
        totalReservations: 6200,
        newReservations: 1500,
        conversionRate: 21.2,
        topBook: "斑马百科·植物王国"
      }
    },
    // W22 有站外数据
    externalData: {
      seeding: [
        { platform: "小红书", posts: 25, views: 580000, likes: 32000 },
        { platform: "抖音", posts: 12, views: 1200000, likes: 85000 },
        { platform: "微信公众号", posts: 8, views: 320000, likes: 15000 }
      ],
      pr: [
        { media: "36氪", title: "斑马百科发布暑期新品", reach: 500000 },
        { media: "母婴头条", title: "儿童科普教育新趋势", reach: 320000 },
        { media: "教育观察", title: "交互式百科全书的创新", reach: 180000 }
      ]
    },
    weekHighlights: {
      ops: [
        { insert: "本周重点工作总结", attributes: { header: 2 } },
        { insert: "\n" },
        { insert: "1. 暑期活动页面设计完成", attributes: { bold: true } },
        { insert: "\n" },
        { insert: "已通过UI评审，进入开发阶段\n" },
        { insert: "2. KOL合作签约完成", attributes: { bold: true } },
        { insert: "\n" },
        { insert: "成功签约5位头部母婴KOL，预计6月中旬开始投放\n" },
        { insert: "3. 新品「植物王国」完成内容审核", attributes: { bold: true } },
        { insert: "\n" },
        { insert: "计划6月第一周正式上架\n" },
        { insert: "4. 站外种草效果显著", attributes: { color: "#e74c3c" } },
        { insert: "\n" },
        { insert: "小红书+抖音累计曝光超180万，转化率超预期\n" }
      ]
    },
    nextWeekPlan: [
      { id: 1, task: "暑期活动H5开发联调", deliverable: "H5页面上线", deadline: "6.03" },
      { id: 2, task: "植物王国正式上架", deliverable: "SKU上架+首页推荐位", deadline: "6.02" },
      { id: 3, task: "618预热方案执行", deliverable: "预热素材投放", deadline: "6.05" },
      { id: 4, task: "数据看板优化", deliverable: "新增用户路径分析", deadline: "6.06" }
    ]
  },

  // ===== W23 数据 =====
  W23: {
    weekLabel: "W23 (6.01-6.07)",
    dateRange: "6.01-6.07",
    okr: [
      { title: "Q2整体GMV达成", target: "500万", current: "425万", progress: 85 },
      { title: "站内转化率提升", target: "8%", current: "7.8%", progress: 97 },
      { title: "拉新用户数", target: "10000", current: "9200", progress: 92 }
    ],
    salesOverview: {
      totalRevenue: 1580000,
      revenueChange: 11.3,
      totalOrders: 4000,
      totalOrderUV: 3400,
      avgOrdersPerUser: 1.18,
      avgPrice: 395,
      refundRate: 2.6
    },
    downloadData: {
      redeemNewUsers: 2100,
      redeemRate: 52.3,
      newUsers: 3000,
      conversionRate: 15.8,
      totalGMV: 950000,
      avgPrice: 316.7
    },
    internalData: {
      sales: {
        revenue: 1280000,
        orders: 3200,
        orderUV: 2750,
        avgOrdersPerUser: 1.16,
        avgPrice: 400,
        refundRate: 2.3
      },
      exposure: {
        mallPV: 168000,
        mallUV: 112000,
        productCardPV: 420000,
        productCardUV: 230000,
        clickUsers: 62000,
        orderRate: 5.8
      },
      topSKU: {
        totalCount: 48,
        list: [
          { name: "斑马百科·恐龙世界", sales: 700, gmv: 279300 },
          { name: "斑马百科·植物王国", sales: 550, gmv: 219450 },
          { name: "斑马百科·太空冒险", sales: 520, gmv: 207480 },
          { name: "斑马百科·海洋探秘", sales: 480, gmv: 191520 },
          { name: "斑马百科·昆虫记", sales: 420, gmv: 167580 }
        ]
      },
      bookReservation: {
        totalReservations: 7000,
        newReservations: 1800,
        conversionRate: 23.5,
        topBook: "斑马百科·宇宙奥秘"
      }
    },
    externalData: {
      seeding: [
        { platform: "小红书", posts: 35, views: 820000, likes: 48000 },
        { platform: "抖音", posts: 18, views: 1800000, likes: 120000 },
        { platform: "微信公众号", posts: 12, views: 450000, likes: 22000 },
        { platform: "B站", posts: 5, views: 350000, likes: 28000 }
      ],
      pr: [
        { media: "人民日报教育版", title: "科普教育创新实践", reach: 1200000 },
        { media: "36氪", title: "斑马百科618备战纪实", reach: 600000 },
        { media: "新浪教育", title: "交互式百科受家长追捧", reach: 450000 },
        { media: "腾讯教育", title: "暑期学习好帮手推荐", reach: 380000 }
      ]
    },
    weekHighlights: {
      ops: [
        { insert: "本周重点工作总结", attributes: { header: 2 } },
        { insert: "\n" },
        { insert: "🎉 618预热表现超预期！", attributes: { bold: true, color: "#e74c3c" } },
        { insert: "\n\n" },
        { insert: "1. 暑期活动H5正式上线", attributes: { bold: true } },
        { insert: "\n" },
        { insert: "首日访问量突破5万，转化率达到6.2%\n" },
        { insert: "2. 植物王国上架首周销量突破550单", attributes: { bold: true } },
        { insert: "\n" },
        { insert: "超出预期38%，已追加库存\n" },
        { insert: "3. KOL投放首批内容发布", attributes: { bold: true } },
        { insert: "\n" },
        { insert: "3位KOL发布视频，累计播放量超500万\n" },
        { insert: "4. 站外PR覆盖主流媒体", attributes: { bold: true } },
        { insert: "\n" },
        { insert: "人民日报教育版报道，品牌声量大幅提升\n" }
      ]
    },
    nextWeekPlan: [
      { id: 1, task: "618正式期活动执行", deliverable: "全渠道活动上线", deadline: "6.09" },
      { id: 2, task: "KOL第二批投放", deliverable: "5位KOL内容发布", deadline: "6.12" },
      { id: 3, task: "用户增长数据复盘", deliverable: "复盘报告+优化方案", deadline: "6.10" },
      { id: 4, task: "新品预告素材制作", deliverable: "3套预告素材", deadline: "6.13" },
      { id: 5, task: "客服话术更新", deliverable: "618专属话术文档", deadline: "6.09" }
    ]
  }
};

// 趋势数据（用于图表，近8周）
const TREND_DATA = {
  weeks: ["W16", "W17", "W18", "W19", "W20", "W21", "W22", "W23"],
  // 销售趋势
  salesRevenue: [720000, 780000, 850000, 890000, 920000, 980000, 1120000, 1280000],
  salesOrders: [1800, 2000, 2100, 2200, 2350, 2500, 2850, 3200],
  salesOrderUV: [1600, 1750, 1850, 1950, 2050, 2200, 2450, 2750],
  salesRefundRate: [4.2, 3.8, 3.5, 3.2, 3.0, 2.8, 2.5, 2.3],
  // 曝光趋势
  mallPV: [80000, 88000, 95000, 102000, 115000, 125000, 142000, 168000],
  mallUV: [55000, 60000, 65000, 72000, 78000, 85000, 96000, 112000],
  productCardPV: [200000, 220000, 240000, 265000, 290000, 320000, 358000, 420000],
  clickUsers: [28000, 31000, 34000, 38000, 42000, 45000, 52000, 62000],
  orderRate: [3.2, 3.5, 3.8, 4.1, 4.5, 4.9, 5.5, 5.8]
};

// 可用周次列表
const AVAILABLE_WEEKS = ["W21", "W22", "W23"];
