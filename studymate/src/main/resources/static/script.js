// ======================================================
// STUDYMATE AI - FINAL SCRIPT V1
// ======================================================

let currentStudentId =
    localStorage.getItem("studentId");

let loggedInUserId =
    localStorage.getItem("loggedInUserId");


// ======================================================
// START
// ======================================================

document.addEventListener("DOMContentLoaded", function () {

    console.log("StudyMate JavaScript loaded successfully.");

    setupAuthButtons();
    setupProfileButton();
    setupSubjectButton();
    setupExamButton();
    setupTaskButton();
    setupPlanButton();
    setupProgressButton();
    setupNavigation();

    if (loggedInUserId) {
        showApp();
        loadLoggedInUser();
    } else {
        showAuth();
    }
});


// ======================================================
// SHOW APP / AUTH
// ======================================================

function showApp() {

    const authScreen =
        document.getElementById("authScreen");

    const appLayout =
        document.querySelector(".app-layout");

    if (authScreen) {
        authScreen.style.display = "none";
    }

    if (appLayout) {
        appLayout.style.display = "flex";
    }
}


function showAuth() {

    const authScreen =
        document.getElementById("authScreen");

    const appLayout =
        document.querySelector(".app-layout");

    if (authScreen) {
        authScreen.style.display = "flex";
    }

    if (appLayout) {
        appLayout.style.display = "none";
    }
}


// ======================================================
// USER DISPLAY
// ======================================================

function updateUserDisplay(name) {

    const profileName =
        document.getElementById("profileDisplayName");

    const avatar =
        document.querySelector(".profile-avatar");

    if (profileName) {
        profileName.textContent =
            name || "Student";
    }

    if (avatar) {
        avatar.textContent =
            name
                ? name.charAt(0).toUpperCase()
                : "S";
    }
}


// ======================================================
// AUTH BUTTONS
// ======================================================

function setupAuthButtons() {

    const showRegisterButton =
        document.getElementById("showRegister");

    if (showRegisterButton) {

        showRegisterButton.addEventListener(
            "click",
            function () {

                document.getElementById(
                    "loginSection"
                ).style.display = "none";

                document.getElementById(
                    "registerSection"
                ).style.display = "block";
            }
        );
    }


    const showLoginButton =
        document.getElementById("showLogin");

    if (showLoginButton) {

        showLoginButton.addEventListener(
            "click",
            function () {

                document.getElementById(
                    "registerSection"
                ).style.display = "none";

                document.getElementById(
                    "loginSection"
                ).style.display = "block";
            }
        );
    }


    const registerButton =
        document.getElementById("registerButton");

    if (registerButton) {
        registerButton.addEventListener(
            "click",
            registerUser
        );
    }


    const loginButton =
        document.getElementById("loginButton");

    if (loginButton) {
        loginButton.addEventListener(
            "click",
            loginUser
        );
    }
}


// ======================================================
// REGISTER
// ======================================================

async function registerUser() {

    const name =
        document.getElementById(
            "registerName"
        ).value.trim();

    const email =
        document.getElementById(
            "registerEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "registerPassword"
        ).value;


    if (!name || !email || !password) {

        alert(
            "Please fill all registration details."
        );

        return;
    }


    try {

        const response =
            await fetch(
                "/api/users/register",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        password: password
                    })
                }
            );


        if (!response.ok) {

            alert(
                "Registration failed. Email may already be registered."
            );

            return;
        }


        await response.json();


        alert(
            "Registration successful! Please login."
        );


        document.getElementById(
            "registerName"
        ).value = "";

        document.getElementById(
            "registerEmail"
        ).value = "";

        document.getElementById(
            "registerPassword"
        ).value = "";


        document.getElementById(
            "loginEmail"
        ).value = email;

        document.getElementById(
            "loginPassword"
        ).value = "";


        document.getElementById(
            "registerSection"
        ).style.display = "none";

        document.getElementById(
            "loginSection"
        ).style.display = "block";

    }
    catch (error) {

        console.error(
            "Registration error:",
            error
        );

        alert(
            "Unable to connect to StudyMate server."
        );
    }
}


