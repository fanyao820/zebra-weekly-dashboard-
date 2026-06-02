/**
 * app.js - 主应用逻辑
 * 包含：周切换、权限系统、快照管理、数据渲染、编辑器、保存功能
 */

// ===== 全局状态 =====
const AppState = {
  currentWeekIndex: 2, // 默认显示最新周（W23）
  isAdmin: false,      // 是否管理者模式
  isSnapshot: false,   // 是否在查看快照
  snapshots: [],       // 快照列表
  sidebarOpen: false   // 侧边栏状态
};

// 管理者密码
const ADMIN_PASSWORD = "zebra2026";

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  // 从 localStorage 加载快照
  loadSnapshots();
  // 初始化周选择器下拉框
  initWeekSelector();
  // 初始化编辑器
  initCustomEditor();
  // 渲染当前周数据
  renderWeek();
  // 绑定事件
  bindEvents();
  // 初始化目录导航滚动监听
  initTocNavigation();
});

// ===== 事件绑定 =====
function bindEvents() {
  // 周次下拉切换
  document.getElementById('weekSelect').addEventListener('change', (e) => {
    AppState.currentWeekIndex = parseInt(e.target.value, 10);
    renderWeek();
  });

  // 管理者登录
  document.getElementById('adminLoginBtn').addEventListener('click', showLoginModal);
  document.getElementById('loginSubmit').addEventListener('click', handleLogin);
  document.getElementById('loginCancel').addEventListener('click', hideLoginModal);
  document.getElementById('loginPassword').addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleLogin();
  });

  // 快照按钮
  document.getElementById('snapshotBtn').addEventListener('click', createSnapshot);
  document.getElementById('snapshotListBtn').addEventListener('click', toggleSidebar);

  // 侧边栏关闭
  document.getElementById('closeSidebar').addEventListener('click', toggleSidebar);
  document.getElementById('sidebarOverlay').addEventListener('click', toggleSidebar);

  // 退出快照模式
  document.getElementById('exitSnapshotBtn').addEventListener('click', exitSnapshot);

  // 下周重点 - 新增行
  document.getElementById('addRowBtn').addEventListener('click', addNextWeekRow);

  // 保存按钮
  document.getElementById('highlightsSaveBtn').addEventListener('click', saveHighlights);
  document.getElementById('nextweekSaveBtn').addEventListener('click', saveNextWeek);
}

// ===== 周选择器初始化 =====
function initWeekSelector() {
  const select = document.getElementById('weekSelect');
  AVAILABLE_WEEKS.forEach((weekKey, idx) => {
    const data = MOCK_DATA[weekKey];
    const option = document.createElement('option');
    option.value = idx;
    option.textContent = `${weekKey} (${data.dateRange})`;
    select.appendChild(option);
  });
  select.value = AppState.currentWeekIndex;
}

// ===== 目录导航 =====
function initTocNavigation() {
  const tocNav = document.getElementById('tocNav');
  const tocLinks = tocNav.querySelectorAll('a');
  const sectionIds = Array.from(tocLinks).map(a => a.getAttribute('href').slice(1));

  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href').slice(1);
      const target = document.getElementById(targetId);
      if (target) {
        const tocHeight = tocNav.offsetHeight;
        const targetTop = target.getBoundingClientRect().top + window.pageYOffset - tocHeight - 10;
        window.scrollTo({ top: targetTop, behavior: 'smooth' });
      }
    });
  });

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        updateTocHighlight(sectionIds, tocLinks);
        ticking = false;
      });
      ticking = true;
    }
  });
  updateTocHighlight(sectionIds, tocLinks);
}

