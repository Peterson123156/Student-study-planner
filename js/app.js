/* =========================================================
   STUDYFLOW
   COMPLETE JAVASCRIPT APPLICATION
========================================================= */


/* =========================================================
   1. STORAGE KEYS
========================================================= */

const STORAGE_KEYS = {
    subjects: "studyflow_subjects",
    schedules: "studyflow_schedules",
    assignments: "studyflow_assignments",
    goals: "studyflow_goals",
    theme: "studyflow_theme"
};


/* =========================================================
   2. GENERAL STORAGE FUNCTIONS
========================================================= */

function getData(key) {
    try {
        const data = localStorage.getItem(key);

        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error("Unable to read saved data:", error);

        return [];
    }
}


function saveData(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
        console.error("Unable to save data:", error);
    }
}


/* =========================================================
   3. GENERATE UNIQUE IDs
========================================================= */

function generateId() {
    return Date.now().toString() + Math.random().toString(36).substring(2, 9);
}


/* =========================================================
   4. PAGE INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    initializeTheme();

    initializeSubjects();

    initializeSchedules();

    initializeAssignments();

    initializeGoals();

    initializeProgress();

    initializeSettings();

    updateHomepage();

});


/* =========================================================
   5. SUBJECTS
========================================================= */

function initializeSubjects() {

    const form = document.getElementById("subjectForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();

        const input = document.getElementById("subjectInput");

        if (!input) {
            return;
        }


        const subjectName = input.value.trim();


        if (subjectName === "") {

            alert("Please enter a subject name.");

            return;
        }


        const subjects = getData(STORAGE_KEYS.subjects);


        const duplicate = subjects.some(function (subject) {

            return subject.name.toLowerCase() === subjectName.toLowerCase();

        });


        if (duplicate) {

            alert("This subject has already been added.");

            return;
        }


        const newSubject = {
            id: generateId(),
            name: subjectName,
            createdAt: new Date().toISOString()
        };


        subjects.push(newSubject);


        saveData(STORAGE_KEYS.subjects, subjects);


        input.value = "";


        displaySubjects();

    });


    displaySubjects();
}


/* =========================================================
   DISPLAY SUBJECTS
========================================================= */

function displaySubjects() {

    const list = document.getElementById("subjectList");

    if (!list) {
        return;
    }


    const subjects = getData(STORAGE_KEYS.subjects);


    list.innerHTML = "";


    if (subjects.length === 0) {

        list.innerHTML = `
            <div class="empty-message">
                <h3>No subjects added yet 📚</h3>
                <p>Add your first subject using the form above.</p>
            </div>
        `;

        return;
    }


    subjects.forEach(function (subject) {

        const item = document.createElement("div");

        item.className = "subject-item";


        item.innerHTML = `

            <div class="subject-name">

                <span>📚</span>

                <h3>${escapeHTML(subject.name)}</h3>

            </div>

            <button
                class="delete-btn"
                onclick="deleteSubject('${subject.id}')"
            >
                Delete
            </button>

        `;


        list.appendChild(item);

    });

}


/* =========================================================
   DELETE SUBJECT
========================================================= */

function deleteSubject(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this subject?"
    );


    if (!confirmed) {
        return;
    }


    let subjects = getData(STORAGE_KEYS.subjects);


    subjects = subjects.filter(function (subject) {

        return subject.id !== id;

    });


    saveData(STORAGE_KEYS.subjects, subjects);


    displaySubjects();

    updateProgress();

}


/* =========================================================
   6. SCHEDULE
========================================================= */

function initializeSchedules() {

    const form = document.getElementById("scheduleForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const subjectInput =
            document.getElementById("scheduleSubject");

        const dayInput =
            document.getElementById("scheduleDay");

        const timeInput =
            document.getElementById("scheduleTime");


        if (!subjectInput || !dayInput || !timeInput) {
            return;
        }


        const subject = subjectInput.value.trim();

        const day = dayInput.value;

        const time = timeInput.value;


        if (!subject || !day || !time) {

            alert("Please complete all schedule fields.");

            return;
        }


        const schedules = getData(STORAGE_KEYS.schedules);


        const newSchedule = {

            id: generateId(),

            subject: subject,

            day: day,

            time: time,

            createdAt: new Date().toISOString()

        };


        schedules.push(newSchedule);


        saveData(STORAGE_KEYS.schedules, schedules);


        subjectInput.value = "";

        dayInput.value = "";

        timeInput.value = "";


        displaySchedules();

    });


    displaySchedules();

}


