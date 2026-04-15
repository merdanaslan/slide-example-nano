document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.slide');
    const navDotsContainer = document.getElementById('nav-dots');
    const navLabel = document.getElementById('nav-label');
    let current = 0;

    slides.forEach((_, i) => {
        const dot = document.createElement('div');
        dot.className = 'nav-dot-item';
        dot.addEventListener('click', () => { current = i; update(); });
        navDotsContainer.appendChild(dot);
    });

    const update = () => {
        slides.forEach(s => s.classList.remove('active'));
        setTimeout(() => slides[current].classList.add('active'), 10);
        navDotsContainer.querySelectorAll('.nav-dot-item').forEach((d, i) => d.classList.toggle('active', i === current));
        if (navLabel) navLabel.textContent = `${(current+1).toString().padStart(2,'0')} / ${slides.length.toString().padStart(2,'0')}`;
    };

    document.addEventListener('keydown', e => {
        if (['ArrowRight','Space',' ','ArrowDown'].includes(e.key) && current < slides.length - 1) { current++; update(); }
        else if (['ArrowLeft','ArrowUp'].includes(e.key) && current > 0) { current--; update(); }
    });

    update();

    let printContainer = null;
    const originalCanvas = document.querySelector('.canvas');
    window.addEventListener('beforeprint', () => {
        originalCanvas.style.display = 'none';
        printContainer = document.createElement('div');
        document.querySelector('.desktop').appendChild(printContainer);
        slides.forEach((slide, idx) => {
            const isDivider = slide.classList.contains('slide-divider');
            const isHero = slide.classList.contains('slide-hero');
            const bg = isDivider ? '#1D1D1F' : '#F5F5F7';
            const color = isDivider ? '#fff' : '#1D1D1F';
            const clone = document.createElement('div');
            clone.className = 'print-canvas';
            clone.style.cssText = `break-after:page; page-break-after:always; width:100vw; height:100vh; display:flex; flex-direction:column; background:${bg}; border-radius:0;`;
            clone.innerHTML = `
                <div style="padding:28px 60px; display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid rgba(255,255,255,0.15); font-family:'Inter',sans-serif; font-size:0.75rem; font-weight:600; color:${isDivider ? 'rgba(255,255,255,0.4)' : '#6E6E73'}; letter-spacing:0.15em;">
                    <span>SUPERTEAM</span><span>${(idx+1).toString().padStart(2,'0')} / ${slides.length.toString().padStart(2,'0')}</span>
                </div>
                <div style="flex-grow:1; position:relative; color:${color};"><div style="position:absolute; inset:0; padding:60px 90px; display:flex; flex-direction:column; justify-content:center;">${slide.innerHTML}</div></div>`;
            printContainer.appendChild(clone);
        });
    });
    window.addEventListener('afterprint', () => { if (printContainer) printContainer.remove(); originalCanvas.style.display = 'flex'; });
});
