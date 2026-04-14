document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const dotContainer = document.getElementById('dot-indicators');
    let currentSlide = 0;
    
    // Build dots
    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'dot';
        dotContainer.appendChild(dot);
    });
    const dots = document.querySelectorAll('.dot');
    
    const updateSlides = () => {
        slides.forEach((s, i) => {
            if (i === currentSlide) {
                s.classList.add('active');
                dots[i].classList.add('active');
            } else {
                s.classList.remove('active');
                dots[i].classList.remove('active');
            }
        });
    };

    document.addEventListener('keydown', (e) => {
        // Space, Right Arrow, Down Arrow = Next
        if (['ArrowRight', 'Space', ' ', 'ArrowDown'].includes(e.key)) {
            if (currentSlide < slides.length - 1) { 
                currentSlide++; 
                updateSlides(); 
            }
        } 
        // Left Arrow, Up Arrow = Previous
        else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
            if (currentSlide > 0) { 
                currentSlide--; 
                updateSlides(); 
            }
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
            
            cloneCanvas.innerHTML = `
                <div class="slides-wrapper" style="width: 100%; height: 100%">
                    <div class="slide active" style="visibility: visible; opacity: 1; transform: scale(1); display: flex; transition: none;">
                        ${slide.innerHTML}
                    </div>
                </div>
            `;
            
            // Handle the pure white background inversion explicitly for PDF
            if (slide.classList.contains('white-mode-slide')) {
                cloneCanvas.style.backgroundColor = '#f5f5f7';
            }

            printContainer.appendChild(cloneCanvas);
        });
    });

    window.addEventListener('afterprint', () => {
        if (printContainer) printContainer.remove();
        originalCanvas.style.display = 'block'; 
    });
});
