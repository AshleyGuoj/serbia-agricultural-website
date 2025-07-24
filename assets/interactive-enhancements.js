/**
 * Interactive Enhancements for AgroTech Solutions Website
 * This file provides enhanced interactivity for all pages without modifying existing HTML
 */

(function() {
    'use strict';

    // Configuration
    const CONFIG = {
        scrollOffset: 120,
        animationDuration: 300,
        mobileBreakpoint: 1024,
        stickyThreshold: 200
    };

    // Utility Functions
    const Utils = {
        // Get current page name for conditional logic
        getCurrentPageName: function() {
            const path = window.location.pathname;
            const filename = path.split('/').pop();
            const pageName = filename.replace('.html', '') || 'homepage';
            
            // Handle URL encoding for spaces and special characters
            return decodeURIComponent(pageName);
        },

        // Check if current page should disable card animations
        shouldDisableCardAnimations: function() {
            const currentPage = this.getCurrentPageName();
            const pagesWithDisabledAnimations = [
                'Center Pivot Irrigation Detail'
            ];
            
            // Multiple detection methods
            const isTargetPage = pagesWithDisabledAnimations.includes(currentPage) ||
                               window.location.href.includes('Center%20Pivot%20Irrigation%20Detail') ||
                               window.location.href.includes('Center Pivot Irrigation Detail') ||
                               document.title.includes('Center Pivot Irrigation Detail');
            
            // Debug: Log current page name
            console.log('Current page:', currentPage);
            console.log('Current URL:', window.location.href);
            console.log('Document title:', document.title);
            console.log('Should disable animations:', isTargetPage);
            
            return isTargetPage;
        },

        // Debounce function for performance optimization
        debounce: function(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        // Check if element is in viewport
        isInViewport: function(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        // Smooth scroll to element
        smoothScrollTo: function(element, offset = CONFIG.scrollOffset) {
            if (!element) return;
            
            const elementPosition = element.offsetTop;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        },

        // Add loading animation
        addLoadingState: function(element, text = 'Loading...') {
            if (!element) return;
            
            const originalText = element.textContent;
            const originalHTML = element.innerHTML;
            
            element.innerHTML = `
                <span class="loading loading-spinner loading-sm"></span>
                ${text}
            `;
            element.disabled = true;
            
            return {
                restore: function() {
                    element.innerHTML = originalHTML;
                    element.disabled = false;
                }
            };
        }
    };

    // Navigation Enhancement
    const NavigationEnhancement = {
        init: function() {
            this.setupActiveNavigation();
            this.setupMobileMenu();
            this.setupSmoothScrolling();
            this.setupStickyNavigation();
            this.setupLanguageSwitcher();
        },

        setupActiveNavigation: function() {
            const currentPageId = this.getCurrentPageId();
            const navLinks = document.querySelectorAll('[data-nav]');
            
            navLinks.forEach(link => {
                const navTarget = link.getAttribute('data-nav');
                if (navTarget === currentPageId) {
                    link.classList.add('active');
                }
                
                // Add hover effects
                link.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-1px)';
                });
                
                link.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        },

        setupMobileMenu: function() {
            const mobileMenuButton = document.querySelector('.btn-ghost.lg\\:hidden');
            const mobileMenu = document.getElementById('mobileMenu');
            
            if (mobileMenuButton && mobileMenu) {
                // Toggle mobile menu
                mobileMenuButton.addEventListener('click', function(e) {
                    e.stopPropagation();
                    mobileMenu.classList.toggle('hidden');
                    
                    // Add slide animation
                    if (!mobileMenu.classList.contains('hidden')) {
                        mobileMenu.style.transform = 'translateY(0)';
                        mobileMenu.style.opacity = '1';
                    } else {
                        mobileMenu.style.transform = 'translateY(-10px)';
                        mobileMenu.style.opacity = '0';
                    }
                });

                // Close menu when clicking outside
                document.addEventListener('click', function(e) {
                    if (!mobileMenu.contains(e.target) && !mobileMenuButton.contains(e.target)) {
                        mobileMenu.classList.add('hidden');
                        mobileMenu.style.transform = 'translateY(-10px)';
                        mobileMenu.style.opacity = '0';
                    }
                });

                // Close menu on window resize
                window.addEventListener('resize', Utils.debounce(function() {
                    if (window.innerWidth >= CONFIG.mobileBreakpoint) {
                        mobileMenu.classList.add('hidden');
                    }
                }, 250));
            }
        },

        setupSmoothScrolling: function() {
            // Smooth scroll for anchor links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function(e) {
                    e.preventDefault();
                    const targetId = this.getAttribute('href').substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        Utils.smoothScrollTo(targetElement);
                    }
                });
            });
        },

        setupStickyNavigation: function() {
            const navbar = document.querySelector('.navbar');
            if (!navbar) return;

            let lastScrollTop = 0;
            
            window.addEventListener('scroll', Utils.debounce(function() {
                const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
                
                if (scrollTop > CONFIG.stickyThreshold) {
                    navbar.classList.add('shadow-lg');
                    navbar.style.backdropFilter = 'blur(10px)';
                    navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
                } else {
                    navbar.classList.remove('shadow-lg');
                    navbar.style.backdropFilter = 'none';
                    navbar.style.backgroundColor = '';
                }
                
                lastScrollTop = scrollTop;
            }, 10));
        },

        getCurrentPageId: function() {
            const path = window.location.pathname;
            const filename = path.split('/').pop();
            return filename.replace('.html', '') || 'homepage';
        },

        setupLanguageSwitcher: function() {
            // Find the navbar-end section
            const navbarEnd = document.querySelector('.navbar-end');
            if (!navbarEnd) return;

            // Check if language switcher already exists
            if (document.querySelector('.language-switcher')) return;

            // Create language switcher
            const languageSwitcher = document.createElement('div');
            languageSwitcher.className = 'language-switcher';
            languageSwitcher.innerHTML = `
                <button class="btn" onclick="toggleLanguage()">
                    <span class="iconify" data-icon="mdi:translate" data-width="18"></span>
                    <span>EN</span>
                </button>
            `;

            // Insert before the Get Quote button
            const getQuoteBtn = navbarEnd.querySelector('.btn-primary');
            if (getQuoteBtn) {
                navbarEnd.insertBefore(languageSwitcher, getQuoteBtn);
            } else {
                navbarEnd.appendChild(languageSwitcher);
            }

            // Add language toggle functionality
            window.toggleLanguage = function() {
                const btn = document.querySelector('.language-switcher .btn span:last-child');
                const icon = document.querySelector('.language-switcher .btn .iconify');
                
                if (btn.textContent === 'EN') {
                    btn.textContent = 'SR';
                    icon.setAttribute('data-icon', 'mdi:translate-variant');
                    // Here you would implement actual language switching logic
                    console.log('Switching to Serbian');
                } else {
                    btn.textContent = 'EN';
                    icon.setAttribute('data-icon', 'mdi:translate');
                    // Here you would implement actual language switching logic
                    console.log('Switching to English');
                }
                
                // Add click animation
                const button = document.querySelector('.language-switcher .btn');
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = '';
                }, 150);
            };
        }
    };

    // Form Enhancement
    const FormEnhancement = {
        init: function() {
            this.setupFormValidation();
            this.setupFormSubmission();
            this.setupInputEnhancements();
        },

        setupFormValidation: function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                const inputs = form.querySelectorAll('input, textarea, select');
                
                inputs.forEach(input => {
                    // Real-time validation
                    input.addEventListener('blur', function() {
                        this.validateField();
                    });
                    
                    input.addEventListener('input', Utils.debounce(function() {
                        if (this.classList.contains('error')) {
                            this.validateField();
                        }
                    }, 300));
                });
                
                // Form submission validation
                form.addEventListener('submit', function(e) {
                    if (!this.validateForm()) {
                        e.preventDefault();
                    }
                });
            });
        },

        setupFormSubmission: function() {
            const forms = document.querySelectorAll('form');
            
            forms.forEach(form => {
                form.addEventListener('submit', function(e) {
                    const submitButton = form.querySelector('button[type="submit"], input[type="submit"]');
                    if (submitButton) {
                        const loadingState = Utils.addLoadingState(submitButton, 'Sending...');
                        
                        // Simulate form submission (replace with actual submission logic)
                        setTimeout(() => {
                            loadingState.restore();
                            // Show success message or redirect
                            this.showSuccessMessage();
                        }, 2000);
                    }
                });
            });
        },

        setupInputEnhancements: function() {
            // Floating labels
            const inputs = document.querySelectorAll('.form-control input, .form-control textarea');
            
            inputs.forEach(input => {
                const label = input.parentElement.querySelector('label');
                if (label) {
                    // Add floating label class
                    label.classList.add('floating-label');
                    
                    // Check initial state
                    if (input.value) {
                        label.classList.add('active');
                    }
                    
                    // Handle focus/blur events
                    input.addEventListener('focus', function() {
                        label.classList.add('active');
                    });
                    
                    input.addEventListener('blur', function() {
                        if (!this.value) {
                            label.classList.remove('active');
                        }
                    });
                }
            });
        },

        validateField: function() {
            const value = this.value.trim();
            const fieldType = this.type;
            const required = this.hasAttribute('required');
            
            // Remove existing error state
            this.classList.remove('error');
            this.classList.remove('success');
            
            // Check required fields
            if (required && !value) {
                this.classList.add('error');
                this.showFieldError('This field is required');
                return false;
            }
            
            // Email validation
            if (fieldType === 'email' && value) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(value)) {
                    this.classList.add('error');
                    this.showFieldError('Please enter a valid email address');
                    return false;
                }
            }
            
            // Phone validation
            if (fieldType === 'tel' && value) {
                const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
                if (!phoneRegex.test(value.replace(/\s/g, ''))) {
                    this.classList.add('error');
                    this.showFieldError('Please enter a valid phone number');
                    return false;
                }
            }
            
            // Success state
            if (value) {
                this.classList.add('success');
            }
            
            return true;
        },

        showFieldError: function(message) {
            // Remove existing error message
            const existingError = this.parentElement.querySelector('.field-error');
            if (existingError) {
                existingError.remove();
            }
            
            // Add new error message
            const errorElement = document.createElement('div');
            errorElement.className = 'field-error text-error text-sm mt-1';
            errorElement.textContent = message;
            this.parentElement.appendChild(errorElement);
        },

        validateForm: function() {
            const inputs = this.querySelectorAll('input, textarea, select');
            let isValid = true;
            
            inputs.forEach(input => {
                if (!input.validateField()) {
                    isValid = false;
                }
            });
            
            return isValid;
        },

        showSuccessMessage: function() {
            // Create success message
            const message = document.createElement('div');
            message.className = 'alert alert-success fixed top-4 right-4 z-50 max-w-sm';
            message.innerHTML = `
                <span class="iconify" data-icon="heroicons:check-circle" data-width="20"></span>
                <span>Form submitted successfully!</span>
            `;
            
            document.body.appendChild(message);
            
            // Remove after 3 seconds
            setTimeout(() => {
                message.remove();
            }, 3000);
        }
    };

    // Card Enhancement
    const CardEnhancement = {
        init: function() {
            this.setupCardHoverEffects();
            this.setupCardClickHandlers();
            this.setupCardAnimations();
        },

        setupCardHoverEffects: function() {
            const cards = document.querySelectorAll('.irrigation-card, .product-image-card, .card');
            
            cards.forEach(card => {
                card.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-8px) scale(1.02)';
                    this.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
                });
                
                card.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0) scale(1)';
                    this.style.boxShadow = '';
                });
            });
        },

        setupCardClickHandlers: function() {
            const clickableCards = document.querySelectorAll('[onclick]');
            
            clickableCards.forEach(card => {
                card.addEventListener('click', function(e) {
                    // Add very fast click animation
                    this.style.transform = 'scale(0.92)';
                    this.style.transition = 'transform 0.05s ease-out';
                    
                    setTimeout(() => {
                        this.style.transform = '';
                        this.style.transition = '';
                    }, 60); // Very fast reset
                });
            });
        },

        setupCardAnimations: function() {
            const cards = document.querySelectorAll('.irrigation-card, .product-image-card, .card');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }
                });
            }, {
                threshold: 0.1,
                rootMargin: '0px 0px -50px 0px'
            });
            
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observer.observe(card);
            });
        }
    };

    // Tab Enhancement
    const TabEnhancement = {
        init: function() {
            this.setupTabSwitching();
            this.setupTabIndicator();
            this.setupTabAnimations();
        },

        setupTabSwitching: function() {
            const tabButtons = document.querySelectorAll('.irrigation-tab, .tab-button');
            
            tabButtons.forEach(button => {
                button.addEventListener('click', function(e) {
                    e.preventDefault();
                    
                    const tabId = this.getAttribute('data-tab') || this.getAttribute('onclick')?.match(/switchTab\('([^']+)'\)/)?.[1];
                    if (tabId) {
                        TabEnhancement.switchTab(tabId, this);
                    }
                });
            });
        },

        switchTab: function(tabId, clickedTab) {
            // Hide all tab contents
            const allContents = document.querySelectorAll('.tab-content');
            allContents.forEach(content => {
                content.classList.add('hidden');
                content.classList.remove('active');
            });
            
            // Show selected tab content
            const selectedContent = document.getElementById(tabId + '-content');
            if (selectedContent) {
                selectedContent.classList.remove('hidden');
                selectedContent.classList.add('active');
                
                // Add fade-in animation
                selectedContent.style.opacity = '0';
                selectedContent.style.transform = 'translateY(10px)';
                
                setTimeout(() => {
                    selectedContent.style.opacity = '1';
                    selectedContent.style.transform = 'translateY(0)';
                }, 50);
            }
            
            // Update tab button states
            const allTabs = document.querySelectorAll('.irrigation-tab, .tab-button');
            allTabs.forEach(tab => {
                tab.classList.remove('active');
            });
            
            if (clickedTab) {
                clickedTab.classList.add('active');
                this.updateTabIndicator(clickedTab);
            }
        },

        setupTabIndicator: function() {
            const activeTab = document.querySelector('.irrigation-tab.active, .tab-button.active');
            if (activeTab) {
                this.updateTabIndicator(activeTab);
            }
            
            // Handle window resize
            window.addEventListener('resize', Utils.debounce(() => {
                const currentActiveTab = document.querySelector('.irrigation-tab.active, .tab-button.active');
                if (currentActiveTab) {
                    this.updateTabIndicator(currentActiveTab);
                }
            }, 250));
        },

        updateTabIndicator: function(activeTab) {
            const indicator = document.querySelector('.tab-indicator');
            if (indicator && activeTab) {
                const tabRect = activeTab.getBoundingClientRect();
                const containerRect = activeTab.parentElement.getBoundingClientRect();
                const leftPosition = tabRect.left - containerRect.left;
                const width = tabRect.width;
                
                indicator.style.left = leftPosition + 'px';
                indicator.style.width = width + 'px';
            }
        },

        setupTabAnimations: function() {
            const tabButtons = document.querySelectorAll('.irrigation-tab, .tab-button');
            
            tabButtons.forEach(button => {
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                });
            });
        }
    };

    // Button Enhancement
    const ButtonEnhancement = {
        init: function() {
            this.setupButtonEffects();
            this.setupCTAButtons();
        },

        setupButtonEffects: function() {
            const buttons = document.querySelectorAll('.btn, button');
            
            buttons.forEach(button => {
                // Ripple effect
                button.addEventListener('click', function(e) {
                    const ripple = document.createElement('span');
                    const rect = this.getBoundingClientRect();
                    const size = Math.max(rect.width, rect.height);
                    const x = e.clientX - rect.left - size / 2;
                    const y = e.clientY - rect.top - size / 2;
                    
                    ripple.style.width = ripple.style.height = size + 'px';
                    ripple.style.left = x + 'px';
                    ripple.style.top = y + 'px';
                    ripple.classList.add('ripple');
                    ripple.style.animation = 'ripple 0.25s ease-out'; // Very fast ripple
                    
                    this.appendChild(ripple);
                    
                    setTimeout(() => {
                        ripple.remove();
                    }, 250); // Very fast removal
                });
                
                // Hover effects - more responsive
                button.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateY(-2px)';
                    this.style.transition = 'transform 0.1s ease-out';
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateY(0)';
                    this.style.transition = 'transform 0.1s ease-out';
                });
            });
        },

        setupCTAButtons: function() {
            const ctaButtons = document.querySelectorAll('.cta-button, .btn-primary');
            
            ctaButtons.forEach(button => {
                // Pulse animation for CTA buttons
                if (button.classList.contains('cta-button')) {
                    button.style.animation = 'pulse 2s infinite';
                }
                
                // Enhanced hover effects
                button.addEventListener('mouseenter', function() {
                    this.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.2)';
                });
                
                button.addEventListener('mouseleave', function() {
                    this.style.boxShadow = '';
                });
            });
        }
    };

    // Scroll Enhancement
    const ScrollEnhancement = {
        init: function() {
            this.setupScrollAnimations();
            this.setupScrollToTop();
            this.setupParallaxEffects();
            this.setupEnhancedScrollEffects();
            this.setupScrollProgress();
        },

        setupScrollAnimations: function() {
            // Check if card animations should be disabled for this page
            if (Utils.shouldDisableCardAnimations()) {
                // For pages with disabled animations, just ensure cards are visible
                const animatedElements = document.querySelectorAll('.irrigation-card, .product-image-card, .card, .bg-base-200, .bg-base-100');
                animatedElements.forEach(element => {
                    element.style.opacity = '1';
                    element.style.transform = 'none';
                    element.style.filter = 'none';
                    element.style.transition = 'none';
                });
                return; // Exit early, no animations
            }

            // Enhanced scroll animations for all cards and sections
            const animatedElements = document.querySelectorAll('.irrigation-card, .product-image-card, .card, .bg-base-200, .bg-base-100');
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Only animate if not already animated
                        if (!entry.target.classList.contains('animated')) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0) scale(1)';
                            entry.target.style.filter = 'blur(0px)';
                            entry.target.classList.add('animated');
                        }
                    }
                });
            }, {
                threshold: 0.08, // Moderate threshold
                rootMargin: '0px 0px -80px 0px' // Moderate margin
            });
            
            animatedElements.forEach((element, index) => {
                // Set initial state - more subtle
                element.style.opacity = '0';
                element.style.transform = 'translateY(20px) scale(0.98)';
                element.style.filter = 'blur(0.5px)';
                element.style.transition = `all 1s ease-out ${index * 0.04}s`; // Slightly faster
                
                observer.observe(element);
            });
        },

        setupScrollToTop: function() {
            // Create enhanced scroll to top button
            const scrollToTopBtn = document.createElement('button');
            scrollToTopBtn.className = 'btn btn-circle btn-primary fixed bottom-6 right-6 z-50';
            scrollToTopBtn.innerHTML = `
                <span class="iconify" data-icon="heroicons:arrow-up" data-width="24"></span>
                <div class="scroll-progress-ring"></div>
            `;
            scrollToTopBtn.style.cssText = `
                opacity: 0;
                transform: translateY(100px) scale(0.8);
                transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
                position: relative;
                overflow: hidden;
            `;
            
            // Add progress ring styles
            const style = document.createElement('style');
            style.textContent = `
                .scroll-progress-ring {
                    position: absolute;
                    top: -2px;
                    left: -2px;
                    right: -2px;
                    bottom: -2px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top: 2px solid var(--color-primary);
                    border-radius: 50%;
                    transform: rotate(-90deg);
                    transition: all 0.3s ease;
                }
                
                .scroll-to-top-hover {
                    transform: translateY(-2px) scale(1.05) !important;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
                }
                
                .ripple {
                    position: absolute;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.3);
                    transform: scale(0);
                    animation: ripple 0.25s ease-out;
                    pointer-events: none;
                }
                
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                /* Fix page height issues */
                body {
                    overflow-x: hidden;
                    min-height: 100vh;
                }
                
                footer {
                    margin-bottom: 0 !important;
                    padding-bottom: 20px !important;
                }
                
                /* Ensure fixed elements don't affect page height */
                .fixed, [style*="position: fixed"], [style*="position:fixed"] {
                    pointer-events: auto;
                }
                
                /* Enhanced Navigation Bar Styles */
                .navbar {
                    font-size: 16px !important;
                    font-weight: 500 !important;
                }
                
                .navbar .nav-link {
                    font-size: 18px !important;
                    font-weight: 600 !important;
                    padding: 12px 20px !important;
                    transition: all 0.3s ease !important;
                    border-radius: 8px !important;
                    margin: 0 4px !important;
                }
                
                .navbar .nav-link:hover {
                    background-color: var(--color-primary) !important;
                    color: var(--color-primary-content) !important;
                    transform: translateY(-2px) !important;
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
                }
                
                .navbar .nav-link.active {
                    background-color: var(--color-primary) !important;
                    color: var(--color-primary-content) !important;
                    font-weight: 700 !important;
                }
                
                .navbar .btn-primary {
                    font-size: 18px !important;
                    font-weight: 600 !important;
                    padding: 12px 24px !important;
                    border-radius: 8px !important;
                    transition: all 0.3s ease !important;
                }
                
                .navbar .btn-primary:hover {
                    transform: translateY(-2px) !important;
                    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.2) !important;
                }
                
                .navbar .text-xl {
                    font-size: 24px !important;
                    font-weight: 700 !important;
                }
                
                /* Mobile menu enhancements */
                .navbar .lg\\:hidden {
                    font-size: 18px !important;
                    padding: 12px 16px !important;
                }
                
                .dropdown .menu .btn {
                    font-size: 16px !important;
                    font-weight: 500 !important;
                    padding: 12px 16px !important;
                }
                
                /* Language switcher styles */
                .language-switcher {
                    display: flex !important;
                    align-items: center !important;
                    margin-right: 12px !important;
                }
                
                .language-switcher .btn {
                    font-size: 16px !important;
                    font-weight: 500 !important;
                    padding: 8px 16px !important;
                    border-radius: 6px !important;
                    background-color: var(--color-base-200) !important;
                    color: var(--color-base-content) !important;
                    border: 1px solid var(--color-base-300) !important;
                    transition: all 0.3s ease !important;
                    display: flex !important;
                    align-items: center !important;
                    gap: 6px !important;
                }
                
                .language-switcher .btn:hover {
                    background-color: var(--color-primary) !important;
                    color: var(--color-primary-content) !important;
                    transform: translateY(-1px) !important;
                    box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1) !important;
                }
                
                .language-switcher .iconify {
                    font-size: 18px !important;
                }
            `;
            document.head.appendChild(style);
            
            document.body.appendChild(scrollToTopBtn);
            
            // Enhanced show/hide with progress indicator
            window.addEventListener('scroll', Utils.debounce(() => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = (scrollTop / docHeight) * 100;
                
                if (scrollTop > 300) { // Increased threshold
                    scrollToTopBtn.style.opacity = '1';
                    scrollToTopBtn.style.transform = 'translateY(0) scale(1)';
                    
                    // Update progress ring
                    const progressRing = scrollToTopBtn.querySelector('.scroll-progress-ring');
                    if (progressRing) {
                        progressRing.style.transform = `rotate(${-90 + (scrollPercent * 3.6)}deg)`;
                    }
                } else {
                    scrollToTopBtn.style.opacity = '0';
                    scrollToTopBtn.style.transform = 'translateY(100px) scale(0.8)';
                }
            }, 15)); // Increased debounce time
            
            // Enhanced hover effects - more subtle
            scrollToTopBtn.addEventListener('mouseenter', function() {
                this.classList.add('scroll-to-top-hover');
                // Removed pulse animation for subtlety
            });
            
            scrollToTopBtn.addEventListener('mouseleave', function() {
                this.classList.remove('scroll-to-top-hover');
            });
            
            // Enhanced scroll to top with easing
            scrollToTopBtn.addEventListener('click', () => {
                const currentScroll = window.pageYOffset;
                const targetScroll = 0;
                const distance = targetScroll - currentScroll;
                const duration = 1000;
                let start = null;
                
                function animation(currentTime) {
                    if (start === null) start = currentTime;
                    const timeElapsed = currentTime - start;
                    const run = easeInOutCubic(timeElapsed, currentScroll, distance, duration);
                    window.scrollTo(0, run);
                    if (timeElapsed < duration) requestAnimationFrame(animation);
                }
                
                function easeInOutCubic(t, b, c, d) {
                    t /= d / 2;
                    if (t < 1) return c / 2 * t * t * t + b;
                    t -= 2;
                    return c / 2 * (t * t * t + 2) + b;
                }
                
                requestAnimationFrame(animation);
            });
        },

        setupParallaxEffects: function() {
            // Check if animations should be disabled for this page
            if (Utils.shouldDisableCardAnimations()) {
                // For pages with disabled animations, ensure no parallax effects
                const parallaxElements = document.querySelectorAll('.bg-base-200, .bg-base-100, .comparison-grid');
                parallaxElements.forEach(element => {
                    element.style.transform = 'none';
                    element.style.filter = 'none';
                });
                return; // Exit early, no parallax
            }

            // Enhanced parallax for background elements - only for background sections
            const parallaxElements = document.querySelectorAll('.bg-base-200, .bg-base-100, .comparison-grid');
            
            window.addEventListener('scroll', Utils.debounce(() => {
                const scrolled = window.pageYOffset;
                const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
                
                // Don't apply parallax beyond the actual content
                if (scrolled > maxScroll) {
                    return;
                }
                
                parallaxElements.forEach((element, index) => {
                    // Skip if element is a card or has specific content
                    if (element.classList.contains('irrigation-card') || 
                        element.classList.contains('product-image-card') || 
                        element.classList.contains('card') ||
                        element.closest('footer')) { // Skip footer elements
                        return;
                    }
                    
                    const speed = element.getAttribute('data-speed') || 0.12; // Moderate speed
                    const yPos = -(scrolled * speed);
                    
                    // Add very subtle parallax effect only to background elements
                    element.style.transform = `translateY(${yPos}px)`;
                    element.style.filter = `blur(${Math.abs(yPos) * 0.0003}px)`; // Moderate blur
                });
            }, 12)); // Moderate debounce time
        },

        setupEnhancedScrollEffects: function() {
            // Check if animations should be disabled for this page
            if (Utils.shouldDisableCardAnimations()) {
                // For pages with disabled animations, just ensure text is visible
                const textElements = document.querySelectorAll('h1, h2, h3, p');
                textElements.forEach(element => {
                    element.style.opacity = '1';
                    element.style.transform = 'none';
                    element.style.transition = 'none';
                });
                return; // Exit early, no animations
            }

            // Add scroll-triggered animations for text elements
            const textElements = document.querySelectorAll('h1, h2, h3, p');
            
            const textObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        // Only animate if not already animated
                        if (!entry.target.classList.contains('text-animated')) {
                            entry.target.style.opacity = '1';
                            entry.target.style.transform = 'translateY(0)';
                            entry.target.classList.add('text-animated');
                        }
                    }
                });
            }, {
                threshold: 0.25, // Moderate threshold
                rootMargin: '0px 0px -50px 0px' // Moderate margin
            });
            
            textElements.forEach((element, index) => {
                element.style.opacity = '0';
                element.style.transform = 'translateY(10px)'; // Reduced movement
                element.style.transition = `all 0.8s ease-out ${index * 0.02}s`; // Slightly faster
                textObserver.observe(element);
            });
        },

        setupScrollProgress: function() {
            // Create scroll progress bar
            const progressBar = document.createElement('div');
            progressBar.className = 'scroll-progress-bar';
            progressBar.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0%;
                height: 3px;
                background: linear-gradient(90deg, var(--color-primary), var(--color-secondary));
                z-index: 9999;
                transition: width 0.1s ease;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            `;
            
            document.body.appendChild(progressBar);
            
            // Update progress bar
            window.addEventListener('scroll', Utils.debounce(() => {
                const scrollTop = window.pageYOffset;
                const docHeight = document.documentElement.scrollHeight - window.innerHeight;
                const scrollPercent = Math.min((scrollTop / docHeight) * 100, 100); // Cap at 100%
                
                progressBar.style.width = scrollPercent + '%';
            }, 10)); // Increased debounce time
            
            // Fix page height issues
            this.fixPageHeight();
        },
        
        fixPageHeight: function() {
            // Ensure page doesn't scroll beyond content
            const footer = document.querySelector('footer');
            if (footer) {
                // Add margin to prevent over-scrolling
                footer.style.marginBottom = '0';
                footer.style.paddingBottom = '20px';
            }
            
            // Fix any elements that might be causing extra height
            const allElements = document.querySelectorAll('*');
            allElements.forEach(element => {
                const computedStyle = window.getComputedStyle(element);
                if (computedStyle.position === 'absolute' || computedStyle.position === 'fixed') {
                    // Ensure absolute/fixed elements don't affect page height
                    element.style.pointerEvents = 'auto';
                }
            });
            
            // Set proper body height
            document.body.style.minHeight = '100vh';
            document.body.style.overflowX = 'hidden'; // Prevent horizontal scroll
        }
    };

    // Image Enhancement
    const ImageEnhancement = {
        init: function() {
            this.setupLazyLoading();
            this.setupImageZoom();
            this.setupImageGallery();
        },

        setupLazyLoading: function() {
            const images = document.querySelectorAll('img[data-src]');
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.getAttribute('data-src');
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                imageObserver.observe(img);
            });
        },

        setupImageZoom: function() {
            const zoomableImages = document.querySelectorAll('.zoomable');
            
            zoomableImages.forEach(img => {
                img.addEventListener('mouseenter', function() {
                    this.style.transform = 'scale(1.1)';
                    this.style.transition = 'transform 0.3s ease';
                });
                
                img.addEventListener('mouseleave', function() {
                    this.style.transform = 'scale(1)';
                });
            });
        },

        setupImageGallery: function() {
            const galleryImages = document.querySelectorAll('.gallery-image');
            
            galleryImages.forEach(img => {
                img.addEventListener('click', function() {
                    // Create lightbox
                    const lightbox = document.createElement('div');
                    lightbox.className = 'fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center';
                    lightbox.innerHTML = `
                        <div class="relative max-w-4xl max-h-full p-4">
                            <img src="${this.src}" alt="${this.alt}" class="max-w-full max-h-full object-contain">
                            <button class="btn btn-circle btn-ghost absolute top-4 right-4 text-white">
                                <span class="iconify" data-icon="heroicons:x-mark" data-width="24"></span>
                            </button>
                        </div>
                    `;
                    
                    document.body.appendChild(lightbox);
                    
                    // Close lightbox
                    lightbox.addEventListener('click', function(e) {
                        if (e.target === lightbox || e.target.closest('button')) {
                            lightbox.remove();
                        }
                    });
                });
            });
        }
    };

    // Performance Enhancement
    const PerformanceEnhancement = {
        init: function() {
            this.setupResourcePreloading();
            this.setupPerformanceMonitoring();
        },

        setupResourcePreloading: function() {
            // Preload critical resources
            const criticalImages = document.querySelectorAll('img[data-preload]');
            
            criticalImages.forEach(img => {
                const link = document.createElement('link');
                link.rel = 'preload';
                link.as = 'image';
                link.href = img.src;
                document.head.appendChild(link);
            });
        },

        setupPerformanceMonitoring: function() {
            // Monitor page load performance
            window.addEventListener('load', () => {
                const loadTime = performance.timing.loadEventEnd - performance.timing.navigationStart;
                console.log(`Page loaded in ${loadTime}ms`);
            });
        }
    };

    // Accessibility Enhancement
    const AccessibilityEnhancement = {
        init: function() {
            this.setupKeyboardNavigation();
            this.setupFocusManagement();
            this.setupScreenReaderSupport();
        },

        setupKeyboardNavigation: function() {
            // Enhanced keyboard navigation for interactive elements
            const interactiveElements = document.querySelectorAll('button, a, input, textarea, select');
            
            interactiveElements.forEach(element => {
                element.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        this.click();
                    }
                });
            });
        },

        setupFocusManagement: function() {
            // Visible focus indicators
            const focusableElements = document.querySelectorAll('button, a, input, textarea, select');
            
            focusableElements.forEach(element => {
                element.addEventListener('focus', function() {
                    this.style.outline = '2px solid var(--color-primary)';
                    this.style.outlineOffset = '2px';
                });
                
                element.addEventListener('blur', function() {
                    this.style.outline = '';
                    this.style.outlineOffset = '';
                });
            });
        },

        setupScreenReaderSupport: function() {
            // Add ARIA labels and descriptions where needed
            const buttons = document.querySelectorAll('button:not([aria-label])');
            
            buttons.forEach(button => {
                const icon = button.querySelector('.iconify');
                if (icon && !button.textContent.trim()) {
                    const iconName = icon.getAttribute('data-icon');
                    button.setAttribute('aria-label', iconName.replace('heroicons:', '').replace('mdi:', ''));
                }
            });
        }
    };

    // Initialize all enhancements when DOM is ready
    document.addEventListener('DOMContentLoaded', function() {
        // Check if animations should be disabled immediately
        if (Utils.shouldDisableCardAnimations()) {
            console.log('Card animations disabled for this page');
            
            // Inject CSS to completely disable animations
            const disableAnimationsCSS = document.createElement('style');
            disableAnimationsCSS.textContent = `
                .irrigation-card, .product-image-card, .card, .bg-base-200, .bg-base-100, h1, h2, h3, p {
                    opacity: 1 !important;
                    transform: none !important;
                    filter: none !important;
                    transition: none !important;
                    animation: none !important;
                }
                
                /* Disable any scroll-triggered animations */
                .animated, .text-animated {
                    opacity: 1 !important;
                    transform: none !important;
                }
            `;
            document.head.appendChild(disableAnimationsCSS);
            
            // Immediately disable all animations
            const allElements = document.querySelectorAll('.irrigation-card, .product-image-card, .card, .bg-base-200, .bg-base-100, h1, h2, h3, p');
            allElements.forEach(element => {
                element.style.opacity = '1';
                element.style.transform = 'none';
                element.style.filter = 'none';
                element.style.transition = 'none';
            });
        }
        
        // Initialize all enhancement modules
        if (typeof NavigationEnhancement !== 'undefined') NavigationEnhancement.init();
        if (typeof FormEnhancement !== 'undefined') FormEnhancement.init();
        if (typeof CardEnhancement !== 'undefined') CardEnhancement.init();
        if (typeof TabEnhancement !== 'undefined') TabEnhancement.init();
        if (typeof ButtonEnhancement !== 'undefined') ButtonEnhancement.init();
        if (typeof ScrollEnhancement !== 'undefined') ScrollEnhancement.init();
        if (typeof ImageEnhancement !== 'undefined') ImageEnhancement.init();
        if (typeof PerformanceEnhancement !== 'undefined') PerformanceEnhancement.init();
        if (typeof AccessibilityEnhancement !== 'undefined') AccessibilityEnhancement.init();
        
        console.log('Interactive enhancements initialized successfully!');
    });

})();