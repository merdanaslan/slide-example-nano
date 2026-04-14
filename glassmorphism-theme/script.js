document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    // Core Navigation Logic
    const updateSlides = () => {
        slides.forEach(s => s.classList.remove('active'));
        setTimeout(() => slides[currentSlide].classList.add('active'), 10);
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
            
            cloneCanvas.innerHTML = `
                <div class="glass-navbar" style="position: absolute; top: 0; left: 0; width: 100%; z-index: 50; padding: 30px 50px; display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; font-weight: 600; letter-spacing: 0.15em; color: #4b5563;">
                    <div>SUPERTEAM // VISION LAYER</div>
                    <div>${(idx + 1).toString().padStart(2, '0')}_05</div>
                </div>
                <div class="slides-wrapper" style="flex-grow: 1; position: relative; z-index: 10; margin-top: 40px;">
                    <div class="slide active" style="visibility: visible; opacity: 1; pointer-events: auto; display: block; position: absolute; inset: 0; padding: 60px 80px; transition: none;">
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
