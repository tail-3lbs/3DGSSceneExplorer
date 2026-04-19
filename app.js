function groupByScene(items) {
  const grouped = new Map();
  for (const item of items) {
    if (!grouped.has(item.scene)) {
      grouped.set(item.scene, {
        key: item.scene,
        title: item.sceneTitle,
        description: item.sceneDescription,
        viewers: [],
      });
    }
    grouped.get(item.scene).viewers.push(item);
  }
  return Array.from(grouped.values());
}

function createFilterChip(label, value, activeValue, onClick) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "filter-chip";
  if (value === activeValue) {
    button.classList.add("is-active");
  }
  button.textContent = label;
  button.addEventListener("click", () => onClick(value));
  return button;
}

function renderFilters(sceneKeys, activeScene, onChange) {
  const filterBar = document.getElementById("filter-bar");
  if (!filterBar) return;
  filterBar.innerHTML = "";
  filterBar.appendChild(createFilterChip("All scenes", "all", activeScene, onChange));
  for (const sceneKey of sceneKeys) {
    const item = window.VIEWER_DATA.find((viewer) => viewer.scene === sceneKey);
    if (!item) continue;
    filterBar.appendChild(createFilterChip(item.sceneTitle, sceneKey, activeScene, onChange));
  }
}

function buildViewerCard(viewer) {
  const template = document.getElementById("viewer-card-template");
  if (!template) {
    throw new Error("Missing #viewer-card-template in index.html");
  }
  const fragment = template.content.cloneNode(true);

  fragment.querySelector(".viewer-type").textContent = viewer.kind;
  fragment.querySelector(".viewer-title").textContent = viewer.title;
  fragment.querySelector(".viewer-size").textContent = viewer.size;
  fragment.querySelector(".viewer-description").textContent = viewer.description;

  const tagRow = fragment.querySelector(".tag-row");
  viewer.tags.forEach((tagText) => {
    const tag = document.createElement("span");
    tag.className = "tag";
    tag.textContent = tagText;
    tagRow.appendChild(tag);
  });

  const link = fragment.querySelector(".viewer-link");
  link.href = viewer.href;
  link.textContent = "Open Viewer";

  return fragment;
}

function renderSceneList(activeScene) {
  const root = document.getElementById("scene-list");
  if (!root) return;
  root.innerHTML = "";

  const filtered = activeScene === "all"
    ? window.VIEWER_DATA
    : window.VIEWER_DATA.filter((viewer) => viewer.scene === activeScene);

  if (filtered.length === 0) {
    const empty = document.createElement("p");
    empty.className = "empty-state";
    empty.textContent = "No viewers match the current filter.";
    root.appendChild(empty);
    return;
  }

  const grouped = groupByScene(filtered);

  grouped.forEach((scene) => {
    const block = document.createElement("section");
    block.className = "scene-block";

    const header = document.createElement("div");
    header.className = "scene-header";

    const copy = document.createElement("div");
    const title = document.createElement("h3");
    title.textContent = scene.title;
    const description = document.createElement("p");
    description.className = "scene-description";
    description.textContent = scene.description;
    copy.append(title, description);

    const meta = document.createElement("div");
    meta.className = "scene-meta";
    meta.textContent = `${scene.viewers.length} viewer${scene.viewers.length === 1 ? "" : "s"}`;

    header.append(copy, meta);

    const grid = document.createElement("div");
    grid.className = "viewer-grid";
    scene.viewers.forEach((viewer) => {
      grid.appendChild(buildViewerCard(viewer));
    });

    block.append(header, grid);
    root.appendChild(block);
  });
}

function init() {
  if (!Array.isArray(window.VIEWER_DATA)) {
    throw new Error("VIEWER_DATA is missing. Ensure viewers-data.js loads before app.js.");
  }

  const sceneKeys = Array.from(new Set(window.VIEWER_DATA.map((viewer) => viewer.scene)));
  let activeScene = "all";

  const rerender = () => {
    renderFilters(sceneKeys, activeScene, (nextScene) => {
      activeScene = nextScene;
      rerender();
    });
    renderSceneList(activeScene);
  };

  rerender();
}

init();
