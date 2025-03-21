// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const navbar = document.getElementById('navbar');
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const sections = document.querySelectorAll('section');
    const revealElements = document.querySelectorAll('.about-image, .about-text, .project-card, .contact-info, .contact-form');
    
    // Initial check for elements in viewport (in case page is refreshed mid-scroll)
    checkElementsInViewport();
    setActiveNavLink();
    
    // Scroll event handlers
    window.addEventListener('scroll', function() {
        handleNavbarScroll();
        checkElementsInViewport();
        setActiveNavLink();
    });
    
    // Mobile menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Smooth scrolling for navigation links
    navLinksItems.forEach(anchor => {
        anchor.addEventListener('click', smoothScrollToTarget);
    });
    
    /**
     * Add or remove scrolled class to navbar based on scroll position
     */
    function handleNavbarScroll() {
        if (window.scrollY > 100) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }
    
    /**
     * Toggle mobile menu visibility
     */
    function toggleMobileMenu() {
        navLinks.classList.toggle('open');
        hamburger.classList.toggle('active');
    }
    
    /**
     * Close mobile menu
     */
    function closeMobileMenu() {
        if (navLinks.classList.contains('open')) {
            navLinks.classList.remove('open');
            hamburger.classList.remove('active');
        }
    }
    
    /**
     * Smooth scroll to target element
     * @param {Event} e - Click event
     */
    function smoothScrollToTarget(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
            
            // Close mobile menu if open
            closeMobileMenu();
            
            // Update active link
            navLinksItems.forEach(link => {
                link.classList.remove('active');
            });
            this.classList.add('active');
        }
    }
    
    /**
     * Check if elements are in viewport and add visible class
     */
    function checkElementsInViewport() {
        revealElements.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementTop < windowHeight - 100) {
                element.classList.add('visible');
            }
        });
    }
    
    /**
     * Set active navigation link based on current scroll position
     */
    function setActiveNavLink() {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (pageYOffset >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinksItems.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    }
    
    // Add animation to skill bars when they come into view
    const skillItems = document.querySelectorAll('.skill-item');
    skillItems.forEach(item => {
        const progress = item.querySelector('.skill-progress');
        const percentText = item.querySelector('.skill-name span:last-child');
        
        if (progress && percentText) {
            const percent = percentText.textContent.replace('%', '');
            progress.style.width = '0%';
            
            // Create intersection observer to animate when in view
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        setTimeout(() => {
                            progress.style.width = percent + '%';
                        }, 300);
                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.5 });
            
            observer.observe(item);
        }
    });
    
    // Initialize form submission (can be expanded with actual form handling)
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Here you would typically add form validation and AJAX submission
            // For now, we'll just add a simple animation
            
            const submitBtn = this.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;
            
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
            
            // Simulate sending (remove this in actual implementation)
            setTimeout(() => {
                submitBtn.textContent = 'Message Sent!';
                
                // Reset form
                contactForm.reset();
                
                // Reset button after a delay
                setTimeout(() => {
                    submitBtn.textContent = originalText;
                    submitBtn.disabled = false;
                }, 3000);
            }, 1500);
        });
    }
    
    // Enhanced project card hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        // Add smooth hover effect
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px)';
            
            // Add image zoom effect
            const projectImage = this.querySelector('.project-image img');
            if (projectImage) {
                projectImage.style.transform = 'scale(1.1)';
            }
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
            
            // Reset image zoom
            const projectImage = this.querySelector('.project-image img');
            if (projectImage) {
                projectImage.style.transform = 'scale(1)';
            }
        });
    });
    
    // Typing animation for hero section (optional effect)
    const heroSubtitle = document.querySelector('.hero-subtitle');
    if (heroSubtitle) {
        const text = heroSubtitle.textContent;
        heroSubtitle.textContent = '';
        
        // Only run this animation after the main fade-in animation completes
        setTimeout(() => {
            let i = 0;
            const typeInterval = setInterval(() => {
                if (i < text.length) {
                    heroSubtitle.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeInterval);
                }
            }, 50);
        }, 1500);
    }
    
    // Lazy load project images for better performance
    if ('IntersectionObserver' in window) {
        const imgOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px 300px 0px"
        };
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                        
                        // Add loaded class for fade-in effect
                        img.addEventListener('load', () => {
                            img.classList.add('loaded');
                        });
                    }
                    
                    imageObserver.unobserve(img);
                }
            });
        }, imgOptions);
        
        // Target all project images with data-src attributes
        const lazyImages = document.querySelectorAll('.project-image img[data-src]');
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        const lazyImages = document.querySelectorAll('.project-image img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
        });
    }
    
    // Animate skill bars when they come into view
    const skillBars = document.querySelectorAll('.skill-progress');
    
    // Create IntersectionObserver to detect when elements are in view
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Add animation to the progress bar
                const progressBar = entry.target;
                const width = progressBar.getAttribute('data-width') || '80%';
                
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 1s ease-in-out';
                    progressBar.style.width = width;
                }, 200);
                
                // Unobserve the element after animation is applied
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    
    // Observe all skill bars
    skillBars.forEach(bar => {
        observer.observe(bar);
    });
});

