import { StoryEngine } from "./stories/StoryEngine.js";

function renderStoryError(container, message) {
  const errorWrapper = document.createElement("div");
  errorWrapper.className = "story-error";

  const card = document.createElement("div");
  card.className = "story-error__card";

  const title = document.createElement("h2");
  title.textContent = "載入故事流時發生錯誤";

  const detail = document.createElement("p");
  detail.textContent = message || "未知錯誤";

  const button = document.createElement("button");
  button.className = "story-error__button";
  button.type = "button";
  button.textContent = "返回首頁";
  button.addEventListener("click", () => {
    window.location.href = "index.html";
  });

  card.append(title, detail, button);
  errorWrapper.append(card);
  container.innerHTML = "";
  container.append(errorWrapper);
}

document.addEventListener("DOMContentLoaded", async () => {
  const container = document.getElementById("story-container");

  if (!container) {
    console.error("Story container not found");
    return;
  }

  const statsJson = localStorage.getItem("threadsStats");
  if (!statsJson) {
    alert("找不到統計資料，請重新上傳檔案");
    window.location.href = "index.html";
    return;
  }

  let stats;
  try {
    stats = JSON.parse(statsJson);
  } catch (error) {
    console.error("Invalid stats JSON:", error);
    renderStoryError(container, "統計資料格式錯誤");
    return;
  }

  try {
    const storyEngine = new StoryEngine(container, stats);
    await storyEngine.init();

    storyEngine.onComplete = () => {
      window.location.href = "result.html";
    };

    window.addEventListener("showSummary", () => {
      window.location.href = "result.html";
    });
  } catch (error) {
    console.error("Story flow error:", error);
    renderStoryError(container, error.message);
  }
});
