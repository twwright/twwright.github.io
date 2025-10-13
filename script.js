document.addEventListener('DOMContentLoaded', function() {
    initSinglePageApp();
    initMadlibForm();
    initCardAnimations();
    initProfileFlip();
});

function initSinglePageApp() {
    const navButtons = document.querySelectorAll('.nav-btn');
    const sections = document.querySelectorAll('.content-section');
    const fixedHeader = document.getElementById('fixed-header');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetSection = this.getAttribute('data-section');
            showSection(targetSection);
        });
    });
    
    function showSection(sectionId) {
        sections.forEach(section => {
            section.classList.remove('active');
        });
        
        const targetSection = document.getElementById(sectionId);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        
        const activeNavBtn = document.querySelector(`.nav-btn[data-section="${sectionId}"]`);
        if (activeNavBtn) {
            activeNavBtn.classList.add('active');
        }
        
        if (sectionId === 'home') {
            fixedHeader.classList.remove('visible');
        } else {
            fixedHeader.classList.add('visible');
        }
        
        window.scrollTo(0, 0);
    }
}

function initCardAnimations() {
    const cardContainers = document.querySelectorAll('.skills-grid, .cert-grid');
    
    cardContainers.forEach(container => {
        const cards = container.querySelectorAll('.card');
        
        cards.forEach((card, index) => {
            card.addEventListener('mouseenter', function() {
                cards.forEach((otherCard, otherIndex) => {
                    if (otherIndex !== index) {
                        const distance = Math.abs(otherIndex - index);
                        const offset = distance === 1 ? 8 : 4;
                        const direction = otherIndex < index ? -1 : 1;
                        
                        otherCard.style.transform = `translateX(${direction * offset}px) translateY(2px)`;
                        otherCard.style.transition = 'all 0.2s ease';
                    }
                });
            });
            
            card.addEventListener('mouseleave', function() {
                cards.forEach(otherCard => {
                    otherCard.style.transform = '';
                });
            });
        });
    });
}

function initMadlibForm() {
    const form = document.querySelector('.madlib-form');
    if (!form) return;
    
    const textInputs = form.querySelectorAll('.madlib-input');
    textInputs.forEach(input => {
        const resizeInput = function() {
            const value = this.value || this.placeholder;
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            context.font = '1.15rem "Courier New", monospace';
            const width = context.measureText(value).width;
            this.style.width = Math.max(width + 20, 120) + 'px';
        };
        
        input.addEventListener('input', resizeInput);
        input.addEventListener('blur', resizeInput);
        
        resizeInput.call(input);
    });
    
    form.addEventListener('submit', function(e) {
        const name = document.getElementById('madlib-name').value;
        const reason = document.getElementById('madlib-reason').value;
        const email = document.getElementById('madlib-email').value;
        const socials = document.getElementById('madlib-socials').value;
        
        let message = `Hello, my name is ${name}. The reason I am writing you is ${reason}.`;
        message += ` You can reach back to me via email at ${email}`;
        
        if (socials) {
            message += ` or my socials at ${socials}`;
        }
        
        message += ` if you prefer. Talk to you soon!`;
        
        document.getElementById('hidden-message').value = message;
        
        const submitBtn = form.querySelector('.btn-submit');
        submitBtn.textContent = 'Sending...';
        submitBtn.style.transform = 'scale(0.98)';
    });
}

function initProfileFlip() {
    const headerProfileFlip = document.getElementById('profile-flip');
    const heroProfileFlip = document.getElementById('hero-profile-flip');
    
    function toggleColorfulMode() {
        const isColorful = document.body.classList.toggle('colorful-mode');
        
        if (headerProfileFlip) {
            headerProfileFlip.classList.toggle('flipped', isColorful);
        }
        if (heroProfileFlip) {
            heroProfileFlip.classList.toggle('flipped', isColorful);
        }
        
        const footerEmoji = document.getElementById('footer-emoji');
        if (footerEmoji) {
            footerEmoji.textContent = isColorful ? '🎉' : '⚡';
        }
    }
    
    function createEmoji(container) {
        const isColorful = document.body.classList.contains('colorful-mode');
        const emojis = isColorful ? ['⚡', '🤖', '⚙️'] : ['🎉', '🎊', '🎈'];
        const emoji = document.createElement('div');
        emoji.className = 'profile-emoji';
        emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
        
        const angle = (Math.random() * 360) * (Math.PI / 180);
        const distance = 30 + Math.random() * 40;
        const tx = Math.cos(angle) * distance;
        const ty = Math.sin(angle) * distance;
        const rotation = Math.random() * 720 - 360;
        
        emoji.style.setProperty('--tx', `${tx}px`);
        emoji.style.setProperty('--ty', `${ty}px`);
        emoji.style.setProperty('--rotation', `${rotation}deg`);
        
        container.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 2000);
    }
    
    let emojiInterval = null;
    
    function startEmojiStream(container) {
        if (emojiInterval) return;
        
        createEmoji(container);
        emojiInterval = setInterval(() => {
            createEmoji(container);
        }, 200);
    }
    
    function stopEmojiStream() {
        if (emojiInterval) {
            clearInterval(emojiInterval);
            emojiInterval = null;
        }
    }
    
    if (headerProfileFlip) {
        headerProfileFlip.addEventListener('click', toggleColorfulMode);
        headerProfileFlip.addEventListener('mouseenter', function() {
            startEmojiStream(this);
        });
        headerProfileFlip.addEventListener('mouseleave', stopEmojiStream);
    }
    
    if (heroProfileFlip) {
        heroProfileFlip.addEventListener('click', toggleColorfulMode);
        heroProfileFlip.addEventListener('mouseenter', function() {
            startEmojiStream(this);
        });
        heroProfileFlip.addEventListener('mouseleave', stopEmojiStream);
    }
}

console.log('Thomas Wright - Portfolio');
console.log('Built with vanilla HTML, CSS, and JavaScript');