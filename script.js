document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       Custom Cursor Logic
       ========================================================================== */
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    if (!isTouchDevice) {
        const cursorDot = document.querySelector('.cursor-dot');
        const cursorOutline = document.querySelector('.cursor-outline');
        const hoverLinks = document.querySelectorAll('.hover-link, .btn, .service-card, .portfolio-item, .contact-details li a, .social-links a');

        let mouseX = 0;
        let mouseY = 0;
        let outlineX = 0;
        let outlineY = 0;

        // Mouse move tracking
        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
            
            // Instantly move the dot
            cursorDot.style.left = `${mouseX}px`;
            cursorDot.style.top = `${mouseY}px`;
        });

        // Add trailing animation for the outline using requestAnimationFrame
        const animateCursor = () => {
            const ease = 0.15;
            outlineX += (mouseX - outlineX) * ease;
            outlineY += (mouseY - outlineY) * ease;
            
            cursorOutline.style.left = `${outlineX}px`;
            cursorOutline.style.top = `${outlineY}px`;
            
            requestAnimationFrame(animateCursor);
        };
        animateCursor();

        // Hover states
        hoverLinks.forEach(link => {
            link.addEventListener('mouseenter', () => {
                document.body.classList.add('cursor-hover');
            });
            link.addEventListener('mouseleave', () => {
                document.body.classList.remove('cursor-hover');
            });
        });
    }

    /* ==========================================================================
       Navigation Scroll Effect & Mobile Menu
       ========================================================================== */
    const navbar = document.querySelector('.navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinkItems = document.querySelectorAll('.nav-links li a');

    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navLinks.classList.toggle('active');
    });

    // Close mobile menu on link click
    navLinkItems.forEach(item => {
        item.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navLinks.classList.remove('active');
        });
    });

    /* ==========================================================================
       Scroll Reveal Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal-text, .reveal-fade, .reveal-scale, .scroll-reveal, .process');

    const revealCallback = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                if(entry.target.classList.contains('process')){
                    entry.target.classList.add('visible');
                }
                // Optional: Stop observing once revealed
                // observer.unobserve(entry.target);
            }
        });
    };

    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver(revealCallback, revealOptions);

    revealElements.forEach(el => {
        revealObserver.observe(el);
    });

    // Trigger hero animations immediately on load
    setTimeout(() => {
        document.querySelectorAll('.hero .reveal-text, .hero .reveal-fade, .hero .reveal-scale').forEach(el => {
            el.classList.add('active');
        });
    }, 100);

    /* ==========================================================================
       Testimonial Slider (Auto Carousel)
       ========================================================================== */
    const track = document.querySelector('.testimonial-track');
    const cards = document.querySelectorAll('.testimonial-card');
    
    // Only init if track exists and has cards
    if (track && cards.length > 0) {
        let currentIndex = 0;
        let slideInterval;
        
        // Calculate max index based on cards visible vs total cards
        const getVisibleCardsCount = () => {
            if (window.innerWidth <= 768) return 1;
            if (window.innerWidth <= 1024) return 2;
            return 3;
        };

        const maxIndex = () => Math.max(0, cards.length - getVisibleCardsCount());

        const updateSlider = () => {
            const cardWidth = cards[0].offsetWidth;
            const gap = 30; // 30px gap based on CSS
            const offset = (cardWidth + gap) * currentIndex;
            track.style.transform = `translateX(-${offset}px)`;
        };

        const nextSlide = () => {
            currentIndex++;
            if (currentIndex > maxIndex()) {
                currentIndex = 0;
            }
            updateSlider();
        };

        // Start auto slide
        slideInterval = setInterval(nextSlide, 5000);

        // Pause on hover
        track.addEventListener('mouseenter', () => {
            clearInterval(slideInterval);
        });
        track.addEventListener('mouseleave', () => {
            slideInterval = setInterval(nextSlide, 5000);
        });

        // Handle window resize to prevent off-screen slides
        window.addEventListener('resize', () => {
            if (currentIndex > maxIndex()) {
                currentIndex = maxIndex();
            }
            updateSlider();
        });
    }

    /* ==========================================================================
       Dynamic Footer Year
       ========================================================================== */
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }
    
    /* ==========================================================================
       Form Submission Mock
       ========================================================================== */
    const form = document.getElementById('contactForm');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = form.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            btn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';
            btn.disabled = true;
            
            setTimeout(() => {
                btn.innerHTML = 'Sent! <i class="fa-solid fa-check"></i>';
                btn.style.background = '#00d2ff'; // Teal color
                btn.style.color = '#0f0f0f';
                form.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.disabled = false;
                    btn.style = '';
                }, 3000);
            }, 1500);
        });
    }
});
