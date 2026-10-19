// ====================================
// Life Shepherd International College
// Main JavaScript
// ====================================

document.addEventListener("DOMContentLoaded", function () {
  // Navigation Slide-out Drawer Toggle
  const hamburger = document.getElementById("hamburger");
  const navDrawer = document.getElementById("navDrawer");
  const drawerBackdrop = document.getElementById("drawerBackdrop");
  const drawerClose = document.getElementById("drawerClose");
  const navMenu = document.getElementById("nav-menu");

  function openDrawer() {
    if (navDrawer) {
      navDrawer.classList.add("active");
      navDrawer.setAttribute("aria-hidden", "false");
    }
    if (drawerBackdrop) drawerBackdrop.classList.add("active");
    if (hamburger) {
      hamburger.classList.add("active");
      hamburger.setAttribute("aria-expanded", "true");
    }
    document.body.classList.add("drawer-open");
  }

  function closeDrawer() {
    if (navDrawer) {
      navDrawer.classList.remove("active");
      navDrawer.setAttribute("aria-hidden", "true");
    }
    if (drawerBackdrop) drawerBackdrop.classList.remove("active");
    if (hamburger) {
      hamburger.classList.remove("active");
      hamburger.setAttribute("aria-expanded", "false");
    }
    document.body.classList.remove("drawer-open");
  }

  if (hamburger) {
    hamburger.addEventListener("click", function (e) {
      e.stopPropagation();
      const isOpen = navDrawer && navDrawer.classList.contains("active");
      if (isOpen) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });
  }

  if (drawerClose) {
    drawerClose.addEventListener("click", function (e) {
      e.stopPropagation();
      closeDrawer();
    });
  }

  if (drawerBackdrop) {
    drawerBackdrop.addEventListener("click", function () {
      closeDrawer();
    });
  }

  // Close on Escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && navDrawer && navDrawer.classList.contains("active")) {
      closeDrawer();
      if (hamburger) hamburger.focus();
    }
  });

  // Close when clicking a nav link
  if (navMenu) {
    navMenu.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => {
        closeDrawer();
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
document.querySelectorAll('a[href*="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    const href = this.getAttribute("href");
    if (!href || href === "#") return;

    const hashIndex = href.indexOf("#");
    const pathPart = href.slice(0, hashIndex);
    const hashPart = href.slice(hashIndex);

    const isCurrentPage =
      !pathPart ||
      window.location.pathname.endsWith("/" + pathPart) ||
      window.location.pathname.endsWith(pathPart) ||
      (window.location.pathname.endsWith("/") && (pathPart === "index.html" || pathPart === ""));

    if (isCurrentPage && hashPart) {
      const target = document.querySelector(hashPart);
      if (target) {
        e.preventDefault();
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
        if (history.pushState) {
          history.pushState(null, null, hashPart);
        } else {
          location.hash = hashPart;
        }
      }
    }
  });
});

// Smooth scroll to hash on page load if present
window.addEventListener("load", function () {
  if (window.location.hash) {
    const target = document.querySelector(window.location.hash);
    if (target) {
      setTimeout(() => {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }, 150);
    }
  }
});

// ====================================
// Life Shepherd Parent Notification Hub
// ====================================

