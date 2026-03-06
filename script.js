// 1. Cambio de estilo del Header al hacer scroll
window.addEventListener('scroll', () => {
    const header = document.getElementById('main-header');
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// 2. Menú Móvil
const menuToggle = document.querySelector('.mobile-menu-toggle');
const menuClose = document.querySelector('.mobile-menu-close');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-item');

function toggleMenu() {
    if (navLinks) navLinks.classList.toggle('active');
}

if (menuToggle) menuToggle.addEventListener('click', toggleMenu);
if (menuClose) menuClose.addEventListener('click', toggleMenu);

// Cerrar el menú al hacer clic en un enlace (ideal para celulares)
navItems.forEach(item => {
    item.addEventListener('click', () => {
        if (window.innerWidth <= 768 && navLinks) {
            navLinks.classList.remove('active');
        }
    });
});

// 3. Animación de aparición (Reveal)
const observerOptions = { threshold: 0.1 };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// 4. Scroll Suave
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;

        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// 5. Formulario Interactivo de Cotización
const projectTypeRadios = document.querySelectorAll('input[name="projectType"]');
const dynamicFieldsContainer = document.getElementById('dynamic-fields-container');
const quoteForm = document.getElementById('quoteForm');

const dynamicFields = {
    'reforma': `
        <div class="input-group">
            <label>Ambientes a remodelar</label>
            <input type="text" name="ambientes_remodelar" placeholder="Ej: Cocina y 2 Baños" required>
        </div>
        <div class="input-group">
            <label>Metros cuadrados (aprox)</label>
            <input type="number" name="metros_cuadrados" placeholder="Ej: 45" required>
        </div>
    `,
    'obra-nueva': `
        <div class="input-group">
            <label>Ubicación del terreno</label>
            <input type="text" name="ubicacion_terreno" placeholder="Ej: Pilar, Buenos Aires" required>
        </div>
        <div class="input-group">
            <label>Metros cuadrados a construir</label>
            <input type="number" name="superficie_m2" placeholder="Ej: 150" required>
        </div>
    `,
    'interiorismo': `
        <div class="input-group">
            <label>Estilo buscado</label>
            <input type="text" name="estilo_interiorismo" placeholder="Ej: Minimalista cálido" required>
        </div>
        <div class="input-group">
            <label>¿Cuántos ambientes?</label>
            <input type="number" name="cantidad_ambientes" placeholder="Ej: 3" required>
        </div>
    `
};

if (projectTypeRadios.length > 0 && dynamicFieldsContainer) {
    projectTypeRadios.forEach(radio => {
        radio.addEventListener('change', (e) => {
            const type = e.target.value;

            // Animación suave de transición entre campos
            dynamicFieldsContainer.style.opacity = 0;
            setTimeout(() => {
                dynamicFieldsContainer.innerHTML = dynamicFields[type];
                dynamicFieldsContainer.style.opacity = 1;
            }, 300);
        });
    });
}

if (quoteForm) {
    quoteForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = quoteForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Enviando solicitud...";
        btn.disabled = true;

        const formData = new FormData(quoteForm);
        let response;

        try {
            response = await fetch(quoteForm.action, {
                method: quoteForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const quoteIntro = document.getElementById('quote-intro');

                // Animación de salida del formulario
                quoteForm.style.transition = "opacity 0.4s ease";
                quoteForm.style.opacity = 0;
                if (quoteIntro) {
                    quoteIntro.style.transition = "opacity 0.4s ease";
                    quoteIntro.style.opacity = 0;
                }

                setTimeout(() => {
                    quoteForm.style.display = "none";
                    if (quoteIntro) quoteIntro.style.display = "none";

                    const successState = document.getElementById('success-state');
                    if (successState) successState.style.display = "block";
                    quoteForm.reset();
                }, 400);

            } else {
                btn.style.background = "#e74c3c";
                btn.style.color = "white";
                btn.innerText = "Error en el servidor. Intentá de nuevo.";
            }
        } catch (error) {
            btn.style.background = "#e74c3c";
            btn.style.color = "white";
            btn.innerText = "Ocurrió un error inesperado.";
        }

        // Restaurar el botón si hubo error
        if (!response || !response.ok) {
            setTimeout(() => {
                btn.innerText = originalText;
                btn.style.background = "";
                btn.style.color = "";
                btn.disabled = false;
            }, 4000);
        }
    });
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button');
        const originalText = btn.innerText;
        btn.innerText = "Enviando...";
        btn.disabled = true;

        const formData = new FormData(contactForm);
        let response;

        try {
            response = await fetch(contactForm.action, {
                method: contactForm.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                const successMsg = document.getElementById('contact-success');
                if (successMsg) successMsg.style.display = "block";
                contactForm.reset();
                setTimeout(() => {
                    if (successMsg) successMsg.style.display = "none";
                }, 5000);
            } else {
                btn.style.background = "#e74c3c";
                btn.style.color = "white";
                btn.innerText = "Error. Intentá de nuevo.";
            }
        } catch (error) {
            btn.style.background = "#e74c3c";
            btn.style.color = "white";
            btn.innerText = "Error inesperado.";
        }

        // Restaurar botón (por si hubo error, o incluso si fue exitoso para poder enviar otro luego de unos segundos)
        setTimeout(() => {
            btn.innerText = originalText;
            btn.style.background = "";
            btn.style.color = "";
            btn.disabled = false;
        }, 4000);
    });
}

