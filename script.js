// Single Page Application Navigation and Interactive Features
class StuartDeetsWebsite {
    constructor() {
        this.currentPage = 'home';
        this.navLinks = document.querySelectorAll('.nav-link');
        this.pages = document.querySelectorAll('.page');
        this.navToggle = document.getElementById('navToggle');
        this.navLinksContainer = document.querySelector('.nav-links');
        this.heroActions = document.querySelectorAll('.hero-actions .btn');
        
        this.init();
    }
    
    init() {
        this.setupNavigation();
        this.setupMobileNav();
        this.setupSmoothScrolling();
        this.setupHeroActions();
        this.setupAnimationObserver();
        this.setupParallaxEffect();
        
        // Set initial page based on hash or default to home
        const hash = window.location.hash.substring(1) || 'home';
        this.navigateToPage(hash, false);
    }
    
    setupNavigation() {
        // Handle navigation clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const page = link.getAttribute('data-page');
                this.navigateToPage(page);
                
                // Close mobile nav if open
                this.navLinksContainer.classList.remove('active');
            });
        });
        
        // Handle browser back/forward
        window.addEventListener('popstate', () => {
            const hash = window.location.hash.substring(1) || 'home';
            this.navigateToPage(hash, false);
        });
        
        // Handle direct hash links
        document.addEventListener('click', (e) => {
            if (e.target.matches('a[href^="#"]')) {
                e.preventDefault();
                const hash = e.target.getAttribute('href').substring(1);
                if (this.isValidPage(hash)) {
                    this.navigateToPage(hash);
                }
            }
        });
    }
    
    setupMobileNav() {
        this.navToggle.addEventListener('click', () => {
            this.navLinksContainer.classList.toggle('active');
            this.navToggle.classList.toggle('active');
        });
        
        // Close mobile nav when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.nav-container')) {
                this.navLinksContainer.classList.remove('active');
                this.navToggle.classList.remove('active');
            }
        });
    }
    
    setupHeroActions() {
        this.heroActions.forEach(btn => {
            const page = btn.getAttribute('data-page');
            if (page) {
                btn.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.navigateToPage(page);
                });
            }
        });
    }
    
    setupSmoothScrolling() {
        // Add smooth scrolling to top when changing pages
        const style = document.createElement('style');
        style.textContent = `
            html {
                scroll-behavior: smooth;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupAnimationObserver() {
        // Create intersection observer for animations
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        this.animationObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, observerOptions);
        
        // Add animation classes to elements
        const animateElements = document.querySelectorAll('.focus-card, .interest-card, .cv-section');
        animateElements.forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease';
            this.animationObserver.observe(el);
        });
        
        // Add CSS for animation
        const animationStyle = document.createElement('style');
        animationStyle.textContent = `
            .animate-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
            }
        `;
        document.head.appendChild(animationStyle);
    }
    
    setupParallaxEffect() {
        // Add subtle parallax effect to background animation
        let ticking = false;
        
        const updateParallax = () => {
            const scrolled = window.pageYOffset;
            const backgroundAnimation = document.querySelector('.background-animation');
            
            if (backgroundAnimation) {
                const rate = scrolled * -0.1;
                backgroundAnimation.style.transform = `translateY(${rate}px)`;
            }
            
            ticking = false;
        };
        
        const requestParallaxUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateParallax);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestParallaxUpdate, { passive: true });
    }
    
    navigateToPage(pageName, updateHistory = true) {
        if (!this.isValidPage(pageName)) {
            pageName = 'home';
        }
        
        // Update URL hash
        if (updateHistory) {
            history.pushState(null, null, `#${pageName}`);
        }
        
        // Hide current page
        const currentPageEl = document.querySelector('.page.active');
        if (currentPageEl) {
            currentPageEl.classList.remove('active');
        }
        
        // Show new page
        const newPageEl = document.getElementById(pageName);
        if (newPageEl) {
            newPageEl.classList.add('active');
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'smooth' });
            
            // Update navigation active state
            this.updateNavActiveState(pageName);
            
            // Update current page
            this.currentPage = pageName;
            
            // Trigger page-specific setup
            this.onPageChange(pageName);
        }
    }
    
    updateNavActiveState(activePage) {
        this.navLinks.forEach(link => {
            const linkPage = link.getAttribute('data-page');
            if (linkPage === activePage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }
    
    isValidPage(pageName) {
        const validPages = ['home', 'research', 'cv', 'teaching'];
        return validPages.includes(pageName);
    }
    
    onPageChange(pageName) {
        // Page-specific functionality
        switch (pageName) {
            case 'home':
                this.setupHomePageAnimations();
                break;
            case 'research':
                this.setupResearchPageAnimations();
                break;
            case 'cv':
                this.setupCVPageAnimations();
                break;
            case 'teaching':
                this.setupTeachingPageAnimations();
                break;
        }
        
        // Re-observe elements for animations
        setTimeout(() => {
            const newElements = document.querySelectorAll(`#${pageName} .focus-card, #${pageName} .interest-card, #${pageName} .cv-section`);
            newElements.forEach(el => {
                if (!el.classList.contains('animate-in')) {
                    this.animationObserver.observe(el);
                }
            });
        }, 100);
    }
    
    setupHomePageAnimations() {
        // Home page animations (typing effect removed)
        const titleElement = document.querySelector('.title-main');
        if (titleElement && !titleElement.classList.contains('animated')) {
            titleElement.classList.add('animated');
        }
    }
    
    setupResearchPageAnimations() {
        // Add staggered animation to focus cards
        const focusCards = document.querySelectorAll('#research .focus-card');
        focusCards.forEach((card, index) => {
            setTimeout(() => {
                if (this.isElementInViewport(card)) {
                    card.classList.add('animate-in');
                }
            }, index * 200);
        });
    }
    
    setupCVPageAnimations() {
        // Add progressive disclosure to CV sections
        const cvSections = document.querySelectorAll('#cv .cv-section');
        cvSections.forEach((section, index) => {
            setTimeout(() => {
                if (this.isElementInViewport(section)) {
                    section.classList.add('animate-in');
                }
            }, index * 300);
        });
    }
    
    setupTeachingPageAnimations() {
        // Add animation to interest cards
        const interestCards = document.querySelectorAll('#teaching .interest-card');
        interestCards.forEach((card, index) => {
            setTimeout(() => {
                if (this.isElementInViewport(card)) {
                    card.classList.add('animate-in');
                }
            }, index * 150);
        });
    }
    
    isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }
}

// Enhanced 4D Go Integration
class FourDGoIntegration {
    constructor() {
        this.backgroundFrame = null;
        this.init();
    }
    
    init() {
        this.setupBackgroundAnimation();
        this.setupDynamicOpacity();
        this.setupInteractiveElements();
    }
    
    setupBackgroundAnimation() {
        const backgroundAnimation = document.querySelector('.background-animation iframe');
        if (backgroundAnimation) {
            this.backgroundFrame = backgroundAnimation;
            
            // Adjust animation based on page
            this.updateAnimationForPage('home');
        }
    }
    
    setupDynamicOpacity() {
        // Adjust background animation opacity based on scroll and page
        let ticking = false;
        
        const updateOpacity = () => {
            const scrolled = window.pageYOffset;
            const windowHeight = window.innerHeight;
            const scrollPercentage = Math.min(scrolled / windowHeight, 1);
            
            const backgroundAnimation = document.querySelector('.background-animation');
            if (backgroundAnimation) {
                // Fade out slightly on scroll to maintain readability
                const opacity = Math.max(0.05, 0.15 - (scrollPercentage * 0.08));
                backgroundAnimation.style.opacity = opacity;
            }
            
            ticking = false;
        };
        
        const requestOpacityUpdate = () => {
            if (!ticking) {
                requestAnimationFrame(updateOpacity);
                ticking = true;
            }
        };
        
        window.addEventListener('scroll', requestOpacityUpdate, { passive: true });
    }
    
    setupInteractiveElements() {
        // Add subtle interaction effects that mirror 4D Go concepts
        const interactiveElements = document.querySelectorAll('.focus-card, .interest-card, .btn');
        
        interactiveElements.forEach(element => {
            element.addEventListener('mouseenter', () => {
                this.createRippleEffect(element);
            });
        });
    }
    
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: radial-gradient(circle, rgba(102,126,234,0.3) 0%, transparent 70%);
            transform: scale(0);
            animation: ripple 0.6s linear;
            pointer-events: none;
            z-index: 0;
        `;
        
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = '50%';
        ripple.style.top = '50%';
        ripple.style.transform = 'translate(-50%, -50%) scale(0)';
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        // Add ripple animation CSS if not exists
        if (!document.querySelector('#ripple-animation')) {
            const style = document.createElement('style');
            style.id = 'ripple-animation';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: translate(-50%, -50%) scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }
    
    updateAnimationForPage(pageName) {
        // Adjust background animation properties based on current page
        const backgroundAnimation = document.querySelector('.background-animation');
        if (!backgroundAnimation) return;
        
        switch (pageName) {
            case 'home':
                backgroundAnimation.style.opacity = '0.15';
                break;
            case 'research':
                backgroundAnimation.style.opacity = '0.12';
                break;
            case 'cv':
                backgroundAnimation.style.opacity = '0.08';
                break;
            case 'teaching':
                backgroundAnimation.style.opacity = '0.10';
                break;
        }
    }
}

// Enhanced Scroll and Resize Handlers
class ResponsiveHandlers {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupResizeHandler();
        this.setupScrollEffects();
    }
    
    setupResizeHandler() {
        let resizeTimeout;
        
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => {
                this.handleResize();
            }, 250);
        });
    }
    
    handleResize() {
        // Recalculate viewport-dependent animations
        const backgroundAnimation = document.querySelector('.background-animation iframe');
        if (backgroundAnimation) {
            // Reset iframe dimensions if needed
            backgroundAnimation.style.width = '100%';
            backgroundAnimation.style.height = '100%';
        }
    }
    
    setupScrollEffects() {
        // Add scroll-based effects
        let scrollTimeout;
        
        window.addEventListener('scroll', () => {
            clearTimeout(scrollTimeout);
            scrollTimeout = setTimeout(() => {
                this.handleScroll();
            }, 10);
        }, { passive: true });
    }
    
    handleScroll() {
        const scrolled = window.pageYOffset;
        
        // Update nav transparency
        const nav = document.querySelector('.main-nav');
        if (nav) {
            const opacity = Math.min(0.95, 0.7 + (scrolled / 500));
            nav.style.setProperty('--nav-opacity', opacity);
        }
    }
}

// Performance Monitoring
class PerformanceMonitor {
    constructor() {
        this.init();
    }
    
    init() {
        // Monitor and optimize performance
        this.setupLazyLoading();
        this.setupImageOptimization();
    }
    
    setupLazyLoading() {
        // Lazy load background animation iframe
        const backgroundIframe = document.querySelector('.background-animation iframe');
        if (backgroundIframe) {
            backgroundIframe.loading = 'lazy';
        }
    }
    
    setupImageOptimization() {
        // Optimize images
        const images = document.querySelectorAll('img');
        images.forEach(img => {
            if (!img.loading) {
                img.loading = 'lazy';
            }
            
            // Add intersection observer for images
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        if (!img.classList.contains('loaded')) {
                            img.classList.add('loaded');
                            img.style.transition = 'opacity 0.3s ease';
                            img.style.opacity = '1';
                        }
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            img.style.opacity = '0';
            imageObserver.observe(img);
        });
    }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new StuartDeetsWebsite();
    new FourDGoIntegration();
    new ResponsiveHandlers();
    new PerformanceMonitor();
    
    // Add loading complete class after short delay
    setTimeout(() => {
        document.body.classList.add('loaded');
    }, 100);
});

// Add CSS for initial loading state
const loadingStyle = document.createElement('style');
loadingStyle.textContent = `
    body:not(.loaded) {
        opacity: 0;
        transition: opacity 0.5s ease;
    }
    
    body.loaded {
        opacity: 1;
    }
    
    img.loaded {
        opacity: 1 !important;
    }
`;
document.head.appendChild(loadingStyle);