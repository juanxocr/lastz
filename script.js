let currentLang = 'es';
let translations = {};

// Modal para TODOS los avatares (videos + imágenes)
const modal = document.getElementById('imgModal');
const modalImg = document.getElementById('modalImg');
const closeBtn = document.getElementById('closeModal');

function openModal(imgSrc) {
    modalImg.src = imgSrc;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.style.display = 'none';
    document.body.style.overflow = 'auto';
}

// Cerrar modal
closeBtn.addEventListener('click', closeModal);
modal.addEventListener('click', (e) => {
    if (e.target === modal) closeModal();
});

// Al cargar el DOM
document.addEventListener('DOMContentLoaded', () => {
    // Clic en CUALQUIER avatar → abre SU imagen
    document.querySelectorAll('.avatar').forEach(avatar => {
        avatar.addEventListener('click', (e) => {
            e.stopPropagation();
            const imgSrc = avatar.src;
            openModal(imgSrc);
        });
    });

    // Clic en image-container
    document.querySelectorAll('.image-container').forEach(container => {
        container.addEventListener('click', (e) => {
            if (!e.target.closest('.avatar')) {
                const imgSrc = container.querySelector('img').src;
                openModal(imgSrc);
            }
        });
    });
});

// ESC cierra modal
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.style.display === 'block') {
        closeModal();
    }
});

// Detectar idioma del navegador
function detectLanguage() {
    const lang = navigator.language || navigator.userLanguage;
    if (lang.startsWith('es')) return 'es';
    if (lang.startsWith('en')) return 'en';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('pt')) return 'pt';
    return 'es';
}

// Cargar traducciones
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

// Actualizar página
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

// Actualizar botones
function updateButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.lang === currentLang);
    });
}

// Cambiar idioma
document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        const newLang = btn.dataset.lang;
        if (newLang !== currentLang) {
            loadTranslations(newLang);
        }
    });
});

// Inicializar
window.addEventListener('load', () => {
    const defaultLang = detectLanguage();
    loadTranslations(defaultLang);
});
