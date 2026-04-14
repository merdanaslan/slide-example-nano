document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const termLoader = document.getElementById('terminal-loader');
    let currentSlide = 0;
    
    // Create an ASCII loading bar generator
    const updateLoader = () => {
        const total = slides.length;
        const progress = currentSlide + 1;
        const barLength = 20;
        const filled = Math.round((progress / total) * barLength);
        const empty = barLength - filled;
        
        const barStr = '█'.repeat(filled) + '░'.repeat(empty);
        const pct = Math.round((progress / total) * 100);
        
        termLoader.textContent = `[STATE] ${barStr} ${pct}%`;
    };

    const updateSlides = () => {
        slides.forEach((s, i) => {
            if (i === currentSlide) {
                s.classList.add('active');
            } else {
                s.classList.remove('active');
            }
        });
        updateLoader();
    };

    document.addEventListener('keydown', (e) => {
        if (['ArrowRight', 'Space', ' ', 'ArrowDown'].includes(e.key)) {
            if (currentSlide < slides.length - 1) { currentSlide++; updateSlides(); }
        } else if (['ArrowLeft', 'ArrowUp'].includes(e.key)) {
            if (currentSlide > 0) { currentSlide--; updateSlides(); }
        }
    });

    // Boot
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

        // Native re-assembly for landscape printing
        slides.forEach((slide) => {
            const cloneCanvas = document.createElement('div');
            cloneCanvas.className = 'print-canvas';
            
            // For the hacker theme, inject the static sideline UI inline for the PDF renderer
            cloneCanvas.innerHTML = `
                <div class="sidebar-lines" style="border-right: 1px solid #21262d; text-align: right; font-size: 1.1rem; line-height: 1.8; color: #484f58; padding: 30px 15px 30px 0; width: 60px;">
                    1<br>2<br>3<br>4<br>5<br>6<br>7<br>8<br>9<br>10<br>11<br>12<br>13<br>14<br>15<br>16<br>17<br>18<br>19<br>20
                </div>
                <div class="slides-wrapper" style="flex-grow: 1; position: relative;">
                    <div class="slide active" style="visibility: visible; opacity: 1; display: block; position: relative;">
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
