gsap.registerPlugin(ScrollTrigger);

/* =====================================================
   LENIS GLOBAL
===================================================== */

const lenis = new Lenis({

  duration: 1.2,

  smoothWheel: true,

  smoothTouch: false,

  wheelMultiplier: 0.75,

  touchMultiplier: 1.5,

  infinite: false

});

/* =====================================================
   GSAP + LENIS SYNC
===================================================== */

lenis.on("scroll", ScrollTrigger.update);

gsap.ticker.add((time) => {

  lenis.raf(time * 1000);

});

gsap.ticker.lagSmoothing(0);

/* =====================================================
   CONFIG
===================================================== */

const frameCount = 70;
/* const midFrame = Math.floor(frameCount / 2); */
const midFrame = Math.floor(frameCount * 0.25);

/* =====================================================
   DOM
===================================================== */

const hero = document.querySelector(".hero");

const canvas = document.getElementById("hero-canvas");
const ctx = canvas.getContext("2d");

const main = document.querySelector(".hero-title");
const secondary = document.querySelector(".hero-secondary");

/* =====================================================
   LENIS (PRO SYNC)
===================================================== */



/* =====================================================
   SCROLL LOCK
===================================================== */

/* document.body.style.overflow = "hidden"; */

/* =====================================================
   RESIZE
===================================================== */

function resize() {

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

}

resize();

window.addEventListener("resize", resize);

/* =====================================================
   FRAMES
===================================================== */

const images = [];
const seq = { frame: 0 };

for (let i = 0; i < frameCount; i++) {

  const img = new Image();

/* Borrar para anterior */
  const realFrame = (i * 3) + 1;

img.src =
  `./assets/frames/comp/frame_${String(realFrame).padStart(4, "0")}.webp`;


/*   img.src =
    `./assets/frames/frame_${String(i + 1).padStart(4, "0")}.jpg`; */

  images.push(img);

}

/* =====================================================
   DRAW ENGINE
===================================================== */

function draw(i) {

  const img = images[i];

  if (!img || !img.complete) return;

  ctx.clearRect(
    0,
    0,
    canvas.width,
    canvas.height
  );

  const canvasRatio =
    canvas.width / canvas.height;

  const imageRatio =
    img.width / img.height;

  let w;
  let h;

  if (imageRatio < canvasRatio) {

    w = canvas.width;
    h = w / imageRatio;

  } else {

    h = canvas.height;
    w = h * imageRatio;

  }

  /* cinematic zoom */

  const p = i / frameCount;

  const scale =
    1.06 - p * 0.06;

  w *= scale;
  h *= scale;

  const x =
    (canvas.width - w) / 2;

  /*   const y =
      (canvas.height - h) / 2
      - p * 80; */

  const y =
    (canvas.height - h) / 3;

  ctx.drawImage(img, x, y, w, h);

}

/* =====================================================
   FIRST FRAME
===================================================== */

images[0].onload = () => draw(0);

setTimeout(() => {
  draw(0);
}, 200);

/* =====================================================
   FRAME SCRUB
===================================================== */

let last = -1;

gsap.to(seq, {

  frame: frameCount - 1,

  snap: "frame",

  ease: "none",

  scrollTrigger: {

    trigger: ".hero",

    start: "top top",

    end: "+=800",

    scrub: 0.6,

    pin: true,

    anticipatePin: 1
  },

  onUpdate: () => {

    const f =
      Math.floor(seq.frame);

    if (f !== last) {

      draw(f);

      last = f;

    }

    updateText(f);

  }

});

/* =====================================================
   INTRO ANIMATION
===================================================== */

/* gsap.fromTo(main,

  {
    opacity: 0,
    filter: "blur(12px)"
  },

  {
    opacity: 1,
    filter: "blur(0px)",

    duration: 1,

    ease: "expo.out",

    onComplete: unlockScroll
  }

);
 */
/* =====================================================
   UNLOCK SCROLL
===================================================== */

function unlockScroll() {

  initLenis();

  ScrollTrigger.refresh();

}

/* =====================================================
   TEXT SYSTEM
===================================================== */

function updateText(frame) {

  /* =====================
     FIRST HALF
  ===================== */

  if (frame < midFrame) {

    const t =
      frame / midFrame;

    gsap.set(main, {

      opacity: 1 - t,

      x: -40 * t,

      filter:
        `blur(${t * 6}px)`

    });

    gsap.set(secondary, {

      opacity: 0,

      x: 80

    });

  }

  /* =====================
     SECOND HALF
  ===================== */

  else {

    const t =
      (frame - midFrame) / midFrame;

    gsap.set(main, {

      opacity: 0

    });

    gsap.set(secondary, {

      opacity: t,

      x: 80 - (80 * t),

      filter:
        `blur(${(1 - t) * 6}px)`

    });

  }

}


/* =========================
   SCROLL INDICATOR LOOP
========================= */

gsap.to(".scroll-dot", {
  y: 90,
  duration: 1.8,
  repeat: -1,
  ease: "power1.inOut"
});

/* =========================
   FADE OUT ON SCROLL
========================= */

gsap.to(".scroll-indicator", {
  opacity: 0,
  y: 20,
  ease: "power2.out",

  scrollTrigger: {
    trigger: ".hero",
    start: "top top",
    end: "20% top",
    scrub: true
  }
});


/* =====================================================
   ABOUT IMAGE PARALLAX
===================================================== */

gsap.utils.toArray('.img-container').forEach(container => {

    const img = container.querySelector('img');

    const tl = gsap.timeline({

        scrollTrigger: {
            trigger: container,

            start: "top bottom",
            end: "bottom top",

            scrub: 1.2
        }

    });

    tl.fromTo(img,

        {
            yPercent: -15
        },

        {
            yPercent: 30,
            ease: "none"
        }

    );

});


/* =====================================================
   TRUCK PARALLAX SCROLL
===================================================== */

gsap.fromTo(".truck-parallax",

    {
        x: -100
    },

    {
        x: 1400,

        ease: "none",

        scrollTrigger: {

            trigger: ".testimonial-wrapper",

            start: "top bottom",
            end: "bottom top",

            scrub: 1.5
        }

    }

);


/* =====================================================
   REFRESH
===================================================== */

ScrollTrigger.refresh();







document.querySelectorAll('a[href^="#"]').forEach((link) => {
  link.addEventListener('click', (e) => {
    const id = link.getAttribute('href')
    const target = document.querySelector(id)

    if (!target) return

    e.preventDefault()

    lenis.scrollTo(target, {
      offset: -80, // ajusta si tienes navbar fija
      duration: 1.5,
    })
  })
})