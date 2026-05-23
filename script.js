document.documentElement.classList.add("js");

const header = document.querySelector("[data-header]");
const loader = document.querySelector("[data-loader]");
const loaderCount = document.querySelector("[data-loader-count]");
const loaderBar = document.querySelector("[data-loader-bar]");
const loaderMessage = document.querySelector("[data-loader-message]");
const cursorDot = document.querySelector("[data-cursor-dot]");
const cursorRing = document.querySelector("[data-cursor-ring]");
const cursorText = document.querySelector("[data-cursor-text]");
const matrixCanvas = document.querySelector("[data-matrix-bg]");
const particleCanvas = document.querySelector("[data-particle-bg]");
const navToggle = document.querySelector("[data-nav-toggle]");
const navLinks = document.querySelector("[data-nav-links]");
const navItems = [...document.querySelectorAll(".nav-links a")];
const year = document.querySelector("[data-year]");
const form = document.querySelector("[data-contact-form]");
const formStatus = document.querySelector("[data-form-status]");

if (loader) {
  document.body.classList.add("is-loading");

  let progress = 0;
  let loaded = document.readyState === "complete";
  const loaderStart = performance.now();
  const loaderDuration = 1600;
  const loaderMessages = [
    "Initializing secure interface",
    "Loading professional shell",
    "Preparing project modules",
    "Activating clean cursor",
    "Access granted",
  ];

  const updateLoader = () => {
    if (loaderCount) loaderCount.textContent = `${progress}%`;
    if (loaderBar) loaderBar.style.width = `${progress}%`;
    if (loaderMessage) {
      const messageIndex = Math.min(
        loaderMessages.length - 1,
        Math.floor((progress / 100) * loaderMessages.length)
      );
      loaderMessage.textContent = loaderMessages[messageIndex];
    }
  };

  window.addEventListener("load", () => {
    loaded = true;
  });

  const timer = setInterval(() => {
    const elapsed = performance.now() - loaderStart;
    const timedProgress = Math.floor((elapsed / loaderDuration) * 100);
    const limit = loaded ? 100 : 92;
    progress = Math.min(limit, Math.max(progress + 1, timedProgress));
    updateLoader();

    if (progress >= 100 && elapsed >= loaderDuration) {
      clearInterval(timer);
      setTimeout(() => {
        document.body.classList.remove("is-loading");
        document.body.classList.add("is-loaded");
        loader.setAttribute("aria-hidden", "true");
      }, 380);
    }
  }, 95);

  updateLoader();
}

if (year) {
  year.textContent = new Date().getFullYear();
}

const syncHeader = () => {
  if (!header) return;
  header.classList.toggle("scrolled", window.scrollY > 18);
};

syncHeader();
window.addEventListener("scroll", syncHeader, { passive: true });

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navLinks.classList.toggle("is-open", !isOpen);
    document.body.classList.toggle("nav-open", !isOpen);
  });

  navItems.forEach((item) => {
    item.addEventListener("click", () => {
      navToggle.setAttribute("aria-expanded", "false");
      navLinks.classList.remove("is-open");
      document.body.classList.remove("nav-open");
    });
  });
}

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.14 }
);

document.querySelectorAll(".reveal").forEach((element) => {
  revealObserver.observe(element);
});

const sectionObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const activeLink = document.querySelector(`.nav-links a[href="#${entry.target.id}"]`);
      navItems.forEach((item) => item.classList.toggle("active", item === activeLink));
    });
  },
  {
    rootMargin: "-36% 0px -58% 0px",
    threshold: 0,
  }
);

document.querySelectorAll("main section[id]").forEach((section) => {
  sectionObserver.observe(section);
});

const canUseCustomCursor = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

if (canUseCustomCursor && cursorDot && cursorRing) {
  document.body.classList.add("cursor-ready");

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let ringX = mouseX;
  let ringY = mouseY;

  const moveCursor = (event) => {
    mouseX = event.clientX;
    mouseY = event.clientY;
    cursorDot.style.left = `${mouseX}px`;
    cursorDot.style.top = `${mouseY}px`;
  };

  const animateCursor = () => {
    ringX += (mouseX - ringX) * 0.17;
    ringY += (mouseY - ringY) * 0.17;
    cursorRing.style.left = `${ringX}px`;
    cursorRing.style.top = `${ringY}px`;
    requestAnimationFrame(animateCursor);
  };

  window.addEventListener("pointermove", moveCursor, { passive: true });
  animateCursor();

  document.querySelectorAll("a, button, [data-cursor]").forEach((item) => {
    item.addEventListener("pointerenter", () => {
      document.body.classList.add("cursor-active");
      if (cursorText) cursorText.textContent = item.dataset.cursor || "";
    });

    item.addEventListener("pointerleave", () => {
      document.body.classList.remove("cursor-active");
      if (cursorText) cursorText.textContent = "";
    });
  });

  document.querySelectorAll("input, textarea").forEach((field) => {
    field.addEventListener("pointerenter", () => {
      document.body.classList.add("cursor-hidden");
    });

    field.addEventListener("pointerleave", () => {
      document.body.classList.remove("cursor-hidden");
    });
  });
}

