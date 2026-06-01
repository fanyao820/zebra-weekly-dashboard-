/**
 * app.js - 主应用逻辑
 * 包含：周切换、权限系统、快照管理、数据渲染
 */

// ===== 全局状态 =====
const AppState = {
  currentWeekIndex: 2, // 默认显示最新周（W23）
  isAdmin: false,      // 是否管理者模式
  isSnapshot: false,   // 是否在查看快照
  snapshots: [],       // 快照列表
  quillEditor: null,   // Quill 编辑器实例
  sidebarOpen: false   // 侧边栏状态
};

// 管理者密码
const ADMIN_PASSWORD = "zebra2026";

// ===== 初始化 =====
document.addEventListener('DOMContentLoaded', () => {
  // 从 localStorage 加载快照
  loadSnapshots();
  // 初始化 Quill 编辑器
  initQuillEditor();
  // 渲染当前周数据
  renderWeek();
  // 绑定事件
bindEvents();
  // 更新导航状态
  updateNavigation();
});

// ===== 事件绑定 =====
function bindEvents() {
  // 周次切换
  document.getElementById('prevWeek').addEventListener('click', () => switchWeek(-1));
  document.getElementById('nextWeek').addEventListener('click', () => switchWeek(1));

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
}

// ===== 周次切换 =====
function switchWeek(direction) {
  const newIndex = AppState.currentWeekIndex + direction;
  if (newIndex >= 0 && newIndex < AVAILABLE_WEEKS.length) {
    AppState.currentWeekIndex = newIndex;
    renderWeek();
    updateNavigation();
  }
}

function updateNavigation() {
  const weekLabel = document.getElementById('currentWeekLabel');
  const weekKey = AVAILABLE_WEEKS[AppState.currentWeekIndex];
  weekLabel.textContent = weekKey;

  // 更新按钮状态
  document.getElementById('prevWeek').disabled = AppState.currentWeekIndex === 0;
  document.getElementById('nextWeek').disabled = AppState.currentWeekIndex === AVAILABLE_WEEKS.length - 1;

  // 高亮当前周
  weekLabel.className = AppState.currentWeekIndex === AVAILABLE_WEEKS.length - 1 ? 'current-week' : '';
}

