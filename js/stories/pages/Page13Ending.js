/**
 * Page13Ending.js - 結尾頁
 * "這就是你的 2025"
 */

import { StoryPage } from '../StoryPage.js';

export default class Page13Ending extends StoryPage {
  render() {
    const el = super.render();
    el.classList.add('page-ending');
    el.innerHTML = `
      <div class="ending-content">
        <div class="threads-logo-ending">
          <img src="images/threads-logo-white.svg" alt="Threads">
          <span>@${this.stats.username}</span>
        </div>
        <h1 class="ending-title">這就是你的 2025</h1>
        <div class="summary-grid">
          <div class="summary-item">
            <span class="value">${this.stats.totalPosts.toLocaleString()}</span>
            <span class="label">貼文</span>
          </div>
          <div class="summary-item">
            <span class="value">${this.stats.totalWords.toLocaleString()}</span>
            <span class="label">字</span>
          </div>
          <div class="summary-item">
            <span class="value">${this.stats.longestStreak}</span>
            <span class="label">天連續</span>
          </div>
          <div class="summary-item">
            <span class="value">+${this.stats.followersCount.toLocaleString()}</span>
            <span class="label">追蹤者</span>
          </div>
        </div>
        <button class="view-summary-btn">查看統整圖</button>
        <button class="restart-btn">重新播放</button>
      </div>
    `;

    // 綁定按鈕事件
    const btn = el.querySelector('.view-summary-btn');
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // 防止觸發頁面點擊事件
      window.dispatchEvent(new CustomEvent('showSummary'));
    });

    const restartBtn = el.querySelector('.restart-btn');
    restartBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      window.dispatchEvent(new CustomEvent('restartStory'));
    });

    return el;
  }

  async animateIn(el) {
    el.classList.add('active');

    // 標題淡入
    const title = el.querySelector('.ending-title');
    title.classList.add('visible');

    await this.delay(400);

    // 統計項目依序滑入
    const items = el.querySelectorAll('.summary-item');
    for (const item of items) {
      await this.delay(150);
      item.classList.add('visible');
    }

    await this.delay(300);

    // Logo 淡入
    const logo = el.querySelector('.threads-logo-ending');
    logo.classList.add('visible');
  }
}