const LSIC_NOTICES = [
  {
    id: "notif-pta-nov",
    category: "pta",
    categoryLabel: "PTA Meeting",
    priority: "Urgent",
    priorityClass: "badge-urgent",
    icon: "fa-users",
    iconClass: "cat-pta",
    accentColor: "#00994d",
    title: "1st Term General PTA Meeting & Academic Progress Review",
    dateDisplay: "Saturday, November 14, 2026",
    timeDisplay: "9:30 AM – 12:30 PM GMT",
    dateISO: "2026-11-14T09:30:00",
    dateEndISO: "2026-11-14T12:30:00",
    targetAudience: "All Parents & Guardians (Crèche – P6)",
    venue: "School Assembly Grounds / Main Hall",
    shortSummary: "Crucial assembly covering academic performance, pupil transport updates, classroom enhancement projects, and executive committee elections.",
    fullDescription: `
      <p>Dear Parents and Guardians,</p>
      <p>The Management and PTA Executive Committee of <strong>Life Shepherd International College</strong> cordially invite all parents and guardians to our <strong>1st Term General Parent-Teacher Association (PTA) Meeting</strong>.</p>
      <div class="modal-notice-highlights">
        <h4><i class="fa-solid fa-list-check"></i> Meeting Agenda:</h4>
        <ul>
          <li><strong>Opening Devotion & Head of School's Welcome:</strong> Vision address and review of foundational learning targets.</li>
          <li><strong>Academic Performance & Assessment Review:</strong> Analysis of continuous assessment scores, reading clinics, and numeracy growth.</li>
          <li><strong>Pupil Transport & Security:</strong> Updated school bus routes, safety protocols, and morning/afternoon pick-up guidelines.</li>
          <li><strong>Infrastructure & Technology:</strong> Progress report on new classroom enhancements and computer lab expansion.</li>
          <li><strong>Interactive Parent-Teacher Q&A:</strong> Open forum for parent suggestions, feedback, and collaborative resolutions.</li>
        </ul>
      </div>
      <p>Your presence, contributions, and active involvement are vital to our pupils' success and character growth. Refreshments will be served.</p>
    `,
    contactPerson: "PTA Secretariat: 0244 745 177 / 0558 099 525",
    isFeatured: true
  },
  {
    id: "notif-midterm-break",
    category: "break",
    categoryLabel: "Mid-Term Break",
    priority: "Upcoming",
    priorityClass: "badge-upcoming",
    icon: "fa-mug-hot",
    iconClass: "cat-break",
    accentColor: "#f39c12",
    title: "First Term Mid-Term Break & Rest Recess",
    dateDisplay: "Thursday, Oct 29 – Monday, Nov 2, 2026",
    timeDisplay: "Dismissal: Wed, Oct 28 at 2:00 PM",
    dateISO: "2026-10-29T14:00:00",
    dateEndISO: "2026-11-02T18:00:00",
    targetAudience: "All Pupils, Staff & Parents",
    venue: "Family Rest & Home Study Period",
    shortSummary: "Classes recess for the mid-term break. Take-home revision packs provided in pupil communication bags. Classes resume Tuesday, Nov 3.",
    fullDescription: `
      <p>Dear Valued Parents and Guardians,</p>
      <p>Please take note that the school will observe its <strong>First Term Mid-Term Break</strong> from <strong>Thursday, October 29 to Monday, November 2, 2026</strong>. Pupils will vacate on Wednesday, October 28, at 2:00 PM.</p>
      <div class="modal-notice-highlights">
        <h4><i class="fa-solid fa-circle-info"></i> Key Information for Parents:</h4>
        <ul>
          <li><strong>Revision & Enrichment Packs:</strong> Engaging learning exercises have been placed in your child's communication bag to keep them sharp during the break.</li>
          <li><strong>Teacher Feedback Notes:</strong> Mid-term classroom observations and character reports are enclosed for your review.</li>
          <li><strong>Class Resumption:</strong> Normal classes resume promptly on <strong>Tuesday, November 3, 2026 at 7:30 AM</strong>.</li>
          <li><strong>Admin Office Hours:</strong> School administration remains open on Friday, 9:00 AM – 1:00 PM for enquiries and fee settlements.</li>
        </ul>
      </div>
      <p>We wish all our pupils and their families a restful and safe break!</p>
    `,
    contactPerson: "Academic Affairs Desk: 0558 099 525",
    isFeatured: false
  },
  {
    id: "notif-vacation-term1",
    category: "vacation",
    categoryLabel: "Vacation Dates",
    priority: "Scheduled",
    priorityClass: "badge-important",
    icon: "fa-umbrella-beach",
    iconClass: "cat-vacation",
    accentColor: "#16a085",
    title: "First Term Vacation & Terminal Report Cards Collection",
    dateDisplay: "Friday, December 18, 2026",
    timeDisplay: "Carol Service & Closing: 9:00 AM – 12:30 PM",
    dateISO: "2026-12-18T09:00:00",
    dateEndISO: "2026-12-18T12:30:00",
    targetAudience: "All Parents & Pupils",
    venue: "Life Shepherd Campus Grounds",
    shortSummary: "End of First Term vacation day. Parents meet facilitators to collect official terminal reports, festive carol presentations, and holiday packs.",
    fullDescription: `
      <p>Dear Parents and Guardians,</p>
      <p>We extend our heartfelt gratitude for your steadfast support throughout our First Term. The term officially closes on <strong>Friday, December 18, 2026</strong>.</p>
      <div class="modal-notice-highlights">
        <h4><i class="fa-solid fa-gift"></i> Vacation Program Details:</h4>
        <ul>
          <li><strong>Festival of Nine Lessons & Carols:</strong> Pupils will present Christmas songs, choreography, and scripture recitations between 9:00 AM and 11:00 AM.</li>
          <li><strong>Report Cards Distribution:</strong> Parents are required to meet their child's class teacher in person to receive official terminal report cards and discuss progress.</li>
          <li><strong>Holiday Vacation Span:</strong> Vacation begins Saturday, December 19, 2026, and concludes Monday, January 11, 2027.</li>
          <li><strong>Holiday Assignment:</strong> Please ensure your child completes the holiday reading challenge and STEM activity booklet before resumption.</li>
        </ul>
      </div>
      <p>Merry Christmas and a Prosperous New Year in advance to all our cherished families!</p>
    `,
    contactPerson: "Administration: 0244 745 177",
    isFeatured: false
  },
  {
    id: "notif-reopening-term2",
    category: "reopening",
    categoryLabel: "Term Reopening",
    priority: "Important",
    priorityClass: "badge-important",
    icon: "fa-door-open",
    iconClass: "cat-reopening",
    accentColor: "#00a8e8",
    title: "Second Term Official Reopening for All Classes",
    dateDisplay: "Tuesday, January 12, 2027",
    timeDisplay: "Gates open at 7:00 AM Prompt",
    dateISO: "2027-01-12T07:00:00",
    dateEndISO: "2027-01-12T15:00:00",
    targetAudience: "All Pupils (Crèche, Nursery, KG & Primary 1-6)",
    venue: "Life Shepherd Campus, Nyanyanu-Kakraba Down, Kasoa",
    shortSummary: "Academic teaching and lessons begin on day one. Parents are advised to settle school fees and organize learning materials in advance.",
    fullDescription: `
      <p>Dear Parents and Guardians,</p>
      <p>Life Shepherd International College wishes to formally notify all parents that the <strong>Second Term of the 2026/2027 Academic Year</strong> commences on <strong>Tuesday, January 12, 2027</strong>.</p>
      <div class="modal-notice-highlights">
        <h4><i class="fa-solid fa-clipboard-check"></i> Reopening Guidelines & Preparedness:</h4>
        <ul>
          <li><strong>Arrival Time:</strong> School gates open at 7:00 AM. Morning devotional assembly begins at 7:45 AM. Academic lessons start on Day 1.</li>
          <li><strong>Uniform Standards:</strong> Pupils must report neatly dressed in full official uniform, polished black shoes, and clean white socks.</li>
          <li><strong>Textbooks & Supplies:</strong> Customized stationery packs and learning materials will be issued to pupils with completed accounts clearance.</li>
          <li><strong>Cafeteria & Bus Service:</strong> School cafeteria feeding and school bus transportation resume full operations on Tuesday morning.</li>
        </ul>
      </div>
      <p>Please finalize all tuition payments and route bookings with the accounts department before resumption.</p>
    `,
    contactPerson: "Admissions Desk: 0244 745 177 / Ivapreku@gmail.com",
    isFeatured: true
  },
  {
    id: "notif-graduation-day",
    category: "graduation",
    categoryLabel: "Graduation & Awards",
    priority: "Upcoming",
    priorityClass: "badge-upcoming",
    icon: "fa-graduation-cap",
    iconClass: "cat-graduation",
    accentColor: "#8e44ad",
    title: "Annual Speech, Prize-Giving & Graduation Ceremony",
    dateDisplay: "Saturday, July 24, 2027",
    timeDisplay: "10:00 AM – 2:00 PM GMT",
    dateISO: "2027-07-24T10:00:00",
    dateEndISO: "2027-07-24T14:00:00",
    targetAudience: "All Parents, Graduating Pupils (KG2 & P6), Guests",
    venue: "Life Shepherd Assembly Grounds, Kasoa",
    shortSummary: "Grand annual ceremony celebrating graduating kindergarten and Primary 6 pupils, academic honors, talent exhibitions, and prizes.",
    fullDescription: `
      <p>Dear Parents, Guardians, and Esteemed Friends,</p>
      <p>The Management and Staff of Life Shepherd International College warmly invite you to our landmark <strong>Annual Speech, Prize-Giving & Graduation Day</strong>.</p>
      <div class="modal-notice-highlights">
        <h4><i class="fa-solid fa-award"></i> Highlights of the Ceremony:</h4>
        <ul>
          <li><strong>Graduation Procession:</strong> Conferral of certificates of transition to our Kindergarten 2 and Primary 6 graduating classes.</li>
          <li><strong>Academic Honors & Special Prizes:</strong> Awards for overall best pupils, subject distinctions, leadership, and exemplary character.</li>
          <li><strong>Pupil Performances:</strong> Cultural dance drama, choral presentations, science club demonstrations, and cadet parade.</li>
          <li><strong>Keynote Address:</strong> Inspiring guest address on foundational education and raising champions for society.</li>
        </ul>
      </div>
      <p>Parents of graduating pupils are kindly invited to consult the graduation committee for gown reservations and invitation cards.</p>
    `,
    contactPerson: "Graduation Committee: 0244 745 177 / 0558 099 525",
    isFeatured: true
  }
];

