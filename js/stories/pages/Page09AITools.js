/**
 * Page09AITools.js - AI 工具統計頁
 * "你最常提及的 AI 工具"
 */

import { StoryPage } from '../StoryPage.js';

export default class Page09AITools extends StoryPage {
  render() {
    const el = super.render();
    const tools = this.stats.topAITools.length > 0
      ? this.stats.topAITools
      : [{ name: 'ChatGPT', count: 0 }, { name: 'Claude', count: 0 }, { name: 'Gemini', count: 0 }];
    el.classList.add('page-ai-tools');
    el.innerHTML = `
      <p class="label">你最常提及的 AI 工具</p>
      <div class="ai-tool-cloud">
        ${tools.map((tool, i) => `
          <span class="ai-tool-word size-${i}" style="--delay: ${i * 0.2}s">${tool.name}</span>
        `).join('')}
      </div>
    `;
    return el;
  }

  async animateIn(el) {
    el.classList.add('active');

    // 標籤淡入
    const label = el.querySelector('.label');
    label.classList.add('visible');

    await this.delay(300);

    // 工具名稱動畫
    const words = el.querySelectorAll('.ai-tool-word');
    for (const word of words) {
      await this.delay(300);
      word.classList.add('pop-in');
    }
  }
}