/* =========================================================
   DISPLAY SCHEDULES
========================================================= */

function displaySchedules() {

    const list = document.getElementById("scheduleList");

    if (!list) {
        return;
    }


    const schedules = getData(STORAGE_KEYS.schedules);


    list.innerHTML = "";


    if (schedules.length === 0) {

        list.innerHTML = `
            <div class="empty-message">
                <h3>No study sessions yet 📅</h3>
                <p>Create your first study session above.</p>
            </div>
        `;

        return;
    }


    const dayOrder = {
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6,
        Sunday: 7
    };


    schedules.sort(function (a, b) {

        const dayDifference =
            dayOrder[a.day] - dayOrder[b.day];


        if (dayDifference !== 0) {
            return dayDifference;
        }


        return a.time.localeCompare(b.time);

    });


    schedules.forEach(function (schedule) {

        const item = document.createElement("div");

        item.className = "schedule-item";


        item.innerHTML = `

            <div>

                <h3>
                    📚 ${escapeHTML(schedule.subject)}
                </h3>

                <p>
                    ${escapeHTML(schedule.day)}
                    •
                    ${formatTime(schedule.time)}
                </p>

            </div>

            <button
                class="delete-btn"
                onclick="deleteSchedule('${schedule.id}')"
            >
                Delete
            </button>

        `;


        list.appendChild(item);

    });

}


/* =========================================================
   DELETE SCHEDULE
========================================================= */

function deleteSchedule(id) {

    const confirmed = confirm(
        "Delete this study session?"
    );


    if (!confirmed) {
        return;
    }


    let schedules = getData(STORAGE_KEYS.schedules);


    schedules = schedules.filter(function (schedule) {

        return schedule.id !== id;

    });


    saveData(STORAGE_KEYS.schedules, schedules);


    displaySchedules();

}


/* =========================================================
   7. ASSIGNMENTS
========================================================= */

function initializeAssignments() {

    const form = document.getElementById("assignmentForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const titleInput =
            document.getElementById("assignmentTitle");

        const subjectInput =
            document.getElementById("assignmentSubject");

        const deadlineInput =
            document.getElementById("assignmentDeadline");


        if (!titleInput || !subjectInput || !deadlineInput) {
            return;
        }


        const title = titleInput.value.trim();

        const subject = subjectInput.value.trim();

        const deadline = deadlineInput.value;


        if (!title || !subject || !deadline) {

            alert("Please complete all assignment fields.");

            return;
        }


        const assignments =
            getData(STORAGE_KEYS.assignments);


        const newAssignment = {

            id: generateId(),

            title: title,

            subject: subject,

            deadline: deadline,

            completed: false,

            createdAt: new Date().toISOString()

        };


        assignments.push(newAssignment);


        saveData(
            STORAGE_KEYS.assignments,
            assignments
        );


        titleInput.value = "";

        subjectInput.value = "";

        deadlineInput.value = "";


        displayAssignments();

        updateProgress();

    });


    displayAssignments();

}


/* =========================================================
   DISPLAY ASSIGNMENTS
========================================================= */

function displayAssignments() {

    const list =
        document.getElementById("assignmentList");


    if (!list) {
        return;
    }


    const assignments =
        getData(STORAGE_KEYS.assignments);


    list.innerHTML = "";


    if (assignments.length === 0) {

        list.innerHTML = `
            <div class="empty-message">

                <h3>No assignments yet 📝</h3>

                <p>
                    Add your first assignment using the form above.
                </p>

            </div>
        `;

        return;
    }


    assignments.sort(function (a, b) {

        return a.deadline.localeCompare(b.deadline);

    });


    assignments.forEach(function (assignment) {

        const item = document.createElement("div");


        item.className =
            "assignment-item" +
            (assignment.completed ? " completed" : "");


        const deadlineText =
            formatDate(assignment.deadline);


        item.innerHTML = `

            <div class="assignment-info">

                <h3>
                    ${escapeHTML(assignment.title)}
                </h3>

                <p>
                    📚 Subject:
                    ${escapeHTML(assignment.subject)}
                </p>

                <p>
                    📅 Deadline:
                    ${deadlineText}
                </p>

                <p>
                    Status:
                    ${
                        assignment.completed
                        ? "✅ Completed"
                        : "⏳ Pending"
                    }
                </p>

            </div>


            <div class="assignment-actions">

                ${
                    assignment.completed
                    ? `
                        <button
                            class="complete-btn"
                            onclick="toggleAssignment('${assignment.id}')"
                        >
                            Mark Pending
                        </button>
                    `
                    : `
                        <button
                            class="complete-btn"
                            onclick="toggleAssignment('${assignment.id}')"
                        >
                            ✓ Complete
                        </button>
                    `
                }


                <button
                    class="delete-btn"
                    onclick="deleteAssignment('${assignment.id}')"
                >
                    Delete
                </button>

            </div>

        `;


        list.appendChild(item);

    });

}


