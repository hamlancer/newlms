// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Navbar scroll effect
window.addEventListener('scroll', function() {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.backgroundColor = '#ffffff';
        header.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
    } else {
        header.style.backgroundColor = '#ffffff';
        header.style.boxShadow = 'none';
    }
});

// Mobile menu toggle functionality
const createMobileMenu = () => {
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelector('.nav-links');
    
    // Create mobile menu button
    const mobileMenuBtn = document.createElement('button');
    mobileMenuBtn.className = 'mobile-menu-btn';
    mobileMenuBtn.innerHTML = '<i class="fas fa-bars"></i>';
    
    // Add mobile menu button to navbar
    navbar.insertBefore(mobileMenuBtn, navLinks);
    
    // Toggle mobile menu
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        mobileMenuBtn.classList.toggle('active');
    });
};

// Initialize mobile menu on load
document.addEventListener('DOMContentLoaded', createMobileMenu);

// Animation on scroll
const animateOnScroll = () => {
    const elements = document.querySelectorAll('.feature-card');
    
    elements.forEach(element => {
        const elementPosition = element.getBoundingClientRect().top;
        const screenPosition = window.innerHeight;
        
        if(elementPosition < screenPosition) {
            element.classList.add('animate');
        }
    });
};

window.addEventListener('scroll', animateOnScroll);

// Statistics Counter Animation
const runCounter = (counter) => {
    const target = parseInt(counter.getAttribute('data-target'));
    const count = parseInt(counter.innerText);
    const increment = target / 200;

    if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(() => runCounter(counter), 1);
    } else {
        counter.innerText = target;
    }
};

const handleIntersection = (entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.counter');
            counters.forEach(counter => {
                counter.innerText = '0';
                runCounter(counter);
            });
            observer.unobserve(entry.target);
        }
    });
};

// Initialize Intersection Observer for Statistics
const statsSection = document.querySelector('.statistics');
if (statsSection) {
    const observer = new IntersectionObserver(handleIntersection, {
        threshold: 0.5
    });
    observer.observe(statsSection);
}

// Newsletter Form Submission
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const email = newsletterForm.querySelector('input[type="email"]').value;
        // Here you would typically send this to your backend
        alert('Thank you for subscribing! You will receive updates at: ' + email);
        newsletterForm.reset();
    });
}

// Course Enrollment
const enrollButtons = document.querySelectorAll('.enroll-btn');
enrollButtons.forEach(button => {
    button.addEventListener('click', () => {
        const courseName = button.closest('.course-card').querySelector('h3').textContent;
        // Here you would typically handle the enrollment process
        alert(`Thank you for your interest in "${courseName}". Please log in to complete enrollment.`);
    });
});

// Testimonials Slider
let currentSlide = 0;
const testimonialSlider = document.querySelector('.testimonials-slider');
const testimonialCards = document.querySelectorAll('.testimonial-card');

if (testimonialSlider && testimonialCards.length > 0) {
    // Create dots
    const dotsContainer = document.querySelector('.testimonial-dots');
    testimonialCards.forEach((_, index) => {
        const dot = document.createElement('span');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    function goToSlide(index) {
        currentSlide = index;
        const offset = testimonialCards[index].offsetLeft;
        testimonialSlider.scrollTo({
            left: offset,
            behavior: 'smooth'
        });
        
        // Update dots
        document.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === index);
        });
    }

    // Auto-scroll
    setInterval(() => {
        currentSlide = (currentSlide + 1) % testimonialCards.length;
        goToSlide(currentSlide);
    }, 5000);
}

// Add smooth reveal animation for course cards
const revealOnScroll = () => {
    const cards = document.querySelectorAll('.course-card');
    cards.forEach(card => {
        const cardTop = card.getBoundingClientRect().top;
        const triggerBottom = window.innerHeight * 0.8;
        
        if (cardTop < triggerBottom) {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }
    });
};

window.addEventListener('scroll', revealOnScroll);

// Course Search Functionality
const initializeSearch = () => {
    const searchInput = document.getElementById('courseSearch');
    const categoryFilter = document.getElementById('categoryFilter');
    const levelFilter = document.getElementById('levelFilter');
    const searchButton = document.getElementById('searchButton');
    const searchResults = document.getElementById('searchResults');

    // Sample course data (in a real application, this would come from a backend)
    const courses = [
        { title: 'Advanced JavaScript', category: 'programming', level: 'advanced', rating: 4.8 },
        { title: 'UI/UX Fundamentals', category: 'design', level: 'beginner', rating: 4.5 },
        { title: 'Digital Marketing Basics', category: 'marketing', level: 'beginner', rating: 4.6 },
        { title: 'Business Analytics', category: 'business', level: 'intermediate', rating: 4.7 }
    ];

    const filterCourses = () => {
        const searchTerm = searchInput.value.toLowerCase();
        const category = categoryFilter.value;
        const level = levelFilter.value;

        return courses.filter(course => {
            const matchesSearch = course.title.toLowerCase().includes(searchTerm);
            const matchesCategory = !category || course.category === category;
            const matchesLevel = !level || course.level === level;
            return matchesSearch && matchesCategory && matchesLevel;
        });
    };

    const displayResults = (results) => {
        searchResults.innerHTML = results.map(course => `
            <div class="course-card">
                <div class="course-content">
                    <h3>${course.title}</h3>
                    <div class="course-meta">
                        <span><i class="fas fa-layer-group"></i> ${course.level}</span>
                        <span><i class="fas fa-star"></i> ${course.rating}</span>
                    </div>
                    <button class="enroll-btn">Enroll Now</button>
                </div>
            </div>
        `).join('');
    };

    searchButton.addEventListener('click', () => {
        const results = filterCourses();
        displayResults(results);
    });

    // Initialize with all courses
    displayResults(courses);
};

