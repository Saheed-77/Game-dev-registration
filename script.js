/**
 * ============================================
 * GAME DEVELOPMENT WORKSHOP - REGISTRATION SCRIPT
 * IEEE Student Branch
 * ============================================
 * 
 * This script handles:
 * 1. Page loading animation
 * 2. Particle background generation
 * 3. Department selection functionality
 * 4. Form validation and redirect
 */

// ============================================
// CONFIGURATION
// ============================================

const CONFIG = {
    // Google Form link for CSE department
    googleFormUrlCSE: 'https://docs.google.com/forms/d/e/1FAIpQLSex5OZzz7ullF5eGFY3V3pPbp-D6qjkDxdNkVNyud7jimEjEg/viewform?usp=dialog',
    
    // Google Form link for all other departments
    googleFormUrlOther: 'https://docs.google.com/forms/d/e/1FAIpQLSf4XxTT_Ibh9isDkYyYZ5tZA5anXZZp4a-cup0RmmKf3w-uYQ/viewform?usp=publish-editor',
    
    // Number of particles to generate
    particleCount: 50,
    
    // Loading screen duration (ms)
    loadingDuration: 1500,
    
    // Animation delays
    animationDelay: 100
};

// ============================================
// DOM ELEMENTS
// ============================================

const elements = {
    loadingOverlay: document.getElementById('loadingOverlay'),
    departmentGrid: document.getElementById('departmentGrid'),
    selectedValue: document.getElementById('selectedValue'),
    selectedDisplay: document.getElementById('selectedDisplay'),
    errorMessage: document.getElementById('errorMessage'),
    registerBtn: document.getElementById('registerBtn'),
    particlesContainer: document.getElementById('particles')
};

// ============================================
// STATE MANAGEMENT
// ============================================

let selectedDepartment = null;

// ============================================
// INITIALIZATION
// ============================================

/**
 * Initialize the application when DOM is ready
 */
document.addEventListener('DOMContentLoaded', () => {
    initLoadingScreen();
    initParticles();
    initDepartmentSelection();
    initRegisterButton();
});

// ============================================
// LOADING SCREEN
// ============================================

/**
 * Handle the loading screen animation
 * Fades out after a set duration
 */
function initLoadingScreen() {
    setTimeout(() => {
        elements.loadingOverlay.classList.add('hidden');
        
        // Remove from DOM after transition
        setTimeout(() => {
            elements.loadingOverlay.style.display = 'none';
        }, 500);
    }, CONFIG.loadingDuration);
}

// ============================================
// PARTICLE SYSTEM
// ============================================

/**
 * Generate floating particles for the background
 * Creates a dynamic, game-like atmosphere
 */
function initParticles() {
    const container = elements.particlesContainer;
    if (!container) return;
    
    // Clear existing particles
    container.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < CONFIG.particleCount; i++) {
        createParticle(container, i);
    }
}

/**
 * Create a single particle element
 * @param {HTMLElement} container - Parent container
 * @param {number} index - Particle index for variation
 */
function createParticle(container, index) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Randomize particle properties for variety
    const size = Math.random() * 4 + 2; // 2-6px
    const left = Math.random() * 100; // 0-100%
    const delay = Math.random() * 8; // 0-8s delay
    const duration = Math.random() * 4 + 6; // 6-10s duration
    const hue = Math.random() > 0.5 ? 180 : 270; // Cyan or Purple
    
    // Apply styles
    particle.style.cssText = `
        width: ${size}px;
        height: ${size}px;
        left: ${left}%;
        animation-delay: ${delay}s;
        animation-duration: ${duration}s;
        background: hsl(${hue}, 100%, 50%);
        box-shadow: 0 0 ${size * 2}px hsl(${hue}, 100%, 50%);
    `;
    
    container.appendChild(particle);
}

// ============================================
// DEPARTMENT SELECTION
// ============================================

/**
 * Initialize department button click handlers
 * Manages selection state and visual feedback
 */
function initDepartmentSelection() {
    const buttons = elements.departmentGrid.querySelectorAll('.dept-btn');
    
    buttons.forEach(button => {
        button.addEventListener('click', () => handleDepartmentSelect(button));
        
        // Add keyboard support for accessibility
        button.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                handleDepartmentSelect(button);
            }
        });
    });
}

/**
 * Handle department button selection
 * @param {HTMLElement} button - Clicked button element
 */
function handleDepartmentSelect(button) {
    const department = button.dataset.dept;
    const allButtons = elements.departmentGrid.querySelectorAll('.dept-btn');
    
    // Remove selection from all buttons
    allButtons.forEach(btn => {
        btn.classList.remove('selected');
        btn.setAttribute('aria-pressed', 'false');
    });
    
    // Add selection to clicked button
    button.classList.add('selected');
    button.setAttribute('aria-pressed', 'true');
    
    // Update state
    selectedDepartment = department;
    
    // Update display
    updateSelectedDisplay(department);
    
    // Hide error message if showing
    hideError();
    
    // Add subtle haptic feedback effect
    animateSelection(button);
}

/**
 * Update the selected department display
 * @param {string} department - Department code
 */
