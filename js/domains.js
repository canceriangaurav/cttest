gsap.registerPlugin(ScrollTrigger);

gsap.defaults({
  ease: "power3.out",
  duration: 0.8
});

/* =========================
   AUDIO ENGINE (STABLE)
========================= */

let firedSounds = new Set();
let currentAmbience = "projector";

function playOnce(id, sound) {
  if (scrollDirection !== 1) return;
  if (firedSounds.has(id)) return;

  if (window.ChronotalesAudio?.isEnabled()) {
    ChronotalesAudio.play(sound);
  }

  firedSounds.add(id);
}

function switchAmbience(type) {
  if (!window.ChronotalesAudio?.isEnabled()) return;
  if (currentAmbience === type) return;

  // STOP EVERYTHING FIRST
  ChronotalesAudio.stopLoop("orbit_ambience");
  ChronotalesAudio.stopLoop("projector_hum");
  ChronotalesAudio.stopLoop("film_reel");

  if (type === "orbit") {
    ChronotalesAudio.play("orbit_ambience");
  } else {
    ChronotalesAudio.play("projector_hum");
  }

  currentAmbience = type;
}

/* reset sounds when user scrolls to top */
ScrollTrigger.create({
  trigger: "#cinematic-wrapper",
  start: "top top",
  onLeaveBack: () => {
    firedSounds.clear();
    switchAmbience("projector");
  }
});

/* =========================
   SCROLL DIRECTION
========================= */

let scrollDirection = 1;

ScrollTrigger.create({
  trigger: "#cinematic-wrapper",
  start: "top top",
  end: "bottom bottom",
  onUpdate: self => {
    scrollDirection = self.direction;
  }
});

/* =========================
   STAGE
========================= */

const stage = document.getElementById("cinematic-stage");

function add(el){
  stage.appendChild(el);
  return el;
}

const lightSweep = document.getElementById("lightSweep");

const t1a = add(createText("NOT A PIPELINE"));
const t1b = add(createText("NEVER WAS"));

const t2a = add(createText("A SYSTEM"));
const t2b = add(createText("BUILT IN LAYERS"));
const t2c = add(createText("CONNECTED"));

const t3a = add(createText("YOU DON’T FOLLOW IT"));
const t3b = add(createText("YOU ENTER IT"));

const line = add(createLine());
const lines = add(createLines());
const square = add(createSquare());
const grid = add(createGrid());

gsap.set(grid, { opacity: 0, pointerEvents: "none" });

/* =========================
   TIMELINE
========================= */

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: "#cinematic-wrapper",
    start: "top top",
    end: "+=9000",
    scrub: 1,
    pin: true
  }
});

/* =========================
   SCENE 1
========================= */

tl.add(() => playOnce("film", "film_reel"))

.fromTo(t1a,{opacity:0,scale:0.8},{opacity:1,scale:1})

.to({}, {duration:1})

.add(() => playOnce("morph", "brand_simplified"))

.to(t1a,{opacity:0,y:-40}, "<")
.fromTo(t1b,{opacity:0,y:40},{opacity:1,y:0}, "<")

.to({}, {duration:1})
.to([t1a,t1b],{opacity:0,letterSpacing:"20px"});

/* =========================
   SCENE 2
========================= */

tl.add(() => playOnce("system", "team_connection"))

.fromTo(t2a,{opacity:0},{opacity:1})
.fromTo(line,{opacity:0,scaleX:0.5},{opacity:1,scaleX:1},"<")

.to({}, {duration:1})

.add(() => playOnce("layers", "constellation"))

.to(t2a,{opacity:0})
.fromTo(t2b,{opacity:0},{opacity:1},"<")

.to(line,{opacity:0},"<")
.to(lines,{opacity:1},"<")

.to({}, {duration:1})

.to(t2b,{opacity:0})
.fromTo(t2c,{opacity:0},{opacity:1},"<")

.to(lines,{opacity:0,scale:2})
.fromTo(square,{opacity:0,scale:0.5},{opacity:1,scale:1},"<")