// Quiz Functionality
const initializeQuiz = () => {
    const questions = [
        {
            question: 'What is the primary purpose of HTML in web development?',
            options: [
                'To structure web content',
                'To style web pages',
                'To add interactivity',
                'To handle server requests'
            ],
            correct: 0
        },
        {
            question: 'Which of these is a JavaScript framework?',
            options: [
                'HTML5',
                'CSS3',
                'React',
                'MySQL'
            ],
            correct: 2
        }
    ];

    let currentQuestionIndex = 0;
    let score = 0;

    const questionText = document.getElementById('questionText');
    const optionsContainer = document.getElementById('optionsContainer');
    const nextButton = document.getElementById('nextQuestion');
    const currentQuestionSpan = document.getElementById('currentQuestion');
    const totalQuestionsSpan = document.getElementById('totalQuestions');
    const quizCard = document.getElementById('quizCard');
    const quizResults = document.getElementById('quizResults');
    const scorePercentage = document.getElementById('scorePercentage');
    const retakeQuiz = document.getElementById('retakeQuiz');

    const loadQuestion = () => {
        const question = questions[currentQuestionIndex];
        questionText.textContent = question.question;
        currentQuestionSpan.textContent = currentQuestionIndex + 1;
        totalQuestionsSpan.textContent = questions.length;

        optionsContainer.innerHTML = question.options.map((option, index) => `
            <button class="option-btn" data-index="${index}">${option}</button>
        `).join('');

        // Add click handlers to options
        optionsContainer.querySelectorAll('.option-btn').forEach(button => {
            button.addEventListener('click', () => selectOption(button));
        });
    };

    const selectOption = (selectedButton) => {
        optionsContainer.querySelectorAll('.option-btn').forEach(button => {
            button.classList.remove('selected');
        });
        selectedButton.classList.add('selected');
        nextButton.style.display = 'block';
    };

    const showResults = () => {
        quizCard.style.display = 'none';
        quizResults.classList.remove('hidden');
        const percentage = (score / questions.length) * 100;
        scorePercentage.textContent = `${percentage}%`;
    };

    nextButton.addEventListener('click', () => {
        const selectedOption = optionsContainer.querySelector('.selected');
        if (selectedOption) {
            const selectedAnswer = parseInt(selectedOption.dataset.index);
            if (selectedAnswer === questions[currentQuestionIndex].correct) {
                score++;
            }
            currentQuestionIndex++;
            if (currentQuestionIndex < questions.length) {
                loadQuestion();
                nextButton.style.display = 'none';
            } else {
                showResults();
            }
        }
    });

    retakeQuiz.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        quizCard.style.display = 'block';
        quizResults.classList.add('hidden');
        loadQuestion();
    });

    // Initialize first question
    loadQuestion();
};

// Learning Path Progress
const initializeLearningPaths = () => {
    const progressBars = document.querySelectorAll('.progress-bar');
    progressBars.forEach(bar => {
        const progress = bar.getAttribute('data-progress');
        bar.style.setProperty('--progress', `${progress}%`);
    });
};

// Community Features
const initializeCommunity = () => {
    const communityButtons = document.querySelectorAll('.community-btn');
    communityButtons.forEach(button => {
        button.addEventListener('click', () => {
            const action = button.textContent;
            // In a real application, this would navigate to the respective pages
            alert(`Navigating to ${action}... This feature will be available soon!`);
        });
    });
};

// Initialize all features when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    initializeSearch();
    initializeQuiz();
    initializeLearningPaths();
    initializeCommunity();
});

// Achievement System
const initializeAchievements = () => {
    const achievementCards = document.querySelectorAll('.achievement-card');
    achievementCards.forEach(card => {
        if (!card.classList.contains('locked')) {
            card.addEventListener('click', () => {
                const achievementName = card.querySelector('h3').textContent;
                // In a real application, this would show more details about the achievement
                alert(`Achievement Details: ${achievementName}`);
            });
        }
    });
};

// Initialize achievements
document.addEventListener('DOMContentLoaded', initializeAchievements);