// ===== 权限系统 =====
function showLoginModal() {
  if (AppState.isAdmin) {
    // 已登录，退出管理者模式
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
  // 更新 Quill 编辑器状态
  if (AppState.quillEditor) {
    AppState.quillEditor.enable(AppState.isAdmin && !AppState.isSnapshot);
  }
  // 更新下周重点表格可编辑状态
  updateNextWeekTableEditable();
  // 更新OKR可编辑状态
  updateOKREditable();
}

// ===== Quill 编辑器 =====
function initQuillEditor() {
  const toolbarOptions = [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline'],
    [{ 'color': [] }],
    [{ 'size': ['small', false, 'large', 'huge'] }],
    [{ 'list': 'ordered' }, { 'list': 'bullet' }],
    ['image'],
    ['clean']
  ];

  AppState.quillEditor = new Quill('#weekHighlightsEditor', {
    theme: 'snow',
    modules: {
      toolbar: toolbarOptions
    },
    placeholder: '请输入本周重点内容...',
    readOnly: true // 默认只读
  });
}

// ===== 数据渲染 =====
function renderWeek() {
  const weekKey = AVAILABLE_WEEKS[AppState.currentWeekIndex];
  const data = AppState.isSnapshot ? AppState.currentSnapshotData : MOCK_DATA[weekKey];

  if (!data) return;

  // 渲染各模块
  renderOKR(data.okr);
  renderSalesOverview(data.salesOverview);
  renderDownloadData(data.downloadData);
  renderInternalSales(data.internalData.sales);
  renderExposure(data.internalData.exposure);
  renderTopSKU(data.internalData.topSKU);
  renderBookReservation(data.internalData.bookReservation);
  renderExternalData(data.externalData);
  renderWeekHighlights(data.weekHighlights);
  renderNextWeekPlan(data.nextWeekPlan);

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

// 渲染总售卖数据
function renderSalesOverview(data) {
  const container = document.getElementById('salesOverview');
  const changeIcon = data.revenueChange >= 0 ? '↑' : '↓';
  const changeClass = data.revenueChange >= 0 ? 'positive' : 'negative';

  container.innerHTML = `
    <div class="data-card highlight">
      <div class="card-label">总收入</div>
      <div class="card-value">¥${formatNumber(data.totalRevenue)}</div>
      <div class="card-change ${changeClass}">${changeIcon} ${Math.abs(data.revenueChange)}%</div>
    </div>
    <div class="data-card">
      <div class="card-label">总订单量</div>
      <div class="card-value">${formatNumber(data.totalOrders)}</div>
    </div>
    <div class="data-card">
      <div class="card-label">总订单UV</div>
      <div class="card-value">${formatNumber(data.totalOrderUV)}</div>
    </div>
    <div class="data-card">
      <div class="card-label">人均订单量</div>
      <div class="card-value">${data.avgOrdersPerUser}</div>
    </div>
    <div class="data-card">
      <div class="card-label">单均价格</div>
      <div class="card-value">¥${data.avgPrice}</div>
    </div>
    <div class="data-card">
      <div class="card-label">总退费率</div>
      <div class="card-value">${data.refundRate}%</div>
    </div>
  `;
}

// 渲染下载拉新数据
function renderDownloadData(data) {
  const container = document.getElementById('downloadData');
  container.innerHTML = `
    <div class="data-card">
      <div class="card-label">兑换新用户</div>
      <div class="card-value">${formatNumber(data.redeemNewUsers)}</div>
    </div>
    <div class="data-card">
      <div class="card-label">兑换率</div>
      <div class="card-value">${data.redeemRate}%</div>
    </div>
    <div class="data-card">
      <div class="card-label">拉新用户</div>
      <div class="card-value">${formatNumber(data.newUsers)}</div>
    </div>
    <div class="data-card">
      <div class="card-label">转化率</div>
      <div class="card-value">${data.conversionRate}%</div>
    </div>
    <div class="data-card">
      <div class="card-label">转化总GMV</div>
      <div class="card-value">¥${formatNumber(data.totalGMV)}</div>
    </div>
    <div class="data-card">
      <div class="card-label">客单价</div>
      <div class="card-value">¥${data.avgPrice}</div>
    </div>
  `;
}

// 渲染站内销售数据
function renderInternalSales(data) {
  const container = document.getElementById('internalSales');
  container.innerHTML = `
    <div class="data-grid compact">
      <div class="data-item"><span class="label">收入</span><span class="value">¥${formatNumber(data.revenue)}</span></div>
      <div class="data-item"><span class="label">订单量</span><span class="value">${formatNumber(data.orders)}</span></div>
      <div class="data-item"><span class="label">订单UV</span><span class="value">${formatNumber(data.orderUV)}</span></div>
      <div class="data-item"><span class="label">人均订单量</span><span class="value">${data.avgOrdersPerUser}</span></div>
      <div class="data-item"><span class="label">单均价格</span><span class="value">¥${data.avgPrice}</span></div>
      <div class="data-item"><span class="label">退费率</span><span class="value">${data.refundRate}%</span></div>
    </div>
  `;
}

// 渲染曝光数据
function renderExposure(data) {
  const container = document.getElementById('exposureData');
  container.innerHTML = `
    <div class="data-grid compact">
      <div class="data-item"><span class="label">商城曝光PV</span><span class="value">${formatNumber(data.mallPV)}</span></div>
      <div class="data-item"><span class="label">商城曝光UV</span><span class="value">${formatNumber(data.mallUV)}</span></div>
      <div class="data-item"><span class="label">商品卡曝光PV</span><span class="value">${formatNumber(data.productCardPV)}</span></div>
      <div class="data-item"><span class="label">商品卡曝光UV</span><span class="value">${formatNumber(data.productCardUV)}</span></div>
      <div class="data-item"><span class="label">点击用户</span><span class="value">${formatNumber(data.clickUsers)}</span></div>
      <div class="data-item"><span class="label">成单率</span><span class="value">${data.orderRate}%</span></div>
    </div>
  `;
}

// 渲染TOP-SKU
function renderTopSKU(data) {
  const container = document.getElementById('topSKU');
  container.innerHTML = `
    <div class="sku-summary">总SKU量：<strong>${data.totalCount}</strong></div>
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
              <td>${formatNumber(item.sales)}</td>
              <td>¥${formatNumber(item.gmv)}</td>
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
  const section = document.getElementById('externalSection');

  // 核心逻辑：无数据时自动隐藏
  if (!data || (!data.seeding?.length && !data.pr?.length)) {
    section.style.display = 'none';
    return;
  }

  section.style.display = 'block';
  const container = document.getElementById('externalData');

  let html = '';

  // 种草数据
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

  // PR传播数据
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

// 渲染本周重点
function renderWeekHighlights(data) {
  if (AppState.quillEditor && data) {
    AppState.quillEditor.setContents(data);
  }
}

// 渲染下周重点
function renderNextWeekPlan(data) {
  const tbody = document.getElementById('nextWeekBody');
  tbody.innerHTML = data.map((item, idx) => `
    <tr data-row-id="${item.id}">
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
  const highlights = AppState.quillEditor ? AppState.quillEditor.getContents() : data.weekHighlights;

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

  // 切换到快照对应的周
  const weekIdx = AVAILABLE_WEEKS.indexOf(snapshot.weekKey);
  if (weekIdx >= 0) AppState.currentWeekIndex = weekIdx;

  renderWeek();
  updateNavigation();
  toggleSidebar();

  // 显示快照提示条
  document.getElementById('snapshotBanner').style.display = 'flex';
  document.getElementById('snapshotBannerText').textContent =
    `正在查看快照：${snapshot.weekKey} - ${snapshot.timestamp}`;

  // 禁用编辑
  if (AppState.quillEditor) AppState.quillEditor.enable(false);
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
