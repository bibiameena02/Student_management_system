const studentForm = document.getElementById('studentForm');
const studentTableBody = document.querySelector('#studentTable tbody');
const searchInput = document.getElementById('search');
const sortSelect = document.getElementById('sort');

// Default students
const defaultStudents = [
    { name: "John", roll: "06", course: "BCA" },
    { name: "Shaz", roll: "12", course: "MBA" },
    { name: "Ammu", roll: "42", course: "B.Tech" },
    { name: "David", roll: "35", course: "MCA" },
    { name: "Bob", roll: "14", course: "M.Tech" }
];

// Load students from local storage or use defaults
let students = JSON.parse(localStorage.getItem('students'));
if (!students || students.length === 0) {
    students = defaultStudents;
    localStorage.setItem('students', JSON.stringify(students));
}

function renderTable() {
    studentTableBody.innerHTML = '';
    let filteredStudents = [...students];

    const searchTerm = searchInput.value.trim().toLowerCase();
    if (searchTerm) {
        filteredStudents = filteredStudents.filter(student =>
            student.name.toLowerCase().includes(searchTerm) ||
            student.roll.toLowerCase().includes(searchTerm) ||
            student.course.toLowerCase().includes(searchTerm) // Now searches course too
        );
    }

    const sortValue = sortSelect.value;
    if (sortValue) {
        filteredStudents.sort((a, b) => a[sortValue].localeCompare(b[sortValue]));
    }

    filteredStudents.forEach((student, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${student.name}</td>
            <td>${student.roll}</td>
            <td>${student.course}</td>
            <td>
                <button onclick="editStudent(${index})">Edit</button>
                <button onclick="deleteStudent(${index})">Delete</button>
            </td>
        `;
        studentTableBody.appendChild(row);
    });
}

studentForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const name = document.getElementById('name').value;
    const roll = document.getElementById('roll').value;
    const course = document.getElementById('course').value;
    const studentId = document.getElementById('studentId').value;

    if (studentId) {
        students[studentId] = { name, roll, course };
    } else {
        students.push({ name, roll, course });
    }

    localStorage.setItem('students', JSON.stringify(students));
    studentForm.reset();
    document.getElementById('studentId').value = '';
    renderTable();
});

function editStudent(index) {
    const student = students[index];
    document.getElementById('name').value = student.name;
    document.getElementById('roll').value = student.roll;
    document.getElementById('course').value = student.course;
    document.getElementById('studentId').value = index;
}

function deleteStudent(index) {
    if (confirm('Are you sure you want to delete this student?')) {
        students.splice(index, 1);
        localStorage.setItem('students', JSON.stringify(students));
        renderTable();
    }
}

searchInput.addEventListener('input', renderTable);
sortSelect.addEventListener('change', renderTable);

renderTable();
