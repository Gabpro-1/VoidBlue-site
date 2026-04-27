// ===== VoidBlue shared helpers =====

function escapeHTML(text) {
  return String(text ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function formatInlineMarkdown(text) {
  return String(text)
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.*?)\*/g, "<em>$1</em>");
}

function formatMarkdown(text) {
  const safe = escapeHTML(text || "");
  const lines = safe.split(/\r?\n/);
  let html = "";
  let inList = false;

  function closeList() {
    if (inList) {
      html += "</ul>";
      inList = false;
    }
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("- ")) {
      if (!inList) {
        html += "<ul>";
        inList = true;
      }
      html += `<li>${formatInlineMarkdown(line.slice(2))}</li>`;
      continue;
    }

    closeList();

    if (line === "") {
      html += "<br>";
    } else if (line.startsWith("### ")) {
      html += `<h5>${formatInlineMarkdown(line.slice(4))}</h5>`;
    } else if (line.startsWith("## ")) {
      html += `<h4>${formatInlineMarkdown(line.slice(3))}</h4>`;
    } else if (line.startsWith("# ")) {
      html += `<h3>${formatInlineMarkdown(line.slice(2))}</h3>`;
    } else {
      html += `<p>${formatInlineMarkdown(line)}</p>`;
    }
  }

  closeList();
  return html;
}

function getLocalArray(key) {
  try {
    const value = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(value) ? value : [];
  } catch (error) {
    return [];
  }
}

function setLocalArray(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function getTodayText() {
  return new Date().toLocaleString();
}