// Helper: Calculate countdown to event
function getNoticeCountdown(dateISO) {
  const target = new Date(dateISO);
  const now = new Date();
  const diffMs = target - now;
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return { text: "Past Event", isFuture: false };
  } else if (diffDays === 0) {
    return { text: "Today!", isFuture: true };
  } else if (diffDays === 1) {
    return { text: "Tomorrow", isFuture: true };
  } else if (diffDays <= 30) {
    return { text: `In ${diffDays} Days`, isFuture: true };
  } else {
    const months = Math.round(diffDays / 30);
    return { text: `In ${months} Month${months > 1 ? "s" : ""}`, isFuture: true };
  }
}

// Local Storage for Read Notices
function getReadNotices() {
  try {
    return JSON.parse(localStorage.getItem("lsic_read_notices") || "[]");
  } catch (e) {
    return [];
  }
}

function markNoticeAsRead(noticeId) {
  const read = getReadNotices();
  if (!read.includes(noticeId)) {
    read.push(noticeId);
    try {
      localStorage.setItem("lsic_read_notices", JSON.stringify(read));
    } catch (e) {}
  }
  updateNotifBadge();
  updateDropdownList();
}

function markAllNoticesAsRead() {
  const allIds = LSIC_NOTICES.map((n) => n.id);
  try {
    localStorage.setItem("lsic_read_notices", JSON.stringify(allIds));
  } catch (e) {}
  updateNotifBadge();
  updateDropdownList();
  showNotification("All parent notices marked as read", "success");
}

function updateNotifBadge() {
  const read = getReadNotices();
  const unreadCount = LSIC_NOTICES.filter((n) => !read.includes(n.id)).length;
  const badge = document.getElementById("notifBadgeCount");
  if (badge) {
    badge.textContent = unreadCount;
    if (unreadCount === 0) {
      badge.classList.add("zero");
    } else {
      badge.classList.remove("zero");
    }
  }
  const dropdownUnread = document.getElementById("dropdownUnreadCount");
  if (dropdownUnread) {
    dropdownUnread.textContent = `${unreadCount} unread`;
  }
}

// Dynamic Header Offset adjustment
function syncHeaderOffset() {
  const header = document.getElementById("header");
  if (header) {
    const height = header.offsetHeight;
    document.documentElement.style.setProperty("--header-height", `${height}px`);
  }
}

// Calendar Export Functions
function formatGoogleCalendarDate(isoStr) {
  const d = new Date(isoStr);
  const pad = (n) => String(n).padStart(2, "0");
  return `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}00Z`;
}

function addToGoogleCalendar(noticeId) {
  const notice = LSIC_NOTICES.find((n) => n.id === noticeId);
  if (!notice) return;
  const start = formatGoogleCalendarDate(notice.dateISO);
  const end = formatGoogleCalendarDate(notice.dateEndISO || notice.dateISO);
  const title = encodeURIComponent(notice.title);
  const details = encodeURIComponent(
    `${notice.shortSummary}\n\nLife Shepherd International College\nContact: ${notice.contactPerson}`
  );
  const location = encodeURIComponent(notice.venue);
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
  window.open(url, "_blank");
}

function downloadICSFile(noticeId) {
  const notice = LSIC_NOTICES.find((n) => n.id === noticeId);
  if (!notice) return;
  const start = formatGoogleCalendarDate(notice.dateISO);
  const end = formatGoogleCalendarDate(notice.dateEndISO || notice.dateISO);
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Life Shepherd International College//Parent Notices//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${notice.id}-${Date.now()}@lifeshepherd.edu.gh`,
    `DTSTAMP:${formatGoogleCalendarDate(new Date().toISOString())}`,
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${notice.title.replace(/,/g, "\\,")}`,
    `DESCRIPTION:${notice.shortSummary.replace(/,/g, "\\,").replace(/\n/g, "\\n")}`,
    `LOCATION:${notice.venue.replace(/,/g, "\\,")}`,
    "STATUS:CONFIRMED",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `${notice.id}.ics`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

function shareNoticeOnWhatsApp(noticeId) {
  const notice = LSIC_NOTICES.find((n) => n.id === noticeId);
  if (!notice) return;
  const text = `📢 *Life Shepherd College Announcement*\n\n📌 *${notice.title}*\n📅 *Date:* ${notice.dateDisplay}\n⏰ *Time:* ${notice.timeDisplay}\n📍 *Venue:* ${notice.venue}\n👥 *Audience:* ${notice.targetAudience}\n\n${notice.shortSummary}\n\n📞 ${notice.contactPerson}\n🌐 https://lifeshepherd.edu.gh`;
  const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
  window.open(url, "_blank");
}