function updateTocHighlight(sectionIds, tocLinks) {
  const tocNav = document.getElementById('tocNav');
  const offset = tocNav.offsetHeight + 20;
  let activeId = sectionIds[0];

  for (const id of sectionIds) {
    const el = document.getElementById(id);
    if (el && el.style.display !== 'none') {
      const rect = el.getBoundingClientRect();
      if (rect.top <= offset) {
        activeId = id;
      }
    }
  }

  tocLinks.forEach(link => {
    const linkTarget = link.getAttribute('href').slice(1);
    if (linkTarget === activeId) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

// ===== 权限系统 =====
function showLoginModal() {
  if (AppState.isAdmin) {
    AppState.isAdmin = false;
    updateAdminUI();
    showToast('已退出管理者模式');
    return;
  }
  document.getElementById('loginModal').classList.add('active');
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginPassword').focus();
}

function hideLoginModal() {
  document.getElementById('loginModal').classList.remove('active');
  document.getElementById('loginError').textContent = '';
}

function handleLogin() {
  const password = document.getElementById('loginPassword').value;
  if (password === ADMIN_PASSWORD) {
    AppState.isAdmin = true;
    hideLoginModal();
    updateAdminUI();
    showToast('管理者模式已激活');
  } else {
    document.getElementById('loginError').textContent = '密码错误，请重试';
  }
}

function updateAdminUI() {
  const body = document.body;
  if (AppState.isAdmin) {
    body.classList.add('admin-mode');
    document.getElementById('adminLoginBtn').textContent = '退出管理';
    document.getElementById('adminLoginBtn').classList.add('active');
  } else {
    body.classList.remove('admin-mode');
    document.getElementById('adminLoginBtn').textContent = '管理者登录';
    document.getElementById('adminLoginBtn').classList.remove('active');
  }
  // 更新编辑器状态
  const editor = document.getElementById('weekHighlightsEditor');
  if (editor) {
    editor.contentEditable = AppState.isAdmin && !AppState.isSnapshot ? 'true' : 'false';
  }
  // 更新下周重点表格可编辑状态
  updateNextWeekTableEditable();
  // 更新OKR可编辑状态
  updateOKREditable();
}

// ===== 自定义富文本编辑器 =====
function initCustomEditor() {
  const toolbar = document.getElementById('editorToolbar');
  
  // 工具栏按钮事件
  toolbar.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;
    const cmd = btn.getAttribute('data-cmd');
    if (!cmd) return;
    
    e.preventDefault();
    const editor = document.getElementById('weekHighlightsEditor');
    editor.focus();

    if (cmd === 'insertImage') {
      handleInsertImage();
    } else if (cmd === 'removeFormat') {
      document.execCommand('removeFormat', false, null);
    } else if (cmd.startsWith('formatBlock-')) {
      const tag = cmd.split('-')[1];
      document.execCommand('formatBlock', false, '<' + tag + '>');
    } else if (cmd === 'indent') {
      document.execCommand('indent', false, null);
    } else if (cmd === 'outdent') {
      document.execCommand('outdent', false, null);
    } else {
      document.execCommand(cmd, false, null);
    }
  });

  // 字号下拉
  document.getElementById('fontSizeSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    if (val) {
      document.getElementById('weekHighlightsEditor').focus();
      document.execCommand('fontSize', false, val);
    }
    e.target.value = '';
  });

  // 行距下拉
  document.getElementById('lineHeightSelect').addEventListener('change', (e) => {
    const val = e.target.value;
    if (val) {
      const sel = window.getSelection();
      if (sel.rangeCount > 0) {
        const range = sel.getRangeAt(0);
        let container = range.commonAncestorContainer;
        if (container.nodeType === 3) container = container.parentElement;
        // Find block-level parent
        while (container && !['P', 'DIV', 'H1', 'H2', 'H3', 'H4', 'LI', 'BLOCKQUOTE'].includes(container.tagName)) {
          container = container.parentElement;
        }
        if (container) {
          container.style.lineHeight = val;
        }
      }
    }
    e.target.value = '';
  });
}

