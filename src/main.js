// Style is linked directly in index.html

document.addEventListener('DOMContentLoaded', () => {
  // Mobile menu toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const navLinks = document.querySelector('.nav-links');
  
  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener('click', () => {
      navLinks.classList.toggle('active');
      mobileToggle.classList.toggle('active');
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('active');
        mobileToggle.classList.remove('active');
      });
    });
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId === '') return;
      
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        const navHeight = document.querySelector('nav')?.offsetHeight || 0;
        const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Intersection Observer for scroll animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  document.querySelectorAll('.fade-up').forEach(element => {
    observer.observe(element);
  });
  
  // Parallax effect on scroll for atmospheric orbs
  let ticking = false;
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(() => {
        const scrolled = window.scrollY;
        document.querySelectorAll('.bg-gradient-orb:not([style*="top:50%"])').forEach((orb, index) => {
          const speed = (index + 1) * 0.08;
          orb.style.transform = `translateY(${scrolled * speed}px)`;
        });
        ticking = false;
      });
      ticking = true;
    }
  });

  // Animated counter for hero metrics
  const animateCounter = (element, target, suffix = '') => {
    const duration = 2000;
    const start = 0;
    const startTime = performance.now();
    
    const update = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out cubic
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(start + (target - start) * eased);
      
      element.textContent = current.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(update);
      }
    };
    
    requestAnimationFrame(update);
  };

  // Set up counter animation for hero metrics when they come into view
  const metricsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const metrics = entry.target.querySelectorAll('.hero-metric-value');
        metrics.forEach(metric => {
          const text = metric.textContent;
          if (text.includes('$')) {
            animateCounter(metric, 2.4, '');
            // Custom handling for currency
            const countUp = () => {
              let count = 0;
              const interval = setInterval(() => {
                count += 0.1;
                if (count >= 2.4) {
                  metric.textContent = '$2.4M+';
                  clearInterval(interval);
                } else {
                  metric.textContent = '$' + count.toFixed(1) + 'M+';
                }
              }, 80);
            };
            countUp();
          } else if (text.includes('150')) {
            let count = 0;
            const interval = setInterval(() => {
              count += 3;
              if (count >= 150) {
                metric.textContent = '150+';
                clearInterval(interval);
              } else {
                metric.textContent = count + '+';
              }
            }, 30);
          }
          // "Top 1%" stays static
        });
        metricsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroMetrics = document.querySelector('.hero-metrics');
  if (heroMetrics) {
    metricsObserver.observe(heroMetrics);
  }
});
