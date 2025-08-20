// Modern Portfolio JavaScript

// DOM Content Loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initNavigation();
    initScrollAnimations();
    initFormHandling();
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

// Scroll animations
function initScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate');
            }
        });
    }, observerOptions);
    
    // Observe elements for animation
    const animateElements = document.querySelectorAll('.experience-card, .project-card, .skill-category, .highlight-item');
    animateElements.forEach(el => {
        el.classList.add('animate-on-scroll');
        observer.observe(el);
    });
}

// Form handling
function initFormHandling() {
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const button = this.querySelector('button[type="submit"]');
            const originalText = button.textContent;
            
            // Show loading state
            button.innerHTML = '<span class="loading"></span> Sending...';
            button.disabled = true;
            
            // Simulate form submission (replace with actual endpoint)
            setTimeout(() => {
                // Show success message
                showNotification('Message sent successfully!', 'success');
                
                // Reset form
                this.reset();
                
                // Reset button
                button.textContent = originalText;
                button.disabled = false;
            }, 2000);
        });
    }
}

// Mobile menu toggle
function initMobileMenu() {
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            this.classList.toggle('active');
        });
        
        // Close mobile menu when clicking on a link
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
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

// Skill bar animations
function initSkillAnimations() {
    const skillBars = document.querySelectorAll('.skill-progress');
    
    const skillObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const width = entry.target.style.width;
                entry.target.style.width = '0%';
                
                setTimeout(() => {
                    entry.target.style.width = width;
                }, 200);
            }
        });
    }, { threshold: 0.5 });
    
    skillBars.forEach(bar => {
        skillObserver.observe(bar);
    });
}

// Project card interactions
function initProjectCards() {
    const projectCards = document.querySelectorAll('.project-card');
    
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Typewriter effect for hero title
function initTypewriterEffect() {
    const titleLines = document.querySelectorAll('.title-line');
    
    titleLines.forEach((line, index) => {
        const text = line.textContent;
        line.textContent = '';
        
        setTimeout(() => {
            typeWriter(line, text, 100);
        }, index * 1000);
    });
}

function typeWriter(element, text, speed) {
    let i = 0;
    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}

// Utility functions
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        border-radius: 8px;
        font-weight: 600;
        z-index: 10000;
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
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

// Animate statistics on scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat-number');
    
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const text = target.textContent;
                const isNumber = text.match(/\d+/);
                
                if (isNumber) {
                    const number = parseInt(isNumber[0]);
                    animateNumber(target, number, text);
                }
            }
        });
    });
    
    stats.forEach(stat => statsObserver.observe(stat));
}

function animateNumber(element, target, originalText) {
    const increment = target / 100;
    let current = 0;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = originalText;
            clearInterval(timer);
        } else {
            element.textContent = originalText.replace(/\d+/, Math.floor(current));
        }
    }, 20);
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    initLazyLoading();
    animateStats();
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
