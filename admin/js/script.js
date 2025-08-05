// Sidebar toggle functionality
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');
const toggleBtn = document.getElementById('toggleBtn');

toggleBtn.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
    mainContent.classList.toggle('expanded');

    const icon = toggleBtn.querySelector('i');
    icon.className = sidebar.classList.contains('collapsed') ? 'fas fa-times' : 'fas fa-bars';
});

// Close sidebar on mobile when clicking outside
document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768 && !sidebar.contains(e.target) && !toggleBtn.contains(e.target)) {
        if (sidebar.classList.contains('collapsed')) {
            sidebar.classList.remove('collapsed');
            mainContent.classList.remove('expanded');
            const icon = toggleBtn.querySelector('i');
            icon.className = 'fas fa-bars';
        }
    }
});

// Global variables
let sampleFeedback = [];
let sampleEmails = [];
let filteredFeedback = [];
let filteredEmails = [];
let currentFeedbackPage = 1;
let currentEmailPage = 1;
const itemsPerPage = 5;

// Fetch feedback from API
async function appendAPIData() {
    try {
        const response = await fetch('https://node-rahul-timbaliya.vercel.app/api/feedback/getAll', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const apiData = await response.json();
        return apiData;
    } catch (error) {
        console.error('Failed to fetch feedback from API:', error);
        return [];
    }
}


async function appendAPIDataEmail() {
    try {
        const response = await fetch('https://node-rahul-timbaliya.vercel.app/api/mail/getAll', {
            method: 'GET',
            headers: { 'Content-Type': 'application/json' }
        });

        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        const apiData = await response.json();
        return apiData;
    } catch (error) {
        console.error('Failed to fetch feedback from API:', error);
        return [];
    }
}

// Generate feedback data
async function generateSampleFeedback() {
    const feedbackcall = await appendAPIData();
    const feedback = feedbackcall.map(item => ({
        id: item._id,
        name: item.name,
        email: item.email,
        subject: item.subject,
        message: item.comment,
        date: item.createdAt,
    }));
    return feedback;
}


// Sample email data
async function generateSampleEmails() {
    const emailcall = await appendAPIDataEmail().then(data => data);
    const emails = 
    emailcall.map(item => ({
        id: item._id,
        sender: item.email.split('@')[0].toUpperCase(),
        email: item.email,
        date: item.createdAt,
    }));
    return emails;
}




// Render feedback table
function loadFeedbackTable(data = []) {
    const tbody = document.getElementById('feedbackTableBody');
    tbody.innerHTML = '';
    data.forEach(feedback => {
        const row = document.createElement('tr');
        const initials = feedback.email.split('@')[0][0].toUpperCase();
        const date = new Date(feedback.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        const messagePreview = feedback.message
            ? feedback.message.length > 100 ? feedback.message.substring(0, 100) + '...' : feedback.message
            : feedback.subject || 'No message content';

        row.innerHTML = `
            <td>
                <div class="user-info">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-details">
                        <h4>${feedback.email.split('@')[0].toUpperCase()}</h4>
                        <p>${feedback.email}</p>
                    </div>
                </div>
            </td>
            <td><div class="message-preview">${messagePreview}</div></td>
            <td>
                <div class="date-info">
                    <div class="date-primary">${formattedDate}</div>
                    <div class="date-secondary">${formattedTime}</div>
                </div>
            </td>
            <td>
                <button class="action-btn view" onclick="viewFeedback('${feedback.id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" onclick="deleteFeedback('${feedback.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Render email table
function loadEmailTable(data = []) {
    const tbody = document.getElementById('emailTableBody');
    tbody.innerHTML = '';
    data.forEach(email => {
        const row = document.createElement('tr');
        const initials = email.email.split('@')[0][0].toUpperCase();
        const date = new Date(email.date);
        const formattedDate = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
        const formattedTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

        row.innerHTML = `
            <td>
                <div class="user-info">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-details">
                        <h4>${email.email}</h4>
                    </div>
                </div>
            </td>
            <td>
                <div class="date-info">
                    <div class="date-primary">${formattedDate}</div>
                    <div class="date-secondary">${formattedTime}</div>
                </div>
            </td>
            <td>
                <button class="action-btn view" onclick="viewEmail('${email.id}')"><i class="fas fa-eye"></i></button>
                <button class="action-btn delete" onclick="deleteEmail('${email.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Search + Pagination
function searchFeedback() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    filteredFeedback = sampleFeedback.filter(f =>
        f.email.toLowerCase().includes(searchTerm) ||
        (f.message || '').toLowerCase().includes(searchTerm)
    );
    currentFeedbackPage = 1;
    loadFeedbackTableWithPagination(1);
}

function searchEmails() {
    const searchTerm = document.getElementById('emailSearchInput').value.toLowerCase();
    filteredEmails = sampleEmails.filter(e =>
        e.sender.toLowerCase().includes(searchTerm) ||
        e.email.toLowerCase().includes(searchTerm) ||
        e.date.toLowerCase().includes(searchTerm)
    );
    currentEmailPage = 1;
    loadEmailTableWithPagination(1);
}

function updateStats() {
    document.getElementById('feedbackCount').textContent = sampleFeedback.length;
    document.getElementById('emailCount').textContent = sampleEmails.length;
}

// Pagination
function loadFeedbackTableWithPagination(page = 1) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    loadFeedbackTable(filteredFeedback.slice(startIndex, endIndex));
    updatePagination('feedback', currentFeedbackPage, filteredFeedback.length);
}

function loadEmailTableWithPagination(page = 1) {
    const startIndex = (page - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    loadEmailTable(filteredEmails.slice(startIndex, endIndex));
    updatePagination('email', currentEmailPage, filteredEmails.length);
}

function updatePagination(type, currentPage, totalItems) {
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    const info = document.getElementById(`${type}PaginationInfo`);
    const prev = document.getElementById(`${type}PrevBtn`);
    const next = document.getElementById(`${type}NextBtn`);
    const numbers = document.getElementById(`${type}PaginationNumbers`);

    info.textContent = `Showing ${(currentPage - 1) * itemsPerPage + 1}-${Math.min(currentPage * itemsPerPage, totalItems)} of ${totalItems} entries`;
    prev.disabled = currentPage === 1;
    next.disabled = currentPage === totalPages;

    numbers.innerHTML = '';
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = `pagination-number ${i === currentPage ? 'active' : ''}`;
        btn.textContent = i;
        btn.onclick = () => {
            if (type === 'feedback') {
                currentFeedbackPage = i;
                loadFeedbackTableWithPagination(i);
            } else {
                currentEmailPage = i;
                loadEmailTableWithPagination(i);
            }
        };
        numbers.appendChild(btn);
    }
}

// View / Delete Feedback or Email
function viewFeedback(id) {
    const f = sampleFeedback.find(fb => fb.id === id);
    if (f) alert(`Feedback from ${f.email.split('@')[0].toUpperCase()}:\n\n${f.message}`);
}
function deleteFeedback(id) {
    if (confirm('Are you sure?')) {
        const index = sampleFeedback.findIndex(f => f.id === id);
        if (index > -1) {
            sampleFeedback.splice(index, 1);
            filteredFeedback = [...sampleFeedback];
            loadFeedbackTableWithPagination(currentFeedbackPage);
            updateStats();
        }
    }
}

function viewEmail(id) {
    const f = sampleEmails.find(fb => fb.id === id);
    if (f) alert(`Email from ${f.email.split('@')[0].toUpperCase()}:\n\n${f.email}`);
}
function deleteEmail(id) {
    if (confirm('Delete this email?')) {
        const index = sampleEmails.findIndex(e => e.id === id);
        if (index > -1) {
            sampleEmails.splice(index, 1);
            filteredEmails = [...sampleEmails];
            loadEmailTableWithPagination(currentEmailPage);
            updateStats();
        }
    }
}

// Initialize
document.addEventListener('DOMContentLoaded', async () => {
    sampleFeedback = await generateSampleFeedback();
    sampleEmails = await generateSampleEmails();

    filteredFeedback = [...sampleFeedback];
    filteredEmails = [...sampleEmails];

    loadFeedbackTableWithPagination(1);
    loadEmailTableWithPagination(1);
    updateStats();

    document.getElementById('searchInput').addEventListener('input', searchFeedback);
    document.getElementById('emailSearchInput').addEventListener('input', searchEmails);
});

// Responsive sidebar
function handleResize() {
    const icon = toggleBtn.querySelector('i');
    sidebar.classList.remove('collapsed');
    mainContent.classList.remove('expanded');
    icon.className = 'fas fa-bars';
}
window.addEventListener('resize', handleResize);
handleResize();