.to({}, {duration:1})
.to(t2c,{opacity:0});

/* =========================
   SCENE 3
========================= */

tl.fromTo(t3a,{opacity:0},{opacity:1})

.to(square,{x:120,y:-80,duration:2,yoyo:true,repeat:1},"<")

.to({}, {duration:1})

.to(t3a,{opacity:0})
.to(square,{x:0,y:0})

.fromTo(t3b,{opacity:0,scale:0.5},{opacity:1,scale:1})

.add(() => playOnce("boom", "explosion"))

.to(square,{scale:6,opacity:0},"<")
.to(t3b,{scale:2,opacity:0})

.add(() => playOnce("close", "closing"));

/* =========================
   SCENE 4 (GRID + AUDIO FIXED)
========================= */

tl.add(() => switchAmbience("orbit"))

.to(grid, {
  opacity: 1,
  duration: 1,

  onStart: () => {
    grid.style.pointerEvents = "auto";
  },

  onReverseComplete: () => {
    grid.style.pointerEvents = "none";
    switchAmbience("projector");
  }
})

.to(".card video",{opacity:0.85,stagger:0.2})
.to(".card-text h2",{opacity:1,y:0,stagger:0.2})
.to(".card-text p",{opacity:1,y:0,stagger:0.2}, "-=0.6")

.to({}, {duration:3});

/* =========================
   HELPERS
========================= */

function createText(txt){
  const d=document.createElement("div");
  d.className="text";
  d.innerText=txt;
  return d;
}

function createLine(){
  const d=document.createElement("div");
  d.className="line";
  return d;
}

function createLines(){
  const d=document.createElement("div");
  d.className="lines";
  for(let i=0;i<4;i++){
    d.appendChild(document.createElement("div"));
  }
  return d;
}

function createSquare(){
  const d=document.createElement("div");
  d.id="square";
  return d;
}

function createGrid(){
  const g = document.createElement("div");
  g.id = "grid";

  const data = [
    { key:"creative", title:"CREATIVE", sub:"Where Ideas Take Form" },
    { key:"strategic", title:"STRATEGIC", sub:"Structure, Clarity, Hold" },
    { key:"digital", title:"DIGITAL", sub:"Motion, Data, Realtime" },
    { key:"physical", title:"PHYSICAL", sub:"Touchable, Visible, Unignorable" }
  ];

  data.forEach(item => {
    const c=document.createElement("div");
    c.className="card";

    const v=document.createElement("video");
    v.src=`assets/videos/${item.key}.mp4`;
    v.autoplay=true;
    v.loop=true;
    v.muted=true;
    v.playsInline=true;

    const textWrap=document.createElement("div");
    textWrap.className="card-text";

    const title=document.createElement("h2");
    title.innerText=item.title;

    const sub=document.createElement("p");
    sub.innerText=item.sub;

    textWrap.appendChild(title);
    textWrap.appendChild(sub);

    c.appendChild(v);
    c.appendChild(textWrap);

    /* HOVER SOUND */
    c.addEventListener("mouseenter", () => {
      if (g.style.pointerEvents === "none") return;
      ChronotalesAudio.play("card_hover");
    });

    /* CLICK */
    c.onclick = () => {
      if (g.style.pointerEvents === "none") return;

      ChronotalesAudio.play("cta_click");
      setTimeout(() => location.href = `${item.key}.html`, 200);
    };

    g.appendChild(c);
  });

  return g;
}

/* =========================
   FOOTER
========================= */

gsap.from(".creative-footer", {
  opacity: 0,
  y: 80,
  duration: 1,
  scrollTrigger: {
    trigger: ".creative-footer",
    start: "top 90%"
  }
});

document.getElementById("currentYear").innerText = new Date().getFullYear();

/* INITIAL AMBIENCE */
if (window.ChronotalesAudio?.isEnabled()) {
  ChronotalesAudio.play("projector_hum");
}