function handleInsertImage() {
  const url = prompt('请输入图片URL（或点取消后选择本地文件上传）:');
  if (url) {
    document.execCommand('insertImage', false, url);
  } else {
    // 创建隐藏的文件选择器
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (ev) => {
          document.getElementById('weekHighlightsEditor').focus();
          document.execCommand('insertImage', false, ev.target.result);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  }
}

// ===== localStorage 保存/加载 =====
function getWeekKey() {
  return AVAILABLE_WEEKS[AppState.currentWeekIndex];
}

function saveHighlights() {
  const weekKey = getWeekKey();
  const editor = document.getElementById('weekHighlightsEditor');
  const content = editor.innerHTML;
  localStorage.setItem(`weeklyReport_${weekKey}_highlights`, content);
  showToast('本周重点已保存');
}

function loadHighlights(weekKey) {
  const saved = localStorage.getItem(`weeklyReport_${weekKey}_highlights`);
  return saved;
}

function saveNextWeek() {
  const weekKey = getWeekKey();
  const rows = [];
  document.querySelectorAll('#nextWeekBody tr').forEach((tr, idx) => {
    rows.push({
      id: idx + 1,
      task: tr.cells[1].textContent,
      deliverable: tr.cells[2].textContent,
      deadline: tr.cells[3].textContent
    });
  });
  localStorage.setItem(`weeklyReport_${weekKey}_nextweek`, JSON.stringify(rows));
  showToast('下周重点已保存');
}

function loadNextWeek(weekKey) {
  const saved = localStorage.getItem(`weeklyReport_${weekKey}_nextweek`);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch (e) {
      return null;
    }
  }
  return null;
}

// ===== 数据渲染 =====
function renderWeek() {
  const weekKey = AVAILABLE_WEEKS[AppState.currentWeekIndex];
  const data = AppState.isSnapshot ? AppState.currentSnapshotData : MOCK_DATA[weekKey];

  if (!data) return;

  // 同步下拉框选中状态
  const select = document.getElementById('weekSelect');
  if (select) select.value = AppState.currentWeekIndex;

  // 渲染各模块
  renderOKR(data.okr);
  renderSalesOverview(data.salesOverview);
  renderDownloadData(data.downloadData);
  renderInternalSales(data.internalData.sales);
  renderExposure(data.internalData.exposure);
  renderTopSKU(data.internalData.topSKU);
  renderBookReservation(data.internalData.bookReservation);
  renderExternalData(data.externalData);
  renderWeekHighlights(data.weekHighlights, weekKey);
  renderNextWeekPlan(data.nextWeekPlan, weekKey);

  // 更新图表
  updateAllCharts(AppState.currentWeekIndex);

  // 更新周标签
  document.getElementById('weekSubtitle').textContent = data.weekLabel;
}

// 渲染OKR
function renderOKR(okrData) {
  const container = document.getElementById('okrContent');
  container.innerHTML = okrData.map((item, idx) => `
    <div class="okr-item">
      <div class="okr-header">
        <span class="okr-title" contenteditable="false" data-okr-idx="${idx}" data-field="title">${item.title}</span>
        <span class="okr-value">${item.current} / ${item.target}</span>
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${item.progress}%">
          <span class="progress-text">${item.progress}%</span>
        </div>
      </div>
    </div>
  `).join('');
  updateOKREditable();
}

function updateOKREditable() {
  const titles = document.querySelectorAll('.okr-title');
  titles.forEach(el => {
    el.contentEditable = AppState.isAdmin && !AppState.isSnapshot;
  });
}

// 环比变化 HTML
function wowHtml(val) {
  if (val === null || val === undefined) return '';
  const isPositive = val >= 0;
  // 对于退费率，下降是好事（仍保持颜色逻辑：下降红色/增长绿色对应数值方向）
  const cls = isPositive ? 'positive' : 'negative';
  const icon = isPositive ? '▲' : '▼';
  return `<div class="card-change ${cls}">${icon} ${Math.abs(val).toFixed(1)}%</div>`;
}

function wowHtmlItem(val) {
  if (val === null || val === undefined) return '';
  const isPositive = val >= 0;
  const cls = isPositive ? 'positive' : 'negative';
  const icon = isPositive ? '▲' : '▼';
  return `<span class="change ${cls}">${icon}${Math.abs(val).toFixed(1)}%</span>`;
}

// 行内环比（用于表格单元格）
function wowHtmlInline(val) {
  if (val === null || val === undefined) return '';
  const isPositive = val >= 0;
  const color = isPositive ? '#27ae60' : '#e74c3c';
  const icon = isPositive ? '▲' : '▼';
  return `<span style="font-size:0.75rem;color:${color};margin-left:4px;">${icon}${Math.abs(val).toFixed(1)}%</span>`;
}

