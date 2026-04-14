document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const trackerContainer = document.getElementById('nav-tracker');
    let currentSlide = 0;
    
    // Inject dynamic HTML tracker dots based on slide count
    if (trackerContainer) {
        slides.forEach((_, idx) => {
            const dot = document.createElement('div');
            dot.className = 'tracker-dot';
            trackerContainer.appendChild(dot);
        });
    }
    
    // Core Navigation Logic
    const updateSlides = () => {
        slides.forEach(s => s.classList.remove('active'));
        setTimeout(() => slides[currentSlide].classList.add('active'), 10);
        
        // Update Tracker Dots
        if (trackerContainer) {
            const dots = trackerContainer.querySelectorAll('.tracker-dot');
            dots.forEach((dot, index) => {
                if (index === currentSlide) dot.classList.add('active');
                else dot.classList.remove('active');
            });
        }
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
            
            // Build tracker string for print visually
            let trackerVisual = '';
            for(let i=0; i<slides.length; i++){
                trackerVisual += `<div style="width: 30px; height: 2px; display: inline-block; margin-left: 8px; background: ${i === idx ? '#FFF' : 'rgba(255,255,255,0.1)'};"></div>`;
            }

            cloneCanvas.innerHTML = `
                <div class="global-navbar" style="position: absolute; top: 0; left: 0; width: 100%; z-index: 50; padding: 30px 50px; display: flex; justify-content: space-between; align-items: center;">
                    <div style="font-size: 0.8rem; font-weight: 700; letter-spacing: 0.2em; color: #8b949e; font-family: 'Outfit', sans-serif;">NEXIS / DEMO DAY 2026</div>
                    <div>${trackerVisual}</div>
                </div>
                
                <div class="slides-wrapper" style="flex-grow: 1; position: relative; z-index: 10; margin-top: 30px;">
                    <div class="slide active" style="visibility: visible; opacity: 1; pointer-events: auto; display: block; position: absolute; inset: 0; padding: 60px 80px; transition: none; background: #030508;">
                        ${slide.innerHTML}
                    </div>
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
