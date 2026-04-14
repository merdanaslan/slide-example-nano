document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const stageTracker = document.getElementById('stage-tracker');
    let currentSlide = 0;
    
    // Core Navigation Logic specifically styled for hard arcade snaps
    const updateSlides = () => {
        // Instant visual removal mapping to 8-bit screen loading
        slides.forEach(s => s.classList.remove('active'));
        
        setTimeout(() => {
            slides[currentSlide].classList.add('active');
        }, 10);
        
        // Update Stage Tracker Header with zero-padded levels
        if(stageTracker) {
            stageTracker.textContent = (currentSlide + 1).toString().padStart(2, '0');
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
            
            const stageNum = (idx + 1).toString().padStart(2, '0');

            // Reconstruct the framework for the printed page dynamically without CRT overlay (as it ruins PDFs)
            cloneCanvas.innerHTML = `
                <div class="arcade-header" style="position: absolute; top: 0; left: 0; width: 100%; z-index: 50; padding: 30px 40px; display: flex; justify-content: space-between; align-items: center; font-size: 1.5rem; text-shadow: 2px 2px 0px #000; font-family: 'VT323', monospace; color: #FFF;">
                    <div>SCORE: <span style="color: #39FF14; text-shadow: 2px 2px 0px #000;">0015000000</span></div>
                    <div>STAGE: <span>${stageNum}</span></div>
                    <div>TIME: <span style="color: #FFEA00; text-shadow: 2px 2px 0px #000;">99</span></div>
                </div>
                
                <div class="slides-wrapper" style="flex-grow: 1; position: relative; z-index: 10; margin-top: 30px;">
                    <div class="slide active" style="visibility: visible; opacity: 1; pointer-events: auto; display: block; position: absolute; inset: 0; padding: 60px 80px; transition: none; background: #0A0A15;">
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
