import * as THREE from 'three';

/**
 * Next-word prediction demo: word tiles on the table and red bars showing the
 * model's probabilities for the next word. The student (or Bıdık, always the
 * most likely word) picks each word. Canned data — the point is the shape of
 * the idea, not a real language model; every candidate fits every sentence.
 */
export const START = ['Mantı', 'en', 'güzel'];
export const STORY = [
  {
    candidates: [
      ['yoğurtla', 0.58],
      ['sarımsakla', 0.22],
      ['tereyağıyla', 0.13],
      ['sabahları', 0.06],
      ['uzayda', 0.01],
    ],
  },
  {
    candidates: [
      ['yenir', 0.64],
      ['buluşur', 0.15],
      ['sunulur', 0.12],
      ['tanışır', 0.08],
      ['uçar', 0.01],
    ],
  },
  {
    candidates: [
      ['.', 0.71],
      [',', 0.18],
      ['ve', 0.08],
      ['ama', 0.02],
      ['!', 0.01],
    ],
  },
  // the sentence is finished
  { candidates: [] },
];

function tileTexture(text, palette) {
  const c = document.createElement('canvas');
  c.width = 512;
  c.height = 256;
  const g = c.getContext('2d');
  g.fillStyle = '#ffffff';
  g.fillRect(0, 0, 512, 256);
  g.fillStyle = palette.ink;
  g.textAlign = 'center';
  g.textBaseline = 'middle';
  let size = 110;
  g.font = `600 ${size}px Fraunces, Georgia, serif`;
  while (g.measureText(text).width > 460 && size > 40) {
    size -= 6;
    g.font = `600 ${size}px Fraunces, Georgia, serif`;
  }
  g.fillText(text, 256, 134);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  return t;
}

export class TokenDemo extends THREE.Group {
  constructor({ palette }) {
    super();
    this.name = 'tokens';
    this.palette = palette;
    this.tiles = [];
    this.bars = [];
    this.stage = 0;
    this.picks = []; // { word, p, top } for every word chosen so far
    this.visible = false;
    this.tileW = 0.78;
    this.barMat = new THREE.MeshStandardMaterial({ color: palette.terracotta, roughness: 0.55 });
    this.barMatSoft = new THREE.MeshStandardMaterial({ color: palette.terracottaSoft, roughness: 0.7 });
    this.slotMat = new THREE.MeshStandardMaterial({ color: '#e5e7eb', roughness: 0.9 });
    this.build(0, false);
  }

  clear() {
    for (const t of this.tiles) this.remove(t);
    for (const b of this.bars) this.remove(b.group);
    this.tiles = [];
    this.bars = [];
  }