// ======================================================
// LOGIN
// ======================================================

async function loginUser() {

    const email =
        document.getElementById(
            "loginEmail"
        ).value.trim();

    const password =
        document.getElementById(
            "loginPassword"
        ).value;


    if (!email || !password) {

        alert(
            "Please enter email and password."
        );

        return;
    }


    try {

        // ------------------------------------------------
        // LOGIN
        // ------------------------------------------------

        const response =
            await fetch(
                "/api/users/login",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email: email,
                        password: password
                    })
                }
            );


        if (!response.ok) {

            alert(
                "Invalid email or password."
            );

            return;
        }


        const user =
            await response.json();


        // ------------------------------------------------
        // SAVE USER
        // ------------------------------------------------

        loggedInUserId =
            Number(user.userId);

        localStorage.setItem(
            "loggedInUserId",
            loggedInUserId
        );

        localStorage.setItem(
            "studentName",
            user.name
        );

        localStorage.setItem(
            "userEmail",
            user.email
        );


        // ------------------------------------------------
        // FIND STUDENT PROFILE
        // ------------------------------------------------

        currentStudentId = null;

        localStorage.removeItem(
            "studentId"
        );


        const studentResponse =
            await fetch(
                `/api/students/user/${user.userId}`
            );


        /*
         * IMPORTANT FIX
         *
         * Do not directly use response.json()
         * because an empty response can cause:
         *
         * Unexpected end of JSON input
         */

        if (studentResponse.ok) {

            const studentText =
                await studentResponse.text();

            if (studentText.trim()) {

                const student =
                    JSON.parse(studentText);

                if (student) {

                    currentStudentId =
                        student.studentId;
                }
            }
        }


        // ------------------------------------------------
        // CREATE STUDENT PROFILE IF NEEDED
        // ------------------------------------------------

        if (!currentStudentId) {

            const createResponse =
                await fetch(
                    "/api/students",
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json"
                        },

                        body: JSON.stringify({

                            userId:
                                user.userId,

                            name:
                                user.name,

                            email:
                                user.email,

                            studyHours:
                                0
                        })
                    }
                );


            if (!createResponse.ok) {

                throw new Error(
                    "Unable to create student profile."
                );
            }


            /*
             * IMPORTANT FIX
             *
             * Safely read the response before JSON.parse()
             */

            const newStudentText =
                await createResponse.text();


            if (!newStudentText.trim()) {

                throw new Error(
                    "Student profile response was empty."
                );
            }


            const newStudent =
                JSON.parse(newStudentText);


            currentStudentId =
                newStudent.studentId;
        }


        // ------------------------------------------------
        // SAVE STUDENT ID
        // ------------------------------------------------

        localStorage.setItem(
            "studentId",
            currentStudentId
        );


        // ------------------------------------------------
        // OPEN APPLICATION
        // ------------------------------------------------

        showApp();

        updateUserDisplay(
            user.name
        );


        const nameInput =
            document.getElementById("name");

        const emailInput =
            document.getElementById("email");


        if (nameInput) {
            nameInput.value =
                user.name;
        }


        if (emailInput) {
            emailInput.value =
                user.email;
        }


        // ------------------------------------------------
        // LOAD DATA
        // ------------------------------------------------

        await loadStudentProfile();
        await loadSubjects();
        await loadSubjectDropdowns();
        await loadTasks();
        await updateDashboard();
        await loadStudyPlan();


        alert(
            "Login successful!"
        );

    }
    catch (error) {

        console.error(
            "Login error:",
            error
        );

        alert(
            "Unable to connect to StudyMate server."
        );
    }
}


// ======================================================
// LOGOUT
// ======================================================

function logoutUser() {

    localStorage.removeItem(
        "loggedInUserId"
    );

    localStorage.removeItem(
        "studentId"
    );

    localStorage.removeItem(
        "studentName"
    );

    localStorage.removeItem(
        "userEmail"
    );


    currentStudentId = null;
    loggedInUserId = null;


    showAuth();


    alert(
        "You have been logged out."
    );
}


