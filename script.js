// Initialize GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        target.scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Animate sections on scroll
const sections = document.querySelectorAll('section');
sections.forEach(section => {
    gsap.from(section, {
        scrollTrigger: {
            trigger: section,
            start: "top 80%",
            end: "top 20%",
            toggleClass: "section-visible",
            once: true
        },
        opacity: 0,
        y: 50,
        duration: 1,
        ease: "power2.out"
    });
});

// Reference your images here
const questionCardSrc = "game_template_page1.jpg"; // replace with your path
const answerCardSrc = "game_template_page2.jpg";     // replace with your path

// Wheel animation
class Wheel {
    constructor() {
        this.canvas = document.getElementById('wheelCanvas');
        this.ctx = this.canvas.getContext('2d');
        this.spinButton = document.getElementById('spinButton');
        this.isSpinning = false;
        this.currentRotation = 0;
        this.targetRotation = 0;
        
        // Fields for the wheel
        this.fields = [
            'Climate Change',
            'Education',
            'Health Care',
            'Youth Exploitation',
            'Water Scarcity',
            'Accessible Technology',
            'Climate Refugees',
            'Gender Equality ',
            'Biodiversity Loss',
            'Crisis'
        ];
        
        this.colors = [
            '#3498db',
            '#e74c3c',
            '#f1c40f',
            '#2ecc71',
            '#9b59b6',
            '#7f8c8d',
            '#ffab91',
            '#f06292',
            '#c5dae9',
            '#000000'
        ];
        
        this.init();
    }
    
    init() {
        // Set canvas size
        this.canvas.width = 400;
        this.canvas.height = 400;
        
        // Draw initial wheel
        this.draw();
        
        // Add spin button listener
        this.spinButton.addEventListener('click', () => this.spin());
    }
    
    draw() {
        const ctx = this.ctx;
        const centerX = this.canvas.width / 2;
        const centerY = this.canvas.height / 2;
        const radius = Math.min(centerX, centerY) - 10;
        
        // Clear canvas
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Save context state
        ctx.save();
        
        // Move to center and rotate
        ctx.translate(centerX, centerY);
        ctx.rotate(this.currentRotation);
        
        // Draw sections
        const sectionAngle = (2 * Math.PI) / this.fields.length;
        for (let i = 0; i < this.fields.length; i++) {
            ctx.beginPath();
            ctx.moveTo(0, 0);
            ctx.arc(0, 0, radius, i * sectionAngle, (i + 1) * sectionAngle);
            ctx.closePath();
            
            // Fill section
            ctx.fillStyle = this.colors[i];
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Add text
            ctx.save();
            ctx.rotate(i * sectionAngle + sectionAngle / 2);
            ctx.textAlign = 'right';
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 16px Poppins';
            ctx.fillText(this.fields[i], radius - 20, 5);
            ctx.restore();
        }
        
        // Restore context state
        ctx.restore();
        
        // Draw center circle
        ctx.beginPath();
        ctx.arc(centerX, centerY, 15, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.fill();
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
        ctx.stroke();
    }
    
    spin() {
        if (this.isSpinning) return;
        this.isSpinning = true;
        this.spinButton.disabled = true;
        // Always spin 4 full rotations
        const fullRotations = 4;
        this.targetRotation = this.currentRotation + (Math.PI * 2 * fullRotations);
        gsap.to(this, {
            currentRotation: this.targetRotation,
            duration: 3,
            ease: "power2.out",
            onUpdate: () => this.draw(),
            onComplete: () => {
                this.isSpinning = false;
                this.spinButton.disabled = false;
                showQuestionPopup();
            }
        });
    }
}

// Show popup when wheel lands
function showQuestionPopup() {
    const popup = document.getElementById('questionPopup');
    const popupCardImage = document.getElementById('popupCardImage');
    popupCardImage.src = questionCardSrc;
    popupCardImage.alt = "Question Card";
    popup.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    popup.dataset.card = "question";
}

// Close popup
if (document.querySelector('.close-popup')) {
    document.querySelector('.close-popup').onclick = function() {
        document.getElementById('questionPopup').style.display = 'none';
        document.body.style.overflow = 'auto';
    };
}

// Toggle card
if (document.getElementById('cardToggleButton')) {
    document.getElementById('cardToggleButton').onclick = function() {
        const popup = document.getElementById('questionPopup');
        const popupCardImage = document.getElementById('popupCardImage');
        if (popup.dataset.card === "question") {
            popupCardImage.src = answerCardSrc;
            popupCardImage.alt = "Answer Card";
            popup.dataset.card = "answer";
        } else {
            popupCardImage.src = questionCardSrc;
            popupCardImage.alt = "Question Card";
            popup.dataset.card = "question";
        }
    };
}

// Close popup when clicking outside
if (document.getElementById('questionPopup')) {
    document.getElementById('questionPopup').addEventListener('click', function(e) {
        if (e.target === this) {
            this.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
}

// Initialize wheel when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const wheel = new Wheel();
    
    // Photo animations
    const presentationItems = document.querySelectorAll('.presentation-item');
    
    presentationItems.forEach((item) => {
        const image = item.querySelector('.presentation-image');
        const textContent = item.querySelector('.text-content');
        
        // Create animation timeline
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: item,
                start: "top 75%",
                toggleActions: "play none none none"
            }
        });
        
        // Slower fade-in animation on the spot
        tl.from(image, {
            autoAlpha: 0,
            duration: 2,
            ease: "power1.inOut"
        });
        
        // Text fade-in slightly after image, also slower
        tl.from(textContent, {
            autoAlpha: 0,
            duration: 2,
            ease: "power1.inOut"
        }, "-=1.5");
    });
    
