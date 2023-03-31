const gallery = document.querySelector('.gallery');
const dialog = document.querySelector('dialog');
const loader = document.querySelector('.loader');
const apiKey = 'NiNRjQTmXyxC2698onGYqbzDUeQJ4MHpTcoAiWni7DkTnXfvoCpCzqDL';
const perPage = 16;


let currentPage = 0;


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


function openDialog(a, b, c, d, e, f, g) {
    document.body.style.overflow = 'hidden';
    dialog.classList.add('expanded');
    dialog.querySelector('.dialog-container').innerHTML += `
    <div class="dialog-header">
        <i class="material-symbols-rounded">photo_camera</i>
        <h2>${a}</h2>
        <button onclick="closeDialog()"><i class="material-symbols-rounded">close</i></button>
    </div>
    <div class="dialog-content">
        <img src="${b}" alt="${c}">
    </div>
    <div class="dialog-footer">
        <div class="column">
            <a href="${d}" target="_blank">${a}</a>
            <h4>${e}x${f}</h4>
            <div class="flex">
                <h4>${g}</h4>
                <span style="background-color: ${g}"></span>
            </div>
        </div>
        <div class="column">
            <div class="flex">
                <button id="download-btn" data-img="${b}" onclick="downloadImage('${b}')"><i class="material-symbols-rounded">download</i></button>
                <a href="${b}" target="_blank"><i class="material-symbols-rounded">open_in_new</i></a>
            </div>
        </div>
    </div>
    `;
}


function closeDialog() {
    dialog.classList.remove('expanded');
    dialog.querySelector('.dialog-container').innerHTML = '';
    document.body.style.overflow = 'auto';
}


function createGallery(items) {
    gallery.innerHTML += items.map(item => `
    <li class="item" onclick="openDialog('${item.photographer}', '${item.src.large2x}', '${item.alt}', '${item.photographer_url}', '${item.width}', '${item.height}', '${item.avg_color}')">
        <img src="${item.src.large2x}" alt="${item.name}">
        <div class="item-details">
            <i class="material-symbols-rounded">photo_camera</i>
            <h3>${item.photographer}</h3>
        </div>
    </li>
    `).join('');
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