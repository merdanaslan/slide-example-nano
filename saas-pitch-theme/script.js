document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const trackDots = document.querySelectorAll('.track-dot');
    let currentSlide = 0;
    
    const updateSlides = () => {
        // Slide visibility logic
        slides.forEach((s, i) => {
            if (i === currentSlide) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });

        // SaaS Tracker Bar UI Logic
        trackDots.forEach((dot, i) => {
            if (i === currentSlide) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    };

    document.addEventListener('keydown', (e) => {
        if (['ArrowRight', 'Space', ' ', 'ArrowDown'].includes(e.key)) {
            if (currentSlide < slides.length - 1) { currentSlide++; updateSlides(); }
        } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
            if (currentSlide > 0) { currentSlide--; updateSlides(); }
        }
    });

    updateSlides();

    // ==========================================
    // PDF EXPORT HOOKS
    // ==========================================
    let printContainer = null;
    let originalCanvas = document.querySelector('.canvas');

    window.addEventListener('beforeprint', () => {
        originalCanvas.style.display = 'none'; 
        
        printContainer = document.createElement('div');
        document.querySelector('.desktop').appendChild(printContainer);

        slides.forEach((slide, idx) => {
            const cloneCanvas = document.createElement('div');
            cloneCanvas.className = 'print-canvas';
            
            // Reconstruct the SaaS wrapper framework for the printed page dynamically
            cloneCanvas.innerHTML = `
                <div class="saas-header" style="position: absolute; top: 0; left: 0; width: 100%; z-index: 50; padding: 40px 50px; display: flex; justify-content: space-between; align-items: center;">
                    <img src="../logos/superteam-white.png" height="22" alt="Superteam">
                    <div class="header-badge" style="padding: 6px 12px; background: rgba(255,255,255,0.05); border: 1px solid rgba(255, 255, 255, 0.08); border-radius: 100px; font-size: 0.75rem; font-weight: 700; letter-spacing: 0.1em; color: #94A3B8;">
                        SERIES ALPHA PITCH
                    </div>
                </div>
                
                <div class="slides-wrapper" style="flex-grow: 1; position: relative; z-index: 10;">
                    <div class="slide active" style="visibility: visible; opacity: 1; pointer-events: auto; display: block; position: absolute; inset: 0; padding: 100px 80px 80px 80px; transition: none;">
                        ${slide.innerHTML}
                    </div>
                </div>

                <div class="saas-footer" style="position: absolute; bottom: 0; left: 0; width: 100%; z-index: 50; padding: 30px 50px; display: flex; justify-content: flex-end;">
                    <div style="font-size: 0.8rem; font-weight: 600; color: #94A3B8;">PAGE 0${idx + 1}</div>
                </div>
            `;
            
            printContainer.appendChild(cloneCanvas);
        });
    });

    window.addEventListener('afterprint', () => {
        if (printContainer) printContainer.remove();
        originalCanvas.style.display = 'flex'; 
    });
});
