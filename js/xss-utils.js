/**
 * xss-utils.js - XSS 防護工具
 */

/**
 * 將 HTML 特殊字元轉義，防止 XSS 攻擊
 * @param {string} str - 需要轉義的字串
 * @returns {string} - 轉義後的字串
 */
export function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}
