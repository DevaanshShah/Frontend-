# Next Earth (React + R3F)

This subproject ports your existing three.js Earth to React Three Fiber with scroll-driven transitions using Framer Motion.

## Getting Started

1. Install dependencies

```bash
npm install
```

2. Move textures from the root project into the Next.js public folder:

- Copy everything from `../textures/` into `public/textures/` here (preserve subfolders like `stars/`).

Resulting paths should look like:

```
next-earth/public/textures/
  00_earthmap1k.jpg
  01_earthbump1k.jpg
  02_earthspec1k.jpg
  03_earthlights1k.jpg
  04_earthcloudmap.jpg
  05_earthcloudmaptrans.jpg
  stars/circle.png
```

3. Run the dev server

```bash
npm run dev
```

Then open http://localhost:3000

## Notes
- The globe layers include: diffuse, specular, bump, night lights, clouds with alpha, and a Fresnel rim glow.
- A starfield point cloud is added to match the original project.
- Scroll transitions horizontally slide the Earth between sections.