/* =========================================================
   TOGGLE ASSIGNMENT COMPLETION
========================================================= */

function toggleAssignment(id) {

    const assignments =
        getData(STORAGE_KEYS.assignments);


    const assignment =
        assignments.find(function (item) {

            return item.id === id;

        });


    if (!assignment) {
        return;
    }


    assignment.completed =
        !assignment.completed;


    saveData(
        STORAGE_KEYS.assignments,
        assignments
    );


    displayAssignments();

    updateProgress();

}


/* =========================================================
   DELETE ASSIGNMENT
========================================================= */

function deleteAssignment(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this assignment?"
    );


    if (!confirmed) {
        return;
    }


    let assignments =
        getData(STORAGE_KEYS.assignments);


    assignments = assignments.filter(function (assignment) {

        return assignment.id !== id;

    });


    saveData(
        STORAGE_KEYS.assignments,
        assignments
    );


    displayAssignments();

    updateProgress();

}


/* =========================================================
   8. GOALS
========================================================= */

function initializeGoals() {

    const form = document.getElementById("goalForm");

    if (!form) {
        return;
    }


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        const input =
            document.getElementById("goalInput");


        if (!input) {
            return;
        }


        const goalText =
            input.value.trim();


        if (!goalText) {

            alert("Please enter a goal.");

            return;
        }


        const goals =
            getData(STORAGE_KEYS.goals);


        const newGoal = {

            id: generateId(),

            text: goalText,

            progress: 0,

            createdAt: new Date().toISOString()

        };


        goals.push(newGoal);


        saveData(
            STORAGE_KEYS.goals,
            goals
        );


        input.value = "";


        displayGoals();

    });


    displayGoals();

}


/* =========================================================
   DISPLAY GOALS
========================================================= */

function displayGoals() {

    const list =
        document.getElementById("goalList");


    if (!list) {
        return;
    }


    const goals =
        getData(STORAGE_KEYS.goals);


    list.innerHTML = "";


    if (goals.length === 0) {

        list.innerHTML = `
            <div class="empty-message">

                <h3>No goals yet 🎯</h3>

                <p>
                    Create your first academic goal above.
                </p>

            </div>
        `;

        return;
    }


    goals.forEach(function (goal) {

        const item =
            document.createElement("div");


        item.className = "goal-item";


        item.innerHTML = `

            <h3>
                🎯 ${escapeHTML(goal.text)}
            </h3>


            <p>
                Goal Progress:
                <strong id="goalPercentage-${goal.id}">
                    ${goal.progress}%
                </strong>
            </p>


            <div class="progress-container">

                <div
                    class="progress-bar"
                    id="goalProgressBar-${goal.id}"
                    style="width: ${goal.progress}%"
                >
                </div>

            </div>


            <input
                type="range"
                min="0"
                max="100"
                value="${goal.progress}"
                oninput="updateGoalProgress('${goal.id}', this.value)"
            >


            <div
                style="
                    display:flex;
                    justify-content:space-between;
                    align-items:center;
                    gap:10px;
                    margin-top:10px;
                "
            >

                <span
                    style="
                        color:var(--text-light);
                        font-size:14px;
                    "
                >
                    ${
                        goal.progress >= 100
                        ? "🎉 Goal completed!"
                        : "Keep going!"
                    }
                </span>


                <button
                    class="delete-btn"
                    onclick="deleteGoal('${goal.id}')"
                >
                    Delete
                </button>

            </div>

        `;


        list.appendChild(item);

    });

}


