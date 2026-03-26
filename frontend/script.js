window.onload = function () {
    const form = document.getElementById("studentForm");
    const studentsList = document.getElementById("studentsList");
    const count = document.getElementById("count");

    // LOAD STUDENTS FROM BACKEND
    async function loadStudents() {
        try {
            const res = await fetch("http://localhost:3000/users");
            const data = await res.json();

            count.textContent = data.length;

            if (data.length === 0) {
                studentsList.innerHTML = "<p>No students added yet. Try adding some!</p>";
                return;
            }

            studentsList.innerHTML = data.map(student => `
                <div class="student-card">
                    <p><strong>Name:</strong> ${student.name}</p>
                    <p><strong>Email:</strong> ${student.email}</p>
                    <p><strong>Phone:</strong> ${student.phone}</p>
                    <p><strong>Course:</strong> ${student.course}</p>
                    <p><strong>Marks:</strong> ${student.marks}</p>
                </div>
            `).join("");
        } catch (err) {
            console.error(err);
            alert("Error loading data ❌");
        }
    }

    // ADD STUDENT
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const student = {
            name: document.getElementById("name").value,
            email: document.getElementById("email").value,
            phone: document.getElementById("phone").value,
            course: document.getElementById("course").value,
            marks: document.getElementById("marks").value,
        };

        try {
            await fetch("http://localhost:3000/users", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(student),
            });

            alert("Student added successfully ✅");
            form.reset();
            loadStudents(); // refresh list
        } catch (err) {
            console.error(err);
            alert("Server error ❌");
        }
    });

    // CLEAR ALL DATA
    document.getElementById("clearAll").addEventListener("click", async () => {
        try {
            await fetch("http://localhost:3000/users", {
                method: "DELETE"
            });

            alert("All data cleared 🗑️");
            loadStudents();
        } catch (err) {
            console.error(err);
            alert("Error clearing data ❌");
        }
    });

    // LOAD ON PAGE START
    loadStudents();
};