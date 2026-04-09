document.addEventListener('DOMContentLoaded', function () {
    // --- Interactive Background Effect ---
    window.addEventListener('mousemove', e => {
        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // --- Time-Warp Intro ---
    const timeWarp = document.getElementById('time-warp');
    const verseGate = document.getElementById('verse-gate');
    const gateBtn = document.getElementById('gate-enter-btn');
    const gateRain = document.getElementById('gate-rain');

    function runTimeWarp() {
        if (!timeWarp) return;
        timeWarp.classList.add('time-warp--show');
        setTimeout(() => {
            timeWarp.classList.add('time-warp--hide');
            setTimeout(() => timeWarp.remove(), 1200);
        }, 200);
    }

    function openGate() {
        if (!verseGate) return;
        verseGate.classList.add('gate-open');
        document.body.classList.remove('gate-locked');
        runTimeWarp();
        setTimeout(() => verseGate.remove(), 1400);
    }

    if (verseGate) {
        document.body.classList.add('gate-locked');
        gateBtn?.addEventListener('click', openGate);
    } else {
        window.addEventListener('load', runTimeWarp);
    }

    // --- Interactive Card Glow Effect ---
    document.querySelectorAll('.card-glow, .exp-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x-card', `${e.clientX - rect.left}px`);
            card.style.setProperty('--mouse-y-card', `${e.clientY - rect.top}px`);
        });
    });

    // --- Project Hover Spotlight ---
    document.querySelectorAll('.project-spotlight').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--spot-x', `${e.clientX - rect.left}px`);
            card.style.setProperty('--spot-y', `${e.clientY - rect.top}px`);
        });
        card.addEventListener('mouseleave', () => {
            card.style.setProperty('--spot-x', '50%');
            card.style.setProperty('--spot-y', '50%');
        });
    });

    // --- Header Scroll Effect ---
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        header.classList.toggle('bg-gray-900/80', window.scrollY > 50);
        header.classList.toggle('backdrop-blur-sm', window.scrollY > 50);
        header.classList.toggle('border-b', window.scrollY > 50);
        header.classList.toggle('border-gray-800', window.scrollY > 50);
    });

    // --- Scroll Milestone Indicator ---
    const scrollIndicator = document.getElementById('scroll-indicator-bar');
    function updateScrollIndicator() {
        if (!scrollIndicator) return;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = docHeight > 0 ? window.scrollY / docHeight : 0;
        scrollIndicator.style.height = `${Math.min(Math.max(progress, 0), 1) * 100}%`;
    }
    window.addEventListener('scroll', updateScrollIndicator);
    updateScrollIndicator();

    // --- HUD Status ---
    const hudText = document.getElementById('hud-text');
    function setHudStatus(status) {
        if (hudText) {
            hudText.textContent = status;
        }
    }

    // --- Mobile Menu ---
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    document.querySelectorAll('.mobile-menu-link').forEach(link => {
        link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
    });
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));

    // --- Fade-in on Scroll Animation ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) entry.target.classList.add('is-visible');
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.fade-in-section').forEach(section => observer.observe(section));

    // --- Scroll Parallax Depth ---
    const parallaxItems = document.querySelectorAll('.parallax-item');
    function updateParallax() {
        const scrollY = window.scrollY;
        parallaxItems.forEach(item => {
            const speed = parseFloat(item.getAttribute('data-parallax')) || 0;
            item.style.setProperty('--parallax-y', `${scrollY * (speed / 100)}px`);
        });
    }
    window.addEventListener('scroll', updateParallax);
    updateParallax();


    // --- Swiper 3D Carousel (Certificates) ---
    // Initialize Swiper only if the container exists
    if (document.querySelector('.certificates-swiper')) {
        const swiper = new Swiper('.certificates-swiper', {
            effect: 'coverflow',
            grabCursor: true,
            centeredSlides: true,
            slidesPerView: 'auto',
            coverflowEffect: {
                rotate: 25, // Decreased rotation for better view
                stretch: 0,
                depth: 500, // Deep 3D Perspective
                modifier: 1,
                slideShadows: false, // Customized CSS shadows used instead
            },
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            loop: true,
            autoplay: {
                delay: 3000,
                disableOnInteraction: false,
            },
            // Add click event to open modal
            on: {
                click: function (swiper, event) {
                    const clickedSlide = swiper.clickedSlide;
                    if (clickedSlide) {
                        const img = clickedSlide.querySelector('img');
                        if (img) {
                            openModal(img.src, clickedSlide.querySelector('h3').innerText);
                        }
                    }
                }
            }
        });
    }



    // --- Toggle Projects Button ---
    const toggleBtn = document.getElementById('toggle-projects-btn');
    const moreProjects = document.getElementById('more-projects');

    if (toggleBtn && moreProjects) {
        toggleBtn.addEventListener('click', () => {
            const isHidden = moreProjects.style.maxHeight === '0px' || moreProjects.style.maxHeight === '';

            if (isHidden) {
                // Expand the container to fit its content
                moreProjects.style.maxHeight = moreProjects.scrollHeight + 'px';
                toggleBtn.textContent = 'Show Less';
            } else {
                // Collapse the container
                moreProjects.style.maxHeight = '0px';
                toggleBtn.textContent = 'Show More';
            }
        });
    }

    // --- Certificate Modal Logic ---
    const modal = document.getElementById('modal');
    const modalImg = document.getElementById('modal-img');
    const closeModalBtn = document.getElementById('modal-close-btn');

    // Make the openModal function globally available
    window.openModal = function (imgSrc) {
        if (modal && modalImg) {
            modalImg.src = imgSrc;
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    // Function to close the modal
    function closeModal() {
        if (modal) {
            modal.classList.add('hidden');
            document.body.style.overflow = 'auto'; // Restore scrolling
        }
    }

    // Event listeners for closing the modal
    if (closeModalBtn) {
        closeModalBtn.addEventListener('click', closeModal);
    }

    if (modal) {
        // Close when clicking on the background overlay
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal();
            }
        });
    }

    // Close with the Escape key
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });

    // --- Add this block to the end of your DOMContentLoaded function ---

    // --- Constellation Network Animation ---
    const canvas = document.getElementById('constellation-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];

        function resizeCanvas() {
            canvas.width = canvas.offsetWidth;
            canvas.height = canvas.offsetHeight;
            createParticles();
        }

        function createParticles() {
            particles = [];
            const particleCount = Math.floor(canvas.width * canvas.height / 25000); // Optimized for performance & cleaner look
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.5,
                    vy: (Math.random() - 0.5) * 0.5,
                    radius: Math.random() * 1.5 + 0.5
                });
            }
        }

        function draw() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                ctx.beginPath();
                ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                ctx.fill();
            });

            for (let i = 0; i < particles.length; i++) {
                for (let j = i + 1; j < particles.length; j++) {
                    const dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);
                    if (dist < 120) { // Adjust line connection distance
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${1 - dist / 120})`;
                        ctx.stroke();
                    }
                }
            }
        }

        function animate() {
            draw();
            requestAnimationFrame(animate);
        }

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        animate();
    }

    // --- Skills Constellation Hover ---
    const skillsCanvas = document.getElementById('skills-constellation');
    const skillsSection = document.getElementById('skills');
    let activeSkill = null;
    let skillsRaf = null;

    function resizeSkillsCanvas() {
        if (!skillsCanvas || !skillsSection) return;
        skillsCanvas.width = skillsSection.clientWidth;
        skillsCanvas.height = skillsSection.clientHeight;
    }

    function drawSkillsConstellation() {
        if (!skillsCanvas || !skillsSection) return;
        const ctx = skillsCanvas.getContext('2d');
        ctx.clearRect(0, 0, skillsCanvas.width, skillsCanvas.height);

        if (!activeSkill) {
            skillsRaf = null;
            return;
        }

        const sectionRect = skillsSection.getBoundingClientRect();
        const baseRect = activeSkill.getBoundingClientRect();
        const baseX = baseRect.left - sectionRect.left + baseRect.width / 2;
        const baseY = baseRect.top - sectionRect.top + baseRect.height / 2;

        const parentCard = activeSkill.closest('.glass-panel') || skillsSection;
        const pills = parentCard.querySelectorAll('.skill-pill');

        ctx.strokeStyle = 'rgba(34, 211, 238, 0.45)';
        ctx.lineWidth = 1;
        ctx.shadowColor = 'rgba(34, 211, 238, 0.4)';
        ctx.shadowBlur = 10;

        pills.forEach(pill => {
            if (pill === activeSkill) return;
            const rect = pill.getBoundingClientRect();
            const x = rect.left - sectionRect.left + rect.width / 2;
            const y = rect.top - sectionRect.top + rect.height / 2;
            ctx.beginPath();
            ctx.moveTo(baseX, baseY);
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.beginPath();
            ctx.arc(x, y, 2, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(192, 132, 252, 0.7)';
            ctx.fill();
        });

        ctx.beginPath();
        ctx.arc(baseX, baseY, 3, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(34, 211, 238, 0.9)';
        ctx.fill();

        skillsRaf = requestAnimationFrame(drawSkillsConstellation);
    }

    if (skillsCanvas && skillsSection) {
        window.addEventListener('resize', () => {
            resizeSkillsCanvas();
            drawSkillsConstellation();
        });
        resizeSkillsCanvas();

        document.querySelectorAll('.skill-pill').forEach(pill => {
            pill.addEventListener('mouseenter', () => {
                activeSkill = pill;
                pill.classList.add('is-active');
                if (!skillsRaf) {
                    drawSkillsConstellation();
                }
            });
            pill.addEventListener('mouseleave', () => {
                pill.classList.remove('is-active');
                activeSkill = null;
            });
        });
    }

    // --- AI Companion Q&A (No LLM/API) ---
    const aiChatLog = document.getElementById('ai-chat-log');
    const aiQuestionInput = document.getElementById('ai-question-input');
    const aiQuestionSend = document.getElementById('ai-question-send');
    const aiSuggestions = document.querySelectorAll('.ai-suggestion');

    const aiState = {
        profile: null,
        sections: []
    };

    function normalizeText(text) {
        return text
            .toLowerCase()
            .replace(/[^\w\s\u0E00-\u0E7F]/g, ' ')
            .replace(/\s+/g, ' ')
            .trim();
    }

    function formatDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function computeAge(dateStr) {
        if (!dateStr) return '';
        const birth = new Date(dateStr);
        if (Number.isNaN(birth.getTime())) return '';
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const m = today.getMonth() - birth.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
            age--;
        }
        return age.toString();
    }

    function appendMessage(text, role) {
        if (!aiChatLog) return;
        const bubble = document.createElement('div');
        bubble.className = `ai-bubble ${role === 'user' ? 'ai-bubble-user' : 'ai-bubble-bot'}`;
        bubble.textContent = text;
        aiChatLog.appendChild(bubble);
        aiChatLog.scrollTop = aiChatLog.scrollHeight;
    }

    function appendTypingIndicator() {
        if (!aiChatLog) return null;
        const bubble = document.createElement('div');
        bubble.className = 'ai-bubble ai-bubble-bot';
        bubble.innerHTML = '<span class="ai-typing"><span></span><span></span><span></span></span>';
        aiChatLog.appendChild(bubble);
        aiChatLog.scrollTop = aiChatLog.scrollHeight;
        return bubble;
    }

    function withPathaPrefix(text) {
        if (!text) return text;
        return `Patha AI: ${text}`;
    }

    function answerFromProfile(question) {
        const profile = aiState.profile;
        if (!profile) return null;
        const q = normalizeText(question);
        const birthDate = formatDate(profile.birthDate);
        const age = computeAge(profile.birthDate);

        if (q.includes('ชื่อเล่น') || q.includes('nickname')) {
            return `บอสของฉันชื่อเล่น ${profile.nickname} ค่ะ`;
        }
        if (q.includes('ชื่อ') || q.includes('name')) {
            return `บอสของฉันชื่อ ${profile.fullName} ชื่อเล่น ${profile.nickname} ค่ะ`;
        }
        if (q.includes('อายุ') || q.includes('age')) {
            return `ตอนนี้บอสอายุ ${age || profile.ageNote} ปีค่ะ (${profile.ageNote})`;
        }
        if (q.includes('เกิด') || q.includes('birthday')) {
            return `บอสเกิดวันที่ ${birthDate} ค่ะ`;
        }
        if (q.includes('สถานะ') || q.includes('โสด') || q.includes('แต่งงาน')) {
            return `สถานะปัจจุบันของบอสคือ ${profile.maritalStatus} ค่ะ`;
        }
        if (q.includes('พี่น้อง') || q.includes('ลูกคนเดียว')) {
            return `บอสเป็น${profile.siblings} ค่ะ`;
        }
        if (q.includes('พ่อ') || q.includes('แม่') || q.includes('ครอบครัว')) {
            return `เกี่ยวกับครอบครัวของบอส: ${profile.parents} ค่ะ`;
        }
        if (q.includes('เป้าหมาย') || q.includes('goal') || q.includes('สายงาน')) {
            return `เป้าหมายของบอสคือ ${profile.goals} (ตำแหน่งที่อยากทำ: ${profile.desiredRoles.join(', ')}) ค่ะ`;
        }
        if (q.includes('ความฝัน') || q.includes('dream')) {
            return `ความฝันของบอสคือ ${profile.dreams} ค่ะ`;
        }
        if (q.includes('งานอดิเรก') || q.includes('hobby')) {
            return `งานอดิเรกของบอสคือ ${profile.hobbies} ค่ะ`;
        }
        if (q.includes('นิสัย') || q.includes('ลักษณะ') || q.includes('บุคลิก')) {
            return `ลักษณะนิสัยของบอสคือ ${profile.traits} ค่ะ`;
        }
        if (q.includes('ติดต่อ') || q.includes('contact') || q.includes('เบอร์') || q.includes('โทร') || q.includes('email') || q.includes('เมล') || q.includes('github') || q.includes('portfolio')) {
            const contact = profile.contact;
            return `ติดต่อบอสได้ที่ โทร ${contact.phone} | อีเมล ${contact.email} | GitHub ${contact.github} | Portfolio ${contact.portfolio} ค่ะ`;
        }
        return null;
    }

    function answerFromKnowledge(question) {
        const q = normalizeText(question);
        if (!q || aiState.sections.length === 0) return null;
        const tokens = q.split(' ');
        let best = null;
        let bestScore = 0;

        aiState.sections.forEach(section => {
            const hay = normalizeText(`${section.title} ${section.body}`);
            let score = 0;
            tokens.forEach(token => {
                if (!token) return;
                if (hay.includes(token)) score += 1;
            });
            if (score > bestScore) {
                bestScore = score;
                best = section;
            }
        });

        if (best && bestScore > 0) {
            return `เรื่องนี้ของบอส: ${best.body.trim()}`;
        }
        return null;
    }

    async function loadKnowledge() {
        try {
            const [profileRes, knowledgeRes] = await Promise.all([
                fetch('data/profile.json'),
                fetch('data/knowledge.md')
            ]);
            if (profileRes.ok) {
                aiState.profile = await profileRes.json();
            }
            if (knowledgeRes.ok) {
                const md = await knowledgeRes.text();
                aiState.sections = md
                    .split(/\n##\s+/)
                    .map((chunk, index) => {
                        if (index === 0) return null;
                        const [titleLine, ...bodyLines] = chunk.split('\n');
                        return {
                            title: titleLine.trim(),
                            body: bodyLines.join('\n').trim()
                        };
                    })
                    .filter(Boolean);
            }
        } catch (err) {
            appendMessage(withPathaPrefix('ขอโทษค่ะ ระบบความรู้ยังไม่พร้อมใช้งาน'), 'bot');
        }
    }

    function handleAsk(question) {
        const clean = question.trim();
        if (!clean) return;
        appendMessage(clean, 'user');
        const typingBubble = appendTypingIndicator();
        setHudStatus('RESPONDING');
        const fromProfile = answerFromProfile(clean);
        const fromKnowledge = fromProfile ? null : answerFromKnowledge(clean);
        const answer = fromProfile
            ? withPathaPrefix(fromProfile)
            : fromKnowledge
                ? withPathaPrefix(fromKnowledge)
                : withPathaPrefix('ขอโทษค่ะ ยังไม่เจอคำตอบ ลองถามเรื่องประวัติ เป้าหมาย งานอดิเรก หรือช่องทางติดต่อได้นะคะ');

        setTimeout(() => {
            if (typingBubble) typingBubble.remove();
            appendMessage(answer, 'bot');
            setHudStatus('READY');
        }, 1500);
    }

    if (aiQuestionSend && aiQuestionInput) {
        aiQuestionSend.addEventListener('click', () => {
            handleAsk(aiQuestionInput.value);
            aiQuestionInput.value = '';
        });
        aiQuestionInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                handleAsk(aiQuestionInput.value);
                aiQuestionInput.value = '';
            }
        });
    }

    aiSuggestions.forEach(btn => {
        btn.addEventListener('click', () => {
            const text = btn.textContent || '';
            if (aiQuestionInput) aiQuestionInput.value = text;
            aiQuestionInput?.focus();
        });
    });

    loadKnowledge();
    setHudStatus('READY');

    // --- 3D Tilt Effect (Vanilla JS) ---
    const tiltCards = document.querySelectorAll('.tilt-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calculate rotation based on cursor position
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -5; // Max rotation deg
            const rotateY = ((x - centerX) / centerX) * 5;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
        });
    });

    // --- Typing Effect ---
    const typingText = document.getElementById('typing-text');
    if (typingText) {
        const roles = [
            "Applied AI Engineer",
            "AI Automation Engineer",
            "AI Context Engineer"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 100;

        function type() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingText.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 50; // Faster deleting
            } else {
                typingText.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 100; // Normal typing
            }

            if (!isDeleting && charIndex === currentRole.length) {
                // Finished typing word
                isDeleting = true;
                typeSpeed = 2000; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                // Finished deleting word
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typeSpeed = 500; // Pause before new word
            }

            setTimeout(type, typeSpeed);
        }

        // Start typing loop
        setTimeout(type, 1000);
    }

    // --- Resume Modal Logic ---
    const resumeBtn = document.getElementById('download-resume-btn');
    const resumeModal = document.getElementById('resume-modal');
    const resumeCancel = document.getElementById('resume-cancel-btn');
    const resumeConfirm = document.getElementById('resume-confirm-btn');
    const resumeOverlay = document.getElementById('resume-modal-overlay');

    if (resumeBtn && resumeModal) {
        resumeBtn.addEventListener('click', (e) => {
            e.preventDefault();
            resumeModal.classList.remove('hidden');
        });

        const closeResumeModal = () => resumeModal.classList.add('hidden');

        if (resumeCancel) resumeCancel.addEventListener('click', closeResumeModal);
        if (resumeOverlay) resumeOverlay.addEventListener('click', closeResumeModal);
        if (resumeConfirm) {
            resumeConfirm.addEventListener('click', () => {
                setTimeout(closeResumeModal, 500); // Small delay for visual effect
            });
        }
    }

    // --- Back to Top Button ---
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 600) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

});
