/**
 * BRIGHT HARBOR DENTAL — INTERACTIVE ENGINE
 * Handlers for sticky nav, mobile menu, gallery lightbox, before/after sliders,
 * testimonial carousel, accessible FAQ accordion, booking validation & animations.
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileMenu();
  initScrollSpy();
  initGalleryLightbox();
  initBeforeAfterSliders();
  initTestimonialsSlider();
  initFaqAccordion();
  initBookingForms();
  initScrollAnimations();
});

/* ==========================================================================
   1. STICKY HEADER & BACK-TO-TOP
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.main-header');
  const backToTopBtn = document.querySelector('.back-to-top');

  window.addEventListener('scroll', () => {
    const scrollPos = window.scrollY;

    if (scrollPos > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }

    if (scrollPos > 400) {
      backToTopBtn?.classList.add('visible');
    } else {
      backToTopBtn?.classList.remove('visible');
    }
  }, { passive: true });

  backToTopBtn?.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileMenu() {
  const toggle = document.querySelector('.menu-toggle');
  const menu = document.querySelector('.nav-menu');
  const links = document.querySelectorAll('.nav-menu .nav-link, .nav-menu .btn');

  if (!toggle || !menu) return;

  const toggleMenu = (open) => {
    const isOpen = open !== undefined ? open : !menu.classList.contains('active');
    toggle.classList.toggle('active', isOpen);
    menu.classList.toggle('active', isOpen);
    toggle.setAttribute('aria-expanded', isOpen.toString());
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  toggle.addEventListener('click', () => toggleMenu());

  links.forEach(link => {
    link.addEventListener('click', () => {
      if (menu.classList.contains('active')) {
        toggleMenu(false);
      }
    });
  });

  document.addEventListener('click', (e) => {
    if (menu.classList.contains('active') && !menu.contains(e.target) && !toggle.contains(e.target)) {
      toggleMenu(false);
    }
  });
}

/* ==========================================================================
   3. SCROLL SPY FOR ACTIVE NAVIGATION
   ========================================================================== */
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-menu .nav-link');

  if (!sections.length || !navLinks.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px' });

  sections.forEach(section => observer.observe(section));
}

/* ==========================================================================
   4. INSIDE OUR CLINIC — GALLERY & LIGHTBOX
   ========================================================================== */
function initGalleryLightbox() {
  const filterBtns = document.querySelectorAll('.gallery-tab-btn');
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('galleryLightbox');
  if (!lightbox) return;

  const lbImg = lightbox.querySelector('.lightbox-image-wrapper img');
  const lbTitle = lightbox.querySelector('.lightbox-title');
  const lbDesc = lightbox.querySelector('.lightbox-desc');
  const lbCounter = lightbox.querySelector('.lightbox-counter');
  const closeBtn = lightbox.querySelector('.lightbox-close-btn');
  const prevBtn = lightbox.querySelector('.lightbox-btn.prev');
  const nextBtn = lightbox.querySelector('.lightbox-btn.next');

  let currentCategory = 'all';
  let activeItems = Array.from(galleryItems);
  let currentIndex = 0;

  // Category Filtering
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-filter') || 'all';

      galleryItems.forEach(item => {
        const itemCat = item.getAttribute('data-category');
        if (currentCategory === 'all' || itemCat === currentCategory) {
          item.style.display = 'block';
          item.style.opacity = '1';
        } else {
          item.style.display = 'none';
          item.style.opacity = '0';
        }
      });

      activeItems = Array.from(galleryItems).filter(item => item.style.display !== 'none');
    });
  });

  // Open Lightbox
  const openLightbox = (index) => {
    currentIndex = index;
    const item = activeItems[currentIndex];
    if (!item) return;

    const img = item.querySelector('img');
    const title = item.getAttribute('data-title') || img.getAttribute('alt') || 'Bright Harbor Clinic';
    const desc = item.getAttribute('data-desc') || '';

    lbImg.src = img.src;
    lbImg.alt = title;
    lbTitle.textContent = title;
    lbDesc.textContent = desc;
    lbCounter.textContent = `${currentIndex + 1} of ${activeItems.length}`;

    lightbox.classList.add('active');
    lightbox.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    lightbox.classList.remove('active');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  const showNext = () => {
    if (activeItems.length === 0) return;
    currentIndex = (currentIndex + 1) % activeItems.length;
    openLightbox(currentIndex);
  };

  const showPrev = () => {
    if (activeItems.length === 0) return;
    currentIndex = (currentIndex - 1 + activeItems.length) % activeItems.length;
    openLightbox(currentIndex);
  };

  galleryItems.forEach((item) => {
    item.addEventListener('click', () => {
      const idx = activeItems.indexOf(item);
      if (idx !== -1) openLightbox(idx);
    });
  });

  closeBtn?.addEventListener('click', closeLightbox);
  nextBtn?.addEventListener('click', (e) => { e.stopPropagation(); showNext(); });
  prevBtn?.addEventListener('click', (e) => { e.stopPropagation(); showPrev(); });

  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard navigation
  window.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') showNext();
    if (e.key === 'ArrowLeft') showPrev();
  });

  // Mobile Swipe Support
  let touchStartX = 0;
  let touchEndX = 0;

  lightbox.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  lightbox.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 45) {
      if (diff < 0) showNext();
      else showPrev();
    }
  }
}

