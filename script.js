const body = document.body;
const dialog = document.querySelector('dialog');
const loader = document.querySelector('.loader');
const apiKey = 'NiNRjQTmXyxC2698onGYqbzDUeQJ4MHpTcoAiWni7DkTnXfvoCpCzqDL';
const perPage = 16;


let currentPage = 1;
let photoIndex = 1;


function showToast(hex) {
    const toast = document.querySelector('.toast');
    toast.classList.add('visible');
    toast.innerText = `Copied ${hex}`;
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.innerText = '';
    }, 1500);
}


function copyPalette(palette) {
    const clipboard = navigator.clipboard;
    clipboard.writeText(palette)
    .then(() => showToast(palette));
}


function downloadImage(image) {
    fetch(image).then(res => res.blob()).then(blob => {
        const anchor = document.createElement('a');
        anchor.href = URL.createObjectURL(blob);
        anchor.download = new Date().getTime();
        document.body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }).catch(() => console.log('Failed to download image'));
}


function closeDialog() {
    dialog.classList.remove('expanded');
    dialog.querySelector('.dialog-container').innerHTML = '';
    body.style.overflow = 'auto';
}


function openDialog(ab, bc, cd, de, ef, fg, gh, hi, ij) {
    body.style.overflow = 'hidden';
    dialog.classList.add('expanded');
    dialog.querySelector('.dialog-container').innerHTML += `
    <div class="dialog-header">
        <i class="material-symbols-rounded">photo_camera</i>
        <h2 id="${ef}">${ab}</h2>
        <button onclick="closeDialog()">
            <i class="material-symbols-rounded">close</i>
        </button>
    </div>
    <div class="dialog-content">
        <img src="${bc}" alt="${cd}" data-height="${gh}" data-width="${fg}">
    </div>
    <div class="dialog-footer">
        <div class="column">
            <a href="${de}" target="_blank">
                <i class="material-symbols-rounded">person</i>
            </a>
        </div>
        <div class="column">
            <a href="${bc}" target="_blank">
                <i class="material-symbols-rounded">open_in_new</i>
            </a>
        </div>
        <div class="column">
            <button data-color="${hi}" onclick="copyPalette('${hi}')">
                <i class="material-symbols-rounded" style="color: ${hi}">launcher_assistant_on</i>
            </button>
        </div>
        <div class="column">
            <button data-img="${bc}" onclick="downloadImage('${bc}')">
                <i class="material-symbols-rounded">download</i>
            </buton>
        </div>
    </div>
    `
}


function createGallery(photos) {
    const ul = document.querySelector('.gallery');
    const gallery = photos.map((photo, i) => {
        const { alt, avg_color, height, id, photographer, photographer_id, photographer_url, src: { large2x }, width } = photo;
        photoIndex++
        i = photoIndex;
        return `
        <li class="item" id="${id}" onclick="openDialog('${photographer}', '${large2x}', '${alt}', '${photographer_url}', '${photographer_id}', '${width}', '${height}', '${avg_color}')">
            <img src="${large2x}" alt="${photographer}">
            <div class="item-details">
                <i class="material-symbols-rounded">photo_camera</i>
                <h3>(${i}) ${photographer}</h3>
            </div>
        </li>
        `
    }).join('');
    ul.innerHTML += `${gallery}`;
}


function getData(url) {
    fetch(url, {
        headers: { Authorization: apiKey }
    }).then(res => res.json()).then(data => {
        createGallery(data.photos);
    }).catch(() => console.log('Error fetching images'))
}


function getMoreData() {
    currentPage++;
    let url = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getData(url);
}


getData(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);


window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 15) {
        loader.classList.add('loading');
        setTimeout(() => {
            loader.classList.remove('loading');
            getMoreData();
        }, 1500);
    }
})