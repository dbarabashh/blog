class CodeBlockEnhancer {
  constructor() {
    this.init();
  }

  init() {
    this.enhanceCodeBlocks();
    this.setupEventListeners();
  }

  enhanceCodeBlocks() {
    const codeBlocks = document.querySelectorAll("pre");
    codeBlocks.forEach((block) => {
      if (block.dataset.enhanced) return;
      const toolbar = this.createToolbar();
      block.insertBefore(toolbar, block.firstChild);
      block.dataset.enhanced = "true";
    });
  }

  createToolbar() {
    const toolbar = document.createElement("div");
    toolbar.className = "code-toolbar";

    const copyButton = document.createElement("button");
    copyButton.className = "code-button copy-button";
    copyButton.innerHTML = `
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
        <path fill="currentColor" d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 0 1 0 1.5h-1.5a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-1.5a.75.75 0 0 1 1.5 0v1.5A1.75 1.75 0 0 1 9.25 16h-7.5A1.75 1.75 0 0 1 0 14.25Z"></path>
        <path fill="currentColor" d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0 1 14.25 11h-7.5A1.75 1.75 0 0 1 5 9.25Zm1.75-.25a.25.25 0 0 0-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 0 0 .25-.25v-7.5a.25.25 0 0 0-.25-.25Z"></path>
      </svg>
      <span class="sr-only">Copy code</span>
    `;
    copyButton.setAttribute("aria-label", "Copy code");

    const fullscreenButton = document.createElement("button");
    fullscreenButton.className = "code-button fullscreen-button";
    fullscreenButton.innerHTML = `
      <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
        <path fill="currentColor" d="M3.25 7a.75.75 0 0 1 .75.75v2.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2.5 10.25v-2.5A.75.75 0 0 1 3.25 7Zm9.5 0a.75.75 0 0 1 .75.75v2.5A1.75 1.75 0 0 1 11.75 12h-2.5a.75.75 0 0 1 0-1.5h2.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 .75-.75ZM3.25 2a.75.75 0 0 1 .75.75v2.5c0 .138.112.25.25.25h2.5a.75.75 0 0 1 0 1.5h-2.5A1.75 1.75 0 0 1 2.5 5.25v-2.5A.75.75 0 0 1 3.25 2Zm9.5 0a.75.75 0 0 1 .75.75v2.5A1.75 1.75 0 0 1 11.75 7h-2.5a.75.75 0 0 1 0-1.5h2.5a.25.25 0 0 0 .25-.25v-2.5a.75.75 0 0 1 .75-.75Z"></path>
      </svg>
      <span class="sr-only">View fullscreen</span>
    `;
    fullscreenButton.setAttribute("aria-label", "View fullscreen");

    toolbar.appendChild(copyButton);
    toolbar.appendChild(fullscreenButton);

    return toolbar;
  }

  setupEventListeners() {
    document.addEventListener("click", (e) => {
      const copyButton = e.target.closest(".copy-button");
      const fullscreenButton = e.target.closest(".fullscreen-button");

      if (copyButton) this.handleCopy(copyButton);
      else if (fullscreenButton) this.handleFullscreen(fullscreenButton);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const modal = document.querySelector(".code-fullscreen-modal");
        if (modal) modal.remove();
      }
    });
  }

  clearExistingAnimations(button) {
    const existingAnim = button.querySelector(".copy-success-animation");
    const existingTooltip = button.querySelector(".copy-tooltip");
    if (existingAnim) existingAnim.remove();
    if (existingTooltip) existingTooltip.remove();
  }

  createSuccessAnimation() {
    const successAnim = document.createElement("div");
    successAnim.className = "copy-success-animation";

    const ripple = document.createElement("span");
    ripple.className = "copy-ripple";

    const checkmark = document.createElement("svg");
    checkmark.className = "copy-checkmark";
    checkmark.setAttribute("viewBox", "0 0 24 24");
    checkmark.innerHTML =
      '<path d="M4 12l5 5L20 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>';

    successAnim.appendChild(ripple);
    successAnim.appendChild(checkmark);
    return successAnim;
  }

  createTooltip(message, isError = false) {
    const tooltip = document.createElement("div");
    tooltip.className = `copy-tooltip${isError ? " error" : ""}`;
    tooltip.setAttribute("role", isError ? "alert" : "status");
    tooltip.setAttribute("aria-live", "polite");
    tooltip.textContent = message;
    tooltip.style.opacity = "0";
    tooltip.style.transform = "translateX(-50%) translateY(4px)";
    return tooltip;
  }

  async handleCopy(button) {
    const pre = button.closest("pre");
    const code = pre.querySelector("code");
    const text = code.textContent;

    try {
      await navigator.clipboard.writeText(text);
      this.clearExistingAnimations(button);

      const successAnim = this.createSuccessAnimation();
      const tooltip = this.createTooltip("Copied to clipboard");

      button.appendChild(successAnim);
      button.appendChild(tooltip);

      requestAnimationFrame(() => {
        successAnim.classList.add("active");
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translateX(-50%) translateY(0)";
      });

      button.classList.add("copied");

      setTimeout(() => {
        tooltip.style.opacity = "0";
        tooltip.style.transform = "translateX(-50%) translateY(-8px)";
        successAnim.style.opacity = "0";

        setTimeout(() => {
          successAnim.remove();
          tooltip.remove();
          button.classList.remove("copied");
        }, 300);
      }, 1500);
    } catch (err) {
      console.error("Failed to copy:", err);
      this.clearExistingAnimations(button);

      const tooltip = this.createTooltip("Failed to copy", true);
      button.appendChild(tooltip);

      requestAnimationFrame(() => {
        tooltip.style.opacity = "1";
        tooltip.style.transform = "translateX(-50%) translateY(0)";
      });

      setTimeout(() => {
        tooltip.style.opacity = "0";
        tooltip.style.transform = "translateX(-50%) translateY(-8px)";
        setTimeout(() => tooltip.remove(), 300);
      }, 1500);
    }
  }

  handleFullscreen(button) {
    const pre = button.closest("pre");
    const code = pre.querySelector("code");

    const modal = document.createElement("div");
    modal.className = "code-fullscreen-modal";
    modal.innerHTML = `
      <div class="code-fullscreen-content">
        <div class="code-fullscreen-header">
          <button class="code-button close-button" aria-label="Close fullscreen view">
            <svg aria-hidden="true" height="16" viewBox="0 0 16 16" width="16">
              <path fill="currentColor" d="M3.72 3.72a.75.75 0 0 1 1.06 0L8 6.94l3.22-3.22a.75.75 0 1 1 1.06 1.06L9.06 8l3.22 3.22a.75.75 0 1 1-1.06 1.06L8 9.06l-3.22 3.22a.75.75 0 0 1-1.06-1.06L6.94 8 3.72 4.78a.75.75 0 0 1 0-1.06z"></path>
            </svg>
          </button>
        </div>
        <pre class="code-fullscreen-pre"><code class="${code.className}">${code.innerHTML}</code></pre>
      </div>
    `;

    document.body.appendChild(modal);

    const closeButton = modal.querySelector(".close-button");
    closeButton.addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.remove();
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  new CodeBlockEnhancer();
});