/* ==========================================================================
   5. REAL SMILE TRANSFORMATIONS — BEFORE & AFTER DRAG SLIDERS
   ========================================================================== */
function initBeforeAfterSliders() {
  const filterBtns = document.querySelectorAll('.transformations-tab-btn');
  const cards = document.querySelectorAll('.ba-card');
  const sliders = document.querySelectorAll('.ba-slider-container');

  // Filter Tabs
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.getAttribute('data-filter') || 'all';

      cards.forEach(card => {
        const cat = card.getAttribute('data-category');
        if (filter === 'all' || cat === filter) {
          card.style.display = 'flex';
          card.style.opacity = '1';
        } else {
          card.style.display = 'none';
          card.style.opacity = '0';
        }
      });
    });
  });

  // Slider Drag Engine
  sliders.forEach(slider => {
    const beforeLayer = slider.querySelector('.ba-before-layer');
    const handle = slider.querySelector('.ba-handle');
    const rangeInput = slider.querySelector('.ba-range-input');
    const beforeImg = beforeLayer?.querySelector('img');

    // Keep beforeImg pixel dimensions matching container
    const updateImageWidth = () => {
      if (beforeImg) {
        beforeImg.style.width = `${slider.offsetWidth}px`;
      }
    };

    updateImageWidth();
    window.addEventListener('resize', updateImageWidth);

    const setPosition = (percentage) => {
      const clamped = Math.max(0, Math.min(100, percentage));
      if (beforeLayer) beforeLayer.style.width = `${clamped}%`;
      if (handle) handle.style.left = `${clamped}%`;
      if (rangeInput) rangeInput.value = clamped;
    };

    // Range input change (keyboard & screen readers)
    if (rangeInput) {
      rangeInput.addEventListener('input', (e) => {
        setPosition(parseFloat(e.target.value));
      });
    }

    // Direct pointer drag (Mouse & Touch)
    let isDragging = false;

    const onPointerMove = (e) => {
      if (!isDragging) return;
      const rect = slider.getBoundingClientRect();
      const pageX = e.pageX !== undefined ? e.pageX : (e.touches ? e.touches[0].pageX : 0);
      const offsetX = pageX - rect.left - window.scrollX;
      const percent = (offsetX / rect.width) * 100;
      setPosition(percent);
    };

    const stopDragging = () => {
      isDragging = false;
      window.removeEventListener('mousemove', onPointerMove);
      window.removeEventListener('mouseup', stopDragging);
      window.removeEventListener('touchmove', onPointerMove);
      window.removeEventListener('touchend', stopDragging);
    };

    slider.addEventListener('mousedown', (e) => {
      isDragging = true;
      onPointerMove(e);
      window.addEventListener('mousemove', onPointerMove);
      window.addEventListener('mouseup', stopDragging);
    });

    slider.addEventListener('touchstart', (e) => {
      isDragging = true;
      onPointerMove(e);
      window.addEventListener('touchmove', onPointerMove, { passive: true });
      window.addEventListener('touchend', stopDragging);
    }, { passive: true });
  });
}