/* =========================================================
   UPDATE GOAL PROGRESS
========================================================= */

function updateGoalProgress(id, value) {

    const goals =
        getData(STORAGE_KEYS.goals);


    const goal =
        goals.find(function (item) {

            return item.id === id;

        });


    if (!goal) {
        return;
    }


    goal.progress =
        Math.min(100, Math.max(0, Number(value)));


    saveData(
        STORAGE_KEYS.goals,
        goals
    );


    const percentage =
        document.getElementById(
            `goalPercentage-${id}`
        );


    const progressBar =
        document.getElementById(
            `goalProgressBar-${id}`
        );


    if (percentage) {

        percentage.textContent =
            `${goal.progress}%`;

    }


    if (progressBar) {

        progressBar.style.width =
            `${goal.progress}%`;

    }

}


/* =========================================================
   DELETE GOAL
========================================================= */

function deleteGoal(id) {

    const confirmed = confirm(
        "Are you sure you want to delete this goal?"
    );


    if (!confirmed) {
        return;
    }


    let goals =
        getData(STORAGE_KEYS.goals);


    goals = goals.filter(function (goal) {

        return goal.id !== id;

    });


    saveData(
        STORAGE_KEYS.goals,
        goals
    );


    displayGoals();

}


/* =========================================================
   9. PROGRESS PAGE
========================================================= */

function initializeProgress() {

    updateProgress();

}


/* =========================================================
   UPDATE ALL PROGRESS STATISTICS
========================================================= */

function updateProgress() {

    const subjects =
        getData(STORAGE_KEYS.subjects);


    const assignments =
        getData(STORAGE_KEYS.assignments);


    const goals =
        getData(STORAGE_KEYS.goals);


    const totalSubjects =
        subjects.length;


    const totalAssignments =
        assignments.length;


    const completedAssignments =
        assignments.filter(function (assignment) {

            return assignment.completed;

        }).length;


    let assignmentProgress = 0;


    if (totalAssignments > 0) {

        assignmentProgress =
            Math.round(
                (completedAssignments /
                totalAssignments) * 100
            );

    }


    const subjectCount =
        document.getElementById("subjectCount");


    const assignmentCount =
        document.getElementById("assignmentCount");


    const completedCount =
        document.getElementById("completedCount");


    const progressPercentage =
        document.getElementById(
            "progressPercentage"
        );


    const overallProgressBar =
        document.getElementById(
            "overallProgressBar"
        );


    if (subjectCount) {

        subjectCount.textContent =
            totalSubjects;

    }


    if (assignmentCount) {

        assignmentCount.textContent =
            totalAssignments;

    }


    if (completedCount) {

        completedCount.textContent =
            completedAssignments;

    }


    if (progressPercentage) {

        progressPercentage.textContent =
            `${assignmentProgress}%`;

    }


    if (overallProgressBar) {

        overallProgressBar.style.width =
            `${assignmentProgress}%`;

    }


    updateHomepage();

}


/* =========================================================
   10. HOMEPAGE
========================================================= */

function updateHomepage() {

    const subjects =
        getData(STORAGE_KEYS.subjects);


    const schedules =
        getData(STORAGE_KEYS.schedules);


    const assignments =
        getData(STORAGE_KEYS.assignments);


    const goals =
        getData(STORAGE_KEYS.goals);


    /*
       These IDs are optional.

       If your index.html contains them,
       the values will automatically update.
    */


    const subjectCount =
        document.getElementById("homeSubjectCount");


    const assignmentCount =
        document.getElementById("homeAssignmentCount");


    const goalCount =
        document.getElementById("homeGoalCount");


    const scheduleCount =
        document.getElementById("homeScheduleCount");


    if (subjectCount) {

        subjectCount.textContent =
            subjects.length;

    }


    if (assignmentCount) {

        assignmentCount.textContent =
            assignments.length;

    }


    if (goalCount) {

        goalCount.textContent =
            goals.length;

    }


    if (scheduleCount) {

        scheduleCount.textContent =
            schedules.length;

    }


    /*
       Optional dashboard elements
    */


    const homeAssignmentProgress =
        document.getElementById(
            "homeAssignmentProgress"
        );


    if (homeAssignmentProgress) {

        let percentage = 0;


        if (assignments.length > 0) {

            const completed =
                assignments.filter(function (assignment) {

                    return assignment.completed;

                }).length;


            percentage =
                Math.round(
                    (completed / assignments.length) * 100
                );

        }


        homeAssignmentProgress.textContent =
            `${percentage}%`;

    }

}


