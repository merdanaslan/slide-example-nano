document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('progress-bar');
    let currentSlide = 0;
    
    // Quick script tracking progress width
    const updateProgress = () => {
        const percentage = ((currentSlide + 1) / slides.length) * 100;
        if(progressBar) progressBar.style.width = `${percentage}%`;
    };

    const updateSlides = () => {
        slides.forEach((s, i) => {
            if (i === currentSlide) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        updateProgress();
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

        slides.forEach((slide) => {
            const cloneCanvas = document.createElement('div');
            cloneCanvas.className = 'print-canvas';
            
            // Reconstruct the 3D wrapper framework for the printed page statically
            cloneCanvas.innerHTML = `
                <div class="top-nav" style="position: absolute; top: 0; left: 0; width: 100%; padding: 40px 60px; display: flex; justify-content: space-between; align-items: center; z-index: 50;">
                    <img src="../logos/superteam-black.png" height="20" alt="Superteam">
                </div>
                
                <div class="slides-wrapper" style="flex-grow: 1; position: relative; z-index: 10;">
                    <div class="slide active" style="visibility: visible; opacity: 1; pointer-events: auto; display: block; position: absolute; inset: 0; padding: 100px 80px 80px 80px; transition: none;">
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
