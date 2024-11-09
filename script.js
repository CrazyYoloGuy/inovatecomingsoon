function preloadImage(url) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
    });
}

function createParticles() {
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles-container';
    document.body.appendChild(particlesContainer);

    function createParticle() {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random size between 3 and 8px
        const size = Math.random() * 5 + 3;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random position
        const x = Math.random() * window.innerWidth;
        const y = Math.random() * window.innerHeight;
        particle.style.left = `${x}px`;
        particle.style.top = `${y}px`;
        
        // Add to container
        particlesContainer.appendChild(particle);
        
        // Animate
        particle.animate([
            {
                opacity: 0,
                transform: 'scale(0) translate(0, 0)',
                offset: 0
            },
            {
                opacity: 0.5,
                transform: `scale(1) translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px)`,
                offset: 0.5
            },
            {
                opacity: 0,
                transform: `scale(1.5) translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px)`,
                offset: 1
            }
        ], {
            duration: 3000,
            easing: 'ease-out',
            iterations: 1
        }).onfinish = () => {
            particle.remove();
        };
    }

    // Create particles periodically
    const particleInterval = setInterval(() => {
        if (document.querySelector('.loader-wrapper').style.display === 'none') {
            clearInterval(particleInterval);
            setTimeout(() => {
                particlesContainer.remove();
            }, 3000);
            return;
        }
        createParticle();
    }, 100);
}

document.addEventListener('DOMContentLoaded', async () => {
    // Preload logo
    try {
        await preloadImage('logo.png');
    } catch (error) {
        console.error('Error loading logo:', error);
    }

    // Set countdown for exactly 10 days from now
    const now = new Date();
    const COUNTDOWN_END_DATE = new Date(now.getTime() + (10 * 24 * 60 * 60 * 1000)); // 10 days from now
    const countdownState = {
        startTime: now.getTime(),
        endTime: COUNTDOWN_END_DATE.getTime(),
        isComplete: false
    };

    // Modal functionality
    const modal = document.querySelector('.modal');
    const spoilerBtn = document.querySelector('.spoiler-btn');
    const closeBtn = document.querySelector('.close-btn');

    function openModal() {
        modal.style.display = 'block';
        setTimeout(() => {
            modal.classList.add('show');
        }, 10);
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }, 300);
    }

    spoilerBtn.addEventListener('click', openModal);
    closeBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Close modal with escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    function updateCountdown() {
        const now = Date.now();
        const distance = countdownState.endTime - now;
        
        // Calculate time units
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Update countdown display
        document.querySelector('.days').textContent = Math.max(0, days).toString().padStart(2, '0');
        document.querySelector('.hours').textContent = Math.max(0, hours).toString().padStart(2, '0');
        document.querySelector('.minutes').textContent = Math.max(0, minutes).toString().padStart(2, '0');
        document.querySelector('.seconds').textContent = Math.max(0, seconds).toString().padStart(2, '0');

        // Calculate and update progress
        const totalDuration = countdownState.endTime - countdownState.startTime;
        const elapsed = now - countdownState.startTime;
        const progress = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
        
        const progressBar = document.querySelector('.countdown-progress');
        const percentageText = document.querySelector('.countdown-percentage');
        if (progressBar && percentageText) {
            progressBar.style.width = `${progress}%`;
            percentageText.textContent = `${Math.round(progress)}%`;
        }

        // Check if countdown is complete
        if (distance < 0) {
            clearInterval(countdownInterval);
            showCompletionMessage();
            
            // Optional: Notify if not already notified
            if (!localStorage.getItem('completionNotified')) {
                showNotification('Countdown Complete!', 'The wait is over! Check out what\'s new.');
                localStorage.setItem('completionNotified', 'true');
            }
        }
    }

    // Add notification functionality
    function showNotification(title, message) {
        if (!("Notification" in window)) {
            return;
        }

        if (Notification.permission === "granted") {
            new Notification(title, { body: message });
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
                if (permission === "granted") {
                    new Notification(title, { body: message });
                }
            });
        }
    }

    function showCompletionMessage() {
        const countdownContainer = document.querySelector('.countdown-container');
        const progressContainer = document.querySelector('.countdown-progress-container');
        
        if (countdownContainer && progressContainer) {
            progressContainer.style.opacity = '0';
            setTimeout(() => {
                progressContainer.style.display = 'none';
                countdownContainer.innerHTML = `
                    <div class="completion-message">
                        <i class="fas fa-check-circle"></i>
                        <h2>Welcome to Innovate Project!</h2>
                        <p>Experience the Next Generation of Discord & Web Innovation</p>
                        <div class="completion-stats">
                            <div class="stat">
                                <i class="fab fa-discord"></i>
                                <span>Advanced Bot Systems</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-globe"></i>
                                <span>Dynamic Websites</span>
                            </div>
                            <div class="stat">
                                <i class="fas fa-code"></i>
                                <span>Custom Solutions</span>
                            </div>
                        </div>
                    </div>
                `;
            }, 300);
        }
    }

    // Start countdown
    updateCountdown();
    const countdownInterval = setInterval(updateCountdown, 1000);

    // Request notification permission on page load
    if ("Notification" in window && Notification.permission === "default") {
        Notification.requestPermission();
    }

    // Create particles
    createParticles();

    // Enhanced loading animation
    const progress = document.querySelector('.loading-progress');
    const loaderWrapper = document.querySelector('.loader-wrapper');
    const loadingText = document.querySelector('.loading-text');
    let width = 0;
    
    const loadingInterval = setInterval(() => {
        if (width >= 100) {
            clearInterval(loadingInterval);
            loadingText.textContent = 'Welcome!';
            loadingText.style.animation = 'none';
            loadingText.style.opacity = '1';
            
            setTimeout(() => {
                loaderWrapper.style.opacity = '0';
                loaderWrapper.style.pointerEvents = 'none';
                setTimeout(() => {
                    loaderWrapper.style.display = 'none';
                }, 800);
            }, 500);
        } else {
            // Smooth acceleration
            width += width < 80 ? 0.5 : (width < 90 ? 0.2 : 0.1);
            if (progress) {
                progress.style.width = `${width}%`;
                loadingText.textContent = `Loading Experience... ${Math.round(width)}%`;
            }
        }
    }, 16);

    // Add smooth reveal animation for update items
    const updateItems = document.querySelectorAll('.update-item');
    updateItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'all 0.3s ease-out';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// Add smooth hover animations for interactive elements
document.querySelectorAll('.social-link, .submit-btn').forEach(element => {
    element.addEventListener('mouseover', function() {
        this.style.transform = 'translateY(-2px)';
    });

    element.addEventListener('mouseout', function() {
        this.style.transform = 'translateY(0)';
    });
});

function adjustContainerHeight() {
    const container = document.querySelector('.container');
    const viewportHeight = window.innerHeight;
    container.style.height = `${viewportHeight * 0.9}px`; // 90% of viewport height

    // Adjust modal content height
    const modalContent = document.querySelector('.modal-content');
    if (modalContent) {
        modalContent.style.height = `${viewportHeight * 0.9}px`;
        modalContent.style.maxHeight = `${viewportHeight * 0.9}px`;
    }
}

// Add these event listeners
window.addEventListener('load', adjustContainerHeight);
window.addEventListener('resize', adjustContainerHeight);