// 渲染总售卖数据 (2行3列 + 环比)
function renderSalesOverview(data) {
  const container = document.getElementById('salesOverview');
  const wow = data.wow || {};

  container.innerHTML = `
    <div class="data-card">
      <div class="card-label">收入</div>
      <div class="card-value">¥${formatNumber(data.totalRevenue)}</div>
      ${wowHtml(wow.totalRevenue)}
    </div>
    <div class="data-card">
      <div class="card-label">总订单量</div>
      <div class="card-value">${formatNumber(data.totalOrders)}</div>
      ${wowHtml(wow.totalOrders)}
    </div>
    <div class="data-card">
      <div class="card-label">总订单UV</div>
      <div class="card-value">${formatNumber(data.totalOrderUV)}</div>
      ${wowHtml(wow.totalOrderUV)}
    </div>
    <div class="data-card">
      <div class="card-label">人均订单量</div>
      <div class="card-value">${data.avgOrdersPerUser}</div>
      ${wowHtml(wow.avgOrdersPerUser)}
    </div>
    <div class="data-card">
      <div class="card-label">单均价格</div>
      <div class="card-value">¥${data.avgPrice}</div>
      ${wowHtml(wow.avgPrice)}
    </div>
    <div class="data-card">
      <div class="card-label">总退费率</div>
      <div class="card-value">${data.refundRate}%</div>
      ${wowHtml(wow.refundRate)}
    </div>
  `;
}

// 渲染下载拉新数据 (2行3列 + 环比)
function renderDownloadData(data) {
  const container = document.getElementById('downloadData');
  const wow = data.wow || {};

  container.innerHTML = `
    <div class="data-card">
      <div class="card-label">兑换新用户</div>
      <div class="card-value">${formatNumber(data.redeemNewUsers)}</div>
      ${wowHtml(wow.redeemNewUsers)}
    </div>
    <div class="data-card">
      <div class="card-label">兑换率</div>
      <div class="card-value">${data.redeemRate}%</div>
      ${wowHtml(wow.redeemRate)}
    </div>
    <div class="data-card">
      <div class="card-label">拉新用户</div>
      <div class="card-value">${formatNumber(data.newUsers)}</div>
      ${wowHtml(wow.newUsers)}
    </div>
    <div class="data-card">
      <div class="card-label">转化率</div>
      <div class="card-value">${data.conversionRate}%</div>
      ${wowHtml(wow.conversionRate)}
    </div>
    <div class="data-card">
      <div class="card-label">转化总GMV</div>
      <div class="card-value">¥${formatNumber(data.totalGMV)}</div>
      ${wowHtml(wow.totalGMV)}
    </div>
    <div class="data-card">
      <div class="card-label">客单价</div>
      <div class="card-value">¥${data.avgPrice}</div>
      ${wowHtml(wow.avgPrice)}
    </div>
  `;
}

// 渲染站内销售数据（带环比）
function renderInternalSales(data) {
  const container = document.getElementById('internalSales');
  const wow = data.wow || {};

  container.innerHTML = `
    <div class="data-grid compact" style="grid-template-columns: 1fr;">
      <div class="data-item">
        <span class="label">收入</span>
        <span class="value">¥${formatNumber(data.revenue)}</span>
        ${wowHtmlItem(wow.revenue)}
      </div>
      <div class="data-item">
        <span class="label">订单量</span>
        <span class="value">${formatNumber(data.orders)}</span>
        ${wowHtmlItem(wow.orders)}
      </div>
    </div>
  `;
}

