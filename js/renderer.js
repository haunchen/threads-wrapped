/**
 * renderer.js - 結果渲染與動畫
 * 將分析結果渲染到頁面並添加動畫效果
 */

export class Renderer {
  constructor(stats) {
    this.stats = stats;
  }

  /**
   * 渲染所有結果
   */
  async render() {
    // 填入基本數據
    this.renderUsername();
    this.renderTopStats();
    this.renderWeeklyChart();
    this.renderHeatmap();
    this.renderLists();
    this.renderBottomStats();

    // 執行動畫
    await this.animateAll();
  }

  /**
   * 渲染用戶名稱
   */
  renderUsername() {
    const el = document.getElementById('username');
    if (el && this.stats.username) {
      el.textContent = `@${this.stats.username}`;
    }
  }

  /**
   * 渲染頂部統計
   */
  renderTopStats() {
    const mostActiveDay = document.getElementById('most-active-day');
    const longestStreak = document.getElementById('longest-streak');

    if (mostActiveDay) {
      mostActiveDay.textContent = this.stats.mostActiveDay;
    }

    if (longestStreak) {
      longestStreak.textContent = `${this.stats.longestStreak} 天`;
    }
  }

  /**
   * 渲染每週圖表
   */
  renderWeeklyChart() {
    const container = document.getElementById('weekly-chart');
    if (!container) return;

    container.innerHTML = '';
    const distribution = this.stats.weeklyDistribution;
    const maxIdx = distribution.reduce((maxI, curr, i, arr) =>
      curr.count > arr[maxI].count ? i : maxI, 0);

    distribution.forEach((day, i) => {
      const bar = document.createElement('div');
      bar.className = 'weekly-bar' + (i === maxIdx ? ' active' : '');
      bar.style.height = `${Math.max(day.percentage, 10)}%`;
      bar.dataset.height = `${Math.max(day.percentage, 10)}%`;
      container.appendChild(bar);
    });

    // 標記最活躍的一天
    const labels = document.querySelectorAll('.weekly-labels span');
    labels.forEach((label, i) => {
      label.classList.toggle('active', i === maxIdx);
    });
  }

  /**
   * 渲染熱力圖
   */
  renderHeatmap() {
    const heatmap = document.getElementById('heatmap');
    const monthsContainer = document.getElementById('heatmap-months');

    if (!heatmap || !monthsContainer) return;

    heatmap.innerHTML = '';
    monthsContainer.innerHTML = '';

    const activity = this.stats.dailyActivity;

    // 計算活動等級
    const getLevel = (count) => {
      if (count === 0) return 0;
      if (count <= 5) return 1;
      if (count <= 15) return 2;
      if (count <= 30) return 3;
      if (count <= 50) return 4;
      return 5;
    };

    // 格式化日期
    const formatDate = (date) => {
      const y = date.getFullYear();
      const m = String(date.getMonth() + 1).padStart(2, '0');
      const d = String(date.getDate()).padStart(2, '0');
      return `${y}-${m}-${d}`;
    };

    const yearStart = new Date(2025, 0, 1);
    const yearEnd = new Date(2025, 11, 31);
    const firstSunday = new Date(2024, 11, 29); // 2025-01-01 是週三，所以從 2024-12-29 週日開始
    const totalWeeks = 53;

    let cellIndex = 0;

    for (let week = 0; week < totalWeeks; week++) {
      const weekDiv = document.createElement('div');
      weekDiv.className = 'heatmap-week';

      for (let day = 0; day < 7; day++) {
        const cell = document.createElement('div');
        cell.className = 'heatmap-cell';
        cell.dataset.index = cellIndex++;

        const currentDate = new Date(firstSunday);
        currentDate.setDate(firstSunday.getDate() + week * 7 + day);
        const dateStr = formatDate(currentDate);

        if (currentDate < yearStart || currentDate > yearEnd) {
          cell.classList.add('empty');
        } else {
          const count = activity[dateStr] || 0;
          const level = getLevel(count);
          if (level > 0) {
            cell.classList.add(`level-${level}`);
          }
          cell.title = `${dateStr}: ${count} 則貼文`;
        }

        weekDiv.appendChild(cell);
      }

      heatmap.appendChild(weekDiv);
    }

    // 月份標籤
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    months.forEach((month) => {
      const span = document.createElement('span');
      span.textContent = month;
      monthsContainer.appendChild(span);
    });
  }

