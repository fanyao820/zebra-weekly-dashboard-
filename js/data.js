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
      totalRevenue: 2718265.66,  // (2448542.83-39680.57) + (340360.02-30956.62)
      totalOrders: 32813,  // (29283-549) + (4513-434)
      totalOrderUV: 25900, // (22623-505) + (4166-384)
      avgOrdersPerUser: 1.27,
      avgPrice: 82.83,
      refundRate: 7.9
    },
    // 总下载拉新数据（累计截至0309-0517，天文单独）
    downloadData: {
      redeemNewUsers: 2231,      // 已兑换UV
      redeemRate: 27.8,          // 兑换率（天文单独 2231/8037）
      newUsers: 230,             // 下载拉新兑换UV
      conversionRate: 14.8,      // 兑换率转化率
      totalGMV: 10762.02,        // 转化百科GMV
      avgPrice: 316.53,          // 人均GMV
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
        // 总数据（橘色）
        total: { uv: 13112, pv: 16368, avgVisit: 1.2, productPV: 293727, clickUV: 4405, clickPV: 11033, clickRate: 33.6, bannerClickUV: 421, bannerClickRate: 3.2, categoryClickUV: 1798 },
        // 分入口（蓝色）
        entries: [
          { name: "家长中心btn", uv: 3051, pv: 3783, avgVisit: 1.2 },
          { name: "家长中心", uv: 3218, pv: 3791, avgVisit: 1.2 },
          { name: "会员管理页", uv: 397, pv: 454, avgVisit: 1.1 },
          { name: "购买成功页", uv: 95, pv: 102, avgVisit: 1.1 }
        ]
      },
      // TOP-SKU（渠道商品数据 W21 本周）
      topSKU: {
        totalCount: 43,
        list: [
          { name: "哺乳动物观察笔记", sales: 507, gmv: 29650.61, wowSales: null, wowGmv: null },
          { name: "海洋动物观察笔记", sales: 112, gmv: 7445.39, wowSales: null, wowGmv: null },
          { name: "天文观察笔记", sales: 101, gmv: 7637, wowSales: null, wowGmv: null }
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
      totalRevenue: 2788902.85,  // 2448542.83 + 340360.02
      totalOrders: 33796,         // 29283 + 4513
      totalOrderUV: 26789,        // 22623 + 4166
      avgOrdersPerUser: 1.26,
      avgPrice: 82.52,
      refundRate: 8.4,
      // 环比 = (W22累计 - W21累计) / W21累计
      wow: {
        totalRevenue: 2.6,
        totalOrders: 3.0,
        totalOrderUV: 3.4,
        avgOrdersPerUser: -0.8,
        avgPrice: -0.4,
        refundRate: 6.3
      }
    },
    // 总下载拉新数据（累计截至0309-0524，天文&哺乳动物合计）
    downloadData: {
      redeemNewUsers: 2301,      // 已兑换UV（天文+哺乳合计）
      redeemRate: 21.5,          // 兑换率 = 2301/10694
      newUsers: 249,             // 下载拉新兑换UV
      conversionRate: 14.9,      // 兑换率转化率
      totalGMV: 10927.42,        // 转化百科GMV
      avgPrice: 295.34,          // 人均GMV
      wow: {
        redeemNewUsers: 3.1,
        redeemRate: -22.7,
        newUsers: 8.3,
        conversionRate: 0.7,
        totalGMV: 1.5,
        avgPrice: -6.7
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
        // 总数据（橘色）
        total: { uv: 22551, pv: 27757, avgVisit: 1.2, productPV: 403019, clickUV: 6261, clickPV: 15435, clickRate: 28.3, bannerClickUV: 767, bannerClickRate: 3.4, categoryClickUV: 2270 },
        // 分入口（蓝色）
        entries: [
          { name: "家长中心btn", uv: 2968, pv: 3617, avgVisit: 1.2 },
          { name: "家长中心", uv: 2634, pv: 3058, avgVisit: 1.2 },
          { name: "会员管理页", uv: 360, pv: 412, avgVisit: 1.1 },
          { name: "购买成功页", uv: 94, pv: 100, avgVisit: 1.1 }
        ]
      },
      // TOP-SKU（渠道商品数据 W22 本周）
      topSKU: {
        totalCount: 43,
        list: [
          { name: "哺乳动物观察笔记", sales: 192, gmv: 10976.14, wowSales: -62.1, wowGmv: -63.0 },
          { name: "海洋动物观察笔记", sales: 110, gmv: 7121.91, wowSales: -1.8, wowGmv: -4.3 },
          { name: "天文观察笔记", sales: 105, gmv: 7861, wowSales: 4.0, wowGmv: 2.9 }
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
