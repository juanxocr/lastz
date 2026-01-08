let currentLang = 'es';
let translations = {};

// --- Lógica del Modal para AVATARES ---
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementById('closeModal');

function openModal(imgSrc) {
    if (modalImg) modalImg.src = imgSrc;
    if (modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }
}

function closeModal() {
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

if (closeBtn) closeBtn.addEventListener('click', closeModal);
if (modal) {
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
}

// --- Eventos al cargar ---
document.addEventListener('DOMContentLoaded', () => {
    
    // 1. Clic en avatares abre modal de imagen
    document.querySelectorAll('.avatar').forEach(avatar => {
        avatar.addEventListener('click', (e) => {
            e.stopPropagation();
            openModal(avatar.src);
        });
    });

    // 2. Clic en imagen de contenedor (si la hay)
    document.querySelectorAll('.image-container').forEach(container => {
        container.addEventListener('click', (e) => {
            if (!e.target.closest('.avatar')) {
                const img = container.querySelector('img');
                if (img) openModal(img.src);
            }
        });
    });

    // 3. Cerrar modales con tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal && modal.style.display === 'block') {
            closeModal();
        }
    });

    // NOTA: El botón Upload ya funciona solo con HTML (href + target="_blank")
    // no requiere código JS extra aquí.
});

// --- Lógica de IDIOMAS ---
function detectLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('pt')) return 'pt';
    return 'es';
}

async function loadTranslations(lang) {
    try {
        const response = await fetch('languages.json');
        translations = await response.json();
        currentLang = lang;
        updatePage();
        updateButtons();
    } catch (error) {
        console.error('Error loading languages:', error);
    }
}

function updatePage() {
    document.querySelectorAll('[data-translate]').forEach(el => {
        const key = el.getAttribute('data-translate');
        if (translations[currentLang] && translations[currentLang][key]) {
            if (key.includes('heroes_list.')) {
                const index = key.split('.')[1];
                el.textContent = translations[currentLang].heroes_list[index];
            } else {
                el.textContent = translations[currentLang][key];
            }
        }
    });
    document.documentElement.lang = currentLang;
    document.title = translations[currentLang]?.title || 'Guardians Of Dawns';
}

function updateButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        // Solo aplicar "active" a botones que tengan data-lang (idiomas), no al upload
        if (btn.dataset.lang) {
            btn.classList.toggle('active', btn.dataset.lang === currentLang);
        }
    });
}

// Eventos clic en botones de idioma
document.querySelectorAll('.lang-btn').forEach(btn => {
    if (btn.dataset.lang) {
        btn.addEventListener('click', () => {
            const newLang = btn.dataset.lang;
            if (newLang !== currentLang) {
                loadTranslations(newLang);
            }
        });
    }
});

// Inicializar
window.addEventListener('load', () => {
    const defaultLang = detectLanguage();
    loadTranslations(defaultLang);
});
