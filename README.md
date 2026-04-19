# 3DGS Scene Explorer

Static landing page for curated 3D Gaussian Splatting viewers.

## Repo contents

- `index.html`: landing page
- `styles.css`: site styling
- `app.js`: catalog rendering and scene filtering
- `viewers-data.js`: viewer metadata
- `viewers/`: standalone exported Plotly HTML viewers

## Notes

- This repo is intentionally static: no build step, framework, or package manager is required.
- The bundled Plotly viewer HTML files are large, so the repository size will grow quickly as more scenes are added.
- When adding a new viewer, update both `viewers/` and `viewers-data.js`.

## Local testing

Serve the folder with a local static server from the repo root:

```bash
cd /home/jiaqi/workspace/3dgs-scene-explorer
python -m http.server 8000
```

Then open:

```text
http://127.0.0.1:8000
```

The landing page reads metadata from `viewers-data.js`, and the viewer links open the copied standalone HTML files directly from `viewers/`.