  build(stage, animate = true) {
    this.clear();
    this.stage = stage;
    const s = { prompt: this.prompt, candidates: STORY[stage].candidates };
    // a long sentence gets narrower tiles so the whole line stays on the table
    const W = s.prompt.length > 5 ? 0.64 : this.tileW;
    const gap = 0.12;
    const total = s.prompt.length * (W + gap) - gap;
    const x0 = -total / 2 + W / 2;
    s.prompt.forEach((word, i) => {
      const tile = new THREE.Group();
      const base = new THREE.Mesh(
        new THREE.BoxGeometry(W, 0.12, 0.42),
        new THREE.MeshPhysicalMaterial({ color: '#ffffff', roughness: 0.35, clearcoat: 0.8 })
      );
      base.castShadow = true;
      base.receiveShadow = true;
      const face = new THREE.Mesh(new THREE.PlaneGeometry(W * 0.94, 0.4 * 0.94), new THREE.MeshBasicMaterial({ map: tileTexture(word, this.palette), transparent: true }));
      face.rotation.x = -Math.PI / 2;
      face.position.y = 0.062;
      tile.add(base, face);
      tile.position.set(x0 + i * (W + gap), 0.06, 1.1);
      tile.userData.target = 1;
      tile.userData.scale = animate ? 0 : 1;
      tile.userData.delay = animate ? i * 0.08 : 0;
      tile.scale.setScalar(animate ? 0.001 : 1);
      this.add(tile);
      this.tiles.push(tile);
    });
    // the empty slot for the next word (none once the sentence is finished)
    const slot = new THREE.Mesh(new THREE.BoxGeometry(W, 0.06, 0.42), this.slotMat);
    slot.position.set(x0 + s.prompt.length * (W + gap), 0.03, 1.1);
    slot.receiveShadow = true;
    slot.visible = s.candidates.length > 0;
    this.add(slot);
    this.tiles.push(slot);
    slot.userData.target = 1;
    slot.userData.scale = 1;
    slot.userData.delay = 0;

    // probability bars behind the tiles
    const n = s.candidates.length;
    const spacing = 0.72;
    const bx0 = -((n - 1) * spacing) / 2;
    s.candidates.forEach(([word, p], i) => {
      const group = new THREE.Group();
      const h = Math.max(0.05, p * 1.9);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.42, 1, 0.42), i === 0 ? this.barMat : this.barMatSoft);
      bar.castShadow = true;
      bar.position.y = 0.5;
      group.add(bar);
      const label = new THREE.Mesh(new THREE.PlaneGeometry(0.66, 0.33), new THREE.MeshBasicMaterial({ map: tileTexture(word, this.palette), transparent: true }));
      label.rotation.x = -Math.PI / 2.6;
      label.position.set(0, 0.2, 0.42);
      group.add(label);
      const pct = new THREE.Mesh(new THREE.PlaneGeometry(0.5, 0.25), new THREE.MeshBasicMaterial({ map: tileTexture(`%${Math.round(p * 100)}`, this.palette), transparent: true }));
      pct.rotation.x = -Math.PI / 2;
      group.add(pct);
      group.userData.pct = pct;
      group.position.set(bx0 + i * spacing, 0, -0.4);
      group.userData.h = h;
      group.userData.cur = animate ? 0.001 : h;
      group.userData.delay = animate ? 0.3 + i * 0.08 : 0;
      bar.scale.y = group.userData.cur;
      this.add(group);
      this.bars.push({ group, bar, p, word });
    });
    this.time = 0;
  }

  /** The sentence so far: the start and the words chosen up to this stage. */
  get prompt() {
    return [...START, ...this.picks.slice(0, this.stage).map((k) => k.word)];
  }

  /** True when the sentence has all its words. */
  get finished() {
    return STORY[this.stage].candidates.length === 0;
  }

  /** Add a word (the most likely one when none is given) and move on; a
   *  finished sentence starts over (lesson 07 steps through it this way). */
  next(word) {
    if (this.finished) return this.reset();
    const c = STORY[this.stage].candidates;
    const pick = c.find(([w]) => w === word) || c[0];
    this.picks = [...this.picks.slice(0, this.stage), { word: pick[0], p: pick[1], top: pick === c[0] }];
    this.build(this.stage + 1, true);
  }

  /** Back to the start of the sentence. */
  reset(animate = true) {
    this.picks = [];
    this.build(0, animate);
  }

  get candidates() {
    return STORY[this.stage].candidates;
  }

  update(dt) {
    this.time += dt;
    for (const t of this.tiles) {
      const u = t.userData;
      if (this.time < u.delay) continue;
      u.scale += (u.target - u.scale) * Math.min(1, dt * 8);
      const s = Math.max(0.001, u.scale);
      t.scale.setScalar(s);
    }
    for (const b of this.bars) {
      const u = b.group.userData;
      if (this.time < u.delay) continue;
      u.cur += (u.h - u.cur) * Math.min(1, dt * 5);
      b.bar.scale.y = Math.max(0.001, u.cur);
      u.pct.position.y = u.cur + 0.02;
    }
  }
}
