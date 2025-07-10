// Sidebar Toggle Functionality
document.addEventListener('DOMContentLoaded', function() {
    const sidebarToggle = document.getElementById('sidebarToggle');
    const appContainer = document.querySelector('.app-container');
    const sidebar = document.querySelector('.sidebar');
    
    // Toggle sidebar collapse
    sidebarToggle.addEventListener('click', function() {
        appContainer.classList.toggle('sidebar-collapsed');
        
        // Store sidebar state in localStorage
        const isCollapsed = appContainer.classList.contains('sidebar-collapsed');
        localStorage.setItem('sidebarCollapsed', isCollapsed);
    });
    
    // Restore sidebar state from localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    if (savedState === 'true') {
        appContainer.classList.add('sidebar-collapsed');
    }
    
    // Mobile sidebar toggle
    function handleMobileView() {
        if (window.innerWidth <= 768) {
            sidebar.classList.add('mobile-view');
        } else {
            sidebar.classList.remove('mobile-view', 'mobile-open');
        }
    }
    
    // Handle window resize
    window.addEventListener('resize', handleMobileView);
    handleMobileView(); // Initial check
    
    // Simple particle animation for background
    createParticleEffect();
});

// Particle Background Effect
function createParticleEffect() {
    const particleContainer = document.getElementById('particle-background');
    const particleCount = 50;
    
    for (let i = 0; i < particleCount; i++) {
        createParticle(particleContainer);
    }
}

function createParticle(container) {
    const particle = document.createElement('div');
    particle.style.position = 'absolute';
    particle.style.width = Math.random() * 3 + 1 + 'px';
    particle.style.height = particle.style.width;
    particle.style.background = `rgba(0, 196, 180, ${Math.random() * 0.5 + 0.1})`;
    particle.style.borderRadius = '50%';
    particle.style.left = Math.random() * 100 + '%';
    particle.style.top = Math.random() * 100 + '%';
    particle.style.pointerEvents = 'none';
    
    // Animation
    particle.style.animation = `float ${Math.random() * 10 + 10}s infinite linear`;
    
    container.appendChild(particle);
    
    // Remove particle after animation completes
    setTimeout(() => {
        if (particle.parentNode) {
            particle.parentNode.removeChild(particle);
            createParticle(container); // Create new particle
        }
    }, (Math.random() * 10 + 10) * 1000);
}

// Add CSS animation for particles
const style = document.createElement('style');
style.textContent = `
    @keyframes float {
        0% {
            transform: translateY(100vh) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Navigation item click handlers
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // Remove active class from all items
        document.querySelectorAll('.nav-item').forEach(navItem => {
            navItem.classList.remove('active');
        });
        
        // Add active class to clicked item
        this.classList.add('active');
        
        // Update page title based on navigation
        const label = this.querySelector('.nav-label').textContent;
        document.querySelector('.page-title').textContent = label;
    });
});

// Notification badge click handler
document.querySelector('.notification-badge').addEventListener('click', function() {
    // Animate the badge
    this.style.transform = 'scale(0.9)';
    setTimeout(() => {
        this.style.transform = 'scale(1)';
    }, 150);
    
    // Reset badge count (simulate reading notifications)
    setTimeout(() => {
        const badgeCount = this.querySelector('.badge-count');
        badgeCount.textContent = '0';
        badgeCount.style.display = 'none';
    }, 1000);
});

// Profile section click handler
document.querySelector('.profile-section').addEventListener('click', function() {
    // Simple profile menu simulation
    console.log('Profile menu clicked');
    // In a real app, this would open a dropdown menu
});