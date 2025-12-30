/**
 * Page10PeakMonth.js - 漲粉高峰頁
 * "X 月是黃金月份"
 */

import { StoryPage } from '../StoryPage.js';

export default class Page10PeakMonth extends StoryPage {
  render() {
    const el = super.render();
    el.classList.add('page-peak-month');
    el.innerHTML = `
      <p class="label">${this.stats.peakFollowerMonth} 是黃金月份</p>
      <div class="peak-content">
        <div class="month-display">+0</div>
        <div class="chart-container">
          <div class="chart-bar">
            <span class="bar-value">追蹤者</span>
          </div>
        </div>
        <div class="chart-icon">📈</div>
      </div>
    `;
    return el;
  }

  animateNumber(element, start, end, duration) {
    const startTime = performance.now();
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (end - start) * easeProgress);
      element.textContent = `+${current}`;
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    requestAnimationFrame(update);
  }

  async animateIn(el) {
    el.classList.add('active');

    // 標籤淡入
    const label = el.querySelector('.label');
    label.classList.add('visible');

    await this.delay(300);

    // 數字顯示
    const monthDisplay = el.querySelector('.month-display');
    monthDisplay.classList.add('visible');

    await this.delay(200);

    // 圖表上升動畫 + 數字遞增同步
    const chartBar = el.querySelector('.chart-bar');
    chartBar.classList.add('grow-up');
    this.animateNumber(monthDisplay, 0, this.stats.peakFollowerGain, 800);

    // 圖示放大
    await this.delay(800);
    const icon = el.querySelector('.chart-icon');
    icon.classList.add('bounce-in');
  }
}
