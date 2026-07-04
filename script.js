/**
 * Website tĩnh — Một vài lời muốn nói
 * Pure JavaScript — không dùng thư viện ngoài
 */

(function () {
  'use strict';

  /* ============================================
     DOM Elements
     ============================================ */
  const loadingScreen = document.getElementById('loading-screen');
  const mainContent = document.getElementById('main-content');
  const readMoreBtn = document.getElementById('read-more-btn');
  const thankYouBtn = document.getElementById('thank-you-btn');
  const messageSection = document.getElementById('message');
  const typewriterContainer = document.getElementById('typewriter-container');
  const notification = document.getElementById('notification');
  const effectsLayer = document.getElementById('effects-layer');
  const particlesContainer = document.getElementById('particles-container');
  const starsContainer = document.getElementById('stars-container');
  const heartsBgContainer = document.getElementById('hearts-bg-container');
  const bgGradient = document.querySelector('.bg-gradient');

  /* ============================================
     Configuration
     ============================================ */
  const LOADING_DURATION = 2500; // 2.5 giây
  const MESSAGE_LINES = [
    'Dạo này anh cảm giác em có hơi lạnh nhạt với anh một chút.',
    'Tụi mình không còn nói chuyện nhiều như trước, cũng không còn nhắn tin cho nhau nhiều nữa.',
    'Anh có hỏi em thì em chỉ nói là em không biết, nên anh nghĩ có lẽ em không muốn nói thẳng với anh lúc này, và anh tôn trọng điều đó.',
    'Thật sự anh rất lo.',
    'Anh thật sự rất yêu em và không muốn tụi mình vì những cảm xúc hiện tại mà dần xa nhau rồi không còn tìm hiểu nhau nữa.',
    'Có lẽ vì tụi mình ở xa nên anh cũng không thể làm được nhiều điều cho em, không thể gặp em thường xuyên hay ở bên em những lúc em mệt.',
    'Nếu thời gian qua anh đã vô tình làm em buồn, làm em mệt hoặc khiến em cảm thấy áp lực thì anh xin lỗi nhé.',
    'Anh chỉ muốn em biết rằng khoảng thời gian được làm quen và trò chuyện cùng em đối với anh thật sự rất đáng quý.',
    'Và nếu một ngày em muốn nói chuyện lại như trước, anh vẫn sẽ rất vui.'
  ];
  const LINE_DELAY = 2300; // 2.3 giây giữa các câu
  const TYPE_SPEED = 45; // ms mỗi ký tự
  const NOTIFICATION_DURATION = 4000; // 4 giây

  let typewriterStarted = false;
  let notificationTimeout = null;

  /* ============================================
     Loading Screen
     ============================================ */
  function initLoadingScreen() {
    setTimeout(function () {
      loadingScreen.classList.add('fade-out');
      loadingScreen.setAttribute('aria-busy', 'false');

      mainContent.classList.remove('hidden');
      mainContent.classList.add('visible');

      // Hiện hero section ngay
      const heroSection = document.querySelector('#hero .fade-in-section');
      if (heroSection) {
        heroSection.classList.add('visible');
      }

      // Xóa loading screen khỏi DOM sau khi fade xong
      setTimeout(function () {
        loadingScreen.style.display = 'none';
      }, 800);
    }, LOADING_DURATION);
  }

  /* ============================================
     Smooth Scroll
     ============================================ */
  function initSmoothScroll() {
    readMoreBtn.addEventListener('click', function () {
      messageSection.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ============================================
     Ripple Effect on Buttons
     ============================================ */
  function initRippleEffect() {
    const rippleButtons = document.querySelectorAll('.ripple-btn');

    rippleButtons.forEach(function (btn) {
      btn.addEventListener('click', function (e) {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height);

        ripple.classList.add('ripple');
        ripple.style.width = size + 'px';
        ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

        btn.appendChild(ripple);

        ripple.addEventListener('animationend', function () {
          ripple.remove();
        });
      });
    });
  }

  /* ============================================
     Intersection Observer — Fade-in on Scroll
     ============================================ */
  function initScrollAnimations() {
    const sections = document.querySelectorAll('.fade-in-section');

    const observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Bắt đầu typewriter khi message section hiện
            if (entry.target.closest('#message') && !typewriterStarted) {
              typewriterStarted = true;
              startTypewriter();
            }
          }
        });
      },
      {
        threshold: 0.25,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    sections.forEach(function (section) {
      observer.observe(section);
    });
  }

  /* ============================================
     Typewriter Effect
     ============================================ */
  function createMessageLine(index) {
    const line = document.createElement('p');
    line.classList.add('message-line');
    line.setAttribute('data-index', index);
    typewriterContainer.appendChild(line);
    return line;
  }

  function typeText(element, text, callback) {
    element.classList.add('typing');
    let charIndex = 0;

    function typeChar() {
      if (charIndex < text.length) {
        element.textContent += text.charAt(charIndex);
        charIndex++;
        setTimeout(typeChar, TYPE_SPEED);
      } else {
        element.classList.remove('typing');
        if (callback) callback();
      }
    }

    element.classList.add('visible');
    typeChar();
  }

  function startTypewriter() {
    // Tạo sẵn các dòng
    MESSAGE_LINES.forEach(function (_, index) {
      createMessageLine(index);
    });

    let currentLine = 0;

    function typeNextLine() {
      if (currentLine >= MESSAGE_LINES.length) return;

      const lineElement = typewriterContainer.querySelector(
        '[data-index="' + currentLine + '"]'
      );

      typeText(lineElement, MESSAGE_LINES[currentLine], function () {
        currentLine++;
        if (currentLine < MESSAGE_LINES.length) {
          setTimeout(typeNextLine, LINE_DELAY);
        }
      });
    }

    typeNextLine();
  }

  /* ============================================
     Dynamic Background Particles
     ============================================ */
  function createParticles() {
    const particleCount = window.innerWidth < 768 ? 25 : 40;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.classList.add('particle');

      const size = Math.random() * 4 + 2;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';
      particle.style.left = Math.random() * 100 + '%';
      particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
      particle.style.animationDelay = (Math.random() * 10) + 's';

      particlesContainer.appendChild(particle);
    }
  }

  function createStars() {
    const starCount = window.innerWidth < 768 ? 15 : 25;
    const starChars = ['✦', '✧', '★', '⋆'];

    for (let i = 0; i < starCount; i++) {
      const star = document.createElement('span');
      star.classList.add('star');
      star.textContent = starChars[Math.floor(Math.random() * starChars.length)];
      star.style.left = Math.random() * 100 + '%';
      star.style.top = Math.random() * 100 + '%';
      star.style.fontSize = (Math.random() * 10 + 8) + 'px';
      star.style.animationDuration = (Math.random() * 3 + 2) + 's';
      star.style.animationDelay = (Math.random() * 5) + 's';

      starsContainer.appendChild(star);
    }
  }

  function createBackgroundHearts() {
    const heartCount = window.innerWidth < 768 ? 6 : 10;

    for (let i = 0; i < heartCount; i++) {
      const heart = document.createElement('span');
      heart.classList.add('bg-heart');
      heart.textContent = '💜';
      heart.style.left = Math.random() * 100 + '%';
      heart.style.top = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 14 + 12) + 'px';
      heart.style.animationDuration = (Math.random() * 4 + 4) + 's';
      heart.style.animationDelay = (Math.random() * 5) + 's';

      heartsBgContainer.appendChild(heart);
    }
  }

  /* ============================================
     Parallax Effect on Scroll
     ============================================ */
  function initParallax() {
    let ticking = false;

    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(function () {
          const scrollY = window.scrollY;

          // Parallax nhẹ cho gradient nền
          if (bgGradient) {
            bgGradient.style.transform = 'translateY(' + (scrollY * 0.15) + 'px)';
          }

          // Parallax cho các container hiệu ứng
          const parallaxOffset = scrollY * 0.08;
          particlesContainer.style.transform = 'translateY(' + parallaxOffset + 'px)';
          starsContainer.style.transform = 'translateY(' + (parallaxOffset * 0.5) + 'px)';
          heartsBgContainer.style.transform = 'translateY(' + (parallaxOffset * 1.2) + 'px)';

          ticking = false;
        });
        ticking = true;
      }
    });
  }

  /* ============================================
     Floating Hearts & Falling Petals (Thank You Button)
     ============================================ */
  function createFloatingHearts(x, y) {
    const heartEmojis = ['💜', '💗', '💖', '❤️'];
    const count = 12;

    for (let i = 0; i < count; i++) {
      const heart = document.createElement('span');
      heart.classList.add('floating-heart');
      heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];

      const offsetX = (Math.random() - 0.5) * 200;
      heart.style.left = (x + offsetX) + 'px';
      heart.style.top = y + 'px';
      heart.style.fontSize = (Math.random() * 16 + 18) + 'px';
      heart.style.animationDuration = (Math.random() * 1.5 + 2) + 's';
      heart.style.animationDelay = (Math.random() * 0.5) + 's';

      effectsLayer.appendChild(heart);

      heart.addEventListener('animationend', function () {
        heart.remove();
      });
    }
  }

  function createFallingPetals() {
    const count = 18;

    for (let i = 0; i < count; i++) {
      const petal = document.createElement('div');
      petal.classList.add('petal');

      petal.style.left = Math.random() * 100 + 'vw';
      petal.style.top = '-20px';
      petal.style.width = (Math.random() * 8 + 8) + 'px';
      petal.style.height = (Math.random() * 8 + 8) + 'px';
      petal.style.animationDuration = (Math.random() * 2 + 3) + 's';
      petal.style.animationDelay = (Math.random() * 1.5) + 's';

      // Màu hoa đa dạng
      const hue = Math.random() > 0.5 ? '#ffb3d0' : '#ffd6e7';
      petal.style.background = 'linear-gradient(135deg, ' + hue + ' 0%, #fff0f5 100%)';

      effectsLayer.appendChild(petal);

      petal.addEventListener('animationend', function () {
        petal.remove();
      });
    }
  }

  /* ============================================
     Notification Popup
     ============================================ */
  function showNotification() {
    notification.classList.remove('hidden');
    notification.classList.add('show');

    if (notificationTimeout) {
      clearTimeout(notificationTimeout);
    }

    notificationTimeout = setTimeout(function () {
      notification.classList.remove('show');
      notification.classList.add('hidden');
    }, NOTIFICATION_DURATION);
  }

  function initThankYouButton() {
    thankYouBtn.addEventListener('click', function (e) {
      const rect = thankYouBtn.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      createFloatingHearts(centerX, centerY);
      createFallingPetals();
      showNotification();
    });
  }

  /* ============================================
     Initialize Everything
     ============================================ */
  function init() {
    initLoadingScreen();
    initSmoothScroll();
    initRippleEffect();
    initScrollAnimations();
    initParallax();
    initThankYouButton();

    createParticles();
    createStars();
    createBackgroundHearts();
  }

  // Chạy khi DOM sẵn sàng
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