// 6. Horizontal Scroll Timeline Logic (Adaptable Mobile/Desktop)
const processScrollArea = document.querySelector('.process-scroll-area');
const timelineTrack = document.getElementById('timelineTrack');
const hItems = document.querySelectorAll('.h-item');
const progressFill = document.getElementById('timelineProgressFill');

if (processScrollArea && timelineTrack) {
    window.addEventListener('scroll', () => {
        // LÓGICA MÓVIL: Evita el movimiento horizontal y activa las tarjetas al bajar
        if (window.innerWidth <= 768) {
            timelineTrack.style.transform = 'none';
            if (progressFill) progressFill.style.width = '0%';

            hItems.forEach(item => {
                const itemRect = item.getBoundingClientRect();
                // Activar tarjeta cuando entra en el 80% superior de la pantalla
                if (itemRect.top < window.innerHeight * 0.8) {
                    item.classList.add('active');
                }
            });
            return;
        }

        // LÓGICA DESKTOP: Movimiento horizontal atado al scroll
        const rect = processScrollArea.getBoundingClientRect();
        const start = rect.top;
        const end = rect.bottom - window.innerHeight;
        const maxScroll = rect.height - window.innerHeight;

        if (start <= 0 && end >= 0) {
            const progress = Math.abs(start) / maxScroll;
            const trackWidth = timelineTrack.scrollWidth;
            const maxTranslate = trackWidth - window.innerWidth;

            timelineTrack.style.transform = `translateX(-${progress * maxTranslate}px)`;
            if (progressFill) progressFill.style.width = `${progress * 100}%`;
        } else if (start > 0) {
            timelineTrack.style.transform = `translateX(0px)`;
            if (progressFill) progressFill.style.width = `0%`;
        } else if (end < 0) {
            const trackWidth = timelineTrack.scrollWidth;
            const maxTranslate = trackWidth - window.innerWidth;
            timelineTrack.style.transform = `translateX(-${maxTranslate}px)`;
            if (progressFill) progressFill.style.width = `100%`;
        }

        // Activar tarjetas al pasar por el centro de la pantalla (Desktop)
        hItems.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const itemCenter = itemRect.left + (itemRect.width / 2);

            if (itemCenter > window.innerWidth * 0.35 && itemCenter < window.innerWidth * 0.65) {
                item.classList.add('active');
            } else {
                item.classList.remove('active');
            }
        });
    });
}

// 7. Lightbox de Galería
const masonryItems = document.querySelectorAll('.masonry-item img');

if (masonryItems.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-modal';

    const lightboxImg = document.createElement('img');
    lightboxImg.className = 'lightbox-content';

    const closeBtn = document.createElement('span');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '&times;';

    lightbox.appendChild(closeBtn);
    lightbox.appendChild(lightboxImg);
    document.body.appendChild(lightbox);

    const closeLightbox = () => {
        lightbox.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    masonryItems.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    closeBtn.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) {
            closeLightbox();
        }
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}