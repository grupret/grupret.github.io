// Tech Evangelism Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Mobile navigation functionality
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
    
    // Intersection Observer for animations
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -100px 0px',
        threshold: 0.1
    };
    
    const fadeInObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // Observe tech cards for fade-in animation
    document.querySelectorAll('.tech-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeInObserver.observe(card);
    });
    
    // Code highlighting enhancement
    function enhanceCodeBlocks() {
        document.querySelectorAll('pre code').forEach(block => {
            const pre = block.parentNode;
            const language = block.className.match(/language-(\w+)/);
            
            if (language) {
                pre.setAttribute('data-language', language[1]);
                
                // Add copy button
                const copyButton = document.createElement('button');
                copyButton.className = 'copy-code-btn';
                copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                copyButton.title = 'Copy code';
                
                copyButton.style.cssText = `
                    position: absolute;
                    top: 10px;
                    right: 50px;
                    background: rgba(255,255,255,0.1);
                    border: 1px solid rgba(255,255,255,0.2);
                    color: #e2e8f0;
                    padding: 5px 8px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: all 0.3s ease;
                `;
                
                copyButton.addEventListener('click', () => {
                    navigator.clipboard.writeText(block.textContent).then(() => {
                        copyButton.innerHTML = '<i class="fas fa-check"></i>';
                        copyButton.style.background = 'rgba(34, 197, 94, 0.2)';
                        setTimeout(() => {
                            copyButton.innerHTML = '<i class="fas fa-copy"></i>';
                            copyButton.style.background = 'rgba(255,255,255,0.1)';
                        }, 2000);
                        
                        trackInteraction('copy_code', language[1]);
                    });
                });
                
                copyButton.addEventListener('mouseenter', () => {
                    copyButton.style.background = 'rgba(255,255,255,0.2)';
                });
                
                copyButton.addEventListener('mouseleave', () => {
                    copyButton.style.background = 'rgba(255,255,255,0.1)';
                });
                
                pre.style.position = 'relative';
                pre.appendChild(copyButton);
            }
        });
    }
    
    enhanceCodeBlocks();
    
    // Tech card interaction tracking
    document.querySelectorAll('.tech-card').forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't track if clicking on links or buttons
            if (!e.target.closest('a') && !e.target.closest('button')) {
                const techName = this.querySelector('.tech-name').textContent;
                trackInteraction('tech_card_click', techName);
            }
        });
    });
    
    // Reference link tracking
    document.querySelectorAll('.reference-link').forEach(link => {
        link.addEventListener('click', function() {
            const linkText = this.textContent.trim();
            const techCard = this.closest('.tech-card');
            const techName = techCard ? techCard.querySelector('.tech-name').textContent : 'unknown';
            trackInteraction('reference_link_click', `${techName} - ${linkText}`);
        });
    });
    
    // Lazy loading for tech logos
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
    
    document.querySelectorAll('.tech-logo img').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Error handling for failed image loads
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="10">Tech Logo</text></svg>';
            this.alt = 'Technology logo not available';
        });
    });
    
    // Dynamic tech stats animation
    function animateStats() {
        const statNumbers = document.querySelectorAll('.tech-stats .stat-number');
        
        statNumbers.forEach(stat => {
            const finalValue = stat.textContent;
            const isInfinity = finalValue === '∞';
            
            if (!isInfinity) {
                const numericValue = parseInt(finalValue.replace(/\D/g, ''));
                const duration = 2000;
                const increment = numericValue / (duration / 50);
                let current = 0;
                
                const timer = setInterval(() => {
                    current += increment;
                    if (current >= numericValue) {
                        stat.textContent = finalValue;
                        clearInterval(timer);
                    } else {
                        stat.textContent = Math.floor(current) + '+';
                    }
                }, 50);
            }
        });
    }
    
    // Trigger stats animation when hero section is visible
    const heroObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setTimeout(animateStats, 500);
                heroObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });
    
    const heroSection = document.querySelector('.tech-hero');
    if (heroSection) {
        heroObserver.observe(heroSection);
    }
    
    // Search functionality for tech cards
    function createTechSearch() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'tech-search-container';
        searchContainer.style.cssText = `
            max-width: 500px;
            margin: 0 auto 3rem;
            position: relative;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search technologies...';
        searchInput.className = 'tech-search-input';
        searchInput.style.cssText = `
            width: 100%;
            padding: 15px 50px 15px 20px;
            border: 2px solid #e2e8f0;
            border-radius: 30px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: white;
            box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        `;
        
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        searchIcon.style.cssText = `
            position: absolute;
            right: 20px;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
            font-size: 1.1rem;
        `;
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchIcon);
        
        // Insert search box after section header
        const sectionHeader = document.querySelector('.tech-focus .section-header');
        sectionHeader.parentNode.insertBefore(searchContainer, sectionHeader.nextSibling);
        
        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                searchTechnologies(searchTerm);
            }, 300);
        });
        
        // Focus styles
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#3b82f6';
            this.style.boxShadow = '0 4px 20px rgba(59, 130, 246, 0.2)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
        });
    }
    
    function searchTechnologies(searchTerm) {
        const techCards = document.querySelectorAll('.tech-card');
        
        if (!searchTerm) {
            // Show all cards if search is empty
            techCards.forEach(card => {
                card.style.display = 'block';
                card.classList.remove('hidden');
            });
            return;
        }
        
        techCards.forEach(card => {
            const techName = card.querySelector('.tech-name').textContent.toLowerCase();
            const techDescription = card.querySelector('.tech-description').textContent.toLowerCase();
            const content = `${techName} ${techDescription}`;
            
            if (content.includes(searchTerm)) {
                card.style.display = 'block';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
        
        trackInteraction('search_technologies', searchTerm);
    }
    
    // Initialize search
    createTechSearch();
    
    // Keyboard navigation enhancements
    document.addEventListener('keydown', function(e) {
        // Escape key to clear search
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('.tech-search-input');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                searchTechnologies('');
                searchInput.blur();
            }
        }
    });
    
    // Performance optimization: Debounced scroll handler
    let scrollTimeout;
    window.addEventListener('scroll', () => {
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            updateActiveNavigation();
        }, 100);
    });
    
    function updateActiveNavigation() {
        const sections = ['tech-hero', 'tech-focus', 'tech-philosophy', 'tech-content'];
        const navLinks = document.querySelectorAll('.nav-link');
        
        let current = '';
        sections.forEach(section => {
            const element = document.querySelector(`.${section}`);
            if (element) {
                const rect = element.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    current = section;
                }
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            // Keep tech evangelism page active
            if (link.getAttribute('href') === 'tech-evangelism.html') {
                link.classList.add('active');
            }
        });
    }
    
    // Add scroll-to-top functionality
    function createScrollToTop() {
        const scrollButton = document.createElement('button');
        scrollButton.className = 'scroll-to-top';
        scrollButton.innerHTML = '<i class="fas fa-arrow-up"></i>';
        scrollButton.style.cssText = `
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
            font-size: 1.2rem;
            z-index: 1000;
            transition: all 0.3s ease;
            opacity: 0;
            transform: translateY(100px);
            box-shadow: 0 4px 15px rgba(59, 130, 246, 0.3);
        `;
        
        document.body.appendChild(scrollButton);
        
        // Show/hide scroll button
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                scrollButton.style.opacity = '1';
                scrollButton.style.transform = 'translateY(0)';
            } else {
                scrollButton.style.opacity = '0';
                scrollButton.style.transform = 'translateY(100px)';
            }
        });
        
        // Scroll to top functionality
        scrollButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
            trackInteraction('scroll_to_top', 'button_click');
        });
        
        // Hover effects
        scrollButton.addEventListener('mouseenter', () => {
            scrollButton.style.background = '#2563eb';
            scrollButton.style.transform += ' scale(1.1)';
        });
        
        scrollButton.addEventListener('mouseleave', () => {
            scrollButton.style.background = '#3b82f6';
            scrollButton.style.transform = scrollButton.style.transform.replace(' scale(1.1)', '');
        });
    }
    
    createScrollToTop();
    
    // Analytics and interaction tracking
    function trackInteraction(action, label) {
        console.log(`Tech evangelism page interaction: ${action} - ${label}`);
        
        // Example: Google Analytics 4 event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'Tech Evangelism Page',
                'event_label': label
            });
        }
    }
    
    // Theme toggle functionality (optional enhancement)
    function createThemeToggle() {
        const themeToggle = document.createElement('button');
        themeToggle.className = 'theme-toggle';
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        themeToggle.title = 'Toggle dark mode';
        themeToggle.style.cssText = `
            position: fixed;
            top: 100px;
            right: 30px;
            width: 40px;
            height: 40px;
            background: rgba(255,255,255,0.9);
            border: 1px solid #e2e8f0;
            border-radius: 50%;
            cursor: pointer;
            font-size: 1rem;
            z-index: 999;
            transition: all 0.3s ease;
            color: #64748b;
            backdrop-filter: blur(10px);
        `;
        
        document.body.appendChild(themeToggle);
        
        // Theme toggle functionality
        let isDark = localStorage.getItem('techPageTheme') === 'dark';
        
        function applyTheme(dark) {
            if (dark) {
                document.body.style.filter = 'invert(1) hue-rotate(180deg)';
                document.querySelectorAll('img, video').forEach(media => {
                    media.style.filter = 'invert(1) hue-rotate(180deg)';
                });
                themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
            } else {
                document.body.style.filter = 'none';
                document.querySelectorAll('img, video').forEach(media => {
                    media.style.filter = 'none';
                });
                themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
            }
        }
        
        applyTheme(isDark);
        
        themeToggle.addEventListener('click', () => {
            isDark = !isDark;
            localStorage.setItem('techPageTheme', isDark ? 'dark' : 'light');
            applyTheme(isDark);
            trackInteraction('theme_toggle', isDark ? 'dark' : 'light');
        });
        
        themeToggle.addEventListener('mouseenter', () => {
            themeToggle.style.background = 'rgba(59, 130, 246, 0.1)';
            themeToggle.style.borderColor = '#3b82f6';
        });
        
        themeToggle.addEventListener('mouseleave', () => {
            themeToggle.style.background = 'rgba(255,255,255,0.9)';
            themeToggle.style.borderColor = '#e2e8f0';
        });
    }
    
    // Uncomment to enable theme toggle
    // createThemeToggle();
    
    // Initialize tooltips for tech badges
    document.querySelectorAll('.tech-badge, .tech-level').forEach(badge => {
        badge.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'custom-tooltip';
            tooltip.textContent = this.textContent;
            tooltip.style.cssText = `
                position: absolute;
                background: #1a1a2e;
                color: white;
                padding: 5px 10px;
                border-radius: 5px;
                font-size: 0.8rem;
                z-index: 1001;
                pointer-events: none;
                transform: translateX(-50%);
                margin-top: -35px;
            `;
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
        });
        
        badge.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.custom-tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        });
    });
    
    console.log('Tech evangelism page JavaScript initialized successfully');
});

// Utility functions
function isTouchDevice() {
    return ('ontouchstart' in window) || 
           (navigator.maxTouchPoints > 0) || 
           (navigator.msMaxTouchPoints > 0);
}

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