const themes = ["light", "dark", "system"];

const icons = {
  light: `
        <svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="5"></circle>
            <line x1="12" y1="1" x2="12" y2="3"></line>
            <line x1="12" y1="21" x2="12" y2="23"></line>
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
            <line x1="1" y1="12" x2="3" y2="12"></line>
            <line x1="21" y1="12" x2="23" y2="12"></line>
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
    `,
  dark: `
        <svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
    `,
  system: `
        <svg class="theme-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
        </svg>
    `,
};

function initTheme() {
  const savedTheme = localStorage.getItem("theme") || "system";
  setTheme(savedTheme);
}

function setTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
  updateThemeIcon(theme);
}

function updateThemeIcon(theme) {
  const button = document.querySelector(".theme-toggle");
  const label = document.querySelector(".theme-label");

  if (button && label) {
    button.innerHTML =
      icons[theme] +
      `<span class="theme-label" aria-hidden="true">${theme}</span>`;
    button.setAttribute("aria-label", `Switch to ${getNextTheme(theme)} theme`);
  }
}

function getNextTheme(currentTheme) {
  const nextIndex = (themes.indexOf(currentTheme) + 1) % themes.length;
  return themes[nextIndex];
}

function toggleTheme() {
  const currentTheme = localStorage.getItem("theme") || "system";
  setTheme(getNextTheme(currentTheme));
}

document.addEventListener("DOMContentLoaded", initTheme);

document.addEventListener("click", (e) => {
  if (e.target.closest(".theme-toggle")) {
    toggleTheme();
  }
});