function updateSelectedDisplay(department) {
    elements.selectedValue.textContent = department;
    elements.selectedValue.style.animation = 'none';
    
    // Trigger reflow for animation restart
    void elements.selectedValue.offsetWidth;
    elements.selectedValue.style.animation = 'pulse 0.3s ease';
}

/**
 * Add selection animation effect
 * @param {HTMLElement} button - Selected button
 */
function animateSelection(button) {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.style.cssText = `
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%) scale(0);
        width: 100%;
        height: 100%;
        background: radial-gradient(circle, rgba(0, 245, 255, 0.3), transparent);
        border-radius: inherit;
        animation: ripple 0.6s ease-out forwards;
        pointer-events: none;
    `;
    
    // Add ripple animation keyframes if not exists
    if (!document.getElementById('ripple-style')) {
        const style = document.createElement('style');
        style.id = 'ripple-style';
        style.textContent = `
            @keyframes ripple {
                to {
                    transform: translate(-50%, -50%) scale(1.5);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
    
    button.appendChild(ripple);
    
    // Remove ripple after animation
    setTimeout(() => ripple.remove(), 600);
}

// ============================================
// REGISTRATION HANDLING
// ============================================

/**
 * Initialize register button click handler
 */
function initRegisterButton() {
    elements.registerBtn.addEventListener('click', handleRegistration);
    
    // Keyboard support
    elements.registerBtn.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRegistration();
        }
    });
}

/**
 * Handle registration button click
 * Validates selection and redirects to Google Form
 */
function handleRegistration() {
    // Validate department selection
    if (!selectedDepartment) {
        showError();
        shakeButton();
        return;
    }
    
    // Hide error if showing
    hideError();
    
    // Show loading state
    showLoadingState();
    
    // Build redirect URL with department parameter
    const redirectUrl = buildRedirectUrl(selectedDepartment);
    
    // Redirect after brief delay for visual feedback
    setTimeout(() => {
        window.location.href = redirectUrl;
    }, 500);
}

/**
 * Build the Google Form URL with department parameter
 * Uses different form links for CSE vs other departments
 * @param {string} department - Selected department code
 * @returns {string} Complete redirect URL
 */
function buildRedirectUrl(department) {
    // Encode the department to handle special characters
    const encodedDept = encodeURIComponent(department);
    
    // Select the appropriate form URL based on department
    const baseUrl = department === 'CSE' 
        ? CONFIG.googleFormUrlCSE 
        : CONFIG.googleFormUrlOther;
    
    // Check if form URL already has parameters
    const separator = baseUrl.includes('?') ? '&' : '?';
    
    return `${baseUrl}${separator}department=${encodedDept}`;
}

// ============================================
// ERROR HANDLING
// ============================================

/**
 * Show the error message
 */
function showError() {
    elements.errorMessage.classList.add('show');
    
    // Auto-hide after 3 seconds
    setTimeout(hideError, 3000);
}

/**
 * Hide the error message
 */
function hideError() {
    elements.errorMessage.classList.remove('show');
}

/**
 * Add shake animation to register button
 */
function shakeButton() {
    elements.registerBtn.style.animation = 'shake 0.5s ease';
    
    setTimeout(() => {
        elements.registerBtn.style.animation = '';
    }, 500);
}

// ============================================
// LOADING STATE
// ============================================

/**
 * Show loading state on register button
 */
function showLoadingState() {
    const btnText = elements.registerBtn.querySelector('.btn-text');
    const originalContent = btnText.innerHTML;
    
    // Update button content
    btnText.innerHTML = `
        <span class="btn-icon">⏳</span>
        REDIRECTING...
    `;
    
    // Disable button
    elements.registerBtn.disabled = true;
    elements.registerBtn.style.cursor = 'wait';
}

// ============================================
// UTILITY FUNCTIONS
// ============================================

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
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

/**
 * Check if device supports touch
 * @returns {boolean} True if touch device
 */
function isTouchDevice() {
    return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

// ============================================
// RESIZE HANDLER
// ============================================

/**
 * Handle window resize for particle regeneration
 */
const handleResize = debounce(() => {
    initParticles();
}, 250);

window.addEventListener('resize', handleResize);

// ============================================
// KEYBOARD NAVIGATION
// ============================================

/**
 * Enhance keyboard navigation for accessibility
 */
document.addEventListener('keydown', (e) => {
    // Tab navigation focus styling
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('mousedown', () => {
    document.body.classList.remove('keyboard-nav');
});

// Add focus styles for keyboard navigation
const focusStyle = document.createElement('style');
focusStyle.textContent = `
    .keyboard-nav .dept-btn:focus,
    .keyboard-nav .register-btn:focus {
        outline: 2px solid var(--color-cyan);
        outline-offset: 4px;
    }
`;
document.head.appendChild(focusStyle);

// ============================================
// CONSOLE MESSAGE
// ============================================

console.log(`
%c🎮 Game Development Workshop
%cIEEE Student Branch Registration Page

Built with ❤️ for aspiring game developers

`, 
'color: #00f5ff; font-size: 20px; font-weight: bold;',
'color: #a855f7; font-size: 14px;'
);

// ============================================
// EXPORT FOR TESTING (if needed)
// ============================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        CONFIG,
        handleDepartmentSelect,
        handleRegistration,
        buildRedirectUrl
    };
}