// Update your sendMail function with this version

function sendMail(e) {
    // Prevent the default form submission
    if (e) e.preventDefault();
    
    // Get form elements properly
    const nameInput = document.getElementById("name");
    const emailInput = document.getElementById("email");
    const subjectInput = document.getElementById("subject");
    const messageInput = document.getElementById("message");
    
    // Check if all fields have values
    if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
        displayFormMessage("Please fill in all fields", false);
        return false;
    }
    
    // Get the submit button
    const submitBtn = document.querySelector(".submit-btn");
    const originalText = submitBtn.textContent;
    
    // Update button state
    submitBtn.textContent = "Sending...";
    submitBtn.disabled = true;
    
    // Create parameters object with correct property values
    const params = {
        from_name: nameInput.value,
        email: emailInput.value,
        subject: subjectInput.value,
        message: messageInput.value,
        sent_date: new Date().toLocaleString()
    };
    
    // Use EmailJS to send the email
    emailjs.send("service_eqe1af9", "template_snt4fii", params)
        .then(function(response) {
            // Success message
            displayFormMessage("Message sent successfully! We'll get back to you soon.", true);
            
            // Reset form
            document.getElementById("contactForm").reset();
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        })
        .catch(function(error) {
            // Error message
            console.error("Email failed to send:", error);
            displayFormMessage("Failed to send message. Please try again later.", false);
            
            // Reset button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        });
        
    return false; // Prevent form submission
}

// Function to display form success/error messages
function displayFormMessage(message, isSuccess) {
    // Remove any existing messages
    const existingMessage = document.querySelector(".form-message");
    if (existingMessage) {
        existingMessage.remove();
    }
    
    // Create message element
    const messageElement = document.createElement("div");
    messageElement.className = isSuccess ? "form-message success" : "form-message error";
    messageElement.textContent = message;
    
    // Add message to the form
    const form = document.getElementById("contactForm");
    form.appendChild(messageElement);
    
    // Scroll to message
    messageElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
    
    // Automatically remove the message after 5 seconds
    setTimeout(() => {
        if (messageElement.parentNode) {
            messageElement.classList.add("fade-out");
            setTimeout(() => {
                if (messageElement.parentNode) {
                    messageElement.remove();
                }
            }, 500); // Wait for fade out animation
        }
    }, 5000);
}

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add contact form container to reveal elements
    const contactFormContainer = document.querySelector(".contact-form-container");
    if (contactFormContainer) {
        // Update reveal elements
        const revealElements = document.querySelectorAll('.about-image, .about-text, .project-card, .contact-info, .contact-form-container');
        
        // Check for elements in viewport
        function checkElementsInViewport() {
            revealElements.forEach(element => {
                if (element) {
                    const elementTop = element.getBoundingClientRect().top;
                    const windowHeight = window.innerHeight;
                    
                    if (elementTop < windowHeight - 100) {
                        element.classList.add('visible');
                    }
                }
            });
        }
        
        // Initial check
        checkElementsInViewport();
        
        // Check on scroll
        window.addEventListener('scroll', checkElementsInViewport);
    }
    
    // Add event listener to form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', sendMail);
    }
});