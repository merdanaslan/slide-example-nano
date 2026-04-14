document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    let currentSlide = 0;
    
    const progressBar = document.getElementById('progress-bar');
    
    const updateProgress = () => {
        // Linearly scales the line based on progression percentage
        const pct = ((currentSlide + 1) / slides.length) * 100;
        progressBar.style.width = `${pct}%`;
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
        if (e.key === 'ArrowRight' || e.key === 'Space') {
            if (currentSlide < slides.length - 1) { currentSlide++; updateSlides(); }
        } else if (e.key === 'ArrowLeft') {
            if (currentSlide > 0) { currentSlide--; updateSlides(); }
        }
    });

    // Boot up
    updateSlides();

    // ==========================================
    // PDF EXPORT HOOKS
    // ==========================================
    let printContainer = null;
    let originalCanvas = document.querySelector('.canvas');

    window.addEventListener('beforeprint', () => {
        // Safely hide the dynamic interactive viewer entirely
        originalCanvas.style.display = 'none'; 
        
        printContainer = document.createElement('div');
        document.querySelector('.desktop').appendChild(printContainer);

        // Physically render independent native HTML nodes per slide for the print queue
        slides.forEach((slide, index) => {
            const cloneCanvas = document.createElement('div');
            cloneCanvas.className = 'print-canvas';
            
            // Reapply global backgrounds & layout natively inside this explicit PDF container
            cloneCanvas.innerHTML = `
                <div class="ambient-glow ambient-1"></div>
                <div class="ambient-glow ambient-2"></div>
                <div class="ambient-glow ambient-3"></div>
                
                <img src="../logos/superteam-black.png" alt="Superteam Germany" class="brand-logo" />
                
                <div class="slides-wrapper" style="width: 100%; height: 100%">
                    <!-- Actively force visibility since CSS animations are disabled in print media rule -->
                    <div class="slide active" style="transition: none; opacity: 1; visibility: visible; display: block; height: 100%;">
                        ${slide.innerHTML}
                    </div>
                </div>

                <div class="progress-container">
                    <div class="progress-bar" style="width: ${((index + 1) / slides.length) * 100}%; transition: none;"></div>
                </div>
            `;
            
            // Clean up dark mode artifacts if the slide is specifically meant to be inverted
            if(slide.classList.contains('dark-mode-slide')){
                cloneCanvas.style.backgroundColor = '#0b0f19';
                let logo = cloneCanvas.querySelector('.brand-logo');
                if(logo) logo.remove(); // Removed black logo to avoid blending in to the dark background
            }

            printContainer.appendChild(cloneCanvas);
        });
    });

    window.addEventListener('afterprint', () => {
        // Destroy PDF scaffolds and resurrect dynamic web component
        if (printContainer) printContainer.remove();
        originalCanvas.style.display = 'flex'; 
    });
});
