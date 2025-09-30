const book = document.querySelector("#book");
const zoomInBtn = document.getElementById("zoom-in");
const zoomOutBtn = document.getElementById("zoom-out");
const fullscreenBtn = document.getElementById("fullscreen");

const paper1 = document.querySelector("#p1");
const paper2 = document.querySelector("#p2");
const paper3 = document.querySelector("#p3");
const paper4 = document.querySelector("#p4");
const progress = document.getElementById("progress-bar");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");

const totalPages = 5; 
let currentPage = 1;

let currentLocation = 1;
let scale = 1;
const numOfPapers = 5;
const maxLocation = numOfPapers + 1;
const isMobile = window.matchMedia("(max-width: 600px)").matches;
const papersMobile = document.querySelectorAll(".paper");
let currentIndexMobile = 0;

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
function updateNavButtons() {
    if (currentPage === 1) {
        prevBtn.style.display = "none";
        nextBtn.style.display = "block"; 
    } else if (currentPage === totalPages) {
        prevBtn.style.display = "block"; 
        nextBtn.style.display = "none";
    } else {
        prevBtn.style.display = "block";
        nextBtn.style.display = "block";
    }
}
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

function updateProgress() {
    const percent = (currentPage / totalPages) * 100;
    progress.style.width = percent + "%";
}
updateNavButtons();

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
            case 4:
                paper4.classList.add("flipped");
                paper4.style.zIndex = 4;
                closeBook(false);
                break;
            default:
                throw new Error("Unknown state");
        }
        currentLocation++;
        if (currentPage < totalPages) currentPage++;
        updateProgress();
        updateNavButtons();
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
            case 5:
                openBook();
                paper4.classList.remove("flipped");
                paper4.style.zIndex = 0;
                break;
            default:
                throw new Error("Unknown state");
        }
        currentLocation--;
        if (currentPage > 1) currentPage--;
        updateProgress();
        updateNavButtons();
    }
}

function goNextMobile() {
    if (currentIndexMobile < papersMobile.length) {
        papersMobile[currentIndexMobile].classList.add("flipped");
        currentIndexMobile++;
        updateNavButtons();
    }
}

function goPrevMobile() {
    if (currentIndexMobile > 0) {
        currentIndexMobile--;
        papersMobile[currentIndexMobile].classList.remove("flipped");
        updateNavButtons();
    }
}
book.addEventListener("click", (e) => {
    const rect = book.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;

    if (isMobile) {
        if(clickX > width / 2) {
            goNextMobile();
        } else {
            goPrevMobile();
        }
    } else {
        if(clickX > width / 2) {
            goNextPage();
        } else {
            goPrevPage();
        }
    }
});

