/**
 * data.js - 真实数据层
 * 包含W21、W22两周的真实数据（来源：石墨表格）
 * 每个指标增加环比字段（wow = week-over-week，W22对比W21）
 */

const MOCK_DATA = {
  // ===== W21 数据 =====
  W21: {
    weekLabel: "W21 (5.18-5.24)",
    dateRange: "5.18-5.24",
    // OKR完成情况（暂无源数据，保持mock）
    okr: [
      { title: "Q2整体GMV达成", target: "500万", current: "320万", progress: 64 },
      { title: "站内转化率提升", target: "8%", current: "6.5%", progress: 81 },
      { title: "拉新用户数", target: "10000", current: "7200", progress: 72 }
    ],
    // 2.1 总售卖数据（站内+站外合计）
    salesOverview: {
      totalRevenue: 78950.90,
      revenueChange: null,
      totalOrders: 1101,
      totalOrderUV: 992,
      avgOrdersPerUser: 1.11,
      avgPrice: 71.71,
      refundRate: 10.2,
      // W21无上一周真实数据，环比设为null
      wow: {
        totalRevenue: null,
        totalOrders: null,
        totalOrderUV: null,
        avgOrdersPerUser: null,
        avgPrice: null,
        refundRate: null
      }
    },
    // 2.2 总下载拉新数据（天文&哺乳动物合计，累计0309-0517）
    downloadData: {
      redeemNewUsers: 230,
      redeemRate: 27.8,
      newUsers: 2231,
      conversionRate: 14.8,
      totalGMV: 10762.02,
      avgPrice: 316.53,
      wow: {
        redeemNewUsers: null,
        redeemRate: null,
        newUsers: null,
        conversionRate: null,
        totalGMV: null,
        avgPrice: null
      }
    },
    // 2.3 站内周数据
    internalData: {
      // (1) 站内销售数据
      sales: {
        revenue: 60302.66,
        orders: 872,
        orderUV: 781,
        avgOrdersPerUser: 1.12,
        avgPrice: 82.29,
        refundRate: 2.2,
        wow: {
          revenue: null,
          orders: null,
          orderUV: null,
          avgOrdersPerUser: null,
          avgPrice: null,
          refundRate: null
        }
      },
      // (2) 商城曝光数据（AI商城 W21）
      exposure: {
        mallPV: 16368,
        mallUV: 13112,
        productCardPV: 293727,
        productCardUV: null,
        clickUsers: 4405,
        clickPV: 11033,
        clickRate: 33.6,
        bannerClickUV: 421,
        bannerClickPV: 506,
        bannerClickRate: 3.2,
        categoryClickUV: 1798,
        orderRate: null
      },
      // (3) TOP-SKU（渠道商品数据 W21）
      topSKU: {
        totalCount: 872,
        list: [
          { name: "哺乳动物观察笔记", sales: 507, gmv: 29650.61 },
          { name: "海洋动物观察笔记", sales: 112, gmv: 7445.39 },
          { name: "天文观察笔记", sales: 101, gmv: 7637 }
        ]
      },
      // (4) 图书预约数据（暂无源数据，保持mock）
      bookReservation: {
        totalReservations: 5600,
        newReservations: 1200,
        conversionRate: 18.5,
        topBook: "斑马百科·昆虫记"
      }
    },
    // 2.4 站外曝光数据（暂无源数据，保持mock）
    externalData: null,
    // 三、本周重点（保持mock）
    weekHighlights: "<h2>本周重点工作总结</h2><p><b>1. 完成了恐龙世界系列的新一轮营销推广</b></p><p>覆盖微信公众号、小红书、抖音三大平台，总曝光超过200万次</p><p><b>2. 优化了商城首页推荐算法</b></p><p>点击率提升15%，转化率提升8%</p><p><b>3. 启动暑期促销活动策划</b></p>",
    // 四、下周重点（保持mock）
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
    // OKR完成情况（暂无源数据，保持mock）
    okr: [
      { title: "Q2整体GMV达成", target: "500万", current: "380万", progress: 76 },
      { title: "站内转化率提升", target: "8%", current: "7.2%", progress: 90 },
      { title: "拉新用户数", target: "10000", current: "8500", progress: 85 }
    ],
    // 2.1 总售卖数据（站内+站外合计）
    salesOverview: {
      totalRevenue: 58235.94,
      revenueChange: -26.2,
      totalOrders: 793,
      totalOrderUV: 723,
      avgOrdersPerUser: 1.10,
      avgPrice: 73.44,
      refundRate: 8.7,
      // 环比（W22 vs W21）
      wow: {
        totalRevenue: -26.2,
        totalOrders: -28.0,
        totalOrderUV: -27.1,
        avgOrdersPerUser: -0.9,
        avgPrice: 2.4,
        refundRate: -14.7
      }
    },
    // 2.2 总下载拉新数据（天文&哺乳动物合计，累计0309-0524）
    downloadData: {
      redeemNewUsers: 249,
      redeemRate: 27.2,
      newUsers: 2301,
      conversionRate: 14.9,
      totalGMV: 10927.42,
      avgPrice: 295.34,
      wow: {
        redeemNewUsers: 8.3,
        redeemRate: -2.2,
        newUsers: 3.1,
        conversionRate: 0.7,
        totalGMV: 1.5,
        avgPrice: -6.7
      }
    },
    // 2.3 站内周数据
    internalData: {
      // (1) 站内销售数据
      sales: {
        revenue: 39680.57,
        orders: 549,
        orderUV: 505,
        avgOrdersPerUser: 1.09,
        avgPrice: 83.29,
        refundRate: 3.0,
        // 环比（W22 vs W21）
        wow: {
          revenue: -34.2,
          orders: -37.0,
          orderUV: -35.3,
          avgOrdersPerUser: -2.7,
          avgPrice: 1.2,
          refundRate: 36.4
        }
      },
      // (2) 商城曝光数据（AI商城 W22）
      exposure: {
        mallPV: 27757,
        mallUV: 22551,
        productCardPV: 403019,
        productCardUV: null,
        clickUsers: 6261,
        clickPV: 15435,
        clickRate: 28.3,
        bannerClickUV: 767,
        bannerClickPV: 843,
        bannerClickRate: 3.4,
        categoryClickUV: 2270,
        orderRate: null
      },
      // (3) TOP-SKU（渠道商品数据 W22）
      topSKU: {
        totalCount: 549,
        list: [
          { name: "哺乳动物观察笔记", sales: 192, gmv: 10976.14 },
          { name: "海洋动物观察笔记", sales: 110, gmv: 7121.91 },
          { name: "天文观察笔记", sales: 105, gmv: 7861 }
        ]
      },
      // (4) 图书预约数据（暂无源数据，保持mock）
      bookReservation: {
        totalReservations: 6200,
        newReservations: 1500,
        conversionRate: 21.2,
        topBook: "斑马百科·植物王国"
      }
    },
    // 2.4 站外曝光数据（暂无源数据，保持mock）
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
    // 三、本周重点（保持mock）
    weekHighlights: "<h2>本周重点工作总结</h2><p><b>1. 暑期活动页面设计完成</b></p><p>已通过UI评审，进入开发阶段</p><p><b>2. KOL合作签约完成</b></p><p>成功签约5位头部母婴KOL，预计6月中旬开始投放</p><p><b>3. 新品「植物王国」完成内容审核</b></p><p>计划6月第一周正式上架</p><p><b style=\"color:#e74c3c\">4. 站外种草效果显著</b></p><p>小红书+抖音累计曝光超180万，转化率超预期</p>",
    // 四、下周重点（保持mock）
    nextWeekPlan: [
      { id: 1, task: "暑期活动H5开发联调", deliverable: "H5页面上线", deadline: "6.03" },
      { id: 2, task: "植物王国正式上架", deliverable: "SKU上架+首页推荐位", deadline: "6.02" },
      { id: 3, task: "618预热方案执行", deliverable: "预热素材投放", deadline: "6.05" },
      { id: 4, task: "数据看板优化", deliverable: "新增用户路径分析", deadline: "6.06" }
    ]
  }
};

// 趋势数据（用于图表，近8周，W21和W22使用真实数据）
const TREND_DATA = {
  weeks: ["W16", "W17", "W18", "W19", "W20", "W21", "W22"],
  // 站内销售趋势（收入）
  salesRevenue: [null, null, null, null, 108581.93, 60302.66, 39680.57],
  // 站内订单数（PV）
  salesOrders: [null, null, null, null, 1691, 872, 549],
  // 站内订单UV
  salesOrderUV: [null, null, null, null, 1593, 781, 505],
  // 站内退费率
  salesRefundRate: [null, null, null, null, 1.5, 2.2, 3.0],
  // 商城曝光PV
  mallPV: [null, null, null, null, null, 16368, 27757],
  // 商城曝光UV
  mallUV: [null, null, null, null, null, 13112, 22551],
  // 商品曝光PV
  productCardPV: [null, null, null, null, null, 293727, 403019],
  // 商品点击UV
  clickUsers: [null, null, null, null, null, 4405, 6261],
  // 商品点击率
  orderRate: [null, null, null, null, null, 33.6, 28.3]
};

// 可用周次列表
const AVAILABLE_WEEKS = ["W21", "W22"];