/* =========================================================
   11. DARK MODE
========================================================= */

function initializeTheme() {

    const savedTheme =
        localStorage.getItem(
            STORAGE_KEYS.theme
        );


    if (savedTheme === "dark") {

        document.body.classList.add("dark-mode");

    }


    updateThemeButton();


    const themeButton =
        document.getElementById("themeToggle");


    if (themeButton) {

        themeButton.addEventListener(
            "click",
            toggleTheme
        );

    }

}


/* =========================================================
   TOGGLE DARK MODE
========================================================= */

function toggleTheme() {

    document.body.classList.toggle("dark-mode");


    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    localStorage.setItem(
        STORAGE_KEYS.theme,
        isDark ? "dark" : "light"
    );


    updateThemeButton();

}


/* =========================================================
   UPDATE THEME BUTTON
========================================================= */

function updateThemeButton() {

    const button =
        document.getElementById("themeToggle");


    if (!button) {
        return;
    }


    const isDark =
        document.body.classList.contains(
            "dark-mode"
        );


    if (isDark) {

        button.textContent =
            "☀️ Light Mode";

    } else {

        button.textContent =
            "🌙 Dark Mode";

    }

}


/* =========================================================
   12. RESET ALL DATA
========================================================= */

function initializeSettings() {

    const resetButton =
        document.getElementById("resetData");


    if (!resetButton) {
        return;
    }


    resetButton.addEventListener(
        "click",
        resetAllData
    );

}


/* =========================================================
   RESET FUNCTION
========================================================= */

function resetAllData() {

    const confirmed = confirm(

        "Are you sure you want to reset StudyFlow?\n\n" +

        "This will permanently delete your subjects, " +
        "schedules, assignments, goals, and progress."

    );


    if (!confirmed) {
        return;
    }


    localStorage.removeItem(
        STORAGE_KEYS.subjects
    );


    localStorage.removeItem(
        STORAGE_KEYS.schedules
    );


    localStorage.removeItem(
        STORAGE_KEYS.assignments
    );


    localStorage.removeItem(
        STORAGE_KEYS.goals
    );


    alert(
        "Your StudyFlow data has been reset."
    );


    window.location.reload();

}


/* =========================================================
   13. DATE FUNCTIONS
========================================================= */

function formatDate(dateString) {

    if (!dateString) {
        return "No date";
    }


    const date =
        new Date(dateString + "T00:00:00");


    if (isNaN(date.getTime())) {
        return dateString;
    }


    return date.toLocaleDateString(
        undefined,
        {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


/* =========================================================
   14. TIME FUNCTIONS
========================================================= */

function formatTime(timeString) {

    if (!timeString) {
        return "";
    }


    const parts =
        timeString.split(":");


    if (parts.length < 2) {
        return timeString;
    }


    let hour =
        parseInt(parts[0], 10);


    const minutes =
        parts[1];


    const period =
        hour >= 12 ? "PM" : "AM";


    hour =
        hour % 12 || 12;


    return `${hour}:${minutes} ${period}`;

}


/* =========================================================
   15. SECURITY / HTML ESCAPING
========================================================= */

function escapeHTML(value) {

    if (value === undefined || value === null) {
        return "";
    }


    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =========================================================
   16. MAKE FUNCTIONS AVAILABLE TO HTML
========================================================= */

window.deleteSubject =
    deleteSubject;


window.deleteSchedule =
    deleteSchedule;


window.toggleAssignment =
    toggleAssignment;


window.deleteAssignment =
    deleteAssignment;


window.updateGoalProgress =
    updateGoalProgress;


window.deleteGoal =
    deleteGoal;


window.toggleTheme =
    toggleTheme;


window.resetAllData =
    resetAllData;


/* =========================================================
   17. CONSOLE MESSAGE
========================================================= */

console.log(
    "StudyFlow loaded successfully 🚀"
);