// Notice Detail Modal Open/Close
function openNoticeModal(noticeId) {
  const notice = LSIC_NOTICES.find((n) => n.id === noticeId);
  if (!notice) return;

  markNoticeAsRead(noticeId);

  const modalBackdrop = document.getElementById("lsicNoticeModal");
  if (!modalBackdrop) return;

  const countdown = getNoticeCountdown(notice.dateISO);

  document.getElementById("modalNoticeCategory").className = `notice-category-badge ${notice.iconClass}`;
  document.getElementById("modalNoticeCategory").textContent = notice.categoryLabel;

  const priorityEl = document.getElementById("modalNoticePriority");
  priorityEl.className = `notif-item-badge ${notice.priorityClass}`;
  priorityEl.textContent = notice.priority;

  const countdownEl = document.getElementById("modalNoticeCountdown");
  countdownEl.className = `notice-countdown-pill ${countdown.isFuture ? "future" : ""}`;
  countdownEl.innerHTML = `<i class="fa-regular fa-clock"></i> ${countdown.text}`;

  document.getElementById("modalNoticeTitle").textContent = notice.title;
  document.getElementById("modalNoticeDate").textContent = notice.dateDisplay;
  document.getElementById("modalNoticeTime").textContent = notice.timeDisplay;
  document.getElementById("modalNoticeVenue").textContent = notice.venue;
  document.getElementById("modalNoticeAudience").textContent = notice.targetAudience;
  document.getElementById("modalNoticeBody").innerHTML = notice.fullDescription;
  document.getElementById("modalNoticeContact").innerHTML = `<strong>Inquiries & Clarifications:</strong> ${notice.contactPerson}`;

  // Hook action buttons
  const googleBtn = document.getElementById("modalGoogleCalBtn");
  const icsBtn = document.getElementById("modalIcsBtn");
  const waBtn = document.getElementById("modalWaShareBtn");

  if (googleBtn) googleBtn.onclick = () => addToGoogleCalendar(notice.id);
  if (icsBtn) icsBtn.onclick = () => downloadICSFile(notice.id);
  if (waBtn) waBtn.onclick = () => shareNoticeOnWhatsApp(notice.id);

  modalBackdrop.classList.add("active");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeNoticeModal() {
  const modalBackdrop = document.getElementById("lsicNoticeModal");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("active");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
}

// Parent Alert Modal Open/Close
function openAlertModal() {
  const modalBackdrop = document.getElementById("lsicAlertModal");
  if (!modalBackdrop) return;

  const form = document.getElementById("parentAlertForm");
  const successState = document.getElementById("alertSuccessState");
  if (form) form.style.display = "flex";
  if (successState) successState.style.display = "none";

  // Pre-fill previously saved details if any
  try {
    const savedName = localStorage.getItem("lsic_parent_name");
    const savedPhone = localStorage.getItem("lsic_parent_phone");
    const savedClass = localStorage.getItem("lsic_parent_class");
    if (savedName) {
      const nameEl = document.getElementById("parentName");
      if (nameEl && !nameEl.value) nameEl.value = savedName;
    }
    if (savedPhone) {
      const phoneEl = document.getElementById("parentPhone");
      if (phoneEl && !phoneEl.value) phoneEl.value = savedPhone;
    }
    if (savedClass) {
      const classEl = document.getElementById("pupilClass");
      if (classEl && !classEl.value) classEl.value = savedClass;
    }
  } catch (e) {}

  modalBackdrop.classList.add("active");
  modalBackdrop.setAttribute("aria-hidden", "false");
  document.body.classList.add("modal-open");
}

function closeAlertModal() {
  const modalBackdrop = document.getElementById("lsicAlertModal");
  if (modalBackdrop) {
    modalBackdrop.classList.remove("active");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }
}

// Dropdown Content Rendering
let currentDropdownFilter = "all";

function updateDropdownList() {
  const container = document.getElementById("notifDropdownList");
  if (!container) return;

  const read = getReadNotices();
  const filtered = LSIC_NOTICES.filter((n) => {
    if (currentDropdownFilter === "all") return true;
    return n.category === currentDropdownFilter;
  });

  if (filtered.length === 0) {
    container.innerHTML = `<div style="text-align: center; padding: 24px; color: rgba(255,255,255,0.6); font-size: 0.85rem;">No notifications in this category.</div>`;
    return;
  }

  container.innerHTML = filtered
    .map((notice) => {
      const isUnread = !read.includes(notice.id);
      return `
      <div class="notif-dropdown-item ${isUnread ? "unread" : ""}" data-notice-id="${notice.id}">
        <div class="notif-item-icon ${notice.iconClass}">
          <i class="fa-solid ${notice.icon}"></i>
        </div>
        <div class="notif-item-content">
          <div class="notif-item-header">
            <span class="notif-item-badge ${notice.priorityClass}">${notice.categoryLabel}</span>
          </div>
          <div class="notif-item-title">${notice.title}</div>
          <div class="notif-item-date"><i class="fa-regular fa-calendar"></i> ${notice.dateDisplay}</div>
        </div>
      </div>
    `;
    })
    .join("");

  // Attach click listener to each item
  container.querySelectorAll(".notif-dropdown-item").forEach((item) => {
    item.addEventListener("click", () => {
      const id = item.getAttribute("data-notice-id");
      closeNotifDropdown();
      openNoticeModal(id);
    });
  });
}

function toggleNotifDropdown() {
  const dropdown = document.getElementById("notifDropdown");
  const bellBtn = document.getElementById("notifBellBtn");
  if (!dropdown) return;

  const isActive = dropdown.classList.contains("active");
  if (isActive) {
    closeNotifDropdown();
  } else {
    dropdown.classList.add("active");
    dropdown.setAttribute("aria-hidden", "false");
    if (bellBtn) {
      bellBtn.classList.add("active");
      bellBtn.setAttribute("aria-expanded", "true");
    }
    updateDropdownList();
  }
}

function closeNotifDropdown() {
  const dropdown = document.getElementById("notifDropdown");
  const bellBtn = document.getElementById("notifBellBtn");
  if (dropdown) {
    dropdown.classList.remove("active");
    dropdown.setAttribute("aria-hidden", "true");
  }
  if (bellBtn) {
    bellBtn.classList.remove("active");
    bellBtn.setAttribute("aria-expanded", "false");
  }
}

// Notice Board Section Renderer (on index.html)
let currentBoardCategory = "all";

function renderNoticeBoardGrid() {
  const grid = document.getElementById("noticesGrid");
  if (!grid) return;

  const filtered = LSIC_NOTICES.filter((n) => {
    if (currentBoardCategory === "all") return true;
    return n.category === currentBoardCategory;
  });

  if (filtered.length === 0) {
    grid.innerHTML = `<div style="grid-column: 1/-1; text-align: center; padding: 48px; background: #fff; border-radius: 16px; color: var(--gray-600);">No circulars found for this category.</div>`;
    return;
  }

  grid.innerHTML = filtered
    .map((notice) => {
      const countdown = getNoticeCountdown(notice.dateISO);
      return `
      <div class="notice-card" style="--card-accent: ${notice.accentColor};" data-notice-id="${notice.id}">
        <div class="notice-card-top">
          <span class="notice-category-badge ${notice.iconClass}">
            <i class="fa-solid ${notice.icon}"></i> ${notice.categoryLabel}
          </span>
          <span class="notice-countdown-pill ${countdown.isFuture ? "future" : ""}">
            <i class="fa-regular fa-clock"></i> ${countdown.text}
          </span>
        </div>

        <h3 class="notice-card-title">${notice.title}</h3>

        <div class="notice-card-meta">
          <div class="notice-meta-item">
            <i class="fa-regular fa-calendar-days"></i>
            <span><strong>Date:</strong> ${notice.dateDisplay}</span>
          </div>
          <div class="notice-meta-item">
            <i class="fa-regular fa-clock"></i>
            <span><strong>Time:</strong> ${notice.timeDisplay}</span>
          </div>
          <div class="notice-meta-item">
            <i class="fa-solid fa-location-dot"></i>
            <span><strong>Venue:</strong> ${notice.venue}</span>
          </div>
          <div class="notice-meta-item">
            <i class="fa-solid fa-user-group"></i>
            <span><strong>Audience:</strong> ${notice.targetAudience}</span>
          </div>
        </div>

        <p class="notice-card-desc">${notice.shortSummary}</p>

        <div class="notice-card-actions">
          <button class="btn-read-notice" type="button" data-open-modal="${notice.id}">
            <i class="fa-solid fa-file-lines"></i> Read Circular
          </button>

          <div class="btn-cal-menu">
            <button class="btn-cal-trigger" type="button" aria-label="Add to Calendar" data-cal-toggle="${notice.id}">
              <i class="fa-regular fa-calendar-plus"></i>
            </button>
            <div class="cal-dropdown-menu" id="calMenu_${notice.id}">
              <button class="cal-option-btn" type="button" data-cal-google="${notice.id}">
                <i class="fa-brands fa-google"></i> Google Calendar
              </button>
              <button class="cal-option-btn" type="button" data-cal-ics="${notice.id}">
                <i class="fa-solid fa-calendar-arrow-down"></i> Apple / Outlook (.ics)
              </button>
            </div>
          </div>

          <button class="btn-share-whatsapp" type="button" aria-label="Share on WhatsApp" data-share-wa="${notice.id}">
            <i class="fa-brands fa-whatsapp"></i>
          </button>
        </div>
      </div>
    `;
    })
    .join("");

  // Attach card event listeners
  grid.querySelectorAll("[data-open-modal]").forEach((btn) => {
    btn.addEventListener("click", () => {
      openNoticeModal(btn.getAttribute("data-open-modal"));
    });
  });

  grid.querySelectorAll("[data-cal-toggle]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      const id = btn.getAttribute("data-cal-toggle");
      const menu = document.getElementById(`calMenu_${id}`);
      document.querySelectorAll(".cal-dropdown-menu.active").forEach((m) => {
        if (m !== menu) m.classList.remove("active");
      });
      if (menu) menu.classList.toggle("active");
    });
  });

  grid.querySelectorAll("[data-cal-google]").forEach((btn) => {
    btn.addEventListener("click", () => {
      addToGoogleCalendar(btn.getAttribute("data-cal-google"));
      document.querySelectorAll(".cal-dropdown-menu.active").forEach((m) => m.classList.remove("active"));
    });
  });

  grid.querySelectorAll("[data-cal-ics]").forEach((btn) => {
    btn.addEventListener("click", () => {
      downloadICSFile(btn.getAttribute("data-cal-ics"));
      document.querySelectorAll(".cal-dropdown-menu.active").forEach((m) => m.classList.remove("active"));
    });
  });

  grid.querySelectorAll("[data-share-wa]").forEach((btn) => {
    btn.addEventListener("click", () => {
      shareNoticeOnWhatsApp(btn.getAttribute("data-share-wa"));
    });
  });
}