// 渲染曝光数据
function renderExposure(data) {
  const container = document.getElementById('exposureData');
  const t = data.total;
  const entries = data.entries || [];
  container.innerHTML = `
    <!-- 总数据卡片（橘色） -->
    <div class="data-grid compact" style="margin-bottom:1rem;">
      <div class="data-item" style="border-left:3px solid #E67E22;">
        <span class="label">商城曝光UV</span>
        <span class="value" style="color:#E67E22;">${formatNumber(t.uv)}</span>
      </div>
      <div class="data-item" style="border-left:3px solid #E67E22;">
        <span class="label">商城曝光PV</span>
        <span class="value" style="color:#E67E22;">${formatNumber(t.pv)}</span>
      </div>
      <div class="data-item" style="border-left:3px solid #E67E22;">
        <span class="label">商品曝光PV</span>
        <span class="value" style="color:#E67E22;">${formatNumber(t.productPV)}</span>
      </div>
      <div class="data-item" style="border-left:3px solid #E67E22;">
        <span class="label">商品点击UV</span>
        <span class="value" style="color:#E67E22;">${formatNumber(t.clickUV)}</span>
      </div>
      <div class="data-item" style="border-left:3px solid #E67E22;">
        <span class="label">商品点击PV</span>
        <span class="value" style="color:#E67E22;">${formatNumber(t.clickPV)}</span>
      </div>
      <div class="data-item" style="border-left:3px solid #E67E22;">
        <span class="label">商品点击率</span>
        <span class="value" style="color:#E67E22;">${t.clickRate}%</span>
      </div>
      <div class="data-item" style="border-left:3px solid #E67E22;">
        <span class="label">Banner点击UV</span>
        <span class="value" style="color:#E67E22;">${formatNumber(t.bannerClickUV)}</span>
      </div>
      <div class="data-item" style="border-left:3px solid #E67E22;">
        <span class="label">Banner点击率</span>
        <span class="value" style="color:#E67E22;">${t.bannerClickRate}%</span>
      </div>
      <div class="data-item" style="border-left:3px solid #E67E22;">
        <span class="label">分类栏点击UV</span>
        <span class="value" style="color:#E67E22;">${formatNumber(t.categoryClickUV)}</span>
      </div>
    </div>
    <!-- 分入口数据表格（蓝色） -->
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr style="background:#EBF3FD;">
            <th style="color:#1E5FC2;">拆分入口</th>
            <th style="color:#1E5FC2;">曝光UV</th>
            <th style="color:#1E5FC2;">曝光PV</th>
            <th style="color:#1E5FC2;">人均访问次数</th>
          </tr>
        </thead>
        <tbody>
          <tr style="background:#FFF8F0;font-weight:bold;">
            <td style="color:#E67E22;">total</td>
            <td style="color:#E67E22;">${formatNumber(t.uv)}</td>
            <td style="color:#E67E22;">${formatNumber(t.pv)}</td>
            <td style="color:#E67E22;">${t.avgVisit}</td>
          </tr>
          ${entries.map(e => `
            <tr>
              <td style="color:#1E5FC2;">${e.name}</td>
              <td style="color:#1E5FC2;">${formatNumber(e.uv)}</td>
              <td style="color:#1E5FC2;">${formatNumber(e.pv)}</td>
              <td style="color:#1E5FC2;">${e.avgVisit}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
    <!-- 曝光趋势图 -->
    <div class="chart-container" style="height:220px;margin-top:1rem;">
      <canvas id="exposureChart"></canvas>
    </div>
  `;
}

// 渲染TOP-SKU
function renderTopSKU(data) {
  const container = document.getElementById('topSKU');
  // SKU数量显示在标题后
  const skuCountEl = document.getElementById('skuCount');
  if (skuCountEl) skuCountEl.textContent = `（共${data.totalCount}个SKU）`;
  container.innerHTML = `
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>#</th>
            <th>SKU名称</th>
            <th>本周销量</th>
            <th>本周GMV</th>
          </tr>
        </thead>
        <tbody>
          ${data.list.map((item, idx) => `
            <tr>
              <td>${idx + 1}</td>
              <td>${item.name}</td>
              <td>${formatNumber(item.sales)} ${wowHtmlInline(item.wowSales)}</td>
              <td>¥${formatNumber(item.gmv)} ${wowHtmlInline(item.wowGmv)}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
}

// 渲染图书预约数据
function renderBookReservation(data) {
  const container = document.getElementById('bookReservation');
  container.innerHTML = `
    <div class="data-card">
      <div class="card-label">总预约数</div>
      <div class="card-value">${formatNumber(data.totalReservations)}</div>
    </div>
    <div class="data-card">
      <div class="card-label">新增预约</div>
      <div class="card-value">${formatNumber(data.newReservations)}</div>
    </div>
    <div class="data-card">
      <div class="card-label">转化率</div>
      <div class="card-value">${data.conversionRate}%</div>
    </div>
    <div class="data-card">
      <div class="card-label">热门图书</div>
      <div class="card-value small">${data.topBook}</div>
    </div>
  `;
}

// 渲染站外曝光数据（支持无数据时隐藏）
function renderExternalData(data) {
  const subsection = document.getElementById('section-external');

  if (!data || (!data.seeding?.length && !data.pr?.length)) {
    subsection.style.display = 'none';
    return;
  }

  subsection.style.display = 'block';
  const container = document.getElementById('externalData');

  let html = '';

  if (data.seeding && data.seeding.length > 0) {
    html += `
      <div class="subsection">
        <h4>📱 图书外渠种草情况</h4>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr><th>平台</th><th>发布数</th><th>曝光量</th><th>互动量</th></tr>
            </thead>
            <tbody>
              ${data.seeding.map(item => `
                <tr>
                  <td>${item.platform}</td>
                  <td>${item.posts}</td>
                  <td>${formatNumber(item.views)}</td>
                  <td>${formatNumber(item.likes)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  if (data.pr && data.pr.length > 0) {
    html += `
      <div class="subsection">
        <h4>📰 图书外渠PR传播情况</h4>
        <div class="table-wrapper">
          <table class="data-table">
            <thead>
              <tr><th>媒体</th><th>标题</th><th>触达量</th></tr>
            </thead>
            <tbody>
              ${data.pr.map(item => `
                <tr>
                  <td>${item.media}</td>
                  <td>${item.title}</td>
                  <td>${formatNumber(item.reach)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  }

  container.innerHTML = html;
}

// 渲染本周重点 - 使用HTML内容
function renderWeekHighlights(data, weekKey) {
  const editor = document.getElementById('weekHighlightsEditor');
  // 优先从localStorage加载
  const saved = loadHighlights(weekKey);
  if (saved !== null) {
    editor.innerHTML = saved;
  } else if (data) {
    // data is HTML string
    editor.innerHTML = data;
  } else {
    editor.innerHTML = '';
  }
  // 设置可编辑状态
  editor.contentEditable = AppState.isAdmin && !AppState.isSnapshot ? 'true' : 'false';
}

// 渲染下周重点
function renderNextWeekPlan(data, weekKey) {
  const tbody = document.getElementById('nextWeekBody');
  // 优先从localStorage加载
  const saved = loadNextWeek(weekKey);
  const rows = saved || data;

  tbody.innerHTML = rows.map((item, idx) => `
    <tr data-row-id="${item.id || idx + 1}">
      <td>${idx + 1}</td>
      <td contenteditable="false" class="editable-cell">${item.task}</td>
      <td contenteditable="false" class="editable-cell">${item.deliverable}</td>
      <td contenteditable="false" class="editable-cell">${item.deadline}</td>
      <td class="action-cell admin-only">
        <button class="btn-delete" onclick="deleteNextWeekRow(this)" title="删除">✕</button>
      </td>
    </tr>
  `).join('');
  updateNextWeekTableEditable();
}

function updateNextWeekTableEditable() {
  const cells = document.querySelectorAll('#nextWeekBody .editable-cell');
  cells.forEach(cell => {
    cell.contentEditable = AppState.isAdmin && !AppState.isSnapshot;
  });
}

// 新增下周重点行
function addNextWeekRow() {
  const tbody = document.getElementById('nextWeekBody');
  const rowCount = tbody.rows.length + 1;
  const tr = document.createElement('tr');
  tr.innerHTML = `
    <td>${rowCount}</td>
    <td contenteditable="${AppState.isAdmin}" class="editable-cell">点击编辑</td>
    <td contenteditable="${AppState.isAdmin}" class="editable-cell">点击编辑</td>
    <td contenteditable="${AppState.isAdmin}" class="editable-cell">点击编辑</td>
    <td class="action-cell admin-only">
      <button class="btn-delete" onclick="deleteNextWeekRow(this)" title="删除">✕</button>
    </td>
  `;
  tbody.appendChild(tr);
}

// 删除下周重点行
function deleteNextWeekRow(btn) {
  if (!AppState.isAdmin) return;
  const row = btn.closest('tr');
  row.remove();
  // 重新编号
  const rows = document.querySelectorAll('#nextWeekBody tr');
  rows.forEach((r, idx) => {
    r.cells[0].textContent = idx + 1;
  });
}

// ===== 快照系统 =====
function createSnapshot() {
  if (!AppState.isAdmin) return;

  const weekKey = AVAILABLE_WEEKS[AppState.currentWeekIndex];
  const data = MOCK_DATA[weekKey];

  // 获取当前编辑器内容
  const highlights = document.getElementById('weekHighlightsEditor').innerHTML;

  // 获取下周重点表格内容
  const nextWeekRows = [];
  document.querySelectorAll('#nextWeekBody tr').forEach((tr, idx) => {
    nextWeekRows.push({
      id: idx + 1,
      task: tr.cells[1].textContent,
      deliverable: tr.cells[2].textContent,
      deadline: tr.cells[3].textContent
    });
  });

  const snapshot = {
    id: Date.now(),
    weekKey: weekKey,
    timestamp: new Date().toLocaleString('zh-CN'),
    data: JSON.parse(JSON.stringify(data)),
    weekHighlights: highlights,
    nextWeekPlan: nextWeekRows
  };

  AppState.snapshots.unshift(snapshot);
  saveSnapshots();
  renderSnapshotList();
  showToast('快照已保存');
}

function loadSnapshots() {
  try {
    const saved = localStorage.getItem('weeklyDashboardSnapshots');
    if (saved) {
      AppState.snapshots = JSON.parse(saved);
    }
  } catch (e) {
    console.warn('加载快照失败:', e);
  }
}

function saveSnapshots() {
  try {
    localStorage.setItem('weeklyDashboardSnapshots', JSON.stringify(AppState.snapshots));
  } catch (e) {
    console.warn('保存快照失败:', e);
  }
}

function renderSnapshotList() {
  const list = document.getElementById('snapshotList');
  if (AppState.snapshots.length === 0) {
    list.innerHTML = '<div class="empty-state">暂无快照</div>';
    return;
  }

  list.innerHTML = AppState.snapshots.map(snap => `
    <div class="snapshot-item" onclick="viewSnapshot(${snap.id})">
      <div class="snapshot-week">${snap.weekKey}</div>
      <div class="snapshot-time">${snap.timestamp}</div>
    </div>
  `).join('');
}

function viewSnapshot(id) {
  const snapshot = AppState.snapshots.find(s => s.id === id);
  if (!snapshot) return;

  AppState.isSnapshot = true;
  AppState.currentSnapshotData = {
    ...snapshot.data,
    weekHighlights: snapshot.weekHighlights,
    nextWeekPlan: snapshot.nextWeekPlan
  };

  const weekIdx = AVAILABLE_WEEKS.indexOf(snapshot.weekKey);
  if (weekIdx >= 0) AppState.currentWeekIndex = weekIdx;

  renderWeek();
  toggleSidebar();

  document.getElementById('snapshotBanner').style.display = 'flex';
  document.getElementById('snapshotBannerText').textContent =
    `正在查看快照：${snapshot.weekKey} - ${snapshot.timestamp}`;

  // 禁用编辑
  const editor = document.getElementById('weekHighlightsEditor');
  if (editor) editor.contentEditable = 'false';
  updateNextWeekTableEditable();
}

function exitSnapshot() {
  AppState.isSnapshot = false;
  AppState.currentSnapshotData = null;
  document.getElementById('snapshotBanner').style.display = 'none';
  renderWeek();
  updateAdminUI();
}

// ===== 侧边栏 =====
function toggleSidebar() {
  AppState.sidebarOpen = !AppState.sidebarOpen;
  const sidebar = document.getElementById('sidebar');
  const overlay = document.getElementById('sidebarOverlay');

  if (AppState.sidebarOpen) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    renderSnapshotList();
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
  }
}

// ===== 工具函数 =====
function formatNumber(num) {
  if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万';
  }
  return num.toLocaleString('zh-CN');
}

function showToast(message) {
  const toast = document.getElementById('toast');
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}
