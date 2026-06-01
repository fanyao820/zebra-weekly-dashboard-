/**
 * charts.js - 图表渲染模块
 * 使用 Chart.js 绘制折线图
 */

// 存储图表实例，用于更新/销毁
const chartInstances = {};

/**
 * 通用图表配置
 */
const chartDefaults = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: 'bottom',
      labels: {
        boxWidth: 12,
        padding: 10,
        font: { size: 11 }
      }
    },
    tooltip: {
      mode: 'index',
      intersect: false,
      backgroundColor: 'rgba(26, 54, 93, 0.9)',
      padding: 10,
      cornerRadius: 6
    }
  },
  scales: {
    x: {
      grid: { display: false },
      ticks: { font: { size: 10 } }
    },
    y: {
      beginAtZero: false,
      grid: { color: 'rgba(0,0,0,0.05)' },
      ticks: { font: { size: 10 } }
    }
  },
  elements: {
    line: { tension: 0.3, borderWidth: 2 },
    point: { radius: 3, hoverRadius: 5 }
  }
};

/**
 * 渲染销售趋势图
 */
function renderSalesChart(currentWeekIndex) {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;

  // 销毁已有实例
  if (chartInstances.sales) {
    chartInstances.sales.destroy();
  }

  // 截取到当前周的数据
  const endIdx = currentWeekIndex + 1;
  const startIdx = Math.max(0, endIdx - 8);
  const labels = TREND_DATA.weeks.slice(startIdx, endIdx);
  const revenueData = TREND_DATA.salesRevenue.slice(startIdx, endIdx);
  const ordersData = TREND_DATA.salesOrders.slice(startIdx, endIdx);

  chartInstances.sales = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '收入(万)',
          data: revenueData.map(v => (v / 10000).toFixed(1)),
          borderColor: '#1a365d',
          backgroundColor: 'rgba(26, 54, 93, 0.1)',
          fill: true,
          yAxisID: 'y'
        },
        {
          label: '订单量',
          data: ordersData,
          borderColor: '#3182ce',
          backgroundColor: 'rgba(49, 130, 206, 0.1)',
          fill: false,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      ...chartDefaults,
      scales: {
        ...chartDefaults.scales,
        y: {
          ...chartDefaults.scales.y,
          position: 'left',
          title: { display: true, text: '收入(万)', font: { size: 10 } }
        },
        y1: {
          position: 'right',
          beginAtZero: false,
          grid: { drawOnChartArea: false },
          title: { display: true, text: '订单量', font: { size: 10 } },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
}

/**
 * 渲染曝光趋势图
 */
function renderExposureChart(currentWeekIndex) {
  const ctx = document.getElementById('exposureChart');
  if (!ctx) return;

  if (chartInstances.exposure) {
    chartInstances.exposure.destroy();
  }

  const endIdx = currentWeekIndex + 1;
  const startIdx = Math.max(0, endIdx - 8);
  const labels = TREND_DATA.weeks.slice(startIdx, endIdx);
  const pvData = TREND_DATA.mallPV.slice(startIdx, endIdx);
  const uvData = TREND_DATA.mallUV.slice(startIdx, endIdx);
  const orderRateData = TREND_DATA.orderRate.slice(startIdx, endIdx);

  chartInstances.exposure = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: '商城PV(万)',
          data: pvData.map(v => (v / 10000).toFixed(1)),
          borderColor: '#2b6cb0',
          backgroundColor: 'rgba(43, 108, 176, 0.1)',
          fill: true,
          yAxisID: 'y'
        },
        {
          label: '商城UV(万)',
          data: uvData.map(v => (v / 10000).toFixed(1)),
          borderColor: '#4299e1',
          backgroundColor: 'rgba(66, 153, 225, 0.1)',
          fill: false,
          yAxisID: 'y'
        },
        {
          label: '成单率(%)',
          data: orderRateData,
          borderColor: '#48bb78',
          backgroundColor: 'rgba(72, 187, 120, 0.1)',
          fill: false,
          yAxisID: 'y1'
        }
      ]
    },
    options: {
      ...chartDefaults,
      scales: {
        ...chartDefaults.scales,
        y: {
          ...chartDefaults.scales.y,
          position: 'left',
          title: { display: true, text: 'PV/UV(万)', font: { size: 10 } }
        },
        y1: {
          position: 'right',
          beginAtZero: true,
          grid: { drawOnChartArea: false },
          title: { display: true, text: '成单率(%)', font: { size: 10 } },
          ticks: { font: { size: 10 } }
        }
      }
    }
  });
}

/**
 * 渲染退费率趋势图（小图）
 */
function renderRefundChart(currentWeekIndex) {
  const ctx = document.getElementById('refundChart');
  if (!ctx) return;

  if (chartInstances.refund) {
    chartInstances.refund.destroy();
  }

  const endIdx = currentWeekIndex + 1;
  const startIdx = Math.max(0, endIdx - 8);
  const labels = TREND_DATA.weeks.slice(startIdx, endIdx);
  const data = TREND_DATA.salesRefundRate.slice(startIdx, endIdx);

  chartInstances.refund = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: '退费率(%)',
        data: data,
        borderColor: '#e53e3e',
        backgroundColor: 'rgba(229, 62, 62, 0.1)',
        fill: true
      }]
    },
    options: {
      ...chartDefaults,
      plugins: {
        ...chartDefaults.plugins,
        legend: { display: false }
      }
    }
  });
}

/**
 * 更新所有图表
 */
function updateAllCharts(currentWeekIndex) {
  // 将周标签映射到TREND_DATA的索引
  const weekKey = AVAILABLE_WEEKS[currentWeekIndex];
  const trendIdx = TREND_DATA.weeks.indexOf(weekKey);
  const idx = trendIdx >= 0 ? trendIdx : TREND_DATA.weeks.length - 1;

  renderSalesChart(idx);
  renderExposureChart(idx);
  renderRefundChart(idx);
}