// ======================================================
// PROFILE BUTTON
// ======================================================

function setupProfileButton() {

    const button =
        document.getElementById(
            "saveProfile"
        );

    if (button) {

        button.addEventListener(
            "click",
            saveProfile
        );
    }
}


// ======================================================
// SAVE PROFILE
// ======================================================

async function saveProfile() {

    const name =
        document.getElementById(
            "name"
        ).value.trim();

    const email =
        document.getElementById(
            "email"
        ).value.trim();

    const studyHours =
        parseInt(
            document.getElementById(
                "studyHours"
            ).value
        );


    if (
        !name ||
        !email ||
        isNaN(studyHours)
    ) {

        alert(
            "Please fill all profile details."
        );

        return;
    }


    if (
        studyHours < 1 ||
        studyHours > 24
    ) {

        alert(
            "Study hours must be between 1 and 24."
        );

        return;
    }


    if (!currentStudentId) {

        alert(
            "Student profile not found."
        );

        return;
    }


    try {

        const response =
            await fetch(
                `/api/students/${currentStudentId}`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        userId:
                            Number(loggedInUserId),

                        name:
                            name,

                        email:
                            email,

                        studyHours:
                            studyHours
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Profile save failed"
            );
        }


        localStorage.setItem(
            "studentName",
            name
        );

        localStorage.setItem(
            "userEmail",
            email
        );


        updateUserDisplay(
            name
        );


        alert(
            "Profile saved successfully!"
        );


        await loadStudentProfile();
        await loadSubjects();
        await loadSubjectDropdowns();
        await loadTasks();
        await updateDashboard();

    }
    catch (error) {

        console.error(
            "Profile error:",
            error
        );

        alert(
            "Unable to save profile."
        );
    }
}


// ======================================================
// LOAD PROFILE
// ======================================================

async function loadStudentProfile() {

    if (!loggedInUserId) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/students/user/${loggedInUserId}`
            );


        if (!response.ok) {
            return;
        }


        const text =
            await response.text();


        if (!text.trim()) {
            return;
        }


        const student =
            JSON.parse(text);


        if (!student) {
            return;
        }


        currentStudentId =
            student.studentId;


        localStorage.setItem(
            "studentId",
            currentStudentId
        );


        const nameInput =
            document.getElementById("name");

        const emailInput =
            document.getElementById("email");

        const hoursInput =
            document.getElementById("studyHours");


        if (nameInput) {
            nameInput.value =
                student.name || "";
        }

        if (emailInput) {
            emailInput.value =
                student.email || "";
        }

        if (hoursInput) {
            hoursInput.value =
                student.studyHours || "";
        }


        updateUserDisplay(
            student.name
        );

    }
    catch (error) {

        console.error(
            "Load profile error:",
            error
        );
    }
}


// ======================================================
// SUBJECT BUTTON
// ======================================================

function setupSubjectButton() {

    const button =
        document.getElementById(
            "addSubject"
        );

    if (button) {

        button.addEventListener(
            "click",
            addSubject
        );
    }
}


// ======================================================
// ADD SUBJECT
// ======================================================

async function addSubject() {

    if (!currentStudentId) {

        alert(
            "Please save your profile first."
        );

        return;
    }


    const subjectName =
        document.getElementById(
            "subjectName"
        ).value.trim();

    const difficulty =
        document.getElementById(
            "difficulty"
        ).value;


    if (!subjectName) {

        alert(
            "Please enter subject name."
        );

        return;
    }


    try {

        const response =
            await fetch(
                "/api/subjects",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        studentId:
                            Number(currentStudentId),

                        subjectName:
                            subjectName,

                        difficulty:
                            difficulty
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Subject creation failed"
            );
        }


        document.getElementById(
            "subjectName"
        ).value = "";


        alert(
            "Subject added successfully!"
        );


        await loadSubjects();
        await loadSubjectDropdowns();
        await updateDashboard();

    }
    catch (error) {

        console.error(
            "Subject error:",
            error
        );

        alert(
            "Unable to add subject."
        );
    }
}


// ======================================================
// LOAD SUBJECTS
// ======================================================

async function loadSubjects() {

    if (!currentStudentId) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/subjects?studentId=${currentStudentId}`
            );
        if (!response.ok) {
            return;
        }


        const subjects =
            await response.json();


        const list =
            document.getElementById(
                "subjectList"
            );


        if (!list) {
            return;
        }


        list.innerHTML = "";


        if (subjects.length === 0) {

            list.innerHTML = `

                <div class="empty-state">

                    <div>📚</div>

                    <h3>No subjects yet</h3>

                    <p>
                        Add your first subject to get started.
                    </p>

                </div>
            `;

        }
        else {

            subjects.forEach(
                subject => {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "subject-item";


                    div.innerHTML = `

                        <span>
                            ${subject.subjectName}
                            - ${subject.difficulty}
                        </span>

                        <button
                            onclick="deleteSubject(${subject.subjectId})">
                            Delete
                        </button>

                    `;


                    list.appendChild(div);
                }
            );
        }


        const count =
            document.getElementById(
                "dashboardSubjects"
            );


        if (count) {
            count.textContent =
                subjects.length;
        }

    }
    catch (error) {

        console.error(
            "Load subjects error:",
            error
        );
    }
}


