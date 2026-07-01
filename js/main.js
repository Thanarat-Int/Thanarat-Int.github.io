document.addEventListener('DOMContentLoaded', function () {
    // --- Interactive Background Effect ---
    window.addEventListener('mousemove', e => {
        document.body.style.setProperty('--mouse-x', `${e.clientX}px`);
        document.body.style.setProperty('--mouse-y', `${e.clientY}px`);
    });

    // --- Intro Gate ---
    const verseGate = document.getElementById('verse-gate');
    const gateBtn = document.getElementById('gate-enter-btn');
    const gateLabel = document.getElementById('vg-enter-label');
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const GATE_LOADING_LABEL = 'Loading';
    const GATE_LOADING_DURATION = prefersReducedMotion ? 350 : 900; // matches .vg-progress-fill animation

    function openGate() {
        if (!verseGate) return;
        verseGate.classList.add('gate-open');
        document.body.classList.remove('gate-locked');
        document.body.classList.add('entering-site');
        setTimeout(() => verseGate.remove(), 900);
    }

    function startEnterSequence() {
        if (!gateBtn || gateBtn.classList.contains('is-loading')) return;
        gateBtn.classList.add('is-loading');
        if (gateLabel) gateLabel.textContent = GATE_LOADING_LABEL;
        setTimeout(openGate, GATE_LOADING_DURATION);
    }

    if (verseGate) {
        document.body.classList.add('gate-locked');
        gateBtn?.addEventListener('click', startEnterSequence);
    }

    // --- Intro Drifting Starfield ---
    (function initStarfield() {
        const canvas = document.getElementById('vg-star-canvas');
        if (!canvas || !verseGate) return;

        const ctx = canvas.getContext('2d');
        const COLORS = ['255,255,255', '186,230,253', '196,181,253'];
        let w = 0, h = 0, dpr = 1, stars = [], last = 0;

        function resize() {
            dpr = Math.min(window.devicePixelRatio || 1, 2);
            w = canvas.clientWidth;
            h = canvas.clientHeight;
            canvas.width = Math.round(w * dpr);
            canvas.height = Math.round(h * dpr);
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        }

        function seed() {
            const count = Math.max(60, Math.min(180, Math.floor((w * h) / 9000)));
            stars = Array.from({ length: count }, () => {
                const z = 0.3 + Math.random() * 0.7; // depth → parallax + size + brightness
                return {
                    x: Math.random() * w,
                    y: Math.random() * h,
                    z,
                    r: 0.4 + z * 1.3,
                    base: 0.25 + z * 0.55,
                    tw: Math.random() * Math.PI * 2,          // twinkle phase
                    tws: 0.6 + Math.random() * 1.4,           // twinkle speed
                    color: COLORS[(Math.random() * COLORS.length) | 0]
                };
            });
        }

        // Slow diagonal drift; nearer (higher z) stars move faster → parallax depth
        const DRIFT_X = 7, DRIFT_Y = 4; // px/sec at z = 1

        function draw(t) {
            const dt = last ? Math.min((t - last) / 1000, 0.05) : 0;
            last = t;
            ctx.clearRect(0, 0, w, h);

            for (const s of stars) {
                s.x += DRIFT_X * s.z * dt;
                s.y += DRIFT_Y * s.z * dt;
                if (s.x > w + 2) s.x = -2;
                if (s.y > h + 2) s.y = -2;

                const twinkle = 0.65 + 0.35 * Math.sin(t / 1000 * s.tws + s.tw);
                ctx.beginPath();
                ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${s.color},${(s.base * twinkle).toFixed(3)})`;
                ctx.fill();
            }
        }

        function loop(t) {
            if (!canvas.isConnected) return; // gate removed → stop cleanly
            draw(t);
            requestAnimationFrame(loop);
        }

        resize();
        seed();

        if (prefersReducedMotion) {
            draw(0);
        } else {
            requestAnimationFrame(loop);
        }

        window.addEventListener('resize', () => {
            resize();
            seed();
            if (prefersReducedMotion) draw(0);
        });
    })();

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

    function withBabataPrefix(text) {
        if (!text) return text;
        return `Babata AI: ${text}`;
    }

    function answerFromProfile(question) {
        const profile = aiState.profile;
        if (!profile) return null;
        const q = normalizeText(question);
        const birthDate = formatDate(profile.birthDate);
        const age = computeAge(profile.birthDate);

        if (q.includes('ชื่อเล่น') || q.includes('nickname')) {
            return `ชื่อเล่นของคุณกอล์ฟคือ "${profile.nickname}" ส่วนชื่อจริงคือ ${profile.fullName} ค่ะ`;
        }
        if (q.includes('ชื่อ') || q.includes('name')) {
            return `คุณกอล์ฟมีชื่อจริงว่า ${profile.fullName} (ชื่อเล่น ${profile.nickname}) ค่ะ`;
        }
        if (q.includes('อายุ') || q.includes('age')) {
            return age ? `คุณกอล์ฟอายุ ${age} ปีค่ะ` : `คุณกอล์ฟเกิดวันที่ ${birthDate} ค่ะ`;
        }
        if (q.includes('เกิด') || q.includes('birthday') || q.includes('วันเกิด')) {
            return `เกิดวันที่ ${birthDate} ค่ะ`;
        }
        if (q.includes('สถานะ') || q.includes('โสด') || q.includes('แต่งงาน') || q.includes('แฟน')) {
            return `สถานะปัจจุบัน ${profile.maritalStatus} ค่ะ`;
        }
        if (q.includes('พี่น้อง') || q.includes('ลูกคนเดียว')) {
            return `คุณกอล์ฟเป็น${profile.siblings}ค่ะ`;
        }
        if (q.includes('พ่อ') || q.includes('แม่') || q.includes('ครอบครัว') || q.includes('family')) {
            return `${profile.parents} ค่ะ`;
        }
        if (q.includes('อยู่ที่ไหน') || q.includes('ที่อยู่') || q.includes('location') || q.includes('จังหวัด')) {
            return `คุณกอล์ฟอยู่ที่กรุงเทพมหานคร ประเทศไทยค่ะ`;
        }
        if (q.includes('เป้าหมาย') || q.includes('goal') || q.includes('สายงาน')) {
            return `${profile.goals} ค่ะ ตำแหน่งที่สนใจคือ ${profile.desiredRoles.join(', ')} ค่ะ`;
        }
        if (q.includes('ความฝัน') || q.includes('dream')) {
            return `${profile.dreams} ค่ะ`;
        }
        if (q.includes('งานอดิเรก') || q.includes('hobby') || q.includes('ว่าง') || q.includes('ชอบทำอะไร')) {
            return `งานอดิเรกของคุณกอล์ฟคือ ${profile.hobbies} ค่ะ`;
        }
        if (q.includes('นิสัย') || q.includes('ลักษณะ') || q.includes('บุคลิก') || q.includes('personality')) {
            return `${profile.traits} ค่ะ`;
        }
        if (q.includes('ติดต่อ') || q.includes('contact') || q.includes('เบอร์') || q.includes('โทร') || q.includes('email') || q.includes('เมล') || q.includes('github') || q.includes('portfolio')) {
            const c = profile.contact;
            return `ติดต่อคุณกอล์ฟได้ที่ค่ะ\n• โทร ${c.phone}\n• อีเมล ${c.email}\n• GitHub ${c.github}\n• Portfolio ${c.portfolio}`;
        }
        return null;
    }

    // Common Thai/English filler words to ignore when scoring relevance
    const TH_STOP = new Set([
        'ครับ', 'ค่ะ', 'คะ', 'นะ', 'อ่ะ', 'อะ', 'หน่อย', 'ได้', 'ไหม', 'มั้ย', 'บ้าง', 'อะไร',
        'ยังไง', 'อย่างไร', 'คือ', 'ของ', 'ที่', 'และ', 'หรือ', 'กับ', 'ให้', 'เป็น', 'มี', 'ไป',
        'มา', 'ว่า', 'จะ', 'ใน', 'นี้', 'นั้น', 'ก็', 'เธอ', 'เขา', 'บอส', 'คุณ', 'ฉัน', 'ผม',
        'the', 'a', 'an', 'is', 'are', 'do', 'does', 'you', 'your', 'what', 'who', 'how',
        'tell', 'me', 'about', 'please', 'can', 'and', 'of'
    ]);

    function tokenize(text) {
        return normalizeText(text).split(' ').filter(t => t && t.length >= 2 && !TH_STOP.has(t));
    }
    function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
    function hasAny(q, arr) { return arr.some(k => q.includes(k)); }
    function sectionsMatching(...keys) {
        return aiState.sections.filter(s => {
            const t = normalizeText(s.title);
            return keys.some(k => t.includes(k));
        });
    }

    // 1) Greetings / meta questions about the assistant itself — composed female secretary
    function answerSmallTalk(qRaw) {
        const q = normalizeText(qRaw);
        if (hasAny(q, ['สวัสดี', 'หวัดดี', 'ดีจ้า', 'ดีครับ', 'ดีค่ะ', 'hello', 'hi ', 'hey'])) {
            return pick([
                'สวัสดีค่ะ ดิฉัน Babata เลขาส่วนตัวของคุณกอล์ฟ ยินดีให้ข้อมูลเกี่ยวกับคุณกอล์ฟนะคะ',
                'สวัสดีค่ะ มีอะไรอยากทราบเกี่ยวกับคุณกอล์ฟ สอบถามได้เลยค่ะ'
            ]);
        }
        if (hasAny(q, ['ขอบคุณ', 'ขอบใจ', 'thank'])) {
            return pick(['ยินดีค่ะ', 'ด้วยความยินดีค่ะ']);
        }
        if (hasAny(q, ['ลาก่อน', 'บายๆ', 'bye', 'goodbye'])) {
            return 'ขอบคุณที่แวะเข้ามานะคะ';
        }
        if (hasAny(q, ['เธอคือใคร', 'คุณคือใคร', 'babata', 'บาบาต้า', 'who are you', 'เธอชื่ออะไร', 'แนะนำตัว'])) {
            return 'ดิฉัน Babata เลขาส่วนตัวของคุณกอล์ฟค่ะ ยินดีให้ข้อมูลเกี่ยวกับทักษะ ผลงาน และประสบการณ์ของคุณกอล์ฟค่ะ';
        }
        if (hasAny(q, ['ทำอะไรได้', 'ช่วยอะไร', 'ถามอะไรได้', 'what can you', 'help'])) {
            return 'สอบถามได้ทุกเรื่องเกี่ยวกับคุณกอล์ฟค่ะ ทั้งทักษะ ผลงาน ประสบการณ์ การศึกษา เป้าหมาย และช่องทางติดต่อค่ะ';
        }
        return null;
    }

    // 2) Concise overview answers (composed, to the point)
    function answerOverview(qRaw) {
        const q = normalizeText(qRaw);
        if (hasAny(q, ['ทักษะ', 'สกิล', 'skill', 'เก่งอะไร', 'ถนัด', 'ความสามารถ', 'tech stack', 'เทคโนโลยี', 'ภาษาโปรแกรม'])) {
            return 'คุณกอล์ฟถนัดด้าน Applied AI/LLM (RAG, Agentic AI, Prompt & Context Engineering), Automation & BI (n8n, Power BI/Apps) และการเขียนโปรแกรม (Python, TypeScript, FastAPI, Next.js) ค่ะ สนใจด้านไหนเป็นพิเศษถามเพิ่มได้ค่ะ';
        }
        if (hasAny(q, ['โปรเจกต์', 'โปรเจค', 'ผลงาน', 'project', 'เคยทำอะไร', 'ทำงานอะไรมา'])) {
            return 'ผลงานเด่นมี 3 ชิ้นค่ะ — RFQ Wizard (แพลตฟอร์มประเมินราคาด้วย AI), Enterprise RAG Chatbot (ผู้ช่วยค้นเอกสารองค์กร) และ Sales Dashboard (ระบบรายงานและพยากรณ์ยอดขาย) อยากทราบรายละเอียดชิ้นไหนแจ้งได้ค่ะ';
        }
        if (hasAny(q, ['ประสบการณ์', 'ทำงานที่ไหน', 'experience', 'เคยทำงาน', 'บริษัท', 'งานที่ผ่านมา', 'ตำแหน่ง'])) {
            return 'ประสบการณ์ของคุณกอล์ฟค่ะ — AI Context Engineer ที่ Sirivatana Interprint (2026), IT Infrastructure Section Head ที่ C.J. Express (2021–2026) และ IT Officer ที่ Lazada (2020–2021) ค่ะ';
        }
        if (hasAny(q, ['เรียน', 'การศึกษา', 'จบ', 'มหาลัย', 'มหาวิทยาลัย', 'education', 'ปริญญา', 'วุฒิ'])) {
            const secs = sectionsMatching('education');
            if (secs.length) return `${secs[0].body.trim()} ค่ะ`;
        }
        if (hasAny(q, ['ทำไมต้องจ้าง', 'ทำไมควรจ้าง', 'จุดเด่น', 'why hire', 'จ้างทำไม', 'ดียังไง', 'จุดแข็ง'])) {
            const secs = sectionsMatching('why hire', 'why');
            if (secs.length) return `${secs[0].body.trim()} ค่ะ`;
        }
        return null;
    }

    // 3) Relevance-scored retrieval over the whole knowledge base
    function answerFromKnowledge(qRaw) {
        const qTokens = tokenize(qRaw);
        if (!qTokens.length || aiState.sections.length === 0) return null;
        let best = null;
        let bestScore = 0;

        aiState.sections.forEach(section => {
            const title = normalizeText(section.title);
            const text = normalizeText(`${section.title} ${section.body}`);
            let score = 0;
            qTokens.forEach(tok => {
                if (text.includes(tok)) {
                    score += title.includes(tok) ? 3 : 1;   // title matches weigh more
                    if (tok.length >= 4) score += 1;         // longer tokens are more specific
                }
            });
            if (score > bestScore) {
                bestScore = score;
                best = section;
            }
        });

        if (best && bestScore >= 2) return `${best.body.trim()} ค่ะ`;
        return null;
    }

    // Pipeline: meta -> structured profile -> overview -> retrieval -> graceful fallback
    function generateAnswer(question) {
        return answerSmallTalk(question)
            || answerOverview(question)
            || answerFromProfile(question)
            || answerFromKnowledge(question)
            || pick([
                'ขออภัยค่ะ ดิฉันยังไม่มีข้อมูลส่วนนี้ ลองถามเรื่องทักษะ ผลงาน ประสบการณ์ หรือการติดต่อคุณกอล์ฟได้ค่ะ',
                'เรื่องนี้ดิฉันยังไม่แน่ใจค่ะ ลองถามใหม่ เช่น "มีทักษะอะไร" หรือ "ติดต่อยังไง" ได้นะคะ'
            ]);
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
            appendMessage(withBabataPrefix('ขอโทษค่ะ ระบบความรู้ยังไม่พร้อมใช้งาน'), 'bot');
        }
    }

    function handleAsk(question) {
        const clean = question.trim();
        if (!clean) return;
        appendMessage(clean, 'user');
        const typingBubble = appendTypingIndicator();
        setHudStatus('RESPONDING');

        const answer = withBabataPrefix(generateAnswer(clean));
        // Natural, length-aware "thinking" delay (0.7s–2.2s)
        const delay = Math.min(2200, 700 + answer.length * 9);

        setTimeout(() => {
            if (typingBubble) typingBubble.remove();
            appendMessage(answer, 'bot');
            setHudStatus('READY');
        }, delay);
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
            "AI Automation Engineer"
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
