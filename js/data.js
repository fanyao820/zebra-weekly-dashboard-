/**
 * data.js - 真实数据层
 * 数据来源：石墨表格
 * 展示：累计数据 + 本周环比变化
 * W22周期截止: 5.25-5.31 | W21周期截止: 5.18-5.24
 */

const MOCK_DATA = {
  // ===== W21 数据（截至5.18-5.24的累计） =====
  W21: {
    weekLabel: "W21 (5.18-5.24)",
    dateRange: "5.18-5.24",
    okr: [
      { title: "Q2整体GMV达成", target: "500万", current: "320万", progress: 64 },
      { title: "站内转化率提升", target: "8%", current: "6.5%", progress: 81 },
      { title: "拉新用户数", target: "10000", current: "7200", progress: 72 }
    ],
    // 总售卖数据（累计，站内+站外）
    // 注：W21累计 = W22累计 - W22本周增量
    salesOverview: {
      totalRevenue: 2718265.66,  // (2448542.83-39680.57) + (327958.77-18555.37)
      revenueChange: null,
      totalOrders: 32813,  // (29283-549) + (4323-244)
      totalOrderUV: 25900, // (22623-505) + (4000-218)
      avgOrdersPerUser: 1.27,
      avgPrice: 82.83,
      refundRate: 7.9,
      wow: {
        totalRevenue: null,
        totalOrders: null,
        totalOrderUV: null,
        avgOrdersPerUser: null,
        avgPrice: null,
        refundRate: null
      }
    },
    // 总下载拉新数据（累计截至0309-0517）
    downloadData: {
      redeemNewUsers: 2231,      // 已兑换UV
      redeemRate: 27.8,          // 兑换率
      newUsers: 230,             // 下载拉新兑换UV
      conversionRate: 14.8,      // 兑换率转化率
      totalGMV: 10762.02,        // 转化百科GMV
      avgPrice: 316.53,          // 人均GMV
      wow: {
        redeemNewUsers: null,
        redeemRate: null,
        newUsers: null,
        conversionRate: null,
        totalGMV: null,
        avgPrice: null
      }
    },
    // 站内周数据
    internalData: {
      // 站内销售（本周增量，用于趋势对比）
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
      // 商城曝光数据（AI商城 0518-0524 周数据）
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
      // TOP-SKU（渠道商品数据 W21 本周）
      topSKU: {
        totalCount: 13,
        list: [
          { name: "哺乳动物观察笔记", sales: 507, gmv: 29650.61 },
          { name: "海洋动物观察笔记", sales: 112, gmv: 7445.39 },
          { name: "天文观察笔记", sales: 101, gmv: 7637 }
        ]
      },
      // 图书预约数据（暂无源数据）
      bookReservation: {
        totalReservations: 5600,
        newReservations: 1200,
        conversionRate: 18.5,
        topBook: "天文观察笔记"
      }
    },
    externalData: null,
    weekHighlights: "<p>W21本周重点待填写</p>",
    nextWeekPlan: [
      { id: 1, task: "待填写", deliverable: "待填写", deadline: "-" }
    ]
  },

  // ===== W22 数据（截至5.25-5.31的累计） =====
  W22: {
    weekLabel: "W22 (5.25-5.31)",
    dateRange: "5.25-5.31",
    okr: [
      { title: "Q2整体GMV达成", target: "500万", current: "380万", progress: 76 },
      { title: "站内转化率提升", target: "8%", current: "7.2%", progress: 90 },
      { title: "拉新用户数", target: "10000", current: "8500", progress: 85 }
    ],
    // 总售卖数据（累计，站内+站外）
    salesOverview: {
      totalRevenue: 2776501.60,  // 2448542.83 + 327958.77
      revenueChange: -26.2,       // 本周增量vs上周增量
      totalOrders: 33606,         // 29283 + 4323
      totalOrderUV: 26623,        // 22623 + 4000
      avgOrdersPerUser: 1.26,
      avgPrice: 82.62,
      refundRate: 8.0,
      // 环比 = (本周新增 vs 上周新增)
      wow: {
        totalRevenue: -26.2,   // (58235.94 vs 78950.90)
        totalOrders: -28.0,    // (793 vs 1101)
        totalOrderUV: -27.1,   // (723 vs 992)
        avgOrdersPerUser: -1.3,
        avgPrice: 2.4,
        refundRate: -14.7
      }
    },
    // 总下载拉新数据（累计截至0309-0524，天文&哺乳动物合计）
    downloadData: {
      redeemNewUsers: 2301,      // 已兑换UV（天文+哺乳合计）
      redeemRate: 27.2,          // 兑换率
      newUsers: 249,             // 下载拉新兑换UV
      conversionRate: 14.9,      // 兑换率转化率
      totalGMV: 10927.42,        // 转化百科GMV
      avgPrice: 295.34,          // 人均GMV
      wow: {
        redeemNewUsers: 3.1,    // (2301 vs 2231)
        redeemRate: -2.2,       // (27.2 vs 27.8)
        newUsers: 8.3,          // (249 vs 230)
        conversionRate: 0.7,    // (14.9 vs 14.8)
        totalGMV: 1.5,          // (10927.42 vs 10762.02)
        avgPrice: -6.7          // (295.34 vs 316.53)
      }
    },
    // 站内周数据
    internalData: {
      // 站内销售（本周 W22 增量数据）
      sales: {
        revenue: 39680.57,
        orders: 549,
        orderUV: 505,
        avgOrdersPerUser: 1.09,
        avgPrice: 83.29,
        refundRate: 3.0,
        wow: {
          revenue: -34.2,    // (39680.57 vs 60302.66)
          orders: -37.0,     // (549 vs 872)
          orderUV: -35.3,    // (505 vs 781)
          avgOrdersPerUser: -2.7,
          avgPrice: 1.2,     // (83.29 vs 82.29)
          refundRate: 36.4   // (3.0 vs 2.2) 退费率上升
        }
      },
      // 商城曝光数据（AI商城 0525-0531 周数据）
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
      // TOP-SKU（渠道商品数据 W22 本周）
      topSKU: {
        totalCount: 13,
        list: [
          { name: "哺乳动物观察笔记", sales: 192, gmv: 10976.14 },
          { name: "海洋动物观察笔记", sales: 110, gmv: 7121.91 },
          { name: "天文观察笔记", sales: 105, gmv: 7861 }
        ]
      },
      // 图书预约数据（暂无源数据）
      bookReservation: {
        totalReservations: 6200,
        newReservations: 1500,
        conversionRate: 21.2,
        topBook: "哺乳动物观察笔记"
      }
    },
    externalData: null,
    weekHighlights: "<p>W22本周重点待填写</p>",
    nextWeekPlan: [
      { id: 1, task: "待填写", deliverable: "待填写", deadline: "-" }
    ]
  }
};

// 趋势数据（站内周增量，用于折线图）
const TREND_DATA = {
  weeks: ["W20", "W21", "W22"],
  // 站内收入（周增量）
  salesRevenue: [108581.93, 60302.66, 39680.57],
  // 站内订单数PV（周增量）
  salesOrders: [1691, 872, 549],
  // 站内订单UV（周增量）
  salesOrderUV: [1593, 781, 505],
  // 站内退费率
  salesRefundRate: [1.5, 2.2, 3.0],
  // 商城曝光PV
  mallPV: [null, 16368, 27757],
  // 商城曝光UV
  mallUV: [null, 13112, 22551],
  // 商品曝光PV
  productCardPV: [null, 293727, 403019],
  // 商品点击UV
  clickUsers: [null, 4405, 6261],
  // 商品点击率(%)
  orderRate: [null, 33.6, 28.3]
};

// 可用周次列表
const AVAILABLE_WEEKS = ["W21", "W22"];
