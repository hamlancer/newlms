// Admin Panel Functionality
document.addEventListener('DOMContentLoaded', () => {
    // Navigation
    const navItems = document.querySelectorAll('.admin-nav li[data-tab]');
    const sections = document.querySelectorAll('.admin-section');

    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetTab = item.dataset.tab;
            
            // Update active states
            navItems.forEach(nav => nav.classList.remove('active'));
            sections.forEach(section => section.classList.remove('active'));
            
            item.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
        });
    });

    // Modal Functionality
    const modals = {
        addStudent: document.getElementById('addStudentModal'),
        addCourse: document.getElementById('addCourseModal'),
        uploadCertificate: document.getElementById('uploadCertificateModal'),
        addUser: document.getElementById('addUserModal')
    };

    const openModal = (modalId) => {
        modals[modalId].style.display = 'block';
    };

    const closeModal = (modal) => {
        modal.style.display = 'none';
    };

    // Close button functionality
    document.querySelectorAll('.close').forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').style.display = 'none';
        });
    });

    // Close modal when clicking outside
    window.addEventListener('click', (e) => {
        Object.values(modals).forEach(modal => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    });

    // Button click handlers
    document.getElementById('addStudentBtn').addEventListener('click', () => openModal('addStudent'));
    document.getElementById('addCourseBtn').addEventListener('click', () => openModal('addCourse'));
    document.getElementById('uploadCertificateBtn').addEventListener('click', () => openModal('uploadCertificate'));
    document.getElementById('addUserBtn').addEventListener('click', () => openModal('addUser'));

    // Form Submissions
    const handleFormSubmit = async (formId, endpoint) => {
        const form = document.getElementById(formId);
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                // In a real application, this would be an API call
                console.log(`Submitting to ${endpoint}:`, data);
                
                // Simulate API call
                await simulateApiCall(endpoint, data);
                
                // Close modal and refresh data
                closeModal(form.closest('.modal'));
                form.reset();
                refreshData();
                
                showNotification('Success!', 'success');
            } catch (error) {
                showNotification('Error: ' + error.message, 'error');
            }
        });
    };

    // Initialize form handlers
    handleFormSubmit('addStudentForm', '/api/students');
    handleFormSubmit('addCourseForm', '/api/courses');
    handleFormSubmit('uploadCertificateForm', '/api/certificates');
    handleFormSubmit('addUserForm', '/api/users');

    // Generate IDs and Numbers
    const generateId = (prefix) => {
        return `${prefix}${Math.random().toString(36).substr(2, 9)}`;
    };

    const generateAdmissionNumber = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        return `ADM${year}${random}`;
    };

    const generateCertificateNumber = () => {
        const year = new Date().getFullYear();
        const random = Math.floor(Math.random() * 100000).toString().padStart(5, '0');
        return `CERT${year}${random}`;
    };

    // Sample Data Management
    let students = [];
    let courses = [];
    let certificates = [];
    let users = [];

    // Add Student
    const addStudent = (studentData) => {
        const student = {
            ...studentData,
            id: generateId('STU'),
            admissionNumber: generateAdmissionNumber(),
            dateAdded: new Date().toISOString()
        };
        students.push(student);
        updateStudentTable();
        return student;
    };

    // Add Course
    const addCourse = (courseData) => {
        const course = {
            ...courseData,
            id: generateId('CRS'),
            dateAdded: new Date().toISOString(),
            students: 0
        };
        courses.push(course);
        updateCourseTable();
        return course;
    };

    // Upload Certificate
    const uploadCertificate = (certificateData) => {
        const certificate = {
            ...certificateData,
            certificateNumber: generateCertificateNumber(),
            dateIssued: new Date().toISOString()
        };
        certificates.push(certificate);
        updateCertificateTable();
        return certificate;
    };

    // Add User
    const addUser = (userData) => {
        const user = {
            ...userData,
            id: generateId('USR'),
            status: 'active',
            dateAdded: new Date().toISOString()
        };
        users.push(user);
        updateUserTable();
        return user;
    };

    // Table Updates
    const updateStudentTable = () => {
        const tbody = document.getElementById('studentTableBody');
        tbody.innerHTML = students.map(student => `
            <tr>
                <td>${student.id}</td>
                <td>${student.studentName}</td>
                <td>${student.fatherName}</td>
                <td>${student.email}</td>
                <td>${student.admissionNumber}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewStudent('${student.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editStudent('${student.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteStudent('${student.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    };

    const updateCourseTable = () => {
        const tbody = document.getElementById('courseTableBody');
        tbody.innerHTML = courses.map(course => `
            <tr>
                <td>${course.id}</td>
                <td>${course.courseTitle}</td>
                <td>${course.category}</td>
                <td>${course.level}</td>
                <td>${course.students}</td>
                <td>
                    <button class="action-btn view-btn" onclick="viewCourse('${course.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="action-btn edit-btn" onclick="editCourse('${course.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteCourse('${course.id}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </td>
            </tr>
        `).join('');
    };

    // Search Functionality
    const setupSearch = (inputId, searchFunction) => {
        const input = document.getElementById(inputId);
        input.addEventListener('input', (e) => {
            const searchTerm = e.target.value.toLowerCase();
            searchFunction(searchTerm);
        });
    };

    setupSearch('studentSearch', (term) => {
        const filtered = students.filter(student => 
            student.studentName.toLowerCase().includes(term) ||
            student.email.toLowerCase().includes(term) ||
            student.admissionNumber.toLowerCase().includes(term)
        );
        updateStudentTable(filtered);
    });

    setupSearch('courseSearch', (term) => {
        const filtered = courses.filter(course => 
            course.courseTitle.toLowerCase().includes(term) ||
            course.category.toLowerCase().includes(term)
        );
        updateCourseTable(filtered);
    });

    // Notification System
    const showNotification = (message, type = 'success') => {
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.remove();
        }, 3000);
    };

    // Simulate API Call
    const simulateApiCall = (endpoint, data) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ success: true, data });
            }, 500);
        });
    };

    // Initialize dashboard stats
    const updateDashboardStats = () => {
        document.getElementById('totalStudents').textContent = students.length;
        document.getElementById('totalCourses').textContent = courses.length;
        document.getElementById('totalCertificates').textContent = certificates.length;
    };

    // Logout functionality
    document.getElementById('logoutBtn').addEventListener('click', () => {
        // In a real application, this would clear session/tokens
        window.location.href = '../index.html';
    });

    // Initial data refresh
    const refreshData = () => {
        updateDashboardStats();
        updateStudentTable();
        updateCourseTable();
    };

    refreshData();
});
