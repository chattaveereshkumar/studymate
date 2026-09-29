// ===============================
// SAVE STUDENT PROFILE
// ===============================

const profileButton = document.querySelector("button");

profileButton.addEventListener("click", async function () {

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;

    const student = {
        name: name,
        email: email
    };

    try {

        const response = await fetch(
            "https://literate-goggles-gx7pvg6wqxrvhpp7w-8080.app.github.dev/api/students",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(student)
            }
        );

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();

        console.log("Student saved:", data);

        alert("Profile saved successfully!");

    } catch (error) {

        console.error(error);

        alert("Could not save profile.");

    }
});


// ===============================
// ADD SUBJECT
// ===============================

const subjectButton = document.getElementById("addSubject");

subjectButton.addEventListener("click", async function () {

    const subjectName =
        document.getElementById("subjectName").value;

    const difficulty =
        document.getElementById("difficulty").value;

    const subject = {
        studentId: 1,
        subjectName: subjectName,
        difficulty: difficulty
    };

    try {

        const response = await fetch(
            "/api/subjects",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(subject)
            }
        );

        if (!response.ok) {
            throw new Error("Server error: " + response.status);
        }

        const data = await response.json();

        console.log("Subject saved:", data);

        alert("Subject added successfully!");

    } catch (error) {

        console.error(error);

        alert("Could not add subject.");

    }
});