// Modern Portfolio JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initMobileMenu();
    initScrollToTop();
    initSkillAnimations();
    initProjectCards();
    initTypewriterEffect();
    initSlideshows();
});

// Navigation functionality
function initNavigation() {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Navbar scroll effect
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Smooth scrolling for navigation links (only for same-page anchors)
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            
            // Only prevent default for same-page anchor links (starting with #)
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const targetId = href.substring(1);
                const targetElement = document.getElementById(targetId);
                
                if (targetElement) {
                    const offsetTop = targetElement.offsetTop - 80;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
            // For external links (like ../index.html), let the browser handle navigation normally
        });
    });
    
    // Active link highlighting
    window.addEventListener('scroll', function() {
        const sections = document.querySelectorAll('section');
        const scrollPos = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// Scroll animations with staggered entrance per group
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.08,
        rootMargin: '0px 0px -40px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                // Stagger siblings within the same parent
                const siblings = Array.from(el.parentElement.children).filter(
                    c => c.classList.contains('animate-on-scroll')
                );
                const idx = siblings.indexOf(el);
                el.style.transitionDelay = (idx * 80) + 'ms';
                el.classList.add('animate');
                observer.unobserve(el);
            }
        });
    }, observerOptions);

    const animateElements = document.querySelectorAll(
        '.experience-card, .project-card, .skill-category, .highlight-item, .role-match-card'
    );
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Mobile menu toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');

    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            const isOpen = navMenu.classList.toggle('open');
            this.classList.toggle('active', isOpen);
            // Animate hamburger bars
            const bars = this.querySelectorAll('.bar');
            if (isOpen) {
                bars[0].style.transform = 'rotate(45deg) translate(5px, 6px)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'rotate(-45deg) translate(5px, -6px)';
            } else {
                bars[0].style.transform = '';
                bars[1].style.opacity = '';
                bars[2].style.transform = '';
            }
        });

        // Close on nav link click
        navMenu.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
                const bars = navToggle.querySelectorAll('.bar');
                bars.forEach(b => { b.style.transform = ''; b.style.opacity = ''; });
            });
        });

        // Close on outside click
        document.addEventListener('click', function(e) {
            if (!navToggle.contains(e.target) && !navMenu.contains(e.target)) {
                navMenu.classList.remove('open');
                navToggle.classList.remove('active');
            }
        });
    }
}