    // Popup handling
    const popup = document.getElementById('questionPopup');
    const closeButton = document.querySelector('.close-popup');
    const cardContainer = document.querySelector('.card-container');
    const cardToggleButton = document.getElementById('cardToggleButton');
    
    // Only the wheel spin should trigger the popup, not the initial button click
    // This functionality is handled in the Wheel.showQuestion method
    
    closeButton.addEventListener('click', () => {
        popup.style.display = 'none';
        document.body.style.overflow = 'auto';
    });
    
    cardToggleButton.addEventListener('click', () => {
        const frontCard = document.querySelector('.front-card');
        const backCard = document.querySelector('.back-card');
        
        if (frontCard.style.display !== 'none') {
            frontCard.style.display = 'none';
            backCard.style.display = 'block';
        } else {
            frontCard.style.display = 'block';
            backCard.style.display = 'none';
        }
    });
    
    // Close popup when clicking outside
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
            popup.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
    });
    
    // Navbar animation on scroll
    const nav = document.querySelector('nav');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            nav.style.transform = 'translateY(0)';
            return;
        }
        
        if (currentScroll > lastScroll) {
            nav.style.transform = 'translateY(-100%)';
        } else {
            nav.style.transform = 'translateY(0)';
        }
        
        lastScroll = currentScroll;
    });

    // --- HERO TYPING/FADING ANIMATION ---
    // Typing effect for main title
    const mainTitle = document.querySelector('.main-title');
    if (mainTitle) {
        const text = mainTitle.textContent;
        mainTitle.textContent = '';
        let i = 0;
        function typeChar() {
            if (i < text.length) {
                mainTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeChar, 60);
            }
        }
        setTimeout(typeChar, 400);
    }

    // Fade-in for tagline
    const tagline = document.querySelector('.tagline');
    if (tagline) {
        gsap.from(tagline, {
            autoAlpha: 0,
            y: 30,
            duration: 1.5,
            delay: 1.2,
            ease: 'power2.out'
        });
    }

    // Sticky nav shrink/fade
    const stickyNav = document.querySelector('.sticky-nav');
    let stickyNavLastScroll = 0;
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        if (currentScroll > 40) {
            stickyNav.classList.add('shrink');
        } else {
            stickyNav.classList.remove('shrink');
        }
        stickyNavLastScroll = currentScroll;
    });

    // --- SCROLL-DRIVEN SLIDESHOW ---
    // Each .fullscreen-section fades/slides in as you scroll
    const sections = document.querySelectorAll('.fullscreen-section');
    sections.forEach((section, idx) => {
        gsap.fromTo(section, {
            autoAlpha: 0,
            y: 60
        }, {
            scrollTrigger: {
                trigger: section,
                start: 'top 80%',
                end: 'top 20%',
                toggleActions: 'play none none reverse',
                // markers: true // Uncomment for debugging
            },
            autoAlpha: 1,
            y: 0,
            duration: 1.2,
            ease: 'power2.out'
        });
    });

    // --- BUTTON MICRO-INTERACTIONS (already in CSS, but add ripple effect) ---
    document.querySelectorAll('button').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const circle = document.createElement('span');
            circle.className = 'ripple';
            this.appendChild(circle);
            const d = Math.max(this.clientWidth, this.clientHeight);
            circle.style.width = circle.style.height = d + 'px';
            circle.style.left = (e.clientX - this.getBoundingClientRect().left - d/2) + 'px';
            circle.style.top = (e.clientY - this.getBoundingClientRect().top - d/2) + 'px';
            setTimeout(() => circle.remove(), 600);
        });
    });
});