// ======================================================
// SUBJECT DROPDOWNS
// ======================================================

async function loadSubjectDropdowns() {

    if (!currentStudentId) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/subjects?studentId=${currentStudentId}`
            );


        if (!response.ok) {
            return;
        }


        const subjects =
            await response.json();


        const examSelect =
            document.getElementById(
                "examSubjectId"
            );

        const taskSelect =
            document.getElementById(
                "taskSubjectId"
            );


        if (examSelect) {

            examSelect.innerHTML =
                '<option value="">Select Subject</option>';
        }


        if (taskSelect) {

            taskSelect.innerHTML =
                '<option value="">Select Subject</option>';
        }


        subjects.forEach(
            subject => {

                if (examSelect) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        subject.subjectId;

                    option.textContent =
                        subject.subjectName;

                    examSelect.appendChild(
                        option
                    );
                }


                if (taskSelect) {

                    const option =
                        document.createElement(
                            "option"
                        );

                    option.value =
                        subject.subjectId;

                    option.textContent =
                        subject.subjectName;

                    taskSelect.appendChild(
                        option
                    );
                }
            }
        );

    }
    catch (error) {

        console.error(
            "Dropdown error:",
            error
        );
    }
}


// ======================================================
// DELETE SUBJECT
// ======================================================

async function deleteSubject(subjectId) {

    if (
        !confirm(
            "Delete this subject?"
        )
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/subjects/${subjectId}`,
                {
                    method: "DELETE"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Delete failed"
            );
        }


        alert(
            "Subject deleted successfully!"
        );


        await loadSubjects();
        await loadSubjectDropdowns();
        await loadTasks();
        await updateDashboard();

    }
    catch (error) {

        console.error(error);

        alert(
            "Unable to delete subject."
        );
    }
}


// ======================================================
// EXAM BUTTON
// ======================================================

function setupExamButton() {

    const button =
        document.getElementById(
            "addExam"
        );

    if (button) {

        button.addEventListener(
            "click",
            saveExam
        );
    }
}


// ======================================================
// SAVE EXAM
// ======================================================

async function saveExam() {

    if (!currentStudentId) {

        alert(
            "Please save your profile first."
        );

        return;
    }


    const subjectId =
        parseInt(
            document.getElementById(
                "examSubjectId"
            ).value
        );


    const examDate =
        document.getElementById(
            "examDate"
        ).value;


    if (
        isNaN(subjectId) ||
        !examDate
    ) {

        alert(
            "Please select subject and exam date."
        );

        return;
    }


    try {

        const response =
            await fetch(
                "/api/exams",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        studentId:
                            Number(currentStudentId),

                        subjectId:
                            subjectId,

                        examDate:
                            examDate
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Exam save failed"
            );
        }


        alert(
            "Exam date saved successfully!"
        );


        await loadStudyPlan();

    }
    catch (error) {

        console.error(
            "Exam error:",
            error
        );

        alert(
            "Unable to save exam."
        );
    }
}


