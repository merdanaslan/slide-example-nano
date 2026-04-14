document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const brandIndicator = document.getElementById('brand-indicator');
    let currentSlide = 0;
    
    const updateSlides = () => {
        slides.forEach((s, i) => {
            if (i === currentSlide) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        
        // Zero-padding for elegance e.g., PAGE 01
        const pageNum = (currentSlide + 1).toString().padStart(2, '0');
        brandIndicator.textContent = `PAGE ${pageNum}`;
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

        slides.forEach((slide, index) => {
            const cloneCanvas = document.createElement('div');
            cloneCanvas.className = 'print-canvas';
            
            const pageNum = (index + 1).toString().padStart(2, '0');

            // Reconstruct the luxury wrapper framework for the printed page
            cloneCanvas.innerHTML = `
                <div class="editorial-header" style="position: absolute; top: 0; left: 0; width: 100%; padding: 50px 60px; display: flex; justify-content: space-between; align-items: center; z-index: 50; font-family: 'Montserrat', sans-serif; font-size: 0.7rem; font-weight: 500; letter-spacing: 0.2em; color: #FBFBF9;">
                    <div style="font-weight: 600; font-size: 1rem;">ST.</div>
                    <div>GERMANY — VOL. I</div>
                </div>

                <div class="slides-wrapper" style="flex-grow: 1; position: relative; z-index: 10;">
                    <div class="slide active" style="visibility: visible; opacity: 1; display: block; position: absolute; inset: 0; padding: 120px 60px; transition: none;">
                        ${slide.innerHTML}
                    </div>
                </div>

                <div class="brand-footer" style="position: absolute; bottom: 0; left: 0; width: 100%; padding: 50px 60px; display: flex; justify-content: space-between; align-items: center; z-index: 50; font-family: 'Montserrat', sans-serif; font-size: 0.65rem; font-weight: 500; letter-spacing: 0.2em; color: #A39D93;">
                    <div>SOLANA FOUNDATION</div>
                    <div>PAGE ${pageNum}</div>
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
