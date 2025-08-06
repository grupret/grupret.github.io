// Travel Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Initialize all Swiper instances
    const swiperConfigs = [
        { selector: '.pushkar-swiper', name: 'Pushkar' },
        { selector: '.shimla-swiper', name: 'Shimla' },
        { selector: '.hampi-swiper', name: 'Hampi' },
        { selector: '.kodai-swiper', name: 'Kodaikanal' },
        { selector: '.amsterdam-swiper', name: 'Amsterdam' }
    ];

    const swipers = [];

    swiperConfigs.forEach(config => {
        const swiperElement = document.querySelector(config.selector);
        if (swiperElement) {
            const swiper = new Swiper(config.selector, {
                // Basic settings
                loop: true,
                autoplay: {
                    delay: 4000,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true
                },
                speed: 600,
                effect: 'slide',
                
                // Pagination
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                    bulletClass: 'swiper-pagination-bullet',
                    bulletActiveClass: 'swiper-pagination-bullet-active'
                },
                
                // Navigation arrows
                navigation: {
                    nextEl: '.swiper-button-next',
                    prevEl: '.swiper-button-prev',
                },
                
                // Responsive breakpoints
                breakpoints: {
                    // Mobile phones
                    320: {
                        spaceBetween: 10,
                        centeredSlides: true
                    },
                    // Tablets
                    768: {
                        spaceBetween: 20,
                        centeredSlides: true
                    },
                    // Desktop
                    1024: {
                        spaceBetween: 30,
                        centeredSlides: false
                    }
                },
                
                // Touch settings for mobile
                touchRatio: 1,
                touchAngle: 45,
                grabCursor: true,
                
                // Keyboard control
                keyboard: {
                    enabled: true,
                    onlyInViewport: true
                },
                
                // Mouse wheel control
                mousewheel: {
                    invert: false,
                    forceToAxis: false,
                    sensitivity: 1
                },
                
                // Lazy loading for better performance
                lazy: {
                    loadPrevNext: true,
                    loadOnTransitionStart: true
                },
                
                // Events
                on: {
                    init: function() {
                        console.log(`${config.name} Swiper initialized`);
                        // Add accessibility attributes
                        this.slides.forEach((slide, index) => {
                            slide.setAttribute('aria-label', `Image ${index + 1} of ${config.name}`);
                        });
                    },
                    slideChange: function() {
                        // Pause videos when slide changes
                        const videos = this.slides[this.previousIndex]?.querySelectorAll('video');
                        videos?.forEach(video => video.pause());
                    },
                    touchStart: function() {
                        // Pause autoplay on touch
                        this.autoplay.stop();
                    },
                    touchEnd: function() {
                        // Resume autoplay after touch
                        setTimeout(() => {
                            this.autoplay.start();
                        }, 3000);
                    }
                }
            });
            
            swipers.push({ swiper, name: config.name });
        }
    });

    // Intersection Observer for performance optimization
    const observerOptions = {
        root: null,
        rootMargin: '50px 0px',
        threshold: 0.1
    };

    const swiperObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const swiperContainer = entry.target;
            const swiperInstance = swipers.find(s => 
                swiperContainer.querySelector(`.${s.name.toLowerCase()}-swiper`)
            );
            
            if (entry.isIntersecting) {
                // Start autoplay when swiper comes into view
                swiperInstance?.swiper.autoplay.start();
            } else {
                // Stop autoplay when swiper goes out of view
                swiperInstance?.swiper.autoplay.stop();
            }
        });
    }, observerOptions);

    // Observe all destination cards
    document.querySelectorAll('.destination-card').forEach(card => {
        swiperObserver.observe(card);
    });

    // Mobile navigation toggle functionality
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    if (navToggle && navMenu) {
        navToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
            
            // Animate hamburger bars
            const bars = navToggle.querySelectorAll('.bar');
            bars.forEach((bar, index) => {
                bar.style.transform = navToggle.classList.contains('active') 
                    ? `rotate(${index === 1 ? 0 : index === 0 ? 45 : -45}deg) translate(${index === 1 ? 0 : index === 0 ? '5px, 5px' : '-5px, -5px'})`
                    : 'none';
            });
        });

        // Close mobile menu when clicking on a link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                navToggle.classList.remove('active');
            });
        });
    }

    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Lazy loading for images
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.classList.add('loaded');
                    imageObserver.unobserve(img);
                }
            }
        });
    });

    // Observe all images with data-src attribute
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // Video lazy loading and optimization
    const videoObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            const iframe = entry.target.querySelector('iframe');
            if (entry.isIntersecting && iframe && !iframe.src) {
                iframe.src = iframe.dataset.src;
                videoObserver.unobserve(entry.target);
            }
        });
    });

    document.querySelectorAll('.video-container').forEach(container => {
        const iframe = container.querySelector('iframe');
        if (iframe && iframe.src) {
            iframe.dataset.src = iframe.src;
            iframe.src = '';
        }
        videoObserver.observe(container);
    });

    // Performance optimization: Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            // Update navigation active state based on scroll position
            updateActiveNavigation();
        }, 100);
    });

    function updateActiveNavigation() {
        const sections = ['home', 'about', 'destinations', 'philosophy'];
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const element = document.getElementById(section);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100) {
                    current = section;
                }
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }

    // Accessibility improvements
    
    // Add keyboard navigation for swipers
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const focusedSwiper = document.querySelector('.swiper:focus-within');
            if (focusedSwiper) {
                const swiperInstance = swipers.find(s => 
                    focusedSwiper.classList.contains(s.name.toLowerCase() + '-swiper')
                );
                if (swiperInstance) {
                    if (e.key === 'ArrowLeft') {
                        swiperInstance.swiper.slidePrev();
                    } else {
                        swiperInstance.swiper.slideNext();
                    }
                }
            }
        }
    });

    // Add focus management for modals/popups
    document.querySelectorAll('.destination-card').forEach(card => {
        card.setAttribute('tabindex', '0');
        card.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                card.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        });
    });

    // Error handling for failed image loads
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="300" viewBox="0 0 400 300"><rect width="100%" height="100%" fill="%23f0f0f0"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999">Image not available</text></svg>';
            this.alt = 'Image not available';
        });
    });

    // Analytics tracking for interactions (placeholder)
    function trackInteraction(action, label) {
        // Placeholder for analytics tracking
        console.log(`Travel page interaction: ${action} - ${label}`);
        
        // Example: Google Analytics 4 event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'Travel Page',
                'event_label': label
            });
        }
    }

    // Track swiper interactions
    swipers.forEach(swiperObj => {
        swiperObj.swiper.on('slideChange', () => {
            trackInteraction('slide_change', swiperObj.name);
        });
    });

    // Track video plays
    document.querySelectorAll('.video-container iframe').forEach(iframe => {
        iframe.addEventListener('load', () => {
            trackInteraction('video_load', iframe.title || 'Unknown video');
        });
    });

    console.log('Travel page JavaScript initialized successfully');
});

// Utility function to check if device supports touch
function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

// Utility function to get viewport dimensions
function getViewportDimensions() {
    return {
        width: Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0),
        height: Math.max(document.documentElement.clientHeight || 0, window.innerHeight || 0)
    };
}

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        isTouchDevice,
        getViewportDimensions
    };
}