// ======================================================
// TASK BUTTON
// ======================================================

function setupTaskButton() {

    const button =
        document.getElementById(
            "addTask"
        );

    if (button) {

        button.addEventListener(
            "click",
            addTask
        );
    }


    const loadButton =
        document.getElementById(
            "loadTasks"
        );

    if (loadButton) {

        loadButton.addEventListener(
            "click",
            async function () {

                await loadTasks();
                await updateDashboard();

            }
        );
    }
}


// ======================================================
// ADD TASK
// ======================================================

async function addTask() {

    if (!currentStudentId) {

        alert(
            "Please save your profile first."
        );

        return;
    }


    const subjectId =
        parseInt(
            document.getElementById(
                "taskSubjectId"
            ).value
        );


    const taskName =
        document.getElementById(
            "taskName"
        ).value.trim();


    const taskDate =
        document.getElementById(
            "taskDate"
        ).value;


    const duration =
        parseInt(
            document.getElementById(
                "taskDuration"
            ).value
        );


    if (
        isNaN(subjectId) ||
        !taskName ||
        !taskDate ||
        isNaN(duration)
    ) {

        alert(
            "Please fill all task details."
        );

        return;
    }


    if (duration <= 0) {

        alert(
            "Duration must be greater than 0."
        );

        return;
    }


    try {

        const response =
            await fetch(
                "/api/tasks",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        studentId:
                            Number(currentStudentId),

                        subjectId:
                            subjectId,

                        taskName:
                            taskName,

                        taskDate:
                            taskDate,

                        duration:
                            duration,

                        status:
                            "Pending"
                    })
                }
            );


        if (!response.ok) {

            throw new Error(
                "Task creation failed"
            );
        }


        document.getElementById(
            "taskName"
        ).value = "";

        document.getElementById(
            "taskDuration"
        ).value = "";


        alert(
            "Task added successfully!"
        );


        await loadTasks();
        await updateDashboard();

    }
    catch (error) {

        console.error(
            "Task error:",
            error
        );

        alert(
            "Unable to add task."
        );
    }
}


// ======================================================
// LOAD TASKS
// ======================================================

