const loadLessons = () => {
    const url = "https://openapi.programming-hero.com/api/levels/all";
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((lessons) => {
            displayLessons(lessons.data);
        })
};

const removeActive = () => {
    const active = document.querySelectorAll(".lesson-btn");
    active.forEach((btn) => {
        btn.classList.remove("active");
    })
};

const loadLevelWords = (id) => {
    manageLoading(true);
    const url = `https://openapi.programming-hero.com/api/level/${id}`;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((words) => {
            removeActive();
            const levelBtn = document.getElementById(`level-${id}`);
            levelBtn.classList.add("active");
            displayWords(words.data);
        })
};

const loadWordDetails = (id) => {
    const url = `https://openapi.programming-hero.com/api/word/${id}`;
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((wordDetails) => {
            displayWordDetails(wordDetails.data);
        })
};

function pronounceWord(word) {
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = "en-EN"; // English
    window.speechSynthesis.speak(utterance);
}

const createElements = (array) => {
    const htmlElements = array.map((item) => {
        const e = `<button class="btn">${item}</button>`;
        return e;
    })
    return htmlElements;
};

const displayWordDetails = (wordDetails) => {
    const modal = document.getElementById("my_modal_5");
    const detailsContainer = document.getElementById("details-container");
    detailsContainer.innerHTML = `
        <div>
            <h2 class="text-2xl font-bold">${wordDetails.word} (<i class="fa-solid fa-microphone-lines"></i> : ${wordDetails.pronunciation})</h2>
        </div>
        <div>
            <h2 class="font-bold">Meaning</h2>
            <p>${wordDetails.meaning}</p>
        </div>
        <div>
            <h2 class="font-bold">Example</h2>
            <p>${wordDetails.sentence}</p>
        </div>
        <div>
            <h2 class="font-bold font-bangla">সমার্থক শব্দ গুলো</h2>
            <div class="flex flex-wrap gap-2">${createElements(wordDetails.synonyms).join("")}</div>
        </div>
    `;
    modal.showModal();
};

const displayLessons = (allLessons) => {
    const lessonsContainer = document.getElementById("level-container");
    lessonsContainer.innerHTML = "";
    for(let lesson of allLessons) {
        const lessonDiv = document.createElement("div");
        lessonDiv.innerHTML = `
            <div>
                <button id="level-${lesson.level_no}" onclick="loadLevelWords(${lesson.level_no})" class="btn btn-outline btn-primary lesson-btn"><i class="fa-brands fa-leanpub"></i>${lesson.lessonName} - ${lesson.level_no}</button>
            </div>
        `;
        lessonsContainer.appendChild(lessonDiv);
    }
}

const displayWords = (allWords) => {
    const wordsContainer = document.getElementById("word-container");
    wordsContainer.innerHTML = "";

    if(allWords.length === 0) {
        wordsContainer.innerHTML = `
            <div class="flex flex-col items-center justify-center col-span-full py-10 space-y-6">
                <img src="./assets/alert-error.png" alt="">
                <p class="text-xl font-bangla font-medium text-[#79716B]">এই Lesson এ এখনো কোন Vocabulary যুক্ত করা হয়নি।</p>
                <h2 class="font-bold text-4xl font-bangla">নেক্সট Lesson এ যান</h2>
            </div>
        `;
        manageLoading(false);
        return;
    }

    allWords.forEach((words) => {
        const wordDiv = document.createElement("div");
        wordDiv.innerHTML = `
            <div class="bg-white rounded-xl shadow-sm text-center py-10 px-5 space-y-4">
                <h2 class="font-bold text-2xl">${words.word ? words.word : "শব্দ পাওয়া যায়নি"}</h2>
                <p class="font-semibold">Meaning / Pronunciation</p>
                <div class="text-2xl font-medium font-bangla">"${words.meaning ? words.meaning : "অর্থ পাওয়া যায়নি"} / ${words.pronunciation ? words.pronunciation : "উচ্চারণ পাওয়া যায়নি"}"</div>
                <div class="flex justify-between items-center">
                    <button onclick="loadWordDetails(${words.id})" class="btn"><i class="fa-solid fa-circle-info"></i></button>
                    <button onclick="pronounceWord('${words.word}')" class="btn"><i class="fa-solid fa-volume"></i></button>
                </div>
            </div>
        `;
        wordsContainer.appendChild(wordDiv);
    });

    manageLoading(false);
}

const manageLoading = (status) => {
    const loadingContainer = document.getElementById("loading-container");
    if(status) {
        loadingContainer.classList.remove("hidden");
        document.getElementById("word-container").classList.add("hidden");
    } else {
        loadingContainer.classList.add("hidden");
        document.getElementById("word-container").classList.remove("hidden");
    }
};

loadLessons();

document.getElementById("btn-search").addEventListener("click", () => {
    removeActive();
    manageLoading(true);
    let inputValue = document.getElementById("input-search").value;
    inputValue = inputValue.toLowerCase().trim();

    const url = "https://openapi.programming-hero.com/api/words/all";
    fetch(url)
        .then((response) => {
            return response.json();
        })
        .then((words) => {
            const allWords = words.data;
            const filteredWords = allWords.filter((word) => {
                const wordName = word.word.toLowerCase().includes(inputValue);
                return wordName;
            });
            displayWords(filteredWords);
        })
});



//my_modal_5.showModal()