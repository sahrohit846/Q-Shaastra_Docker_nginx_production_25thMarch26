/**
 * Q-Shaastra Enhanced Landing Page JavaScript
 * Advanced gamification and interactive features
 */

class QuantumGamification {
    constructor() {
        this.userLevel = parseInt(localStorage.getItem('quantumLevel') || '1');
        this.userXP = parseInt(localStorage.getItem('quantumXP') || '0');
        this.achievements = JSON.parse(localStorage.getItem('quantumAchievements') || '[]');
        this.currentStreak = parseInt(localStorage.getItem('quantumStreak') || '0');
        this.lastVisit = localStorage.getItem('quantumLastVisit');
        
        this.init();
    }

    init() {
        this.setupParticles();
        this.setupScrollEffects();
        this.setupAchievementSystem();
        this.setupProgressTracking();
        this.setupInteractiveElements();
        this.setupKeyboardShortcuts();
        this.checkDailyStreak();
        this.welcomeNewUser();
    }

    // Particle System Enhancement
    setupParticles() {
        if (typeof particlesJS !== 'undefined') {
            const updateParticlesTheme = () => {
                const isDark = document.body.classList.contains('dark');
                const particleColor = isDark ? '#00d4ff' : '#7c3aed';
                
                if (window.pJSDom && window.pJSDom[0]) {
                    window.pJSDom[0].pJS.particles.color.value = particleColor;
                    window.pJSDom[0].pJS.particles.line_linked.color = particleColor;
                    window.pJSDom[0].pJS.fn.particlesRefresh();
                }
            };

            // Update particles when theme changes
            const observer = new MutationObserver(updateParticlesTheme);
            observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
            
            updateParticlesTheme();
        }
    }