async function loadTasks() {

    if (!currentStudentId) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/tasks?studentId=${currentStudentId}`
            );


        if (!response.ok) {
            return;
        }


        const tasks =
            await response.json();


        const list =
            document.getElementById(
                "taskList"
            );


        if (!list) {
            return;
        }


        list.innerHTML = "";


        if (tasks.length === 0) {

            list.innerHTML = `

                <div class="empty-state">

                    <div>✓</div>

                    <h3>No study tasks yet</h3>

                    <p>
                        Create your first study task.
                    </p>

                </div>
            `;

        }
        else {

            tasks.forEach(
                task => {

                    const div =
                        document.createElement(
                            "div"
                        );


                    div.className =
                        "task-item";


                    const completed =
                        task.status ===
                        "Completed";


                    div.innerHTML = `

                        <div>

                            <strong>
                                ${task.taskName}
                            </strong>

                            <br>

                            Date:
                            ${task.taskDate}

                            <br>

                            Duration:
                            ${task.duration}
                            minutes

                            <br>

                            Status:
                            ${task.status}

                        </div>

                        ${
                            completed
                            ? ""
                            : `
                                <button
                                    onclick="completeTask(${task.taskId})">
                                    Complete
                                </button>
                            `
                        }

                    `;


                    list.appendChild(div);
                }
            );
        }


        const dashboardTasks =
            document.getElementById(
                "dashboardTasks"
            );


        if (dashboardTasks) {

            dashboardTasks.textContent =
                tasks.length;
        }

    }
    catch (error) {

        console.error(
            "Load tasks error:",
            error
        );
    }
}


// ======================================================
// COMPLETE TASK
// ======================================================

async function completeTask(taskId) {

    try {

        const response =
            await fetch(
                `/api/tasks/${taskId}/complete`,
                {
                    method: "PUT"
                }
            );


        if (!response.ok) {

            throw new Error(
                "Complete failed"
            );
        }


        alert(
            "Task completed!"
        );


        await loadTasks();
        await updateDashboard();

    }
    catch (error) {

        console.error(error);

        alert(
            "Unable to complete task."
        );
    }
}


// ======================================================
// STUDY PLAN BUTTON
// ======================================================

function setupPlanButton() {

    const button =
        document.getElementById(
            "generatePlan"
        );

    if (button) {

        button.addEventListener(
            "click",
            loadStudyPlan
        );
    }
}


// ======================================================
// LOAD STUDY PLAN
// ======================================================

async function loadStudyPlan() {

    if (!currentStudentId) {
        return;
    }


    const hoursInput =
        document.getElementById(
            "studyHours"
        );


    if (!hoursInput) {
        return;
    }


    const studyHours =
        parseInt(
            hoursInput.value
        );


    if (
        isNaN(studyHours) ||
        studyHours <= 0
    ) {
        return;
    }


    try {

        const response =
            await fetch(
                `/api/study-plan/${studyHours}?studentId=${currentStudentId}`
            );


        if (!response.ok) {

            throw new Error(
                "Plan generation failed"
            );
        }


        const plans =
            await response.json();


        const planList =
            document.getElementById(
                "studyPlan"
            );


        if (!planList) {
            return;
        }


        planList.innerHTML = "";


        if (plans.length === 0) {

            planList.innerHTML = `

                <div class="empty-state">

                    <div>🧠</div>

                    <h3>No study plan available</h3>

                    <p>
                        Add subjects to generate your plan.
                    </p>

                </div>
            `;

            return;
        }


        plans.forEach(
            plan => {

                const div =
                    document.createElement(
                        "div"
                    );


                div.className =
                    "study-plan-item";


                div.innerHTML = `

                    <strong>
                        ${plan.subjectName}
                    </strong>

                    <br>

                    ${plan.task}

                    <br>

                    Duration:
                    ${plan.duration}
                    minutes

                    <br>

                    Date:
                    ${plan.studyDate}

                `;


                planList.appendChild(div);
            }
        );

    }
    catch (error) {

        console.error(
            "Study plan error:",
            error
        );

        alert(
            "Unable to generate study plan."
        );
    }
}


// ======================================================
// DASHBOARD
// ======================================================

async function updateDashboard() {

    if (!currentStudentId) {
        return;
    }


    try {

        const tasksResponse =
            await fetch(
                `/api/tasks?studentId=${currentStudentId}`
            );


        if (!tasksResponse.ok) {
            return;
        }


        const tasks =
            await tasksResponse.json();


        const totalTasks =
            tasks.length;


        const completedTasks =
            tasks.filter(
                task =>
                    task.status ===
                    "Completed"
            ).length;


        const progress =
            totalTasks === 0
                ? 0
                : Math.round(
                    completedTasks /
                    totalTasks *
                    100
                );


        const hoursInput =
            document.getElementById(
                "studyHours"
            );


        const dashboardHours =
            document.getElementById(
                "dashboardStudyHours"
            );


        if (dashboardHours) {

            dashboardHours.textContent =
                hoursInput
                    ? hoursInput.value || "0"
                    : "0";
        }


        const dashboardTasks =
            document.getElementById(
                "dashboardTasks"
            );


        if (dashboardTasks) {

            dashboardTasks.textContent =
                totalTasks;
        }


        const dashboardProgress =
            document.getElementById(
                "dashboardProgress"
            );


        if (dashboardProgress) {

            dashboardProgress.textContent =
                progress + "%";
        }


        const subjectsResponse =
            await fetch(
                `/api/subjects?studentId=${currentStudentId}`
            );


        if (subjectsResponse.ok) {

            const subjects =
                await subjectsResponse.json();


            const dashboardSubjects =
                document.getElementById(
                    "dashboardSubjects"
                );


            if (dashboardSubjects) {

                dashboardSubjects.textContent =
                    subjects.length;
            }
        }


        updateProgressSection(
            tasks,
            progress
        );

    }
    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );
    }
}


// ======================================================
// PROGRESS
// ======================================================

function updateProgressSection(
    tasks,
    progress
) {

    const dashboard =
        document.getElementById(
            "progressDashboard"
        );


    if (!dashboard) {
        return;
    }


    const completed =
        tasks.filter(
            task =>
                task.status ===
                "Completed"
        ).length;


    const pending =
        tasks.length -
        completed;


    dashboard.innerHTML = `

        <div style="
            display:grid;
            grid-template-columns:
            repeat(auto-fit,minmax(150px,1fr));
            gap:20px;
        ">

            <div>

                <strong style="font-size:28px;">
                    ${tasks.length}
                </strong>

                <p>Total Tasks</p>

            </div>


            <div>

                <strong style="font-size:28px;">
                    ${completed}
                </strong>

                <p>Completed</p>

            </div>


            <div>

                <strong style="font-size:28px;">
                    ${pending}
                </strong>

                <p>Pending</p>

            </div>


            <div>

                <strong style="font-size:28px;">
                    ${progress}%
                </strong>

                <p>Completion</p>

            </div>

        </div>
    `;
}


// ======================================================
// PROGRESS BUTTON
// ======================================================

function setupProgressButton() {

    const button =
        document.getElementById(
            "showProgress"
        );


    if (button) {

        button.addEventListener(
            "click",
            async function () {

                await updateDashboard();


                const section =
                    document.getElementById(
                        "progress"
                    );


                if (section) {

                    section.scrollIntoView({
                        behavior:
                            "smooth"
                    });
                }
            }
        );
    }
}


// ======================================================
// NAVIGATION
// ======================================================

function setupNavigation() {

    const navItems =
        document.querySelectorAll(
            ".nav-item"
        );


    navItems.forEach(
        item => {

            item.addEventListener(
                "click",
                function () {

                    navItems.forEach(
                        nav => {

                            nav.classList.remove(
                                "active"
                            );
                        }
                    );


                    item.classList.add(
                        "active"
                    );
                }
            );
        }
    );
}


// ======================================================
// LOAD LOGGED-IN USER
// ======================================================

async function loadLoggedInUser() {

    const savedName =
        localStorage.getItem(
            "studentName"
        );


    const savedEmail =
        localStorage.getItem(
            "userEmail"
        );


    const nameInput =
        document.getElementById(
            "name"
        );


    const emailInput =
        document.getElementById(
            "email"
        );


    if (nameInput && savedName) {

        nameInput.value =
            savedName;
    }


    if (emailInput && savedEmail) {

        emailInput.value =
            savedEmail;
    }


    updateUserDisplay(
        savedName
    );


    if (!loggedInUserId) {
        return;
    }


    try {

        const studentResponse =
            await fetch(
                `/api/students/user/${loggedInUserId}`
            );


        if (studentResponse.ok) {

            const studentText =
                await studentResponse.text();


            if (studentText.trim()) {

                const student =
                    JSON.parse(studentText);


                if (student) {

                    currentStudentId =
                        student.studentId;


                    localStorage.setItem(
                        "studentId",
                        currentStudentId
                    );
                }
            }
        }

    }
    catch (error) {

        console.error(
            "Student loading error:",
            error
        );
    }


    if (currentStudentId) {

        await loadStudentProfile();
        await loadSubjects();
        await loadSubjectDropdowns();
        await loadTasks();
        await updateDashboard();
        await loadStudyPlan();
    }
}


// ======================================================
// GLOBAL FUNCTIONS
// ======================================================

window.deleteSubject =
    deleteSubject;

window.completeTask =
    completeTask;

window.logoutUser =
    logoutUser;