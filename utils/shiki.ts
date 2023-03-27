const HTML_ENTITIES: Record<string, string> = {
  "<": "&lt;",
  ">": "&gt;",
  "&": "&amp;",
  "'": "&apos;",
  '"': "&quot;",
};

function escapeHtml(text: string) {
  return text.replaceAll(/["&'<>]/g, (ch) => HTML_ENTITIES[ch] || "");
}

const loadShiki = async () => {
  const r = await import("shiki-es");
  r.setCDN("/shiki/");
  const shiki = await r.getHighlighter({
    themes: ["vitesse-dark"],
    langs: ["js", "css", "html", "ts"],
  });
  shiki.loadLanguage("html");

  return shiki;
};

export const highlightCode = async (code: string) => {
  const shiki = await loadShiki();
  if (!shiki) return escapeHtml(code);

  return shiki.codeToHtml(code, {
    lang: "ts",
    theme: "vitesse-dark",
  });
};