if (form && formStatus) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const name = data.get("name");
    const email = data.get("email");
    const message = data.get("message");
    const subject = encodeURIComponent(`Portfolio contact - ${name}`);
    const body = encodeURIComponent(`${message}\n\nFrom: ${name}\nEmail: ${email}`);

    formStatus.textContent = "Opening your email app...";
    window.location.href = `mailto:moujtahidadam5@gmail.com?subject=${subject}&body=${body}`;
  });
}

if (matrixCanvas) {
  const context = matrixCanvas.getContext("2d");
  const glyphs = "01{}[]<>$#@/\\|SECURITYLINUXDJANGOGITJAVA";
  const fontSize = 16;
  let drops = [];

  const resizeMatrix = () => {
    const ratio = window.devicePixelRatio || 1;
    matrixCanvas.width = Math.floor(window.innerWidth * ratio);
    matrixCanvas.height = Math.floor(window.innerHeight * ratio);
    matrixCanvas.style.width = `${window.innerWidth}px`;
    matrixCanvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    drops = Array.from({ length: Math.ceil(window.innerWidth / fontSize) }, () =>
      Math.random() * window.innerHeight
    );
  };

  const drawMatrix = () => {
    context.fillStyle = "rgba(2, 4, 3, 0.08)";
    context.fillRect(0, 0, window.innerWidth, window.innerHeight);
    context.fillStyle = "rgba(77, 255, 154, 0.58)";
    context.font = `${fontSize}px ui-monospace, SFMono-Regular, Menlo, monospace`;

    drops.forEach((drop, index) => {
      const char = glyphs[Math.floor(Math.random() * glyphs.length)];
      const x = index * fontSize;
      context.fillText(char, x, drop);
      drops[index] = drop > window.innerHeight + Math.random() * 700 ? 0 : drop + fontSize;
    });

    window.setTimeout(() => requestAnimationFrame(drawMatrix), 48);
  };

  resizeMatrix();
  drawMatrix();
  window.addEventListener("resize", resizeMatrix, { passive: true });
}

if (particleCanvas) {
  const context = particleCanvas.getContext("2d");
  let particles = [];

  const resizeParticles = () => {
    const ratio = window.devicePixelRatio || 1;
    particleCanvas.width = Math.floor(window.innerWidth * ratio);
    particleCanvas.height = Math.floor(window.innerHeight * ratio);
    particleCanvas.style.width = `${window.innerWidth}px`;
    particleCanvas.style.height = `${window.innerHeight}px`;
    context.setTransform(ratio, 0, 0, ratio, 0, 0);
    particles = Array.from({ length: Math.max(32, Math.floor(window.innerWidth / 22)) }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      r: Math.random() * 1.8 + 0.6,
      dx: (Math.random() - 0.5) * 0.32,
      dy: (Math.random() - 0.5) * 0.32,
      alpha: Math.random() * 0.34 + 0.1,
    }));
  };

  const drawParticles = () => {
    context.clearRect(0, 0, window.innerWidth, window.innerHeight);

    particles.forEach((particle) => {
      particle.x += particle.dx;
      particle.y += particle.dy;
      if (particle.x < 0 || particle.x > window.innerWidth) particle.dx *= -1;
      if (particle.y < 0 || particle.y > window.innerHeight) particle.dy *= -1;

      context.beginPath();
      context.arc(particle.x, particle.y, particle.r, 0, Math.PI * 2);
      context.fillStyle = `rgba(77, 255, 154, ${particle.alpha})`;
      context.fill();
    });

    for (let i = 0; i < particles.length; i += 1) {
      for (let j = i + 1; j < particles.length; j += 1) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance < 112) {
          context.beginPath();
          context.moveTo(particles[i].x, particles[i].y);
          context.lineTo(particles[j].x, particles[j].y);
          context.strokeStyle = `rgba(77, 255, 154, ${0.08 - distance / 1600})`;
          context.lineWidth = 1;
          context.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  };

  resizeParticles();
  drawParticles();
  window.addEventListener("resize", resizeParticles, { passive: true });
}
