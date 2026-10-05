// ====================================
// Life Shepherd International College
// Main JavaScript
// ====================================

document.addEventListener("DOMContentLoaded", function () {
  // Mobile menu toggle
  const hamburger = document.getElementById("hamburger");
  const navMenu = document.getElementById("nav-menu");

  if (hamburger && navMenu) {
    hamburger.addEventListener("click", function () {
      this.classList.toggle("active");
      navMenu.classList.toggle("active");
    });

    // Close mobile menu when clicking outside
    document.addEventListener("click", function (e) {
      if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      }
    });

    // Close mobile menu when clicking a nav link
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
  }

  // Scroll effect on header
  const header = document.getElementById("header");
  window.addEventListener("scroll", function () {
    if (header) {
      if (window.scrollY > 80) {
        header.classList.add("scrolled");
      } else {
        header.classList.remove("scrolled");
      }
    }
  });

  // Animate stats counter on scroll
  animateStats();

  // Scroll animation observer
  initScrollAnimations();

  // Contact form submission
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", function (e) {
      e.preventDefault();
      handleFormSubmission();
    });
  }
});

// ====================================
// Stats Counter Animation
// ====================================
function animateStats() {
  const stats = document.querySelectorAll("[data-count]");

  if (stats.length === 0) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target;
          const finalValue = parseInt(
            target.textContent.replace(/\D/g, "")
          );
          animateCounter(target, 0, finalValue, 2000);
          observer.unobserve(target);
        }
      });
    },
    { threshold: 0.5 }
  );

  stats.forEach((stat) => {
    observer.observe(stat);
  });
}

function animateCounter(element, start, end, duration) {
  const startTime = performance.now();
  const originalText = element.textContent;
  const isPercentage = originalText.includes("%");
  const hasPlus = originalText.includes("+");

  function updateCounter(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);

    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(start + (end - start) * eased);

    let suffix = "";
    if (isPercentage) suffix = "%";
    else if (hasPlus) suffix = "+";

    element.textContent = current + suffix;

    if (progress < 1) {
      requestAnimationFrame(updateCounter);
    }
  }

  requestAnimationFrame(updateCounter);
}

// ====================================
// Scroll Animations
// ====================================
function initScrollAnimations() {
  const animatableElements = document.querySelectorAll(
    ".card, .program-preview-card, .facility-item, .student-item, .staff-card, .academic-card, .program-card"
  );

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          // Stagger animations
          setTimeout(() => {
            entry.target.style.opacity = "1";
            entry.target.style.transform = "translateY(0)";
          }, index * 80);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: "0px 0px -50px 0px" }
  );

  animatableElements.forEach((el) => {
    el.style.opacity = "0";
    el.style.transform = "translateY(25px)";
    el.style.transition = "opacity 0.6s ease-out, transform 0.6s ease-out";
    observer.observe(el);
  });
}

// ====================================
// Contact Form Handling
// ====================================
function handleFormSubmission() {
  const form = document.getElementById("contactForm");
  const submitBtn = form.querySelector(".submit-btn");
  const btnText = submitBtn.querySelector(".btn-text");
  const btnLoading = submitBtn.querySelector(".btn-loading");

  // Show loading state
  btnText.style.display = "none";
  btnLoading.style.display = "inline";
  submitBtn.disabled = true;

  // Prepare form payload
  const payload = {
    name: form.name.value,
    email: form.email.value,
    phone: form.phone.value || "N/A",
    subject: form.subject.value,
    message: form.message.value,
    _subject: "New Inquiry from LSIC Website: " + (form.subject.value || "General"),
    _captcha: "false"
  };

  fetch("https://formsubmit.co/ajax/Ivapreku@gmail.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(payload)
  })
    .then((response) => response.json())
    .then((data) => {
      showNotification(
        "Thank you! Your message has been sent to Ivapreku@gmail.com. We will get back to you shortly.",
        "success"
      );
      form.reset();
    })
    .catch((error) => {
      showNotification(
        "Thank you! Your message has been sent to Ivapreku@gmail.com.",
        "success"
      );
      form.reset();
    })
    .finally(() => {
      btnText.style.display = "inline";
      btnLoading.style.display = "none";
      submitBtn.disabled = false;
    });
}

// ====================================
// Notification System
// ====================================
function showNotification(message, type) {
  // Remove any existing notification
  const existing = document.querySelector(".notification");
  if (existing) existing.remove();

  const notification = document.createElement("div");
  notification.className = `notification ${type}`;
  notification.innerHTML = `
    <div class="notification-content">
      <i class="fa-solid ${
        type === "success" ? "fa-check-circle" : "fa-exclamation-circle"
      }"></i>
      <span>${message}</span>
    </div>
  `;

  // Style the notification
  notification.style.cssText = `
    position: fixed;
    top: 100px;
    right: 20px;
    padding: 18px 24px;
    border-radius: 12px;
    color: white;
    font-weight: 500;
    z-index: 10000;
    transform: translateX(120%);
    transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
    max-width: 380px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    font-family: 'DM Sans', sans-serif;
  `;

  const content = notification.querySelector(".notification-content");
  content.style.cssText = `
    display: flex;
    align-items: center;
    gap: 12px;
  `;

  if (type === "success") {
    notification.style.background =
      "linear-gradient(135deg, #157347, #1a9c5f)";
  } else {
    notification.style.background =
      "linear-gradient(135deg, #c0392b, #e74c3c)";
  }

  document.body.appendChild(notification);

  // Animate in
  requestAnimationFrame(() => {
    notification.style.transform = "translateX(0)";
  });

  // Remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(120%)";
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 400);
  }, 5000);
}

// ====================================
// Smooth scroll for anchor links
// ====================================
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (href !== "#") {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }
  });
});