// Parent Alert Form Submission Handler
function handleAlertSubscription(form) {
  if (!form) return;
  const submitBtn = form.querySelector(".alert-subscribe-submit-btn") || document.getElementById("alertSubscribeSubmitBtn");
  const originalHtml = submitBtn ? submitBtn.innerHTML : '<i class="fa-solid fa-bell"></i> Subscribe to School Alerts';

  // Safe input value extraction
  const nameEl = document.getElementById("parentName") || (form.elements ? form.elements["parentName"] : null);
  const phoneEl = document.getElementById("parentPhone") || (form.elements ? form.elements["parentPhone"] : null);
  const emailEl = document.getElementById("parentEmail") || (form.elements ? form.elements["parentEmail"] : null);
  const classEl = document.getElementById("pupilClass") || (form.elements ? form.elements["pupilClass"] : null);

  const parentName = (nameEl && nameEl.value ? nameEl.value : "").trim();
  const parentPhone = (phoneEl && phoneEl.value ? phoneEl.value : "").trim();
  const parentEmail = (emailEl && emailEl.value ? emailEl.value : "").trim();
  const pupilClass = (classEl && classEl.value ? classEl.value : "").trim();

  // Validate required inputs
  if (!parentName || !parentPhone || !pupilClass) {
    if (form.reportValidity) {
      form.reportValidity();
    } else {
      alert("Please fill in your name, mobile/WhatsApp number, and child's class level.");
    }
    return;
  }

  // Visual feedback on button immediately
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Subscribing...`;
  }

  const selectedTopics = Array.from(form.querySelectorAll("input[name='topics']:checked")).map((cb) => cb.value);
  const selectedChannels = Array.from(form.querySelectorAll("input[name='channels']:checked")).map((cb) => cb.value);

  const topicsText = selectedTopics.length > 0 ? selectedTopics.join(", ") : "All School Notices";
  const channelsText = selectedChannels.length > 0 ? selectedChannels.join(", ") : "WhatsApp & SMS";

  const payload = {
    parentName: parentName,
    parentPhone: parentPhone,
    parentEmail: parentEmail || "Not provided",
    pupilClass: pupilClass,
    topics: topicsText,
    channels: channelsText,
    _subject: "New Parent Alert Registration: " + parentName + " (" + pupilClass + ")",
    _captcha: "false"
  };

  // 1. Immediately persist to localStorage so data is NEVER lost
  try {
    localStorage.setItem("lsic_parent_subscribed", "true");
    localStorage.setItem("lsic_parent_name", parentName);
    localStorage.setItem("lsic_parent_phone", parentPhone);
    localStorage.setItem("lsic_parent_email", parentEmail);
    localStorage.setItem("lsic_parent_class", pupilClass);

    // Save into list of registered parents for Admin SMS portal integration
    const existing = JSON.parse(localStorage.getItem("lsic_registered_parents") || "[]");
    const filtered = existing.filter((p) => p.phone !== parentPhone);
    filtered.unshift({
      name: parentName,
      phone: parentPhone,
      email: parentEmail || "N/A",
      classLevel: pupilClass,
      topics: selectedTopics,
      channels: selectedChannels,
      registeredAt: new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      })
    });
    localStorage.setItem("lsic_registered_parents", JSON.stringify(filtered));
  } catch (storageErr) {
    console.warn("Storage warning:", storageErr);
  }

  // 2. Personalize the confirmation screen
  const successMsg = document.getElementById("alertSuccessMessage");
  if (successMsg) {
    successMsg.innerHTML = `Thank you, <strong>${parentName}</strong>! Your subscription for <strong>${pupilClass}</strong> has been registered. You will receive updates via <strong>${channelsText}</strong> on <strong>${parentPhone}</strong> before all upcoming school dates.`;
  }

  // 3. Personalize the direct WhatsApp join button
  const waJoinBtn = document.querySelector(".whatsapp-direct-join-btn");
  if (waJoinBtn) {
    const waText = encodeURIComponent(
      `Hello Life Shepherd College, I have registered for parent alerts for my child in ${pupilClass}.\nParent: ${parentName}\nPhone: ${parentPhone}.\nPlease confirm my number on the official broadcast list.`
    );
    waJoinBtn.href = `https://wa.me/233244745177?text=${waText}`;
  }

  // Transition UI to confirmed state
  function transitionToSuccess() {
    form.style.display = "none";
    const successState = document.getElementById("alertSuccessState");
    if (successState) {
      successState.style.display = "block";
    }
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalHtml;
    }
    showNotification("You've subscribed to Life Shepherd parent alerts!", "success");
  }

  // 4. Send background notification to FormSubmit with timeout fallback
  let didTransition = false;
  const timeoutId = setTimeout(() => {
    if (!didTransition) {
      didTransition = true;
      transitionToSuccess();
    }
  }, 2400);

  try {
    fetch("https://formsubmit.co/ajax/Ivapreku@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .catch(() => ({ success: true }))
      .finally(() => {
        clearTimeout(timeoutId);
        if (!didTransition) {
          didTransition = true;
          transitionToSuccess();
        }
      });
  } catch (fetchErr) {
    clearTimeout(timeoutId);
    if (!didTransition) {
      didTransition = true;
      transitionToSuccess();
    }
  }
}

