/* 
   Subhajit Ghosh Portfolio - Advanced Cinematic Engine
   Intro Sequence, Email Simulation, and Varied Transitions
*/

document.addEventListener('DOMContentLoaded', () => {
    // 1. Particle Init - Connecting Moving Stars
    if (typeof particlesJS !== 'undefined') {
        particlesJS('particles-js', {
            "particles": {
                "number": { "value": 150, "density": { "enable": true, "value_area": 800 } },
                "color": { "value": "#ffffff" },
                "shape": { "type": "circle" },
                "opacity": { "value": 0.8, "random": true },
                "size": { "value": 2, "random": true },
                "line_linked": {
                    "enable": true,
                    "distance": 130,
                    "color": "#ffffff",
                    "opacity": 0.4,
                    "width": 1
                },
                "move": {
                    "enable": true,
                    "speed": 1.5,
                    "direction": "none",
                    "random": true,
                    "straight": false,
                    "out_mode": "out",
                    "bounce": false
                }
            },
            "interactivity": {
                "events": {
                    "onhover": { "enable": true, "mode": "grab" },
                    "onclick": { "enable": true, "mode": "push" }
                }
            },
            "retina_detect": true
        });
    }

    const envelopeTrigger = document.getElementById('envelope-trigger');
    const introOverlay = document.getElementById('intro-overlay');
    const namePrompt = document.getElementById('name-prompt');
    const visitorInput = document.getElementById('visitor-name');
    const loadingScreen = document.getElementById('loading-screen');
    const loadingStatus = document.getElementById('loading-status');
    const pageContainer = document.getElementById('page-container');
    const sections = document.querySelectorAll('#page-container section');

    // 2.5 EmailJS Configuration (User must replace these keys)
    const EMAILJS_PUBLIC_KEY = "SgK_q2GD9KOaT0q_8";
    const EMAILJS_SERVICE_ID = "service_xmp3igc";
    const EMAILJS_TEMPLATE_ID = "template_dmtgt3s";

    if (typeof emailjs !== 'undefined') {
        emailjs.init(EMAILJS_PUBLIC_KEY);
    }

    async function sendEmailNotification(name, time) {
        if (EMAILJS_PUBLIC_KEY === "YOUR_PUBLIC_KEY") {
            console.warn("EmailJS keys not configured. skipping email.");
            return;
        }
        try {
            await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
                visitor_name: name,
                timestamp: time,
                to_email: "suvojitghosh2000@gmail.com",
                bcc_email: "survimukherjee0905@gmail.com",
                subject: "portfolio sg notification"
            });
            console.log("Email notification sent successfully!");
        } catch (error) {
            console.error("Email failed:", error);
        }
    }

    let currentIndex = 0;
    let isTransitioning = false;
    let visitorName = "";

    // 3. Intro Sequence Logic

    // Step 1: Tech Envelope Click (Realistic 3D Interaction)
    if (envelopeTrigger) {
        envelopeTrigger.addEventListener('click', () => {
            // Stage 1: Open Flap
            envelopeTrigger.classList.add('open');

            // Stage 2: Pop out Letter
            setTimeout(() => {
                envelopeTrigger.classList.add('pop');
            }, 600);

            // Stage 3: Fade to Name Prompt
            setTimeout(() => {
                introOverlay.style.opacity = '0';
                setTimeout(() => {
                    introOverlay.style.visibility = 'hidden';
                    namePrompt.style.display = 'flex';
                    setTimeout(() => namePrompt.style.opacity = '1', 10);
                    visitorInput.focus();
                }, 800);
            }, 2100); // Wait for flap + letter animations
        });
    }

    // Step 2: Name Entry
    visitorInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && visitorInput.value.trim() !== '') {
            visitorName = visitorInput.value.trim();
            proceedToLoading();
        }
    });

    function proceedToLoading() {
        namePrompt.style.opacity = '0';
        setTimeout(() => {
            namePrompt.style.display = 'none';
            loadingScreen.style.display = 'flex';

            const now = new Date();
            const timestamp = now.toLocaleString('en-GB', {
                day: '2-digit', month: '2-digit', year: 'numeric',
                hour: '2-digit', minute: '2-digit', second: '2-digit',
                hour12: false
            });

            // Trigger Real Email
            sendEmailNotification(visitorName, timestamp);

            console.log(`[SECURE LOG] New Access: ${visitorName} | Time: ${timestamp}`);

            runLoadingSequence();
        }, 500);
    }

    function runLoadingSequence() {
        const statuses = ["DECRYPTING ACCESS...", "BYPASSING FIREWALL...", "MAPPING ROBOTIC CORES...", "WELCOME GRANTED."];
        let i = 0;
        const interval = setInterval(() => {
            loadingStatus.innerText = statuses[i];
            i++;
            if (i >= statuses.length) {
                clearInterval(interval);
                setTimeout(revealPortfolio, 1000);
            }
        }, 800);
    }

    function revealPortfolio() {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            pageContainer.style.display = 'block';
            currentIndex = 0;
            updatePages();
        }, 1000);
    }


    // 4. Varied Scroll Engine

    function updatePages() {
        // Define unique transition classes based on "from -> to" logic or just index
        // We'll use classes that hide the section according to its position relative to active
        sections.forEach((section, index) => {
            section.className = ''; // Reset

            if (index === currentIndex) {
                section.classList.add('active-page');
            } else if (index < currentIndex) {
                // Determine which "exit" animation to use
                const transitions = [
                    'transition-slide-fade', // From Hero
                    'transition-rotate-wipe', // From About
                    'transition-tilt-down',   // From Education
                    'transition-star-burst',  // From Projects
                    'transition-flip-z',      // From Skills
                    'transition-blueprint-scan', // From Resume (NEW)
                    'transition-slide-fade'   // From Contact
                ];

                const transClass = transitions[index] || 'transition-flip-z';
                section.classList.add(transClass);
                section.classList.add('past-page');
            } else {
                // Future pages
                section.classList.add('future-page');
            }
        });
    }

    function handleScroll(direction) {
        if (isTransitioning || pageContainer.style.display === 'none') return;

        // Special Case: IF on projects section AND book is open
        if (sections[currentIndex].id === 'projects' && isBookOpen) {
            isTransitioning = true;
            closeBookAction();

            // Wait for book closing animation before section transition
            setTimeout(() => {
                isTransitioning = false;
                executeSectionTransition(direction);
            }, 1000);
            return;
        }

        executeSectionTransition(direction);
    }

    function executeSectionTransition(direction) {
        if (isTransitioning) return;

        // Visual Flash Effect (Bollywood Tech style)
        const activeContent = sections[currentIndex].querySelector('.content-wrapper') || sections[currentIndex].querySelector('.book-container');
        if (activeContent) {
            activeContent.style.animation = 'flash-glow 0.8s ease-out';
            setTimeout(() => activeContent.style.animation = '', 800);
        }

        if (direction === 'down' && currentIndex < sections.length - 1) {
            currentIndex++;
            isTransitioning = true;
            updatePages();
        } else if (direction === 'up' && currentIndex > 0) {
            currentIndex--;
            isTransitioning = true;
            updatePages();
        }

        if (isTransitioning) {
            setTimeout(() => {
                isTransitioning = false;
            }, 1200);
        }
    }

    // Events
    window.addEventListener('wheel', (e) => {
        const direction = e.deltaY > 0 ? 'down' : 'up';
        handleScroll(direction);
    }, { passive: true });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown') handleScroll('down');
        if (e.key === 'ArrowUp' || e.key === 'PageUp') handleScroll('up');
    });

    let touchStartY = 0;
    window.addEventListener('touchstart', e => touchStartY = e.touches[0].clientY, { passive: true });
    window.addEventListener('touchend', e => {
        const deltaY = touchStartY - e.changedTouches[0].clientY;
        if (Math.abs(deltaY) > 50) handleScroll(deltaY > 0 ? 'down' : 'up');
    }, { passive: true });

    // 5. Parchment Scroll Interaction (Classic Mode)
    const parchmentOverlay = document.getElementById('parchment-overlay');
    const closeParchment = document.getElementById('close-parchment');
    const reachOutBtns = document.querySelectorAll('.reach-out-trigger');
    const particlesDiv = document.getElementById('particles-js');

    reachOutBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();

            // Start the "Aesthetic Migration"
            document.body.style.overflow = 'hidden';
            pageContainer.style.opacity = '0';
            particlesDiv.style.opacity = '0';

            setTimeout(() => {
                pageContainer.style.display = 'none';
                particlesDiv.style.display = 'none';

                parchmentOverlay.style.display = 'flex';
                setTimeout(() => {
                    parchmentOverlay.style.opacity = '1';
                    // Trigger the unroll
                    setTimeout(() => {
                        parchmentOverlay.classList.add('unrolled');
                    }, 500);
                }, 100);
            }, 1000);
        });
    });

    closeParchment.addEventListener('click', () => {
        // Roll it back
        parchmentOverlay.classList.remove('unrolled');

        setTimeout(() => {
            parchmentOverlay.style.opacity = '0';
            setTimeout(() => {
                parchmentOverlay.style.display = 'none';

                // Return to Future
                pageContainer.style.display = 'block';
                particlesDiv.style.display = 'block';

                setTimeout(() => {
                    pageContainer.style.opacity = '1';
                    particlesDiv.style.opacity = '1';
                    document.body.style.overflow = 'auto';
                }, 100);
            }, 1000);
        }, 1500); // Wait for paper to roll up
    });

    // 6. Ancient Book Project Showcase (Phase 8 Revised)
    const projectItems = document.querySelectorAll('.project-item');
    const bookContainer = document.getElementById('book-container');
    const bookCover = document.getElementById('book-cover');
    const bookVisual = document.getElementById('book-visual');
    const bookDetails = document.getElementById('book-details');
    const bookOpenState = document.getElementById('book-open-state');
    const prevCorner = document.getElementById('prev-corner');
    const nextCorner = document.getElementById('next-corner');

    let projectIndex = 0;
    let isBookOpen = false;

    function updateBook() {
        const item = projectItems[projectIndex];
        const name = item.getAttribute('data-name');
        const desc = item.getAttribute('data-desc');
        const img = item.getAttribute('data-img');
        const link = item.getAttribute('data-link');
        const tech = item.getAttribute('data-tech');

        // Cinematic Image or Fallback
        let imgHtml = '';
        if (img === 'WEATHER_FALLBACK') {
            imgHtml = `
                <div class="weather-card-fallback" style="width: 100%; height: 200px; border-radius: 10px; display: flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                    <i class="fas fa-bolt-lightning" style="font-size: 3rem; color: var(--accent-cyan); text-shadow: 0 0 15px var(--accent-cyan);"></i>
                </div>
            `;
        } else {
            imgHtml = `<img src="${img}" alt="${name}">`;
        }

        // Apply flip effect classes or just fade
        const pages = [bookVisual, bookDetails];
        pages.forEach(p => {
            p.style.opacity = '0';
            p.style.transform = 'translateY(10px)';
        });

        setTimeout(() => {
            bookVisual.innerHTML = `
                ${imgHtml}
                ${link !== '#' ? `<a href="${link}" target="_blank" class="github-seal"><i class="fab fa-github"></i> Royal Repo</a>` : '<span class="github-seal" style="opacity: 0.6; filter: hue-rotate(45deg);"><i class="fas fa-lock-open"></i> Royal Archive</span>'}
            `;

            bookDetails.innerHTML = `
                <h3 style="font-family: 'Cinzel', serif;">📜 ${name}</h3>
                <p>${desc}</p>
                <div style="margin-top: 20px; border-top: 1px dashed #8d6e63; padding-top: 10px;">
                    <small style="font-family: inherit; font-size: 1rem; color: #795548;">Artifacts Used: ${tech}</small>
                </div>
                <div style="margin-top: 15px; font-family: 'Cinzel', serif; font-size: 0.8rem; color: #a1887f;">
                    Scroll ${projectIndex + 1} of ${projectItems.length}
                </div>
            `;

            pages.forEach(p => {
                p.style.opacity = '1';
                p.style.transform = 'translateY(0)';
            });
        }, 400);
    }

    // Opening Logic
    if (bookCover) {
        bookCover.addEventListener('click', () => {
            if (!isBookOpen) {
                openBookAction();
            }
        });
    }

    function openBookAction() {
        bookCover.classList.add('opened');
        bookContainer.classList.add('is-open');
        bookOpenState.style.display = 'flex';
        setTimeout(() => {
            bookOpenState.style.opacity = '1';
        }, 50);
        isBookOpen = true;
        updateBook();
    }

    function closeBookAction() {
        if (!isBookOpen) return;

        bookOpenState.style.opacity = '0';
        setTimeout(() => {
            bookOpenState.style.display = 'none';
            bookCover.classList.remove('opened');
            bookContainer.classList.remove('is-open');
            isBookOpen = false;
        }, 500);
    }

    // Corner Pagination
    if (prevCorner) {
        prevCorner.addEventListener('click', (e) => {
            e.stopPropagation();
            if (projectIndex > 0) {
                projectIndex--;
                updateBook();
            }
        });
    }

    if (nextCorner) {
        nextCorner.addEventListener('click', (e) => {
            e.stopPropagation();
            if (projectIndex < projectItems.length - 1) {
                projectIndex++;
                updateBook();
            }
        });
    }

    // Resume Modal Logic (Phase 17)
    const resumeTrigger = document.getElementById('resume-trigger');
    const resumeModal = document.getElementById('resume-modal');

    if (resumeTrigger && resumeModal) {
        resumeTrigger.addEventListener('click', (e) => {
            e.preventDefault();
            resumeModal.classList.add('active');
        });

        resumeModal.addEventListener('click', () => {
            resumeModal.classList.remove('active');
        });
    }

    // Initialize Book (Hidden until first open)

    // 7. Shuffling Cards Logic
    const shufflingCards = document.querySelectorAll('.shuffling-card');
    if (shufflingCards.length > 0) {
        let cardPositions = Array.from({ length: shufflingCards.length }, (_, i) => i);

        function updateCards() {
            shufflingCards.forEach((card, index) => {
                card.setAttribute('data-pos', cardPositions[index]);
            });
        }

        function shuffleNext() {
            const topCardIndex = cardPositions.indexOf(0);
            const topCard = shufflingCards[topCardIndex];
            if (!topCard) return;

            topCard.classList.add('shuffle-out');

            setTimeout(() => {
                cardPositions = cardPositions.map(pos => {
                    if (pos === 0) return shufflingCards.length - 1;
                    return pos - 1;
                });

                updateCards();

                setTimeout(() => {
                    topCard.classList.remove('shuffle-out');
                }, 50);
            }, 300);
        }

        updateCards();
        setInterval(shuffleNext, 3500);

        const cardsContainer = document.getElementById('about-shuffling-cards');
        if (cardsContainer) {
            cardsContainer.addEventListener('click', shuffleNext);
            cardsContainer.style.cursor = 'pointer';
        }
    }
});