/* ==========================================================================
   6. TESTIMONIALS SLIDER
   ========================================================================== */
function initTestimonialsSlider() {
  const slides = document.querySelectorAll('.testimonial-slide');
  const prevBtn = document.querySelector('.test-nav-btn.prev');
  const nextBtn = document.querySelector('.test-nav-btn.next');
  const dotsContainer = document.querySelector('.test-dots');

  if (!slides.length) return;

  let current = 0;
  let autoTimer = null;

  // Build dots
  if (dotsContainer) {
    dotsContainer.innerHTML = '';
    slides.forEach((_, idx) => {
      const dot = document.createElement('button');
      dot.className = `test-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to testimonial ${idx + 1}`);
      dot.addEventListener('click', () => goToSlide(idx));
      dotsContainer.appendChild(dot);
    });
  }

  const dots = document.querySelectorAll('.test-dot');

  const goToSlide = (index) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');

    current = (index + slides.length) % slides.length;

    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
    resetTimer();
  };

  const nextSlide = () => goToSlide(current + 1);
  const prevSlide = () => goToSlide(current - 1);

  nextBtn?.addEventListener('click', nextSlide);
  prevBtn?.addEventListener('click', prevSlide);

  // Auto rotation
  const startTimer = () => {
    autoTimer = setInterval(nextSlide, 7000);
  };
  const resetTimer = () => {
    clearInterval(autoTimer);
    startTimer();
  };

  startTimer();

  const track = document.querySelector('.testimonials-slider-wrap');
  track?.addEventListener('mouseenter', () => clearInterval(autoTimer));
  track?.addEventListener('mouseleave', () => startTimer());
}

/* ==========================================================================
   7. ACCESSIBLE FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const btn = item.querySelector('.faq-question-btn');
    const panel = item.querySelector('.faq-answer-panel');

    btn?.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all others for sleek accordion
      faqItems.forEach(other => {
        if (other !== item) {
          other.classList.remove('active');
          const otherBtn = other.querySelector('.faq-question-btn');
          const otherPanel = other.querySelector('.faq-answer-panel');
          if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
          if (otherPanel) otherPanel.style.maxHeight = '0px';
        }
      });

      // Toggle this item
      if (isOpen) {
        item.classList.remove('active');
        btn.setAttribute('aria-expanded', 'false');
        if (panel) panel.style.maxHeight = '0px';
      } else {
        item.classList.add('active');
        btn.setAttribute('aria-expanded', 'true');
        if (panel) panel.style.maxHeight = `${panel.scrollHeight}px`;
      }
    });
  });
}

/* ==========================================================================
   8. APPOINTMENT BOOKING FORMS & VALIDATION
   ========================================================================== */
