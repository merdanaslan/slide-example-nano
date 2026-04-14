document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const slideIndicator = document.getElementById('slide-indicator');
    let currentSlide = 0;
    
    const updateSlides = () => {
        slides.forEach((s, i) => {
            if (i === currentSlide) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        
        // Update the footer indicator
        slideIndicator.textContent = `0${currentSlide + 1} / 0${slides.length}`;
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
            
            // Reconstruct Global Layout for Print
            cloneCanvas.innerHTML = `
                <div class="bg-gradient-orb" style="position: absolute; width: 800px; height: 800px; top: 50%; left: 50%; transform: translate(-50%, -50%); background: radial-gradient(circle, rgba(0, 114, 255, 0.15) 0%, rgba(153, 69, 255, 0.05) 40%, transparent 70%); filter: blur(80px); z-index: 0;"></div>
                
                <div class="global-header" style="position: absolute; top: 0; left: 0; width: 100%; padding: 30px 50px; display: flex; justify-content: space-between; align-items: center; z-index: 50;">
                    <img src="../logos/superteam-white.png" height="20" alt="Superteam">
                    <div style="display: flex; align-items: center; gap: 8px; font-size: 0.75rem; letter-spacing: 2px; font-weight: 600; color: #8e9bb0;">
                        <div style="width: 6px; height: 6px; background-color: #00e1ff; border-radius: 50%; box-shadow: 0 0 10px #00e1ff;"></div> SYSTEMS NOMINAL
                    </div>
                </div>

                <div class="slides-wrapper" style="flex-grow: 1; position: relative; z-index: 10;">
                    <div class="slide active" style="visibility: visible; opacity: 1; transform: translateY(0) scale(1); display: block; position: absolute; inset: 0; padding: 100px 50px 80px 50px; transition: none;">
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