    // Advanced Scroll Effects
    setupScrollEffects() {
        // Parallax effect for hero section
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const parallaxElements = document.querySelectorAll('.floating-element');
            
            parallaxElements.forEach((element, index) => {
                const speed = 0.5 + (index * 0.1);
                element.style.transform = `translateY(${scrolled * speed}px) rotate(${scrolled * 0.1}deg)`;
            });

            // Progress bar update
            this.updateProgressBar();
        });

        // Intersection Observer for reveal animations
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    
                    // Trigger confetti for important sections
                    if (entry.target.classList.contains('stats')) {
                        this.triggerConfetti();
                    }
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe elements for reveal
        document.querySelectorAll('.feature-card, .stat-item, .section-header').forEach(el => {
            el.classList.add('scroll-reveal');
            revealObserver.observe(el);
        });
    }

    // Achievement System
    setupAchievementSystem() {
        const achievements = {
            firstVisit: { name: 'Welcome Explorer', xp: 50, icon: '🎉', description: 'First visit to Q-Shaastra' },
            featureExplorer: { name: 'Feature Explorer', xp: 100, icon: '🚀', description: 'Explored all features' },
            quantumLearner: { name: 'Quantum Learner', xp: 200, icon: '⚛️', description: 'Started learning quantum basics' },
            communityMember: { name: 'Community Member', xp: 150, icon: '👥', description: 'Joined our community' },
            dailyVisitor: { name: 'Daily Visitor', xp: 75, icon: '📅', description: 'Visited for consecutive days' },
            scrollMaster: { name: 'Scroll Master', xp: 50, icon: '🎯', description: 'Explored the entire page' }
        };

        // Check for achievements on page load
        this.checkAchievements(achievements);

        // Feature card interactions
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const rewardType = card.dataset.reward;
                if (rewardType && !this.hasAchievement(`feature_${rewardType}`)) {
                    this.unlockAchievement(`feature_${rewardType}`, {
                        name: `Discovered ${rewardType}`,
                        xp: 25,
                        icon: '🔓'
                    });
                }
            });
        });

        // Scroll depth achievement
        let maxScroll = 0;
        window.addEventListener('scroll', () => {
            const scrollPercent = (window.pageYOffset / (document.documentElement.scrollHeight - window.innerHeight)) * 100;
            maxScroll = Math.max(maxScroll, scrollPercent);
            
            if (maxScroll > 80 && !this.hasAchievement('scrollMaster')) {
                this.unlockAchievement('scrollMaster', achievements.scrollMaster);
            }
        });
    }

    checkAchievements(achievements) {
        // First visit achievement
        if (!this.hasAchievement('firstVisit')) {
            this.unlockAchievement('firstVisit', achievements.firstVisit);
        }

        // Check daily streak
        this.checkDailyStreak();
    }

    unlockAchievement(id, achievement) {
        if (this.hasAchievement(id)) return;

        this.achievements.push({
            id,
            name: achievement.name,
            icon: achievement.icon,
            date: new Date().toISOString(),
            xp: achievement.xp
        });

        this.addXP(achievement.xp);
        this.showAchievementNotification(achievement);
        this.saveProgress();
    }

    hasAchievement(id) {
        return this.achievements.some(a => a.id === id);
    }

    showAchievementNotification(achievement) {
        const notification = document.createElement('div');
        notification.className = 'achievement-popup show';
        notification.innerHTML = `
            <div class="achievement-content">
                <div class="achievement-icon">${achievement.icon}</div>
                <div class="achievement-info">
                    <div class="achievement-title">${achievement.name}</div>
                    <div class="achievement-xp">+${achievement.xp} XP</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        // Play achievement sound (if audio is enabled)
        this.playAchievementSound();

        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    playAchievementSound() {
        // Create a simple achievement sound using Web Audio API
        if (typeof AudioContext !== 'undefined' || typeof webkitAudioContext !== 'undefined') {
            const audioContext = new (AudioContext || webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            oscillator.frequency.setValueAtTime(523.25, audioContext.currentTime); // C5
            oscillator.frequency.setValueAtTime(659.25, audioContext.currentTime + 0.1); // E5
            oscillator.frequency.setValueAtTime(783.99, audioContext.currentTime + 0.2); // G5
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.5);
        }
    }

    // Progress Tracking
    setupProgressTracking() {
        this.updateLevelDisplay();
        
        // Add XP for various activities
        document.addEventListener('click', (e) => {
            if (e.target.closest('.feature-card')) {
                this.addXP(5);
            }
            if (e.target.closest('.hero-cta, .cta-button')) {
                this.addXP(10);
            }
        });

        // Time-based XP (every 30 seconds)
        setInterval(() => {
            this.addXP(1);
        }, 30000);
    }

    addXP(amount) {
        this.userXP += amount;
        const oldLevel = this.userLevel;
        this.userLevel = Math.floor(this.userXP / 1000) + 1;
        
        if (this.userLevel > oldLevel) {
            this.levelUp();
        }
        
        this.updateLevelDisplay();
        this.saveProgress();
    }

    levelUp() {
        this.showLevelUpNotification();
        this.unlockLevelRewards();
    }

    showLevelUpNotification() {
        const notification = document.createElement('div');
        notification.className = 'level-up-notification';
        notification.innerHTML = `
            <div class="level-up-content">
                <div class="level-up-icon">🎊</div>
                <div class="level-up-text">
                    <div class="level-up-title">Level Up!</div>
                    <div class="level-up-subtitle">You reached level ${this.userLevel}</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    unlockLevelRewards() {
        const rewards = {
            2: { name: 'Quantum Rookie', bonus: 50 },
            5: { name: 'Quantum Explorer', bonus: 100 },
            10: { name: 'Quantum Expert', bonus: 200 },
            20: { name: 'Quantum Master', bonus: 500 }
        };

        if (rewards[this.userLevel]) {
            this.addXP(rewards[this.userLevel].bonus);
            this.showRewardNotification(rewards[this.userLevel]);
        }
    }

    showRewardNotification(reward) {
        const notification = document.createElement('div');
        notification.className = 'reward-notification';
        notification.innerHTML = `
            <div class="reward-content">
                <div class="reward-icon">🎁</div>
                <div class="reward-text">
                    <div class="reward-title">New Reward Unlocked!</div>
                    <div class="reward-name">${reward.name}</div>
                    <div class="reward-bonus">+${reward.bonus} XP Bonus</div>
                </div>
            </div>
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 4000);
    }

    // updateLevelDisplay() {
    //     // Create level indicator if it doesn't exist
    //     let levelIndicator = document.getElementById('levelIndicator');
    //     if (!levelIndicator) {
    //         levelIndicator = document.createElement('div');
    //         levelIndicator.id = 'levelIndicator';
    //         levelIndicator.className = 'level-indicator';
    //         document.querySelector('.nav-container').appendChild(levelIndicator);
    //     }
        
    //     const xpProgress = (this.userXP % 1000) / 1000 * 100;
    //     levelIndicator.innerHTML = `
    //         <div class="level-info">
    //             <div class="level-number">Lv.${this.userLevel}</div>
    //             <div class="xp-bar">
    //                 <div class="xp-progress" style="width: ${xpProgress}%"></div>
    //             </div>
    //             <div class="xp-text">${this.userXP % 1000}/1000 XP</div>
    //         </div>
    //     `;
    // }

    // Interactive Elements
    setupInteractiveElements() {
        // Enhanced feature card interactions
        document.querySelectorAll('.feature-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                card.style.transform = 'translateY(-10px) rotateX(5deg) scale(1.02)';
                card.style.transition = 'all 0.3s ease';
            });
            
            card.addEventListener('mouseleave', () => {
                card.style.transform = 'translateY(0) rotateX(0) scale(1)';
            });
            
            // Add click ripple effect
            card.addEventListener('click', (e) => {
                this.createRippleEffect(e, card);
            });
        });

        // Enhanced button interactions
        document.querySelectorAll('.hero-cta, .cta-button').forEach(button => {
            button.addEventListener('mouseenter', () => {
                button.style.transform = 'translateY(-3px) scale(1.05)';
            });
            
            button.addEventListener('mouseleave', () => {
                button.style.transform = 'translateY(0) scale(1)';
            });
        });

        // Add particle burst on clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.hero-cta, .cta-button, .feature-card')) {
                this.createParticleBurst(e.clientX, e.clientY);
            }
        });
    }

    createRippleEffect(e, element) {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const ripple = document.createElement('div');
        ripple.className = 'ripple';
        ripple.style.cssText = `
            position: absolute;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.6);
            transform: translate(-50%, -50%);
            pointer-events: none;
            left: ${x}px;
            top: ${y}px;
            width: 0;
            height: 0;
            animation: rippleEffect 0.6s ease-out;
        `;
        
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    createParticleBurst(x, y) {
        const colors = ['#00d4ff', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'];
        const particleCount = 12;
        
        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            const color = colors[Math.floor(Math.random() * colors.length)];
            const angle = (i / particleCount) * Math.PI * 2;
            const velocity = 50 + Math.random() * 50;
            
            particle.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: ${color};
                border-radius: 50%;
                pointer-events: none;
                z-index: 9999;
                left: ${x}px;
                top: ${y}px;
                animation: particleBurst 1s ease-out forwards;
                --velocity-x: ${Math.cos(angle) * velocity}px;
                --velocity-y: ${Math.sin(angle) * velocity}px;
            `;
            
            document.body.appendChild(particle);
            
            setTimeout(() => {
                particle.remove();
            }, 1000);
        }
    }

    // Keyboard Shortcuts
    setupKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + T for theme toggle
            if ((e.ctrlKey || e.metaKey) && e.key === 't') {
                e.preventDefault();
                document.getElementById('themeToggle').click();
            }
            
            // Spacebar for scroll to next section
            if (e.key === ' ' && !e.target.matches('input, textarea')) {
                e.preventDefault();
                this.scrollToNextSection();
            }
            
            // Arrow keys for navigation
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                this.scrollToNextSection();
            }
            
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                this.scrollToPrevSection();
            }
        });
    }

    scrollToNextSection() {
        const sections = ['home', 'features', 'stats', 'cta'];
        const currentSection = this.getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        const nextIndex = (currentIndex + 1) % sections.length;
        
        document.getElementById(sections[nextIndex]).scrollIntoView({
            behavior: 'smooth'
        });
    }

    scrollToPrevSection() {
        const sections = ['home', 'features', 'stats', 'cta'];
        const currentSection = this.getCurrentSection();
        const currentIndex = sections.indexOf(currentSection);
        const prevIndex = currentIndex === 0 ? sections.length - 1 : currentIndex - 1;
        
        document.getElementById(sections[prevIndex]).scrollIntoView({
            behavior: 'smooth'
        });
    }

    getCurrentSection() {
        const sections = ['home', 'features', 'stats', 'cta'];
        const scrollPosition = window.pageYOffset;
        
        for (let i = sections.length - 1; i >= 0; i--) {
            const section = document.getElementById(sections[i]);
            if (section && section.offsetTop <= scrollPosition + 100) {
                return sections[i];
            }
        }
        
        return 'home';
    }

    // Daily Streak System
    checkDailyStreak() {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();
        
        if (this.lastVisit === today) {
            // Already visited today
            return;
        } else if (this.lastVisit === yesterday) {
            // Consecutive day
            this.currentStreak++;
            this.addXP(50 + (this.currentStreak * 10));
        } else {
            // Streak broken
            this.currentStreak = 1;
            this.addXP(50);
        }
        
        this.lastVisit = today;
        localStorage.setItem('quantumLastVisit', today);
        localStorage.setItem('quantumStreak', this.currentStreak);
        
        if (this.currentStreak >= 3 && !this.hasAchievement('dailyVisitor')) {
            this.unlockAchievement('dailyVisitor', {
                name: 'Daily Visitor',
                xp: 75,
                icon: '📅'
            });
        }
    }

    // Welcome new users
    welcomeNewUser() {
        const isNewUser = !localStorage.getItem('quantumWelcomeShown');
        if (isNewUser) {
            setTimeout(() => {
                this.showWelcomeTour();
                localStorage.setItem('quantumWelcomeShown', 'true');
            }, 3000);
        }
    }

    showWelcomeTour() {
        const tourSteps = [
            {
                element: '.hero-cta',
                title: 'Start Your Journey!',
                content: 'Click here to begin your quantum computing adventure.',
                position: 'bottom'
            },
            {
                element: '#themeToggle',
                title: 'Theme Toggle',
                content: 'Switch between light and dark themes anytime.',
                position: 'bottom'
            },
            {
                element: '.features',
                title: 'Explore Features',
                content: 'Discover our interactive quantum computing features.',
                position: 'top'
            }
        ];

        this.startTour(tourSteps);
    }

    startTour(steps) {
        let currentStep = 0;
        
        const showStep = (stepIndex) => {
            if (stepIndex >= steps.length) return;
            
            const step = steps[stepIndex];
            const element = document.querySelector(step.element);
            
            if (element) {
                this.highlightElement(element);
                this.showTourTooltip(element, step, () => {
                    currentStep++;
                    showStep(currentStep);
                });
            }
        };
        
        showStep(0);
    }

    highlightElement(element) {
        element.classList.add('highlighted');
        setTimeout(() => {
            element.classList.remove('highlighted');
        }, 3000);
    }

    showTourTooltip(element, step, callback) {
        const tooltip = document.createElement('div');
        tooltip.className = 'tour-tooltip';
        tooltip.innerHTML = `
            <div class="tour-content">
                <h3>${step.title}</h3>
                <p>${step.content}</p>
                <button class="tour-next">Got it!</button>
            </div>
        `;
        
        document.body.appendChild(tooltip);
        
        // Position tooltip
        const rect = element.getBoundingClientRect();
        tooltip.style.position = 'fixed';
        tooltip.style.left = `${rect.left + rect.width / 2}px`;
        tooltip.style.top = step.position === 'bottom' ? `${rect.bottom + 10}px` : `${rect.top - 100}px`;
        tooltip.style.transform = 'translateX(-50%)';
        tooltip.style.zIndex = '10000';
        
        tooltip.querySelector('.tour-next').addEventListener('click', () => {
            tooltip.remove();
            callback();
        });
    }

    // Progress Bar
    updateProgressBar() {
        const scrollTop = window.pageYOffset;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        
        const progressBar = document.getElementById('progressBar');
        if (progressBar) {
            progressBar.style.width = `${scrollPercent}%`;
        }
    }

    // Utility Methods
    saveProgress() {
        localStorage.setItem('quantumLevel', this.userLevel.toString());
        localStorage.setItem('quantumXP', this.userXP.toString());
        localStorage.setItem('quantumAchievements', JSON.stringify(this.achievements));
    }

    triggerConfetti() {
        // Simple confetti effect
        const confettiCount = 50;
        const colors = ['#00d4ff', '#7c3aed', '#ec4899', '#f59e0b', '#10b981'];
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.style.cssText = `
                position: fixed;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                left: ${Math.random() * 100}%;
                top: -10px;
                opacity: 1;
                transform: rotate(${Math.random() * 360}deg);
                transition: all 3s ease-out;
                z-index: 9999;
            `;
            
            document.body.appendChild(confetti);
            
            setTimeout(() => {
                confetti.style.top = '110%';
                confetti.style.opacity = '0';
                confetti.style.transform = `rotate(${Math.random() * 1440}deg)`;
            }, 100);
            
            setTimeout(() => {
                confetti.remove();
            }, 3000);
        }
    }

    // CSS for animations
    addCustomStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rippleEffect {
                to {
                    width: 200px;
                    height: 200px;
                    opacity: 0;
                }
            }
            
            @keyframes particleBurst {
                to {
                    transform: translate(var(--velocity-x), var(--velocity-y));
                    opacity: 0;
                }
            }
            
            .level-indicator {
                position: fixed;
                top: 20px;
                right: 20px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 10px 15px;
                border-radius: 10px;
                font-size: 14px;
                z-index: 1000;
                backdrop-filter: blur(10px);
            }
            
            .xp-bar {
                width: 100px;
                height: 4px;
                background: rgba(255, 255, 255, 0.3);
                border-radius: 2px;
                margin: 5px 0;
                overflow: hidden;
            }
            
            .xp-progress {
                height: 100%;
                background: linear-gradient(90deg, #00d4ff, #7c3aed);
                border-radius: 2px;
                transition: width 0.3s ease;
            }
            
            .level-up-notification, .reward-notification, .achievement-popup {
                position: fixed;
                top: 100px;
                right: 20px;
                background: linear-gradient(135deg, #7c3aed, #ec4899);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                font-weight: 600;
                z-index: 2000;
                box-shadow: 0 10px 30px rgba(124, 58, 237, 0.3);
                animation: slideInRight 0.5s ease-out;
            }
            
            .tour-tooltip {
                background: rgba(0, 0, 0, 0.9);
                color: white;
                padding: 15px 20px;
                border-radius: 10px;
                max-width: 250px;
                font-size: 14px;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
            }
            
            .highlighted {
                position: relative;
                animation: pulse 2s infinite;
            }
            
            @keyframes pulse {
                0% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.7); }
                70% { box-shadow: 0 0 0 10px rgba(0, 212, 255, 0); }
                100% { box-shadow: 0 0 0 0 rgba(0, 212, 255, 0); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize the gamification system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add custom styles first
    const quantumGame = new QuantumGamification();
    quantumGame.addCustomStyles();
});

// Additional utility functions
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

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Performance optimization for scroll events
const optimizedScrollHandler = throttle(() => {
    // Scroll-based animations and effects
}, 16); // ~60fps

window.addEventListener('scroll', optimizedScrollHandler);