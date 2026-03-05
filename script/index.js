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

const displayLessons = (allLessons) => {
    const lessonsContainer = document.getElementById("level-container");
    lessonsContainer.innerHTML = "";
    for(let lesson of allLessons) {
        const lessonDiv = document.createElement("div");
        lessonDiv.innerHTML = `
            <div>
                <button class="btn btn-outline btn-primary"><i class="fa-brands fa-leanpub"></i>${lesson.lessonName} - ${lesson.level_no}</button>
            </div>
        `;
        lessonsContainer.appendChild(lessonDiv);
    }
}

loadLessons();