  /**
   * 渲染列表（Top 互動對象、年度關鍵字）
   */
  renderLists() {
    // Top 互動對象
    const interactionsContainer = document.getElementById('top-interactions');
    if (interactionsContainer) {
      interactionsContainer.innerHTML = '';
      this.stats.topInteractions.forEach((item, i) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
          <div class="list-rank">${i + 1}</div>
          <div class="list-content">
            <div class="list-name">${item.username}</div>
          </div>
        `;
        interactionsContainer.appendChild(div);
      });

      // 如果沒有資料，顯示預設
      if (this.stats.topInteractions.length === 0) {
        interactionsContainer.innerHTML = '<div class="list-item"><div class="list-name" style="color:#666">尚無資料</div></div>';
      }
    }

    // 年度關鍵字
    const keywordsContainer = document.getElementById('top-keywords');
    if (keywordsContainer) {
      keywordsContainer.innerHTML = '';
      this.stats.topKeywords.forEach((keyword, i) => {
        const div = document.createElement('div');
        div.className = 'list-item';
        div.innerHTML = `
          <div class="list-rank">${i + 1}</div>
          <div class="list-content">
            <div class="list-name">${keyword}</div>
          </div>
        `;
        keywordsContainer.appendChild(div);
      });

      // 如果沒有資料，顯示預設
      if (this.stats.topKeywords.length === 0) {
        keywordsContainer.innerHTML = '<div class="list-item"><div class="list-name" style="color:#666">尚無資料</div></div>';
      }
    }
  }

  /**
   * 渲染底部統計
   */
  renderBottomStats() {
    const elements = {
      'total-posts': this.stats.totalPosts,
      'total-words': this.stats.totalWords,
      'total-likes': this.stats.totalLikes,
      'followers-count': this.stats.followersCount,
      'personality': this.stats.personality,
      'favorite-emoji': this.stats.favoriteEmoji
    };

    for (const [id, value] of Object.entries(elements)) {
      const el = document.getElementById(id);
      if (el) {
        if (typeof value === 'number') {
          el.dataset.target = value;
          el.textContent = '0';
        } else {
          el.textContent = value;
        }
      }
    }
  }

  /**
   * 執行所有動畫
   */
  async animateAll() {
    // 1. 區塊淡入動畫
    await this.animateItems();

    // 2. 數字跳動動畫
    this.animateNumbers();

    // 3. 每週長條圖動畫
    this.animateWeeklyBars();

    // 4. 熱力圖動畫
    this.animateHeatmap();
  }

  /**
   * 區塊淡入動畫
   */
  async animateItems() {
    const items = document.querySelectorAll('.animate-item');
    for (let i = 0; i < items.length; i++) {
      await this.delay(100);
      items[i].classList.add('visible');
    }
  }

  /**
   * 數字跳動動畫
   */
  animateNumbers() {
    const numberElements = document.querySelectorAll('[data-target]');

    numberElements.forEach(el => {
      const target = parseInt(el.dataset.target);
      if (isNaN(target)) return;

      const duration = 1500;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current = Math.min(Math.round(increment * step), target);
        el.textContent = current.toLocaleString();

        if (step >= steps) {
          clearInterval(timer);
          el.textContent = target.toLocaleString();
        }
      }, duration / steps);
    });
  }

  /**
   * 每週長條圖動畫
   */
  animateWeeklyBars() {
    const bars = document.querySelectorAll('.weekly-bar');
    bars.forEach((bar, i) => {
      setTimeout(() => {
        bar.classList.add('animate');
      }, i * 100);
    });
  }

  /**
   * 熱力圖動畫
   */
  animateHeatmap() {
    const cells = document.querySelectorAll('.heatmap-cell:not(.empty)');
    cells.forEach((cell, i) => {
      setTimeout(() => {
        cell.classList.add('animate');
      }, i * 2);
    });
  }

  /**
   * 延遲函數
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
