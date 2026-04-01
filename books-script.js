// Books Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Category filtering functionality
    const categoryButtons = document.querySelectorAll('.category-btn');
    const bookCards = document.querySelectorAll('.book-card');
    
    function filterBooks(category) {
        bookCards.forEach(card => {
            const cardCategories = card.dataset.category.split(' ');
            
            if (category === 'all' || cardCategories.includes(category)) {
                card.classList.remove('hidden', 'fade-out');
                card.classList.add('fade-in');
                setTimeout(() => {
                    card.style.display = 'grid';
                }, 50);
            } else {
                card.classList.add('fade-out');
                card.classList.remove('fade-in');
                setTimeout(() => {
                    card.classList.add('hidden');
                    card.style.display = 'none';
                }, 300);
            }
        });
        
        // Update button states
        categoryButtons.forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeButton = document.querySelector(`[data-category="${category}"]`);
        if (activeButton) {
            activeButton.classList.add('active');
        }
        
        // Analytics tracking
        trackInteraction('filter_books', category);
    }
    
    // Add click event listeners to category buttons
    categoryButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.dataset.category;
            filterBooks(category);
        });
        
        // Keyboard navigation
        button.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });
    
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
    
    // Reading list functionality
    let readingList = JSON.parse(localStorage.getItem('readingList') || '[]');
    
    function updateReadingListButtons() {
        document.querySelectorAll('.btn-secondary').forEach(button => {
            const bookCard = button.closest('.book-card');
            const bookTitle = bookCard.querySelector('.book-title').textContent;
            
            if (readingList.includes(bookTitle)) {
                button.textContent = '✓ In Reading List';
                button.style.background = '#dcfce7';
                button.style.color = '#16a34a';
                button.style.borderColor = '#bbf7d0';
            } else {
                button.textContent = 'Add to Reading List';
                button.style.background = '#f1f5f9';
                button.style.color = '#64748b';
                button.style.borderColor = '#e2e8f0';
            }
        });
    }
    
    function toggleReadingList(bookTitle, button) {
        if (readingList.includes(bookTitle)) {
            readingList = readingList.filter(title => title !== bookTitle);
            trackInteraction('remove_from_reading_list', bookTitle);
        } else {
            readingList.push(bookTitle);
            trackInteraction('add_to_reading_list', bookTitle);
        }
        
        localStorage.setItem('readingList', JSON.stringify(readingList));
        updateReadingListButtons();
        
        // Show feedback
        showFeedback(readingList.includes(bookTitle) ? 'Added to reading list!' : 'Removed from reading list!');
    }
    
    // Add event listeners to reading list buttons
    document.querySelectorAll('.btn-secondary').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const bookCard = this.closest('.book-card');
            const bookTitle = bookCard.querySelector('.book-title').textContent;
            toggleReadingList(bookTitle, this);
        });
    });
    
    // Initialize reading list button states
    updateReadingListButtons();
    
    // Feedback notification system
    function showFeedback(message) {
        // Remove existing feedback
        const existingFeedback = document.querySelector('.feedback-notification');
        if (existingFeedback) {
            existingFeedback.remove();
        }
        
        // Create feedback element
        const feedback = document.createElement('div');
        feedback.className = 'feedback-notification';
        feedback.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: #3b82f6;
            color: white;
            padding: 12px 20px;
            border-radius: 10px;
            z-index: 1000;
            transform: translateX(300px);
            transition: transform 0.3s ease;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            font-weight: 500;
        `;
        feedback.textContent = message;
        
        document.body.appendChild(feedback);
        
        // Animate in
        setTimeout(() => {
            feedback.style.transform = 'translateX(0)';
        }, 100);
        
        // Animate out and remove
        setTimeout(() => {
            feedback.style.transform = 'translateX(300px)';
            setTimeout(() => {
                feedback.remove();
            }, 300);
        }, 3000);
    }
    
    // Search functionality
    function createSearchBox() {
        const searchContainer = document.createElement('div');
        searchContainer.className = 'search-container';
        searchContainer.style.cssText = `
            max-width: 400px;
            margin: 0 auto 2rem;
            position: relative;
        `;
        
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Search books by title, author, or genre...';
        searchInput.className = 'search-input';
        searchInput.style.cssText = `
            width: 100%;
            padding: 12px 45px 12px 15px;
            border: 2px solid #e2e8f0;
            border-radius: 25px;
            font-size: 1rem;
            transition: all 0.3s ease;
            background: white;
        `;
        
        const searchIcon = document.createElement('i');
        searchIcon.className = 'fas fa-search';
        searchIcon.style.cssText = `
            position: absolute;
            right: 15px;
            top: 50%;
            transform: translateY(-50%);
            color: #64748b;
            font-size: 1rem;
        `;
        
        searchContainer.appendChild(searchInput);
        searchContainer.appendChild(searchIcon);
        
        // Insert search box before category nav
        const categoryNav = document.querySelector('.category-nav');
        categoryNav.parentNode.insertBefore(searchContainer, categoryNav);
        
        // Search functionality
        let searchTimeout;
        searchInput.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const searchTerm = this.value.toLowerCase().trim();
                searchBooks(searchTerm);
            }, 300);
        });
        
        // Focus styles
        searchInput.addEventListener('focus', function() {
            this.style.borderColor = '#3b82f6';
            this.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
        });
        
        searchInput.addEventListener('blur', function() {
            this.style.borderColor = '#e2e8f0';
            this.style.boxShadow = 'none';
        });
    }
    
    function searchBooks(searchTerm) {
        if (!searchTerm) {
            // Show all books if search is empty
            bookCards.forEach(card => {
                card.style.display = 'grid';
                card.classList.remove('hidden');
            });
            return;
        }
        
        bookCards.forEach(card => {
            const title = card.querySelector('.book-title').textContent.toLowerCase();
            const author = card.querySelector('.book-author').textContent.toLowerCase();
            const genre = card.querySelector('.book-genre').textContent.toLowerCase();
            const content = `${title} ${author} ${genre}`;
            
            if (content.includes(searchTerm)) {
                card.style.display = 'grid';
                card.classList.remove('hidden');
            } else {
                card.style.display = 'none';
                card.classList.add('hidden');
            }
        });
        
        trackInteraction('search_books', searchTerm);
    }
    
    // Initialize search box
    createSearchBox();
    
    // Lazy loading for book images
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
    
    // Observe all book images
    document.querySelectorAll('.book-image img').forEach(img => {
        imageObserver.observe(img);
    });
    
    // Error handling for failed image loads
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="400" viewBox="0 0 300 400"><rect width="100%" height="100%" fill="%23f1f5f9"/><text x="50%" y="50%" text-anchor="middle" dy=".3em" fill="%23999" font-size="16">Book cover not available</text></svg>';
            this.alt = 'Book cover not available';
        });
    });
    
    // Keyboard navigation improvements
    document.addEventListener('keydown', function(e) {
        // Escape key to clear search
        if (e.key === 'Escape') {
            const searchInput = document.querySelector('.search-input');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                searchBooks('');
                searchInput.blur();
            }
        }
        
        // Arrow key navigation for categories
        if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
            const focusedButton = document.activeElement;
            if (focusedButton.classList.contains('category-btn')) {
                e.preventDefault();
                const buttons = Array.from(categoryButtons);
                const currentIndex = buttons.indexOf(focusedButton);
                let nextIndex;
                
                if (e.key === 'ArrowLeft') {
                    nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
                } else {
                    nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
                }
                
                buttons[nextIndex].focus();
            }
        }
    });
    
    // Analytics and interaction tracking
    function trackInteraction(action, label) {
        console.log(`Books page interaction: ${action} - ${label}`);
        
        // Example: Google Analytics 4 event tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', action, {
                'event_category': 'Books Page',
                'event_label': label
            });
        }
    }
    
    // Track book card interactions
    bookCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't track if clicking on buttons
            if (!e.target.closest('button') && !e.target.closest('a')) {
                const bookTitle = this.querySelector('.book-title').textContent;
                trackInteraction('book_card_click', bookTitle);
            }
        });
    });
    
    // Track external link clicks
    document.querySelectorAll('.btn-primary').forEach(link => {
        link.addEventListener('click', function() {
            const bookTitle = this.closest('.book-card').querySelector('.book-title').textContent;
            trackInteraction('external_link_click', bookTitle);
        });
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
        const sections = ['books-hero', 'books-categories', 'reading-philosophy', 'currently-reading'];
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
            // Keep books page active
            if (link.getAttribute('href') === 'books.html') {
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
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
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
    
    // Initialize tooltips for book ratings
    document.querySelectorAll('.book-rating').forEach(rating => {
        rating.setAttribute('title', 'My personal rating for this book');
    });
    
    // Add reading time estimates
    document.querySelectorAll('.book-card').forEach(card => {
        const readingTime = Math.floor(Math.random() * 8) + 3; // Random 3-10 hours
        const timeElement = document.createElement('div');
        timeElement.className = 'reading-time';
        timeElement.style.cssText = `
            position: absolute;
            bottom: 10px;
            right: 10px;
            background: rgba(59, 130, 246, 0.9);
            color: white;
            padding: 3px 8px;
            border-radius: 12px;
            font-size: 0.7rem;
            font-weight: 500;
        `;
        timeElement.textContent = `${readingTime}h read`;
        
        const bookImage = card.querySelector('.book-image');
        bookImage.style.position = 'relative';
        bookImage.appendChild(timeElement);
    });
    
    console.log('Books page JavaScript initialized successfully');
});

// Utility functions
function getReadingList() {
    return JSON.parse(localStorage.getItem('readingList') || '[]');
}

function exportReadingList() {
    const readingList = getReadingList();
    const dataStr = JSON.stringify(readingList, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = 'my-reading-list.json';
    link.click();
}

// Export functions for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        getReadingList,
        exportReadingList
    };
}