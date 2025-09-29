const book = document.querySelector("#book");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const fullscreenBtn = document.getElementById("fullscreen");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const paper3 = document.querySelector("#p3");

let currentLocation = 1;
let scale = 1;
const numOfPapers = 6;
const maxLocation = numOfPapers + 1;

// detect mobile
const isMobile = window.matchMedia("(max-width: 600px)").matches;

// daftar semua kertas untuk mobile (p1, b1, p2, b2, p3, b3)
const papersMobile = document.querySelectorAll(".paper");
let currentIndexMobile = 0;

// === Zoom & Fullscreen ===
zoomInBtn.addEventListener("click", () => {
    scale += 0.1;
    book.style.transform = `scale(${scale})`;
});

zoomOutBtn.addEventListener("click", () => {
    scale = Math.max(0.5, scale - 0.1);
    book.style.transform = `scale(${scale})`;
});

fullscreenBtn.addEventListener("click", () => {
    if (!document.fullscreenElement) {
        document.documentElement.requestFullscreen();
    } else {
        document.exitFullscreen();
    }
});

// === Desktop Logic ===
function openBook() {
    book.style.transform = "translateX(50%)";
}

function closeBook(isAtBeginning) {
    if(isAtBeginning) {
        book.style.transform = "translateX(0%)";
    } else {
        book.style.transform = "translateX(100%)";
    }
}

function updateBookShadow() {
    book.classList.remove("shadow-1", "shadow-2", "shadow-3", "shadow-4", "shadow-5", "shadow-6");
    let openPages = currentLocation - 1;
    openPages = Math.min(openPages, 6);

    if (openPages > 0) {
        book.classList.add(`shadow-${openPages}`);
    }
}

function goNextPage() {
    if(currentLocation < maxLocation) {
        switch(currentLocation) {
            case 1:
                openBook();
                paper1.classList.add("flipped");
                paper1.style.zIndex = 1;
                break;
            case 2:
                paper2.classList.add("flipped");
                paper2.style.zIndex = 2;
                break;
            case 3:
                paper3.classList.add("flipped");
                paper3.style.zIndex = 3;
                closeBook(false);
                break;
            default:
                throw new Error("Unknown state");
        }
        currentLocation++;
    }
}

function goPrevPage() {
    if(currentLocation > 1) {
        switch(currentLocation) {
            case 2:
                closeBook(true);
                paper1.classList.remove("flipped");
                paper1.style.zIndex = 3;
                break;
            case 3:
                paper2.classList.remove("flipped");
                paper2.style.zIndex = 2;
                break;
            case 4:
                openBook();
                paper3.classList.remove("flipped");
                paper3.style.zIndex = 1;
                break;
            default:
                throw new Error("Unknown state");
        }
        currentLocation--;
    }
}

// === Mobile Logic ===
function goNextMobile() {
    if (currentIndexMobile < papersMobile.length) {
        papersMobile[currentIndexMobile].classList.add("flipped");
        currentIndexMobile++;
    }
}

function goPrevMobile() {
    if (currentIndexMobile > 0) {
        currentIndexMobile--;
        papersMobile[currentIndexMobile].classList.remove("flipped");
    }
}

// === Detect click position (Desktop vs Mobile) ===
book.addEventListener("click", (e) => {
    const rect = book.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (isMobile) {
        if(clickX > width / 2) {
            goNextMobile(); // klik kanan di mobile
        } else {
            goPrevMobile(); // klik kiri di mobile
        }
    } else {
        if(clickX > width / 2) {
            goNextPage(); // klik kanan di desktop
        } else {
            goPrevPage(); // klik kiri di desktop
        }
    }
});
