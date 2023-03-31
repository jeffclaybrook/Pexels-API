const body = document.body;
const gallery = document.querySelector('.gallery');
const dialog = document.querySelector('dialog');
const loader = document.querySelector('.loader');
const apiKey = 'NiNRjQTmXyxC2698onGYqbzDUeQJ4MHpTcoAiWni7DkTnXfvoCpCzqDL';
const perPage = 16;


let currentPage = 1;
let photoIndex = 1;


function showToast(hex) {
    const toast = document.querySelector('.toast');
    toast.classList.add('visible');
    toast.setAttribute('aria-hidden', 'false');
    toast.innerText = `Copied HEX code: ${hex}`;
    setTimeout(() => {
        toast.classList.remove('visible');
        toast.setAttribute('aria-hidden', 'true');
        toast.innerText = '';
    }, 2000);
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
        body.appendChild(anchor);
        anchor.click();
        anchor.remove();
    }).catch(() => console.log('Failed to download image'));
}


function closeDialog() {
    dialog.classList.remove('expanded');
    dialog.setAttribute('aria-hidden', 'true');
    dialog.querySelector('.dialog-container').innerHTML = '';
    body.style.overflow = 'auto';
}


function openDialog(
    ab,
    bc,
    cd,
    de,
    ef,
    fg,
    gh,
    hi,
    ij
) {
    body.style.overflow = 'hidden';
    dialog.setAttribute('aria-hidden', 'false');
    dialog.classList.add('expanded');
    dialog.querySelector('.dialog-container').innerHTML += `
    <div class="dialog-header">
        <i class="material-symbols-rounded">photo_camera</i>
        <h2 id="${ef}">${ab}</h2>
        <button onclick="closeDialog()" aria-label="Close image">
            <i class="material-symbols-rounded">close</i>
        </button>
    </div>
    <div class="dialog-content">
        <img src="${bc}" alt="${cd}" data-height="${gh}" data-width="${fg}">
    </div>
    <div class="dialog-footer">
        <div class="column">
            <a href="${de}" target="_blank" aria-label="Photographer profile">
                <i class="material-symbols-rounded">person</i>
            </a>
        </div>
        <div class="column">
            <a href="${ij}" target="_blank" aria-label="Open image in new tab">
                <i class="material-symbols-rounded">open_in_new</i>
            </a>
        </div>
        <div class="column">
            <button data-color="${hi}" onclick="copyPalette('${hi}')" aria-label="Copy HEX code">
                <i class="material-symbols-rounded" style="color: ${hi}">launcher_assistant_on</i>
            </button>
        </div>
        <div class="column">
            <button data-img="${bc}" onclick="downloadImage('${bc}')" aria-label="Download image">
                <i class="material-symbols-rounded">download</i>
            </buton>
        </div>
    </div>
    `;
}


function createGallery(data) {
    const items = data.map(item => {
        const {
            id,
            width,
            height,
            url,
            photographer,
            photographer_url,
            photographer_id,
            avg_color,
            src,
            alt
        } = item;
        const {
            large2x,
            large,
            medium,
            small,
            landscape
        } = src;
        return `
        <li
            class="item"
            onclick="openDialog(
                '${photographer}',
                '${large2x}',
                '${alt}',
                '${photographer_url}',
                '${photographer_id}',
                '${width}',
                '${height}',
                '${avg_color}',
                '${url}'
            )"
        >
            <img
                alt="${alt}"
                id="${id}"
                data-width="${width}"
                data-height="${height}"
                data-url="${url}"
                data-avg_color="${avg_color}"
                src="${large2x}"
                srcset="
                    ${large2x},
                    ${large},
                    ${medium},
                    ${small},
                    ${landscape}
                "
            >
            <div class="item-details">
                <i class="material-symbols-rounded">photo_camera</i>
                <h3
                    data-photographer="${photographer}"
                    data-photographer_url="${photographer_url}"
                    data-photographer_id="${photographer_id}"
                >${photographer}</h3>
            </div>
        </li>
        `
    }).join('');
    gallery.innerHTML += `${items}`;
}


async function getData(url) {
    const settings = {
        headers: { Authorization: apiKey }
    };
    try {
        const res = await fetch(url, settings);
        const data = await res.json();
        createGallery(data.photos);
    } catch {
        console.log('Error fetching data');
    }
}


async function getMoreData() {
    currentPage++;
    let url = `https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`;
    getData(url);
}


getData(`https://api.pexels.com/v1/curated?page=${currentPage}&per_page=${perPage}`);


window.addEventListener('scroll', () => {
    if (window.scrollY + window.innerHeight >= document.body.offsetHeight - 15) {
        loader.classList.add('loading');
        loader.innerHTML = `<div class="dots"></div>`
        setTimeout(() => {
            loader.classList.remove('loading');
            loader.innerHTML = '';
            getMoreData();
        }, 1500);
    }
})