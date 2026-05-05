(function initThree() {
  const canvas = document.getElementById("bg-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000,
  );
  camera.position.z = 5;

  // Lighting
  const ambient = new THREE.AmbientLight(0x0466c8, 0.4);
  scene.add(ambient);
  // Point light acts like a coloured lamp
  const pointLight = new THREE.PointLight(0x0466c8, 1.5, 50);
  pointLight.position.set(3, 4, 3);
  scene.add(pointLight);
  const pointLight2 = new THREE.PointLight(0x0466c8, 1, 40);
  pointLight2.position.set(-4, -2, 2);
  scene.add(pointLight2);
  //Stars
  const starGeo = new THREE.BufferGeometry();
  const starCount = 2000;
  const positions = new Float32Array(starCount * 3);
  for (let i = 0; i < starCount * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 300;
  }
  starGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const starMAt = new THREE.PointsMaterial({
    color: 0x979dac,
    size: 0.18,
    transparent: true,
    opacity: 0.75,
  });
  const stars = new THREE.Points(starGeo, starMAt);
  scene.add(stars);
  // Floating shapes help create a dynamic background
  const makeShape = (geo, x, y, z) => {
    const mat = new THREE.MeshStandardMaterial({
      color: 0x0466c8,
      transparent: true,
      wireframe: true,
      opacity: 0.35,
    });
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y, z);
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.006,
      rotY: (Math.random() - 0.5) * 0.006,
      floatSpeed: 0.3 + Math.random() * 0.4,
      floatAmp: 0.3 + Math.random() * 0.3,
      originalY: y,
    };
    scene.add(mesh);
    return mesh;
  };
  const shapes = [
    makeShape(new THREE.TorusGeometry(0.9, 0.3, 12, 48), -3.5, 1.2, -3),
    makeShape(new THREE.IcosahedronGeometry(0.8, 1), 3.2, 0.4, -4),
    makeShape(new THREE.OctahedronGeometry(0.7), -0.5, -2.0, -2),
    makeShape(new THREE.TorusGeometry(0.6, 0.2, 10, 36), 2.0, 2.2, -5),
    makeShape(new THREE.IcosahedronGeometry(0.55, 0), -2.8, -1.5, -4),
  ];
  // --- Mouse parallax ---
  let mouseX = 0,
    mouseY = 0;
  document.addEventListener("mousemove", (e) => {
    // Normalise to -1..+1
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });
  // --- Resize handler ---
  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
  // --- Animation loop ---
  // Three.js calls this every frame (like requestAnimationFrame)
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    // Rotate starfield slowly
    stars.rotation.y = t * 0.015;
    stars.rotation.x = t * 0.005;
    // Float + rotate each shape
    shapes.forEach((s) => {
      s.rotation.x += s.userData.rotX;
      s.rotation.y += s.userData.rotY;
      // Bob up and down using a sine wave
      s.position.y =
        s.userData.originY +
        Math.sin(t * s.userData.floatSpeed) * s.userData.floatAmp;
    });
    // Gently tilt camera toward the mouse position
    camera.position.x += (mouseX * 0.4 - camera.position.x) * 0.03;
    camera.position.y += (-mouseY * 0.4 - camera.position.y) * 0.03;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();
})();

(function typewriter() {
  const el = document.getElementById("typewriter");
  const words = [
    "beautiful interfaces.",
    "clean codes.",
    "things people love.",
    "smooth animations.",
    "my way into tech.",
    "ideas into reality.",
    "the future, one line at a time.",
  ];
  let wi = 0;
  let ci = 0;
  let deleting = false;

  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    let delay = deleting ? 55 : 95;
    if (!deleting && ci > word.length) {
      delay = 1500;
      deleting = true;
    } else if (deleting && ci < 0) {
      deleting = false;
      ci = 0;
      wi = (wi + 1) % words.length;
      delay = 400;
    }
    setTimeout(tick, delay);
  }
  tick();
})();

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add("visible");
        e.target.querySelectorAll(".bar-fill").forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
      }
    });
  },
  { threshold: 0.12 },
);
document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));

document.querySelectorAll(".card-3d").forEach((card) => {
  card.addEventListener("mousemove", (e) => {
    const rect = card.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    const tiltX = dy * -12;
    const tiltY = dx * 12;
    card.style.transform = `perspective(800px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale3d(1.03,1.03,10.3)`;
  });
  card.addEventListener("mouseleave", () => {
    card.style.transform =
      "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)";
  });
});

document.querySelectorAll(".skill-tab").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.tab;
    document.querySelectorAll(".skill-tab").forEach((b) => {
      if (b.dataset.tab === target) {
        b.className = "skill-tab btn-primary text-sm";
      } else {
        b.className = "skill-tab text-sm btn-ghost";
      }
    });
    document.querySelectorAll(".skill-panel").forEach((panel) => {
      if (panel.id === `tab-${target}`) {
        panel.classList.remove("hidden");
      } else {
        panel.classList.add("hidden");
      }
    });
    setTimeout(() => {
      document
        .querySelectorAll("#tab-" + target + ".bar-fill")
        .forEach((bar) => {
          bar.style.width = bar.dataset.width + "%";
        });
    }, 50);
  });
});
setTimeout(() => {
  document.querySelectorAll("#tab-frontend .bar-fill").forEach((bar) => {
    bar.style.width = bar.dataset.width + "%";
  });
}, 800);

document.querySelector("#sendBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  const btn = document.querySelector("#sendBtn");
  const form = document.querySelector("#contactForm");
  const name = document.querySelector("#name").value.trim();
  const email = document.querySelector("#email").value.trim();
  const subject = document.querySelector("#subject").value.trim();
  const message = document.querySelector("#message").value.trim();

  if (!name || !email || !message) {
    alert("Please fill in your name, email and message!");
    return;
  }
  btn.textContent = "sending message...";
  btn.disabled = true;
  btn.style.opacity = 0.7;
  try {
    const response = await fetch(form.action, {
      method: form.method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, message, subject }),
    });
    if (response.ok) {
      btn.textContent = "Message sent";
      btn.style.opacity = "1";
      document.querySelector("#sendSuccess").classList.remove("hidden");
      form.reset();
      setTimeout(() => {
        btn.textContent = "Send Message";
        document.querySelector("#sendSuccess").classList.add("hidden");
        btn.disabled = false;
      }, 4000);
    } else {
      btn.textContent = "Failed to send";
      btn.style.opacity = "1";
      btn.disabled = false;
    }
  } catch (error) {
    btn.textContent = "Error sending";
    btn.style.opacity = "1";
    btn.disabled = false;
  }
});

document.getElementById("menuToggle").addEventListener("click", () => {
  document.querySelector("#mobileMenu").classList.toggle("open");
});
document.querySelectorAll("#mobileMenu a").forEach((link) => {
  document.querySelector("#mobileMenu").addEventListener("click", () => {
    document.querySelector("#mobileMenu").classList.remove("open");
  });
});
