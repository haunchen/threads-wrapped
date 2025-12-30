/**
 * Page02FirstPost.js - 起點頁
 * "一切從這天開始..."
 */

import { StoryPage } from '../StoryPage.js';

export default class Page02FirstPost extends StoryPage {
  render() {
    const el = super.render();
    el.classList.add('page-first-post');
    el.innerHTML = `
      <p class="label">一切從這天開始...</p>
      <div class="date-display">${this.stats.firstPostDate}</div>
    `;
    return el;
  }

  async animateIn(el) {
    el.classList.add('active');

    // 標籤淡入
    const label = el.querySelector('.label');
    label.classList.add('visible');

    await this.delay(300);

    // 日期顯示
    const dateDisplay = el.querySelector('.date-display');
    dateDisplay.classList.add('visible');
  }
}
