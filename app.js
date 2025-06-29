const UNSPLASH_TOKEN = "wc1nnfbsEQBb78gZQ8pcTUIGFaNUWOstb163SZrNB2E";
const photoEl = document.getElementById('photo');
const locationEl = document.getElementById('location');

// Определяем ориентацию один раз при загрузке
function getInitialOrientation() {
    return window.innerWidth > window.innerHeight ? 'landscape' : 'portrait';
}

async function loadRandomPhoto() {
    try {
        photoEl.classList.add('fade-out');
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const orientation = getInitialOrientation();
        const apiUrl = `https://api.unsplash.com/photos/random?client_id=${UNSPLASH_TOKEN}&query=nature&orientation=${orientation}&w=1920&h=1080`;
        
        const response = await fetch(apiUrl);
        const data = await response.json();

        const imageUrl = data.urls.regular;
        const location = data.location || {};
        const text = formatLocationText(location);

        await setImageWithFade(imageUrl, text);
        
    } catch (error) {
        handleError(error);
    }
}

// Вспомогательные функции
function formatLocationText(location) {
    const country = location.country || "Неизвестно";
    const city = location.city || "Неизвестно";
    const lat = location.position?.latitude || "?";
    const lon = location.position?.longitude || "?";
    return `${city}, ${country} (${lat}, ${lon})`;
}

async function setImageWithFade(imageUrl, text) {
    const img = new Image();
    img.src = imageUrl;
    await img.decode(); // Ждём загрузки изображения
    
    photoEl.src = imageUrl;
    locationEl.textContent = text;
    photoEl.classList.remove('fade-out');
}

function handleError(error) {
    console.error("Ошибка:", error);
    photoEl.classList.remove('fade-out');
    locationEl.textContent = "Не удалось загрузить фото. Попробуйте позже.";
}

// Инициализация
loadRandomPhoto();
setInterval(loadRandomPhoto, 60000);