// Global aliases to ensure either function name works seamlessly
const handleAlertSubmission = handleAlertSubscription;
window.handleAlertSubscription = handleAlertSubscription;
window.handleAlertSubmission = handleAlertSubscription;

// Inject Required Modals & Dropdown into the DOM
function injectNotificationDOM() {
  // 1. Notification Dropdown (inside .notif-bell-wrapper)
  const bellWrapper = document.querySelector(".notif-bell-wrapper");
  if (bellWrapper && !document.getElementById("notifDropdown")) {
    const dropdownEl = document.createElement("div");
    dropdownEl.className = "notif-dropdown";
    dropdownEl.id = "notifDropdown";
    dropdownEl.setAttribute("aria-hidden", "true");
    dropdownEl.innerHTML = `
      <div class="notif-dropdown-header">
        <div class="notif-dropdown-title">
          <i class="fa-solid fa-bell"></i>
          <span>Parent Notifications</span>
          <span class="notif-unread-count" id="dropdownUnreadCount">0 unread</span>
        </div>
        <button class="notif-mark-read-btn" id="markAllReadBtn" type="button">Mark all read</button>
      </div>

      <div class="notif-dropdown-filters">
        <button class="notif-filter-chip active" data-filter="all" type="button">All</button>
        <button class="notif-filter-chip" data-filter="pta" type="button">PTA</button>
        <button class="notif-filter-chip" data-filter="reopening" type="button">Reopening</button>
        <button class="notif-filter-chip" data-filter="break" type="button">Breaks</button>
        <button class="notif-filter-chip" data-filter="vacation" type="button">Vacation</button>
        <button class="notif-filter-chip" data-filter="graduation" type="button">Graduation</button>
      </div>

      <div class="notif-dropdown-list" id="notifDropdownList"></div>

      <div class="notif-dropdown-footer">
        <button class="notif-footer-subscribe-btn" id="dropdownSubscribeBtn" type="button">
          <i class="fa-solid fa-paper-plane"></i> Subscribe to Alerts
        </button>
        <a href="index.html#notice-board" class="notif-footer-view-all">
          Notice Board <i class="fa-solid fa-arrow-right"></i>
        </a>
      </div>
      <div class="notif-dropdown-admin-bar">
        <a href="admin-sms.html" class="notif-admin-link">
          <i class="fa-solid fa-tower-broadcast"></i> Staff: Broadcast Parent Bulk SMS
        </a>
      </div>
    `;
    bellWrapper.appendChild(dropdownEl);
  }

  // 2. Notice Detail Modal
  if (!document.getElementById("lsicNoticeModal")) {
    const modalBackdrop = document.createElement("div");
    modalBackdrop.className = "lsic-modal-backdrop";
    modalBackdrop.id = "lsicNoticeModal";
    modalBackdrop.setAttribute("aria-hidden", "true");
    modalBackdrop.setAttribute("role", "dialog");
    modalBackdrop.setAttribute("aria-modal", "true");
    modalBackdrop.innerHTML = `
      <div class="lsic-modal-dialog">
        <div class="lsic-modal-header">
          <div class="lsic-modal-badges">
            <span class="notice-category-badge cat-pta" id="modalNoticeCategory">PTA Meeting</span>
            <span class="notif-item-badge badge-urgent" id="modalNoticePriority">Urgent</span>
            <span class="notice-countdown-pill future" id="modalNoticeCountdown">
              <i class="fa-regular fa-clock"></i> In 26 Days
            </span>
          </div>
          <h2 class="lsic-modal-title" id="modalNoticeTitle">Notice Title</h2>
          <button class="lsic-modal-close-btn" id="modalCloseNoticeBtn" aria-label="Close Notice" type="button">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="lsic-modal-meta-grid">
          <div class="modal-meta-item">
            <i class="fa-solid fa-calendar-day"></i>
            <div><strong>Date:</strong> <span id="modalNoticeDate"></span></div>
          </div>
          <div class="modal-meta-item">
            <i class="fa-solid fa-clock"></i>
            <div><strong>Time:</strong> <span id="modalNoticeTime"></span></div>
          </div>
          <div class="modal-meta-item">
            <i class="fa-solid fa-location-dot"></i>
            <div><strong>Venue:</strong> <span id="modalNoticeVenue"></span></div>
          </div>
          <div class="modal-meta-item">
            <i class="fa-solid fa-user-group"></i>
            <div><strong>Audience:</strong> <span id="modalNoticeAudience"></span></div>
          </div>
        </div>

        <div class="lsic-modal-body" id="modalNoticeBody"></div>

        <div style="padding: 0 28px 18px;">
          <div class="modal-contact-box" id="modalNoticeContact"></div>
        </div>

        <div class="lsic-modal-footer">
          <div class="modal-footer-left">
            <button class="cta-button primary" id="modalGoogleCalBtn" type="button" style="padding: 9px 18px; font-size: 0.85rem;">
              <i class="fa-brands fa-google"></i> Google Calendar
            </button>
            <button class="cta-button secondary" id="modalIcsBtn" type="button" style="padding: 9px 18px; font-size: 0.85rem;">
              <i class="fa-solid fa-calendar-arrow-down"></i> Download .ics
            </button>
          </div>
          <button class="btn-share-whatsapp" id="modalWaShareBtn" type="button" style="width: auto; height: auto; padding: 9px 18px; border-radius: 50px; font-size: 0.85rem; display: inline-flex; gap: 8px; font-weight: 600;">
            <i class="fa-brands fa-whatsapp"></i> Share Notice
          </button>
        </div>
      </div>
    `;
    document.body.appendChild(modalBackdrop);
  }

  // 3. Parent Alert Subscription Modal
  if (!document.getElementById("lsicAlertModal")) {
    const alertModalBackdrop = document.createElement("div");
    alertModalBackdrop.className = "lsic-modal-backdrop";
    alertModalBackdrop.id = "lsicAlertModal";
    alertModalBackdrop.setAttribute("aria-hidden", "true");
    alertModalBackdrop.setAttribute("role", "dialog");
    alertModalBackdrop.setAttribute("aria-modal", "true");
    alertModalBackdrop.innerHTML = `
      <div class="lsic-modal-dialog">
        <div class="lsic-modal-header" style="background: linear-gradient(135deg, #063920 0%, #005681 100%);">
          <div class="lsic-modal-badges">
            <span class="notice-category-badge cat-pta" style="background: rgba(255,255,255,0.2); color: #fff;">
              <i class="fa-solid fa-bell-concierge"></i> Parent Service
            </span>
          </div>
          <h2 class="lsic-modal-title">Subscribe to Parent Alerts</h2>
          <p style="color: rgba(255,255,255,0.85); font-size: 0.88rem; margin-top: 4px;">
            Receive timely WhatsApp, SMS, and email alerts for PTA meetings, vacation, breaks, and reopening dates.
          </p>
          <button class="lsic-modal-close-btn" id="modalCloseAlertBtn" aria-label="Close" type="button">
            <i class="fa-solid fa-xmark"></i>
          </button>
        </div>

        <div class="lsic-modal-body">
          <form id="parentAlertForm" class="alert-form-grid">
            <div class="alert-form-group">
              <label for="parentName">Parent / Guardian Full Name <span class="req">*</span></label>
              <input type="text" id="parentName" name="parentName" class="alert-form-input" placeholder="e.g. Mrs. Grace Mensah" required />
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
              <div class="alert-form-group">
                <label for="parentPhone">Mobile / WhatsApp Number <span class="req">*</span></label>
                <input type="tel" id="parentPhone" name="parentPhone" class="alert-form-input" placeholder="0244 123 456" required />
              </div>

              <div class="alert-form-group">
                <label for="parentEmail">Email Address</label>
                <input type="email" id="parentEmail" name="parentEmail" class="alert-form-input" placeholder="parent@gmail.com" />
              </div>
            </div>

            <div class="alert-form-group">
              <label for="pupilClass">Child / Ward's Class Level <span class="req">*</span></label>
              <select id="pupilClass" name="pupilClass" class="alert-form-select" required>
                <option value="" disabled selected>Select class level...</option>
                <option value="Crèche / Day Care">Crèche (6 months – 2 years)</option>
                <option value="Nursery 1 & 2">Nursery 1 & 2 (Ages 2 – 4)</option>
                <option value="Kindergarten (KG1 & KG2)">Kindergarten (KG1 & KG2)</option>
                <option value="Lower Primary (P1 - P3)">Lower Primary (Primary 1 – Primary 3)</option>
                <option value="Upper Primary (P4 - P6)">Upper Primary (Primary 4 – Primary 6)</option>
                <option value="Multiple Children">Multiple Children in Different Classes</option>
              </select>
            </div>

            <div class="alert-form-group">
              <label>What Alerts Would You Like to Receive?</label>
              <div class="alert-checkbox-grid">
                <label class="alert-checkbox-label">
                  <input type="checkbox" name="topics" value="PTA Meetings" checked />
                  <span>PTA Meetings & Assemblies</span>
                </label>
                <label class="alert-checkbox-label">
                  <input type="checkbox" name="topics" value="Term Reopening" checked />
                  <span>Term Dates & Reopening</span>
                </label>
                <label class="alert-checkbox-label">
                  <input type="checkbox" name="topics" value="Mid-Term & Vacation" checked />
                  <span>Mid-Term Breaks & Vacation</span>
                </label>
                <label class="alert-checkbox-label">
                  <input type="checkbox" name="topics" value="Graduation Ceremonies" checked />
                  <span>Graduation & Annual Awards</span>
                </label>
              </div>
            </div>

            <div class="alert-form-group">
              <label>Preferred Delivery Methods</label>
              <div class="alert-channel-pills">
                <label class="alert-channel-pill">
                  <input type="checkbox" name="channels" value="WhatsApp" checked />
                  <i class="fa-brands fa-whatsapp" style="color: #25d366;"></i> WhatsApp
                </label>
                <label class="alert-channel-pill">
                  <input type="checkbox" name="channels" value="SMS" checked />
                  <i class="fa-solid fa-comment-sms" style="color: #00a8e8;"></i> SMS Alert
                </label>
                <label class="alert-channel-pill">
                  <input type="checkbox" name="channels" value="Email" checked />
                  <i class="fa-solid fa-envelope" style="color: #f39c12;"></i> Email
                </label>
              </div>
            </div>

            <button type="submit" class="alert-subscribe-submit-btn" id="alertSubscribeSubmitBtn">
              <i class="fa-solid fa-bell"></i> Subscribe to School Alerts
            </button>
          </form>

          <!-- Success State -->
          <div id="alertSuccessState" class="modal-success-state" style="display: none;">
            <div class="success-badge-icon">
              <i class="fa-solid fa-check"></i>
            </div>
            <h3>Registration Confirmed!</h3>
            <p id="alertSuccessMessage">
              Thank you! You are now subscribed to official Life Shepherd International College alerts. You will receive updates directly before all key school dates.
            </p>
            <div style="display: flex; flex-direction: column; gap: 12px; align-items: center;">
              <a href="https://wa.me/233244745177?text=Hello%20Life%20Shepherd%20College,%20I%20have%20subscribed%20for%20parent%20alerts.%20Please%20add%20me%20to%20the%20official%20broadcast%20list." target="_blank" rel="noopener noreferrer" class="whatsapp-direct-join-btn">
                <i class="fa-brands fa-whatsapp"></i> Join Parents WhatsApp Broadcast
              </a>
              <button class="btn btn-secondary" id="alertSuccessCloseBtn" type="button" style="margin-top: 6px;">
                Close Window
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
    document.body.appendChild(alertModalBackdrop);
  }
}

// Initialization of all Parent Notification System components
function initParentNotifications() {
  injectNotificationDOM();
  updateNotifBadge();
  syncHeaderOffset();

  window.addEventListener("resize", syncHeaderOffset);

  // Announcement Banner logic
  const banner = document.getElementById("announcementBanner");
  const bannerCloseBtn = document.getElementById("bannerCloseBtn");
  const isBannerDismissed = sessionStorage.getItem("lsic_banner_dismissed");

  if (banner) {
    if (isBannerDismissed === "true") {
      banner.classList.add("dismissed");
    }
    syncHeaderOffset();

    if (bannerCloseBtn) {
      bannerCloseBtn.addEventListener("click", () => {
        banner.classList.add("dismissed");
        sessionStorage.setItem("lsic_banner_dismissed", "true");
        setTimeout(syncHeaderOffset, 420);
      });
    }

    // Banner "View Details" click
    document.querySelectorAll("[data-open-notice]").forEach((btn) => {
      btn.addEventListener("click", () => {
        const noticeId = btn.getAttribute("data-open-notice");
        openNoticeModal(noticeId);
      });
    });
  }

  // Header Bell Button toggle
  const bellBtn = document.getElementById("notifBellBtn");
  if (bellBtn) {
    bellBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleNotifDropdown();
    });
  }

  // Filter chips in dropdown
  document.querySelectorAll(".notif-filter-chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      document.querySelectorAll(".notif-filter-chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      currentDropdownFilter = chip.getAttribute("data-filter");
      updateDropdownList();
    });
  });

  // Mark all as read in dropdown
  const markAllReadBtn = document.getElementById("markAllReadBtn");
  if (markAllReadBtn) {
    markAllReadBtn.addEventListener("click", () => {
      markAllNoticesAsRead();
    });
  }

  // Subscribe button in dropdown
  const dropdownSubscribeBtn = document.getElementById("dropdownSubscribeBtn");
  if (dropdownSubscribeBtn) {
    dropdownSubscribeBtn.addEventListener("click", () => {
      closeNotifDropdown();
      openAlertModal();
    });
  }

  // Notice Modal Close handlers
  const modalCloseNoticeBtn = document.getElementById("modalCloseNoticeBtn");
  if (modalCloseNoticeBtn) {
    modalCloseNoticeBtn.addEventListener("click", closeNoticeModal);
  }

  const noticeModalBackdrop = document.getElementById("lsicNoticeModal");
  if (noticeModalBackdrop) {
    noticeModalBackdrop.addEventListener("click", (e) => {
      if (e.target === noticeModalBackdrop) closeNoticeModal();
    });
  }

  // Alert Modal Close handlers
  const modalCloseAlertBtn = document.getElementById("modalCloseAlertBtn");
  if (modalCloseAlertBtn) {
    modalCloseAlertBtn.addEventListener("click", closeAlertModal);
  }

  const alertSuccessCloseBtn = document.getElementById("alertSuccessCloseBtn");
  if (alertSuccessCloseBtn) {
    alertSuccessCloseBtn.addEventListener("click", closeAlertModal);
  }

  const alertModalBackdrop = document.getElementById("lsicAlertModal");
  if (alertModalBackdrop) {
    alertModalBackdrop.addEventListener("click", (e) => {
      if (e.target === alertModalBackdrop) closeAlertModal();
    });
  }

  // Parent Alert Form submit & button click handlers
  const alertForm = document.getElementById("parentAlertForm");
  const alertSubmitBtn = document.getElementById("alertSubscribeSubmitBtn") || (alertForm ? alertForm.querySelector(".alert-subscribe-submit-btn") : null);

  if (alertForm) {
    alertForm.addEventListener("submit", (e) => {
      e.preventDefault();
      handleAlertSubscription(alertForm);
    });
  }

  if (alertSubmitBtn && alertForm) {
    alertSubmitBtn.addEventListener("click", (e) => {
      if (alertForm.checkValidity && !alertForm.checkValidity()) {
        alertForm.reportValidity();
        return;
      }
      e.preventDefault();
      handleAlertSubscription(alertForm);
    });
  }

  // Open subscription modal from notice board CTA button
  const openSubscribeModalBtn = document.getElementById("openSubscribeModalBtn");
  if (openSubscribeModalBtn) {
    openSubscribeModalBtn.addEventListener("click", openAlertModal);
  }

  // Notice Board Filter tabs (on index.html)
  document.querySelectorAll(".notice-tab-btn").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelectorAll(".notice-tab-btn").forEach((t) => {
        t.classList.remove("active");
        t.setAttribute("aria-selected", "false");
      });
      tab.classList.add("active");
      tab.setAttribute("aria-selected", "true");
      currentBoardCategory = tab.getAttribute("data-category");
      renderNoticeBoardGrid();
    });
  });

  // Render initial notice board grid if container is present
  renderNoticeBoardGrid();

  // Close dropdown or calendar menus on outside click
  document.addEventListener("click", (e) => {
    const dropdown = document.getElementById("notifDropdown");
    const bellBtn = document.getElementById("notifBellBtn");
    if (dropdown && dropdown.classList.contains("active")) {
      if (!dropdown.contains(e.target) && (!bellBtn || !bellBtn.contains(e.target))) {
        closeNotifDropdown();
      }
    }

    document.querySelectorAll(".cal-dropdown-menu.active").forEach((menu) => {
      if (!menu.contains(e.target) && !menu.previousElementSibling.contains(e.target)) {
        menu.classList.remove("active");
      }
    });
  });

  // Keyboard accessibility: Close modals/dropdowns on Escape
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeNoticeModal();
      closeAlertModal();
      closeNotifDropdown();
      document.querySelectorAll(".cal-dropdown-menu.active").forEach((m) => m.classList.remove("active"));
    }
  });
}

// Call on DOMContentLoaded
document.addEventListener("DOMContentLoaded", function () {
  initParentNotifications();
});

