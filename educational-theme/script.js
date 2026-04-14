document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const progressBar = document.getElementById('edu-progress');
    let currentSlide = 0;
    
    // Core Navigation & Logic
    const updateSlides = () => {
        slides.forEach(s => s.classList.remove('active'));
        setTimeout(() => slides[currentSlide].classList.add('active'), 10);
        
        // Update top progress bar logic
        if (progressBar) {
            const progress = ((currentSlide + 1) / slides.length) * 100;
            progressBar.style.width = `${progress}%`;
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
            
            // Reconstruct the framework for the printed page dynamically
            // Extract the background color logic if applied to the specific slide natively
            const hasBlueBg = slide.classList.contains('bg-blue-soft');
            const hasYellowBg = slide.classList.contains('bg-yellow-soft');
            let bgStyle = 'background: #FFFCF8;';
            if(hasBlueBg) bgStyle = 'background: #DBEAFE;';
            if(hasYellowBg) bgStyle = 'background: #FEF3C7;';

            cloneCanvas.innerHTML = `
                <div class="edu-header" style="position: absolute; top: 0; left: 0; width: 100%; z-index: 50; padding: 40px 60px; display: flex; justify-content: space-between; align-items: center;">
                    <img src="../logos/superteam-black.png" height="20" alt="Superteam">
                    <span style="font-weight: 700; font-size: 0.9rem; color: #64748b; text-transform: uppercase;">PAGE ${idx + 1}</span>
                </div>
                
                <div class="slides-wrapper" style="flex-grow: 1; position: relative; z-index: 10; margin-top: 20px;">
                    <div class="slide active" style="visibility: visible; opacity: 1; pointer-events: auto; display: block; position: absolute; inset: 0; padding: 80px 100px; transition: none; ${bgStyle}">
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
