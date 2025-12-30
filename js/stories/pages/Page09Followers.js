/**
 * Page09Followers.js - 社群成長頁
 * "你的圈子變大了"
 */

import { StoryPage } from '../StoryPage.js';

export default class Page09Followers extends StoryPage {
  render() {
    const el = super.render();
    el.classList.add('page-followers');
    el.innerHTML = `
      <p class="label">你的圈子變大了</p>
      <div class="growth-display">
        <span class="plus">+</span>
        <span class="followers-number" data-target="${this.stats.followersCount}">0</span>
        <span class="unit">追蹤者</span>
      </div>
      <div class="crowd-animation">
        <div class="person-row"></div>
      </div>
    `;
    return el;
  }

  // 檢查兩個圓是否重疊
  isOverlapping(x1, y1, r1, x2, y2, r2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < (r1 + r2 + 4); // 加 4px 間距
  }

  // 找到不重疊的位置
  findNonOverlappingPosition(size, existingCircles, containerW, containerH) {
    for (let attempt = 0; attempt < 50; attempt++) {
      const x = Math.random() * (containerW - size);
      const y = Math.random() * (containerH - size);
      const centerX = x + size / 2;
      const centerY = y + size / 2;
      const radius = size / 2;

      let overlaps = false;
      for (const circle of existingCircles) {
        if (this.isOverlapping(centerX, centerY, radius, circle.cx, circle.cy, circle.r)) {
          overlaps = true;
          break;
        }
      }

      if (!overlaps) {
        return { x, y, cx: centerX, cy: centerY, r: radius };
      }
    }
    return null; // 找不到位置
  }

  async animateIn(el) {
    el.classList.add('active');

    // 標籤淡入
    const label = el.querySelector('.label');
    label.classList.add('visible');

    await this.delay(200);

    // 數字區塊顯示
    const growthDisplay = el.querySelector('.growth-display');
    growthDisplay.classList.add('visible');

    // 準備圓圈資料
    const row = el.querySelector('.person-row');
    const personCount = Math.min(Math.ceil(this.stats.followersCount / 150), 15);
    const colors = ['#5b6eae', '#6b8e7e', '#9b7e8e', '#7e8e5b', '#8e7e5b', '#5b8e8e', '#ae5b6e', '#6e8eae'];
    const containerW = 220;
    const containerH = 120;

    // 預先計算所有不重疊的位置
    const circleData = [];
    const existingCircles = [];
    for (let i = 0; i < personCount; i++) {
      const size = 20 + Math.random() * 18;
      const pos = this.findNonOverlappingPosition(size, existingCircles, containerW, containerH);
      if (pos) {
        existingCircles.push(pos);
        circleData.push({
          size,
          x: pos.x,
          y: pos.y,
          color: colors[Math.floor(Math.random() * colors.length)]
        });
      }
    }

    // 同步動畫：數字增長 + 圓圈冒泡
    const numEl = el.querySelector('.followers-number');
    const target = this.stats.followersCount;
    const duration = 1500;
    const startTime = performance.now();
    let addedCount = 0;

    const animate = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // 更新數字
      const currentValue = Math.floor(progress * target);
      numEl.textContent = currentValue.toLocaleString();

      // 根據進度新增圓圈
      const shouldHaveCircles = Math.floor(progress * circleData.length);
      while (addedCount < shouldHaveCircles && addedCount < circleData.length) {
        const data = circleData[addedCount];
        const person = document.createElement('div');
        person.className = 'person-icon';
        person.style.width = `${data.size}px`;
        person.style.height = `${data.size}px`;
        person.style.left = `${data.x}px`;
        person.style.top = `${data.y}px`;
        person.style.backgroundColor = data.color;
        row.appendChild(person);
        addedCount++;
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