// Scroll to top functionality
function initScrollToTop() {
    // Create scroll to top button
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background: #3b82f6;
        color: white;
        border: none;
        border-radius: 50%;
        cursor: pointer;
        font-size: 18px;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 1000;
        box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
    `;
    
    document.body.appendChild(scrollTopBtn);
    
    // Show/hide scroll top button
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.visibility = 'visible';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.visibility = 'hidden';
        }
    });
    
    // Scroll to top functionality
    scrollTopBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Skill bar animations - trigger when section scrolls into view
function initSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');

    // Store target widths from inline style, then reset to 0
    skillBars.forEach(bar => {
        bar.dataset.targetWidth = bar.style.width || '0%';
        bar.style.width = '0%';
    });

    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                // Stagger within a category
                const category = bar.closest('.skill-category');
                const bars = category ? Array.from(category.querySelectorAll('.skill-progress')) : [bar];
                const idx = bars.indexOf(bar);
                setTimeout(() => {
                    bar.style.width = bar.dataset.targetWidth;
                }, idx * 120);
                skillObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.3, rootMargin: '0px 0px -30px 0px' });

    skillBars.forEach(bar => skillObserver.observe(bar));
}

// Project card interactions - hover handled via CSS; add counter animation
function initProjectCards() {
    // Animate stat numbers in hero on page load
    const statNumbers = document.querySelectorAll('.stat-number');
    statNumbers.forEach(el => {
        const raw = el.textContent.trim();
        const num = parseFloat(raw.replace(/[^0-9.]/g, ''));
        if (!isNaN(num) && num > 1) {
            animateCounter(el, 0, num, raw, 1400);
        }
    });
}

function animateCounter(el, from, to, original, duration) {
    const suffix = original.replace(/[0-9.]/g, '');
    const start = performance.now();
    function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // Ease-out expo
        const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const current = from + (to - from) * eased;
        el.textContent = (Number.isInteger(to) ? Math.round(current) : current.toFixed(1)) + suffix;
        if (progress < 1) requestAnimationFrame(step);
        else el.textContent = original;
    }
    requestAnimationFrame(step);
}

// Smooth title reveal (replaces typewriter)
function initTypewriterEffect() {
    // Title lines already animated via CSS slideInLeft - nothing extra needed
    // Add a subtle word-by-word reveal to the hero subtitle instead
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;
    const text = subtitle.textContent;
    const words = text.split(' ');
    subtitle.innerHTML = words.map((w, i) =>
        `<span style="display:inline-block;opacity:0;transform:translate3d(0,10px,0);transition:opacity 400ms cubic-bezier(0.16,1,0.3,1) ${600 + i * 30}ms, transform 400ms cubic-bezier(0.16,1,0.3,1) ${600 + i * 30}ms">${w}&nbsp;</span>`
    ).join('');
    requestAnimationFrame(() => {
        subtitle.querySelectorAll('span').forEach(s => {
            s.style.opacity = '0.9';
            s.style.transform = 'translate3d(0,0,0)';
        });
    });
}

// Performance optimization
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Lazy loading for images
function initLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// Tab functionality for project details
function showTab(tabId) {
    const tabs = document.querySelectorAll('.tab-content');
    const buttons = document.querySelectorAll('.tab-button');
    
    tabs.forEach(tab => {
        tab.classList.add('hidden');
        tab.classList.remove('active');
    });
    
    buttons.forEach(button => {
        button.classList.remove('active');
    });
    
    const activeTab = document.getElementById(tabId);
    const activeButton = document.querySelector(`[onclick="showTab('${tabId}')"]`);
    
    if (activeTab) {
        activeTab.classList.remove('hidden');
        activeTab.classList.add('active');
    }
    
    if (activeButton) {
        activeButton.classList.add('active');
    }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
});

// Performance monitoring
window.addEventListener('load', function() {
    const loadTime = performance.timing.domContentLoadedEventEnd - performance.timing.navigationStart;
    console.log('Page loaded in:', loadTime, 'ms');
});

// Add CSS for mobile menu
const mobileMenuCSS = `
    @media (max-width: 768px) {
        .nav-menu {
            position: fixed;
            top: 70px;
            left: -100%;
            width: 100%;
            height: calc(100vh - 70px);
            background: white;
            flex-direction: column;
            justify-content: flex-start;
            padding: 2rem;
            transition: left 0.3s ease;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .nav-menu.active {
            left: 0;
        }
        
        .nav-toggle.active .bar:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .nav-toggle.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .nav-toggle.active .bar:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    }
`;

// Add the CSS to the document
const style = document.createElement('style');
style.textContent = mobileMenuCSS;
document.head.appendChild(style);

function initSlideshows() {
    const slideshowContainers = document.querySelectorAll('.slideshow');
    if (slideshowContainers.length === 0) return;

    fetch('assets/images/manifest.json')
        .then(resp => resp.json())
        .then(manifest => {
            slideshowContainers.forEach(container => {
                const folder = container.getAttribute('data-folder');
                const images = manifest[folder] || [];
                if (!images.length) return;

                const img = document.createElement('img');
                img.alt = folder;
                img.style.width = '100%';
                img.style.height = '100%';
                img.style.objectFit = 'cover';
                img.decoding = 'async';
                img.loading = 'lazy';
                container.appendChild(img);

                let index = 0;
                const update = () => {
                    const src = images[index % images.length];
                    img.src = src;
                    index = (index + 1) % images.length;
                };
                update();
                if (images.length > 1) {
                    setInterval(update, 3500);
                }
            });
        })
        .catch(err => {
            console.error('Failed to load slideshow manifest', err);
        });
}