function initBookingForms() {
  const mainForm = document.getElementById('appointmentForm');
  const quickForm = document.getElementById('quickBookingForm');
  const successModal = document.getElementById('bookingSuccessModal');
  const closeSuccessBtn = document.getElementById('closeSuccessModalBtn');
  const successSummary = document.getElementById('successSummaryText');

  // Quick hero form forwards data to Supabase and shows confirmation
  quickForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const nameInput = quickForm.querySelector('[name="quick_name"]');
    const phoneInput = quickForm.querySelector('[name="quick_phone"]');
    const serviceInput = quickForm.querySelector('[name="quick_service"]');
    const submitBtn = quickForm.querySelector('button[type="submit"]');

    const name = nameInput?.value.trim() || '';
    const phone = phoneInput?.value.trim() || '';
    const service = serviceInput?.value || 'General Dentistry';

    if (!name || !phone) {
      alert('Please provide your name and phone number so we can reach you.');
      return;
    }

    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Saving to Clinic System...';
    }

    // Save to Supabase backend
    if (window.SupabaseAPI) {
      await window.SupabaseAPI.saveQuickInquiry({
        full_name: name,
        phone: phone,
        service: service,
        source: 'hero_quick_booking'
      });
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }

    // Populate main form and show confirmation
    const mainName = mainForm?.querySelector('[name="patient_name"]');
    const mainPhone = mainForm?.querySelector('[name="patient_phone"]');
    const mainService = mainForm?.querySelector('[name="patient_service"]');

    if (mainName) mainName.value = name;
    if (mainPhone) mainPhone.value = phone;
    if (mainService && service) mainService.value = service;

    showSuccessModal(name, service, 'Earliest Available Time');
    quickForm.reset();
  });

  // Main Booking Form Validation & Supabase Persistence
  mainForm?.addEventListener('submit', async (e) => {
    e.preventDefault();

    let isValid = true;
    const nameGroup = mainForm.querySelector('#groupName');
    const phoneGroup = mainForm.querySelector('#groupPhone');
    const emailGroup = mainForm.querySelector('#groupEmail');
    const serviceGroup = mainForm.querySelector('#groupService');
    const submitBtn = mainForm.querySelector('button[type="submit"]');

    const nameVal = mainForm.querySelector('[name="patient_name"]')?.value.trim();
    const phoneVal = mainForm.querySelector('[name="patient_phone"]')?.value.trim();
    const emailVal = mainForm.querySelector('[name="patient_email"]')?.value.trim();
    const dateVal = mainForm.querySelector('[name="patient_date"]')?.value || '';
    const serviceVal = mainForm.querySelector('[name="patient_service"]')?.value;
    const doctorVal = mainForm.querySelector('[name="patient_doctor"]')?.value || 'First Available';
    const notesVal = mainForm.querySelector('[name="patient_message"]')?.value.trim() || '';

    // Validate Name
    if (!nameVal || nameVal.length < 2) {
      nameGroup?.classList.add('has-error');
      isValid = false;
    } else {
      nameGroup?.classList.remove('has-error');
    }

    // Validate Phone
    if (!phoneVal || phoneVal.length < 7) {
      phoneGroup?.classList.add('has-error');
      isValid = false;
    } else {
      phoneGroup?.classList.remove('has-error');
    }

    // Validate Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailVal || !emailRegex.test(emailVal)) {
      emailGroup?.classList.add('has-error');
      isValid = false;
    } else {
      emailGroup?.classList.remove('has-error');
    }

    // Validate Service
    if (!serviceVal) {
      serviceGroup?.classList.add('has-error');
      isValid = false;
    } else {
      serviceGroup?.classList.remove('has-error');
    }

    if (!isValid) return;

    const originalBtnText = submitBtn ? submitBtn.innerHTML : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Connecting to Supabase...';
    }

    // Save to Supabase backend
    if (window.SupabaseAPI) {
      await window.SupabaseAPI.saveAppointment({
        patient_name: nameVal,
        patient_phone: phoneVal,
        patient_email: emailVal,
        preferred_date: dateVal || null,
        service: serviceVal,
        preferred_doctor: doctorVal,
        notes: notesVal
      });
    }

    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnText;
    }

    showSuccessModal(nameVal, serviceVal, dateVal || 'Earliest Available');
    mainForm.reset();
  });

  function showSuccessModal(name, service, date) {
    if (!successModal) return;
    if (successSummary) {
      successSummary.innerHTML = `
        Thank you, <strong>${escapeHtml(name)}</strong>! We've received your appointment request for 
        <strong>${escapeHtml(service)}</strong> on <strong>${escapeHtml(date)}</strong>. 
        Our office manager Sophie Adeyemi will call you within 2 business hours to finalize your visit time.
      `;
    }
    successModal.classList.add('active');
    successModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  closeSuccessBtn?.addEventListener('click', () => {
    successModal.classList.remove('active');
    successModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  });

  successModal?.addEventListener('click', (e) => {
    if (e.target === successModal) {
      successModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  });
}

function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

/* ==========================================================================
   9. SCROLL REVEAL MICRO-ANIMATIONS
   ========================================================================== */
function initScrollAnimations() {
  const elements = document.querySelectorAll('.fade-in-up');

  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('appeared'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('appeared');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elements.forEach(el => observer.observe(el));
}
