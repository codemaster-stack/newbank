// Your existing BACKEND_URL definition
const BACKEND_URL = "https://newbank-api.onrender.com"; // or however you define it

// PUT THE FUNCTION HERE - right after BACKEND_URL
function getImageUrl(profilePicPath) {
  if (!profilePicPath) return null;
  
  if (profilePicPath.startsWith('http://') || profilePicPath.startsWith('https://')) {
    return profilePicPath;
  } else {
    return `${BACKEND_URL}/${profilePicPath}`;
  }
}


// Place the openSection function HERE 
function openSection(sectionId) {
  // Hide all sections with class 'section'
  const sections = document.querySelectorAll('.section');
  sections.forEach(section => {
    section.classList.remove('active');
  });

// card

  if (sectionId === 'cardManagement') {
    console.log("Loading card management...");
    if (typeof initializeCardManagement === 'function') {
        initializeCardManagement();
    }
}
  
  // Hide all sections with class 'content-section' 
  const contentSections = document.querySelectorAll('.content-section');
  contentSections.forEach(section => {
    section.style.display = 'none';
  });
  
  // Show the selected section (try both class types)
  const targetSection = document.getElementById(sectionId);
  if (targetSection) {
    if (targetSection.classList.contains('section')) {
      targetSection.classList.add('active');
    } else if (targetSection.classList.contains('content-section')) {
      targetSection.style.display = 'block';
    }
  }

  // Load users when viewUsers is opened
  if (sectionId === 'viewUsers') {
    if (typeof window.loadUsers === 'function') {
      window.loadUsers();
    }
  }
  
           // Super admin sections
if (sectionId === 'viewAdmins') {
  if (typeof window.loadAdmins === 'function') {
    window.loadAdmins();
  }
}

if (sectionId === 'recycleBin') {
  if (typeof window.loadRecycleBin === 'function') {
    window.loadRecycleBin();
  }
}

if (sectionId === 'sentEmails') {
  if (typeof window.loadSentEmails === 'function') {
    window.loadSentEmails();
  }
}

if (sectionId === 'chatHistory') {
  if (typeof window.loadChatHistoryView === 'function') {
    window.loadChatHistoryView();
  }
}

  // Special handling for chat
  if (sectionId === 'chat') {
    console.log("Loading chat users...");
    setTimeout(() => {
      if (typeof loadChatUsers === 'function') {
        loadChatUsers();
      } else {
        console.error("loadChatUsers function not available yet");
      }
    }, 100);
  }
}

// Make openSection globally available
window.openSection = openSection;

// Then rest of your code...


document.addEventListener("DOMContentLoaded", () => {
  // Function to toggle sidebar
  function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('active');
  }

  // Make toggleSidebar globally available
  window.toggleSidebar = toggleSidebar;

  // Show dashboard by default
  openSection('dashboard');
});



// // Logout functionality
// document.addEventListener("DOMContentLoaded", () => {
//   // ... rest of your logout code
// });


// Logout functionality
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  if (logoutBtn) {
    logoutBtn.addEventListener("click", (e) => {
      e.preventDefault();
      localStorage.removeItem("adminToken");
      window.location.href = "admin-signup.html";
    });
  }
});

// Admin form handlers
 
document.addEventListener("DOMContentLoaded", () => {
  // const BACKEND_URL = "https://newbank-api.onrender.com";
  const token = localStorage.getItem("token"); // Change to "adminToken" if different

  // Show message helper
  function showMessage(message, type = 'success') {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    const activeSection = document.querySelector('.section.active');
    activeSection.insertBefore(messageDiv, activeSection.firstChild);
    
    setTimeout(() => messageDiv.remove(), 5000);
  }

  // Create User Form

  const createUserForm = document.getElementById('createUserForm');
if (createUserForm) {
  createUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Creating...';
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/users/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (response.ok) {
        showMessage('User created successfully!');
        e.target.reset();
      } else {
        showMessage(result.message || 'Failed to create user', 'error');
      }
    } catch (error) {
      showMessage('Error creating user', 'error');
      console.error(error);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

  // Delete User Form
  
  const deleteUserForm = document.getElementById('deleteUserForm');
if (deleteUserForm) {
  deleteUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    
    if (!confirm(`Are you sure you want to delete user: ${email}?`)) return;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Deleting...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/auth/users/${email}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
      });
      
      const result = await response.json();
      if (response.ok) {
        showMessage('User deleted successfully!');
        e.target.reset();
      } else {
        showMessage(result.message || 'Failed to delete user', 'error');
      }
    } catch (error) {
      showMessage('Error deleting user', 'error');
      console.error(error);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

  // Deactivate User Form

const deactivateUserForm = document.getElementById('deactivateUserForm');
if (deactivateUserForm) {
  deactivateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Deactivating...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/auth/users/${email}/deactivate`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
      });
      
      const result = await response.json();
      if (response.ok) {
        showMessage('User deactivated successfully!');
        e.target.reset();
      } else {
        showMessage(result.message || 'Failed to deactivate user', 'error');
      }
    } catch (error) {
      showMessage('Error deactivating user', 'error');
      console.error(error);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}
  
  // Reactivate User Form

const reactivateUserForm = document.getElementById('reactivateUserForm');
if (reactivateUserForm) {
  reactivateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Reactivating...';
    submitBtn.disabled = true;
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/auth/users/${email}/reactivate`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
      });
      
      const result = await response.json();
      if (response.ok) {
        showMessage('User reactivated successfully!');
        e.target.reset();
      } else {
        showMessage(result.message || 'Failed to reactivate user', 'error');
      }
    } catch (error) {
      showMessage('Error reactivating user', 'error');
      console.error(error);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

  // Fund User Form

const fundUserForm = document.getElementById('fundUserForm');
if (fundUserForm) {
  fundUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Funding...';
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/auth/fund-user`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}` 
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (response.ok) {
        showMessage('User account funded successfully!');
        e.target.reset();
      } else {
        showMessage(result.message || 'Failed to fund user account', 'error');
      }
    } catch (error) {
      showMessage('Error funding user account', 'error');
      console.error(error);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}
  // transfer

const transferForm = document.getElementById('transferForm');
if (transferForm) {
  transferForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Transferring...';
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/auth/transfer-funds`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}` 
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (response.ok) {
        showMessage('Funds transferred successfully!');
        e.target.reset();
      } else {
        showMessage(result.message || 'Failed to transfer funds', 'error');
      }
    } catch (error) {
      showMessage('Error transferring funds', 'error');
      console.error(error);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

//Get Send Email

const sendEmailForm = document.getElementById('sendEmailForm');
if (sendEmailForm) {
  sendEmailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    submitBtn.disabled = true;
    
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    
    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/auth/send-email`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}` 
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      if (response.ok) {
        showMessage('Email sent successfully!');
        e.target.reset();
      } else {
        showMessage(result.message || 'Failed to send email', 'error');
      }
    } catch (error) {
      showMessage('Error sending email', 'error');
      console.error(error);
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}
  // Load Users Function
   
 window.loadUsers = async function() {
  const usersTableBody = document.getElementById('usersTableBody');
  if (!usersTableBody) return;
  
  usersTableBody.innerHTML = '<tr><td colspan="8" class="loading">Loading users...</td></tr>';
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/auth/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
    });
    
    const users = await response.json();
    
    if (response.ok && Array.isArray(users)) {
      usersTableBody.innerHTML = users.map(user => {
        const profilePicPath = user.profilePic || user.profilePicture;
        const imageUrl = getImageUrl(profilePicPath); // USE HELPER FUNCTION
        
        return `
          <tr>
            <td>${user.fullname || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.phone || 'N/A'}</td>
            <td>$${((user.balances?.current || 0) + (user.balances?.savings || 0)).toFixed(2)}</td>
            <td class="${user.isActive !== false ? 'status-active' : 'status-inactive'}">
              ${user.isActive !== false ? 'Active' : 'Inactive'}
            </td>
            <td>${user.savingsAccountNumber || 'Not Generated'}</td>
            <td>${user.currentAccountNumber || 'Not Generated'}</td>
            <td>
              ${imageUrl 
               ? `<img src="${imageUrl}" alt="Profile" style="width: 40px; height: 40px; border-radius: 50%; object-fit: cover;">`
                : '<span style="color: #666;">No Image</span>'
              }
            </td>
          </tr>
        `;
      }).join('');
    } else {
      usersTableBody.innerHTML = '<tr><td colspan="8">Failed to load users</td></tr>';
    }
  } catch (error) {
    console.error('Error loading users:', error);
    usersTableBody.innerHTML = '<tr><td colspan="8">Error loading users</td></tr>';
  }
};
  // Update User Profile functionality
 const updateUserForm = document.getElementById('updateUserForm');   
 const searchUserBtn = document.getElementById('searchUserBtn');   
 const userUpdateFields = document.getElementById('userUpdateFields');    

  if (searchUserBtn) {
   searchUserBtn.addEventListener('click', async () => {
  const email = updateUserForm.searchEmail.value;
 if (!email) return;    

  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/auth/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
    });
    
    const users = await response.json();
    const user = users.find(u => u.email === email);
    
    if (user) {
      updateUserForm.fullname.value = user.fullname || '';
      updateUserForm.email.value = user.email || '';       
      updateUserForm.phone.value = user.phone || '';  
      
 // Display current profile picture       
      const currentProfilePic = document.getElementById('currentProfilePic');
      if (user.profilePic) {
       const imageUrl = getImageUrl(user.profilePic);
       currentProfilePic.src = imageUrl;  
      } else {
        currentProfilePic.src = '/default-avatar.png';
      }
      
      userUpdateFields.style.display = 'block';
    } else {
      showMessage('User not found', 'error');
    }
  } catch (error) {
    showMessage('Error searching user', 'error');
    console.error(error);
  }
});
  }

  if (updateUserForm) {
  updateUserForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const searchEmail = e.target.searchEmail.value;
    
    // Use FormData instead of JSON for file uploads
    const formData = new FormData();
    
    // Add text fields
    if (e.target.fullname.value) formData.append('fullname', e.target.fullname.value);
    if (e.target.email.value) formData.append('email', e.target.email.value);
    if (e.target.phone.value) formData.append('phone', e.target.phone.value);
    
    // Handle file upload
    const fileInput = e.target.profilePic;
    if (fileInput.files.length > 0) {
      formData.append('profilePic', fileInput.files[0]);
    }

    try {
      const response = await fetch(`${BACKEND_URL}/api/admin/auth/users/${searchEmail}/profile`, {
        
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem("adminToken")}`
          // Remove Content-Type header - let browser set it for FormData
        },
        body: formData // Use FormData instead of JSON
      });

      const result = await response.json();
      if (response.ok) {
        showMessage('User profile updated successfully!');
        userUpdateFields.style.display = 'none';
        e.target.reset();
      } else {
        showMessage(result.message || 'Failed to update user profile', 'error');
      }
    } catch (error) {
      showMessage('Error updating user profile', 'error');
      console.error(error);
    }
  });
}
});


function openMailModal() {
  document.getElementById("mailModal").style.display = "block";

  // Fetch messages
  fetch("https://newbank-api.onrender.com/api/admin/auth/messages", { credentials: "include" })
  
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("messageList");
      list.innerHTML = "";

      data.forEach((msg, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
          <div class="collapsible">
            <div class="summary">
              <strong>${msg.email || "Guest User"}</strong> - ${msg.subject}
              <button class="toggle-btn">+</button>
            </div>
            <div class="details" style="display: none; margin-top: 5px;">
              <strong>Name:</strong> ${msg.name || "Guest User"}<br>
              <strong>Email:</strong> ${msg.email}<br>
              <strong>Phone:</strong> ${msg.phone || "N/A"}<br>
              <strong>Subject:</strong> ${msg.subject}<br>
              <strong>Message:</strong> ${msg.message}
            </div>
          </div>
        `;

        // Toggle expand/collapse
        li.querySelector(".toggle-btn").addEventListener("click", (e) => {
          const details = li.querySelector(".details");
          const btn = e.target;
          if (details.style.display === "none") {
            details.style.display = "block";
            btn.textContent = "−";
          } else {
            details.style.display = "none";
            btn.textContent = "+";
          }
        });

        list.appendChild(li);
      });
    });

  // Fetch loan applications
   fetch("https://valley.pvbonline.online/api/admin/auth/loans", { credentials: "include" })
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("loanList");
      list.innerHTML = "";

      data.forEach((loan, index) => {
        const li = document.createElement("li");

        li.innerHTML = `
          <div class="collapsible">
            <div class="summary">
              <strong>${loan.applicantName}</strong> applied for ${loan.loanType} loan - $${loan.loanAmount}
              <button class="toggle-btn">+</button>
            </div>
            <div class="details" style="display: none; margin-top: 5px;">
              <strong>Loan Type:</strong> ${loan.loanType}<br>
              <strong>Amount:</strong> $${loan.loanAmount}<br>
              <strong>Applicant Name:</strong> ${loan.applicantName}<br>
              <strong>Email:</strong> ${loan.applicantEmail}<br>
              <strong>Phone:</strong> ${loan.applicantPhone}<br>
              <strong>Annual Income:</strong> $${loan.annualIncome}<br>
              <strong>Purpose:</strong> ${loan.loanPurpose}<br>
              <strong>Status:</strong> ${loan.status}
            </div>
          </div>
        `;

        // Toggle expand/collapse
        li.querySelector(".toggle-btn").addEventListener("click", (e) => {
          const details = li.querySelector(".details");
          const btn = e.target;
          if (details.style.display === "none") {
            details.style.display = "block";
            btn.textContent = "−";
          } else {
            details.style.display = "none";
            btn.textContent = "+";
          }
        });

        list.appendChild(li);
      });
    });
}

function closeMailModal() {
  document.getElementById("mailModal").style.display = "none";
}




// Connect to your backend socket server
let selectedVisitorId = null;
let chatHistory = {}; // Store chat history for each visitor

const socket = io("https://newbank-api.onrender.com");

// Load chat history from memory on page load
window.addEventListener('DOMContentLoaded', () => {
  loadAllChatHistory();
});

// Admin joins the admin room
socket.emit("joinAdmin", "admin_" + Date.now());

// Request chat history from server for all visitors
socket.emit("requestChatHistory");

// Receive chat history from server
socket.on("chatHistory", (data) => {
  console.log("📚 Received chat history from server:", data);
  
  // Store all conversation history
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(visitorId => {
      if (!chatHistory[visitorId]) {
        chatHistory[visitorId] = [];
      }
      
      // Merge server history with local history
      data[visitorId].forEach(msg => {
        chatHistory[visitorId].push({
          sender: msg.sender || msg.from || "User",
          text: msg.text || msg.message,
          html: `<strong>${msg.sender || msg.from || "User"}:</strong> ${msg.text || msg.message}`,
          timestamp: msg.timestamp || Date.now()
        });
      });
    });
    
    saveAllChatHistory();
    
    // If a user is selected, reload their chat
    if (selectedVisitorId && chatHistory[selectedVisitorId]) {
      loadChatHistory(selectedVisitorId);
    }
  }
});

// Fetch active visitors
function loadChatUsers() {
  console.log("🔍 loadChatUsers called!");
  console.trace("Called from:");
  
  const usersUl = document.getElementById("usersUl");
  if (!usersUl) {
    console.error("❌ usersUl element not found!");
    return;
  }
  
  const existingVisitors = usersUl.querySelectorAll('li[id^="visitor-"]');
  console.log("📋 Existing visitors found:", existingVisitors.length);
  
  if (existingVisitors.length === 0) {
    console.log("📋 No visitors, showing waiting message");
    usersUl.innerHTML = "<li><em>Waiting for visitors to send messages...</em></li>";
  } else {
    console.log("📋 Visitors already in list, preserving them");
  }
}

function selectUser(visitorId, email) {
  // Save current chat before switching (if there was a previous user)
  if (selectedVisitorId) {
    saveChatHistory(selectedVisitorId);
  }
  
  selectedVisitorId = visitorId;
  
  // Clear chat window
  const chatWindow = document.getElementById("chatWindow");
  chatWindow.innerHTML = "";
  
  // Add header
  const headerDiv = document.createElement("div");
  headerDiv.style.padding = "10px";
  headerDiv.style.backgroundColor = "#f5f5f5";
  headerDiv.style.borderBottom = "2px solid #ddd";
  headerDiv.style.marginBottom = "10px";
  headerDiv.innerHTML = `<strong>Chatting with:</strong> ${email}`;
  chatWindow.appendChild(headerDiv);
  
  // Initialize chat history for new visitor
  if (!chatHistory[visitorId]) {
    chatHistory[visitorId] = [];
    // Request history from server for this specific visitor
    socket.emit("requestVisitorHistory", { visitorId: visitorId });
  }
  
  // Load previous chat history for this visitor
  loadChatHistory(visitorId);
  
  console.log("Selected user:", visitorId, email);
}

// Save current chat to history
function saveChatHistory(visitorId) {
  const chatWindow = document.getElementById("chatWindow");
  const messages = chatWindow.querySelectorAll(".chat-message");
  
  chatHistory[visitorId] = Array.from(messages).map(msg => {
    const strongTag = msg.querySelector("strong");
    const sender = strongTag ? strongTag.textContent.replace(":", "").trim() : "User";
    const text = msg.textContent.replace(/^[^:]+:\s*/, "").trim();
    
    return {
      sender: sender,
      text: text,
      html: msg.innerHTML,
      timestamp: Date.now()
    };
  });
  
  // Save to memory
  saveAllChatHistory();
  
  console.log(`💾 Saved ${messages.length} messages for ${visitorId}`);
}

// Load chat history for a visitor
function loadChatHistory(visitorId) {
  const chatWindow = document.getElementById("chatWindow");
  
  if (chatHistory[visitorId] && chatHistory[visitorId].length > 0) {
    chatHistory[visitorId].forEach(msg => {
      const msgDiv = document.createElement("div");
      msgDiv.className = "chat-message";
      msgDiv.style.padding = "8px";
      msgDiv.style.marginBottom = "5px";
      msgDiv.innerHTML = msg.html;
      chatWindow.appendChild(msgDiv);
    });
    
    chatWindow.scrollTop = chatWindow.scrollHeight;
    console.log(`📂 Loaded ${chatHistory[visitorId].length} messages for ${visitorId}`);
  } else {
    console.log(`📭 No chat history for ${visitorId}`);
  }
}

// Save all chat history to memory (in-memory storage only)
function saveAllChatHistory() {
  // Store in memory - data persists during session
  window.adminChatHistory = chatHistory;
  console.log("💾 Saved all chat history to memory");
}

// Load all chat history from memory
function loadAllChatHistory() {
  if (window.adminChatHistory) {
    chatHistory = window.adminChatHistory;
    console.log("📂 Loaded chat history from memory");
  }
}

// Typing indicator handling
let typingTimeout;
const input = document.getElementById("chatMessage");

if (input) {
  input.addEventListener("input", () => {
    if (!selectedVisitorId) return;
    
    // Emit typing event
    socket.emit("adminTyping", { visitorId: selectedVisitorId, typing: true });
    
    // Clear previous timeout
    clearTimeout(typingTimeout);
    
    // Stop typing after 2 seconds of inactivity
    typingTimeout = setTimeout(() => {
      socket.emit("adminTyping", { visitorId: selectedVisitorId, typing: false });
    }, 2000);
  });
}

// ✨ Listen for visitor typing
socket.on("visitorTyping", (data) => {
  console.log("👤 Visitor typing event received:", data);
  
  // Show typing indicator if this visitor is currently selected
  if (data.visitorId === selectedVisitorId) {
    showTypingIndicator(data.typing);
  }
  
  // Also highlight the visitor in the list if they're typing but not selected
  if (data.typing && data.visitorId !== selectedVisitorId) {
    const visitorLi = document.getElementById(`visitor-${data.visitorId}`);
    if (visitorLi) {
      // Add a small typing indicator next to their name
      if (!visitorLi.querySelector('.typing-badge')) {
        const badge = document.createElement('span');
        badge.className = 'typing-badge';
        badge.textContent = ' ✍️';
        badge.style.fontSize = '12px';
        visitorLi.appendChild(badge);
      }
    }
  } else {
    // Remove typing badge when they stop typing
    const visitorLi = document.getElementById(`visitor-${data.visitorId}`);
    if (visitorLi) {
      const badge = visitorLi.querySelector('.typing-badge');
      if (badge) badge.remove();
    }
  }
});

function showTypingIndicator(isTyping) {
  const chatWindow = document.getElementById("chatWindow");
  let typingDiv = document.getElementById("typing-indicator");
  
  if (isTyping) {
    if (!typingDiv) {
      typingDiv = document.createElement("div");
      typingDiv.id = "typing-indicator";
      typingDiv.style.padding = "8px";
      typingDiv.style.fontStyle = "italic";
      typingDiv.style.color = "#666";
      typingDiv.style.backgroundColor = "#f9f9f9";
      typingDiv.style.borderRadius = "5px";
      typingDiv.style.marginTop = "5px";
      typingDiv.innerHTML = "User is typing<span class='dots'>...</span>";
      chatWindow.appendChild(typingDiv);
      
      // Animate dots
      animateTypingDots();
    }
  } else {
    if (typingDiv) {
      typingDiv.remove();
    }
  }
  
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

function animateTypingDots() {
  const dotsSpan = document.querySelector("#typing-indicator .dots");
  if (!dotsSpan) return;
  
  let dotCount = 0;
  const interval = setInterval(() => {
    if (!document.getElementById("typing-indicator")) {
      clearInterval(interval);
      return;
    }
    dotCount = (dotCount + 1) % 4;
    dotsSpan.textContent = ".".repeat(dotCount);
  }, 500);
}

// Send message
function sendMessage() {
  if (!selectedVisitorId) {
    alert("Please select a user first.");
    return;
  }

  const input = document.getElementById("chatMessage");
  const message = input.value.trim();
  if (!message) return;

  // Stop typing indicator
  socket.emit("adminTyping", { visitorId: selectedVisitorId, typing: false });
  clearTimeout(typingTimeout);

  socket.emit("adminMessage", { visitorId: selectedVisitorId, text: message });

  appendMessage("Admin", message);
  
  // Save to history immediately
  if (!chatHistory[selectedVisitorId]) {
    chatHistory[selectedVisitorId] = [];
  }
  chatHistory[selectedVisitorId].push({
    sender: "Admin",
    text: message,
    html: `<strong>Admin:</strong> ${message}`,
    timestamp: Date.now()
  });
  saveAllChatHistory();
  
  input.value = "";
}

// Receive visitor messages
socket.on("chatMessage", (data) => {
  console.log("📨 Received message:", data);
  
  // Extract visitorId - handle different data formats
  const visitorId = data.visitorId || data.sender;
  const messageText = data.text || data.message;
  
  console.log("Extracted visitorId:", visitorId, "Message:", messageText);
  
  // Auto-add visitor to list if not already there
  if (!document.getElementById(`visitor-${visitorId}`)) {
    const usersUl = document.getElementById("usersUl");
    if (usersUl) {
      // Clear the "Waiting for visitors..." message
      if (usersUl.innerHTML.includes("Waiting for visitors")) {
        usersUl.innerHTML = "";
      }
      
      // Create new visitor list item
      const li = document.createElement("li");
      li.textContent = visitorId;
      li.style.cursor = "pointer";
      li.style.padding = "8px";
      li.style.borderBottom = "1px solid #ddd";
      li.style.listStyle = "none";
      li.onclick = () => {
        selectUser(visitorId, visitorId);
        // Highlight selected user
        document.querySelectorAll("#usersUl li").forEach(item => {
          item.style.backgroundColor = "";
          item.style.fontWeight = "normal";
        });
        li.style.backgroundColor = "#e3f2fd";
      };
      li.id = `visitor-${visitorId}`;
      usersUl.appendChild(li);
      
      console.log("✅ Added visitor to list:", visitorId);
    }
  }
  
  // Initialize chat history if needed
  if (!chatHistory[visitorId]) {
    chatHistory[visitorId] = [];
  }
  
  // Store message in history
  const messageData = {
    sender: "User",
    text: messageText,
    html: `<strong>User:</strong> ${messageText}`,
    timestamp: Date.now()
  };
  
  chatHistory[visitorId].push(messageData);
  saveAllChatHistory();
  
  // Handle the message display
  if (visitorId === selectedVisitorId) {
    console.log("✅ Displaying message for selected user");
    appendMessage("User", messageText);
  } else {
    console.log("📩 New message from another visitor:", visitorId);
    // Highlight visitor with new message
    const visitorLi = document.getElementById(`visitor-${visitorId}`);
    if (visitorLi) {
      visitorLi.style.backgroundColor = "#ffeb3b";
      visitorLi.style.fontWeight = "bold";
    }
  }
});

function appendMessage(sender, message) {
  const chatWindow = document.getElementById("chatWindow");
  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-message";
  msgDiv.style.padding = "8px";
  msgDiv.style.marginBottom = "5px";
  msgDiv.innerHTML = `<strong>${sender}:</strong> ${message}`;
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}


 // ==================== SUPER ADMIN SPECIFIC FUNCTIONS ====================

// Load all admins
window.loadAdmins = async function() {
  const adminsTableBody = document.getElementById('adminsTableBody');
  if (!adminsTableBody) return;
  
   adminsTableBody.innerHTML = '<tr><td colspan="7" class="loading">Loading admins...</td></tr>';
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/auth/admins`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
    });
    
    const result = await response.json();
    
    if (response.ok && result.admins) {
      adminsTableBody.innerHTML = result.admins.map(admin => `
       <tr>
         <td>${admin.username}</td>
         <td>${admin.email}</td>
         <td><span class="role-badge ${admin.role}">${admin.role}</span></td>
         <td>$${admin.wallet || 0}</td>
         <td class="${admin.isActive !== false ? 'status-active' : 'status-inactive'}">
          ${admin.isActive !== false ? 'Active' : 'Inactive'}
         </td>
          <td>${new Date(admin.createdAt).toLocaleDateString()}</td>
          <td>
         ${admin.role !== 'superadmin' ? `
         <button onclick="fundAdminWalletInline('${admin._id}', '${admin.username}')" style="background: #28a745; color: white; border: none; padding: 5px 10px; cursor: pointer; border-radius: 4px;">
          💰 Fund
         </button>
         ` : '<span style="color: #999;">N/A</span>'}
         </td>
        </tr>
       `).join('');
  } else {
  adminsTableBody.innerHTML = '<tr><td colspan="7">Failed to load admins</td></tr>';
}
} catch (error) {
console.error('Error loading admins:', error);
adminsTableBody.innerHTML = '<tr><td colspan="7">Error loading admins</td></tr>';
}
};


// Inline fund admin wallet
window.fundAdminWalletInline = async function(adminId, username) {
  const amount = prompt(`Enter amount to fund ${username}'s wallet:`);
  
  if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
    alert("Invalid amount");
    return;
  }

  const token = localStorage.getItem("adminToken");

  try {
    const res = await fetch(`${BACKEND_URL}/api/admin/auth/fund-wallet`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        adminId: adminId,
        amount: parseFloat(amount)
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      alert(data.message || "Failed to fund wallet");
    } else {
      alert(`Successfully funded ${username}'s wallet with $${amount}`);
      loadAdmins(); // Reload the admin list to show updated wallet
    }
  } catch (error) {
    console.error("Fund wallet error:", error);
    alert("An error occurred. Check console.");
  }
};

// Load deleted users (recycle bin)
window.loadRecycleBin = async function() {
  const recycleBinTableBody = document.getElementById('recycleBinTableBody');
  if (!recycleBinTableBody) return;
  
  recycleBinTableBody.innerHTML = '<tr><td colspan="5" class="loading">Loading deleted users...</td></tr>';
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/auth/recycle-bin/users`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
    });
    
    const result = await response.json();
    
    if (response.ok && result.users) {
      if (result.users.length === 0) {
        recycleBinTableBody.innerHTML = '<tr><td colspan="5">🎉 Recycle bin is empty</td></tr>';
        return;
      }
      
      recycleBinTableBody.innerHTML = result.users.map(user => `
        <tr>
          <td>${user.fullname}</td>
          <td>${user.email}</td>
          <td>${user.deletedAt ? new Date(user.deletedAt).toLocaleDateString() : 'N/A'}</td>
          <td><span class="role-badge ${user.deletedBy}">${user.deletedBy || 'N/A'}</span></td>
          <td>
            <button onclick="restoreUser('${user.email}')" class="btn btn-approve" style="padding: 5px 10px; margin-right: 5px;">
              ✅ Restore
            </button>
            <button onclick="permanentDeleteUser('${user.email}')" class="btn btn-reject" style="padding: 5px 10px;">
              🗑️ Delete Forever
            </button>
          </td>
        </tr>
      `).join('');
    } else {
      recycleBinTableBody.innerHTML = '<tr><td colspan="5">Failed to load recycle bin</td></tr>';
    }
  } catch (error) {
    console.error('Error loading recycle bin:', error);
    recycleBinTableBody.innerHTML = '<tr><td colspan="5">Error loading recycle bin</td></tr>';
  }
};

// Restore user from recycle bin
async function restoreUser(email) {
  if (!confirm(`Restore user ${email}?`)) return;
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/auth/recycle-bin/users/${email}/restore`, {
      method: 'PUT',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
    });
    
    const result = await response.json();
    if (response.ok) {
      alert('✅ User restored successfully!');
      loadRecycleBin();
    } else {
      alert(`❌ Error: ${result.message}`);
    }
  } catch (error) {
    alert('❌ Error restoring user');
    console.error(error);
  }
}

// Permanent delete user
async function permanentDeleteUser(email) {
  if (!confirm(`⚠️ PERMANENTLY delete ${email}? This cannot be undone!`)) return;
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/auth/recycle-bin/users/${email}/permanent`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
    });
    
    const result = await response.json();
    if (response.ok) {
      alert('🗑️ User permanently deleted!');
      loadRecycleBin();
    } else {
      alert(`❌ Error: ${result.message}`);
    }
  } catch (error) {
    alert('❌ Error deleting user');
    console.error(error);
  }
}

// Load chat history for super admin
// window.loadChatHistoryView = async function() {
//   const userList = document.getElementById('chatHistoryUserList');
//   if (!userList) return;
  
//   userList.innerHTML = '<li style="padding: 10px;">Loading users...</li>';
  
//   // Get all users who have chat history
//   if (window.adminChatHistory && Object.keys(window.adminChatHistory).length > 0) {
//     const visitors = Object.keys(window.adminChatHistory);
//     userList.innerHTML = visitors.map(visitorId => `
//       <li style="padding: 10px; cursor: pointer; border-bottom: 1px solid #ddd;" 
//           onclick="displayChatHistory('${visitorId}')">
//         ${visitorId}
//       </li>
//     `).join('');
//   } else {
//     userList.innerHTML = '<li style="padding: 10px;">No chat history available</li>';
//   }
// };
// Load chat history for super admin (from database)
window.loadChatHistoryView = async function() {
  const userList = document.getElementById('chatHistoryUserList');
  const chatDisplay = document.getElementById('chatHistoryDisplay');
  
  if (!userList) return;
  
  userList.innerHTML = '<li style="padding: 10px;">Loading users...</li>';
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat/history`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
    });
    
    if (!response.ok) throw new Error('Failed to load chat history');
    
    const data = await response.json();
    const messages = data.messages;
    
    if (!messages || messages.length === 0) {
      userList.innerHTML = '<li style="padding: 10px;">No chat history available</li>';
      chatDisplay.innerHTML = '<p>No messages found</p>';
      return;
    }
    
    // Group messages by user/visitor
    const chatsByUser = {};
    messages.forEach(msg => {
      const userId = msg.sender === 'admin' ? msg.receiverEmail : msg.senderEmail;
      if (!chatsByUser[userId]) {
        chatsByUser[userId] = [];
      }
      chatsByUser[userId].push(msg);
    });
    
    // Display user list
    userList.innerHTML = Object.keys(chatsByUser).map(userId => `
      <li style="padding: 10px; cursor: pointer; border-bottom: 1px solid #ddd;" 
          onclick="displayDatabaseChatHistory('${userId}')">
        ${userId} <span style="color: #666; font-size: 12px;">(${chatsByUser[userId].length} messages)</span>
      </li>
    `).join('');
    
    // Store for access
    window.databaseChatHistory = chatsByUser;
    
  } catch (error) {
    console.error('Error loading chat history:', error);
    userList.innerHTML = '<li style="padding: 10px; color: red;">Error loading chat history</li>';
  }
};

// Display specific user's chat history from database
window.displayDatabaseChatHistory = async function(userEmail) {
  const display = document.getElementById('chatHistoryDisplay');
  if (!display) return;
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/chat/history/${userEmail}`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
    });
    
    if (!response.ok) throw new Error('Failed to load chat');
    
    const data = await response.json();
    const messages = data.messages;
    
    if (!messages || messages.length === 0) {
      display.innerHTML = `<p>No messages found for ${userEmail}</p>`;
      return;
    }
    
    display.innerHTML = `
      <h2>💬 Chat History with ${userEmail}</h2>
      <div style="max-height: 600px; overflow-y: auto; border: 1px solid #ddd; padding: 15px; border-radius: 5px; background: #f9f9f9;">
        ${messages.map(msg => `
          <div style="margin-bottom: 15px; padding: 12px; background: ${msg.sender === 'admin' ? '#e3f2fd' : '#fff'}; border-radius: 8px; border-left: 3px solid ${msg.sender === 'admin' ? '#2196F3' : '#4CAF50'};">
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
              <strong style="color: ${msg.sender === 'admin' ? '#1976D2' : '#388E3C'};">
                ${msg.sender === 'admin' ? `👨‍💼 ${msg.senderName}` : '👤 User'}
              </strong>
              <small style="color: #666;">${new Date(msg.createdAt).toLocaleString()}</small>
            </div>
            <div style="color: #333;">${msg.message}</div>
          </div>
        `).join('')}
      </div>
    `;
    
    // Scroll to bottom
    const chatContainer = display.querySelector('div');
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
    
  } catch (error) {
    console.error('Error loading chat for user:', error);
    display.innerHTML = `<p style="color: red;">Error loading chat history for ${userEmail}</p>`;
  }
};



// Admin management form handlers
document.addEventListener("DOMContentLoaded", () => {
  // Deactivate Admin
  const deactivateAdminForm = document.getElementById('deactivateAdminForm');
  if (deactivateAdminForm) {
    deactivateAdminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/auth/admins/${email}/deactivate`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
        });
        
        const result = await response.json();
        if (response.ok) {
          alert('Admin deactivated successfully!');
          e.target.reset();
          if (typeof loadAdmins === 'function') loadAdmins();
        } else {
          alert(result.message || 'Failed to deactivate admin');
        }
      } catch (error) {
        alert('Error deactivating admin');
        console.error(error);
      }
    });
  }
  
  // Reactivate Admin
  const reactivateAdminForm = document.getElementById('reactivateAdminForm');
  if (reactivateAdminForm) {
    reactivateAdminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/auth/admins/${email}/reactivate`, {
          method: 'PUT',
          headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
        });
        
        const result = await response.json();
        if (response.ok) {
          alert('Admin reactivated successfully!');
          e.target.reset();
          if (typeof loadAdmins === 'function') loadAdmins();
        } else {
          alert(result.message || 'Failed to reactivate admin');
        }
      } catch (error) {
        alert('Error reactivating admin');
        console.error(error);
      }
    });
  }
  
  // Delete Admin
  const deleteAdminForm = document.getElementById('deleteAdminForm');
  if (deleteAdminForm) {
    deleteAdminForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = e.target.email.value;
      
      if (!confirm(`Delete admin ${email}?`)) return;
      
      try {
        const response = await fetch(`${BACKEND_URL}/api/admin/auth/admins/${email}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
        });
        
        const result = await response.json();
        if (response.ok) {
          alert('Admin deleted successfully!');
          e.target.reset();
          if (typeof loadAdmins === 'function') loadAdmins();
        } else {
          alert(result.message || 'Failed to delete admin');
        }
      } catch (error) {
        alert('Error deleting admin');
        console.error(error);
      }
    });
  }
});

// Card

 // Global variables
        let currentCardId = null;
        let allCardsData = [];
        // const BACKEND_URL = 'https://newbank-api.onrender.com';

        // Initialize on page
     function initializeCardManagement() {
    loadPendingCards();
    loadStats();
}

// Open rejection modal
function openRejectionModal(cardId) {
    currentCardId = cardId;
    document.getElementById('rejectionModal').style.display = 'block';
}

// Close rejection modal
function closeRejectionModal() {
    document.getElementById('rejectionModal').style.display = 'none';
    document.getElementById('rejectionForm').reset();
    currentCardId = null;
}

// Handle rejection form submission - Add this event listener separately
document.addEventListener('DOMContentLoaded', () => {
    const rejectionForm = document.getElementById('rejectionForm');
    if (rejectionForm) {
        rejectionForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const reason = document.getElementById('rejectionReason').value;
            
            try {
                const response = await fetch(`${BACKEND_URL}/api/admin/reject-card/${currentCardId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    },
                    body: JSON.stringify({ reason })
                });

                const result = await response.json();
                
                if (response.ok) {
                    alert('❌ Card application rejected successfully!');
                    closeRejectionModal();
                    loadPendingCards();
                    loadStats();
                } else {
                    alert(`❌ Error: ${result.message}`);
                }
            } catch (error) {
                alert('❌ Network error. Please try again.');
                console.error('Error rejecting card:', error);
            }
        });
    }
});

        // Tab switching
        function showTab(tabName) {
            // Hide all tab contents
            document.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Remove active class from all tabs
            document.querySelectorAll('.tab').forEach(tab => {
                tab.classList.remove('active');
            });
            
            // Show selected tab content
            document.getElementById(tabName).classList.add('active');
            
            // Add active class to clicked tab
            event.target.classList.add('active');
            
            // Load data based on tab
            switch(tabName) {
                case 'pending':
                    loadPendingCards();
                    break;
                case 'approved':
                    loadApprovedCards();
                    break;
                case 'all':
                    loadAllCards();
                    break;
                case 'stats':
                    loadStats();
                    break;
            }
        }

        // Load pending card applications
        async function loadPendingCards() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/admin/pending-cards`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                const result = await response.json();
                
                if (response.ok) {
                    displayPendingCards(result.pendingCards);
                } else {
                    console.error('Error loading pending cards:', result.message);
                }
            } catch (error) {
                console.error('Network error loading pending cards:', error);
            }
        }

        // Load approved cards
        async function loadApprovedCards() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/admin/all-cards?status=approved`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                const result = await response.json();
                
                if (response.ok) {
                    displayApprovedCards(result.cards);
                } else {
                    console.error('Error loading approved cards:', result.message);
                }
            } catch (error) {
                console.error('Network error loading approved cards:', error);
            }
        }

        // Load all cards
        async function loadAllCards() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/admin/all-cards`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                const result = await response.json();
                
                if (response.ok) {
                    allCardsData = result.cards;
                    displayAllCards(result.cards);
                } else {
                    console.error('Error loading all cards:', result.message);
                }
            } catch (error) {
                console.error('Network error loading all cards:', error);
            }
        }

        // Load statistics
        async function loadStats() {
            try {
                const response = await fetch(`${BACKEND_URL}/api/admin/all-cards`, {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                const result = await response.json();
                
                if (response.ok) {
                    const cards = result.cards;
                    const totalCards = cards.length;
                    const pendingCards = cards.filter(card => card.status === 'pending').length;
                    const approvedCards = cards.filter(card => card.status === 'approved').length;
                    const activeCards = cards.filter(card => card.status === 'approved' && card.isActive).length;

                    document.getElementById('totalCards').textContent = totalCards;
                    document.getElementById('pendingCards').textContent = pendingCards;
                    document.getElementById('approvedCards').textContent = approvedCards;
                    document.getElementById('activeCards').textContent = activeCards;
                }
            } catch (error) {
                console.error('Network error loading stats:', error);
            }
        }

        // Display pending cards
        function displayPendingCards(cards) {
            const container = document.getElementById('pendingCardsContainer');
            
            if (cards.length === 0) {
                container.innerHTML = `
                    <div class="empty-state">
                        <h3>🎉 No Pending Applications</h3>
                        <p>All card applications have been processed.</p>
                    </div>
                `;
                return;
            }

            container.innerHTML = cards.map(card => `
                <div class="card-application pending">
                    <div class="card-header">
                        <div class="user-info">
                            <h3>${card.userId.fullname}</h3>
                            <p>${card.userId.email}</p>
                        </div>
                        <span class="status-badge pending">${card.status}</span>
                    </div>
                    
                    <div class="card-details">
                        <div class="detail-item">
                            <label>Card Holder Name</label>
                            <span>${card.cardHolderName}</span>
                        </div>
                        <div class="detail-item">
                            <label>Card Type</label>
                            <span>${card.cardType.toUpperCase()}</span>
                        </div>
                        <div class="detail-item">
                            <label>Card Number</label>
                            <span>${card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}</span>
                        </div>
                        <div class="detail-item">
                            <label>Expiry Date</label>
                            <span>${card.expiryDate}</span>
                        </div>
                        <div class="detail-item">
                            <label>CVV</label>
                            <span>${card.cvv}</span>
                        </div>
                        <div class="detail-item">
                            <label>Applied On</label>
                            <span>${new Date(card.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                    
                    <div class="card-actions">
                        <button class="btn btn-approve" onclick="approveCard('${card._id}')">
                            ✅ Approve
                        </button>
                        <button class="btn btn-reject" onclick="openRejectionModal('${card._id}')">
                            ❌ Reject
                        </button>
                    </div>
                </div>
            `).join('');
        }

      
        // Display approved cards
function displayApprovedCards(cards) {
    const container = document.getElementById('approvedCardsContainer');
    
    if (cards.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📭 No Approved Cards</h3>
                <p>No cards have been approved yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cards.map(card => {
        const fullname = card.userId ? card.userId.fullname : 'N/A';
        const email = card.userId ? card.userId.email : 'N/A';
        const balance = card.cardBalance ?? 0;

        return `
        <div class="card-application approved">
            <div class="card-header">
                <div class="user-info">
                    <h3>${fullname}</h3>
                    <p>${email}</p>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span class="status-badge approved">${card.status}</span>
                    <span class="status-badge ${card.isActive ? 'approved' : 'rejected'}">
                        ${card.isActive ? 'Active' : 'Inactive'}
                    </span>
                </div>
            </div>
            
            <div class="card-details">
                <div class="detail-item">
                    <label>Card Holder Name</label>
                    <span>${card.cardHolderName}</span>
                </div>
                <div class="detail-item">
                    <label>Card Type</label>
                    <span>${card.cardType.toUpperCase()}</span>
                </div>
                <div class="detail-item">
                    <label>Card Number</label>
                    <span>${card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}</span>
                </div>
                <div class="detail-item">
                    <label>Balance</label>
                    <span>$${balance.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <label>Created By</label>
                    <span>${card.createdBy.toUpperCase()}</span>
                </div>
                <div class="detail-item">
                    <label>Approved On</label>
                    <span>${card.approvedAt ? new Date(card.approvedAt).toLocaleDateString() : 'N/A'}</span>
                </div>
            </div>
            
            <div class="card-actions">
                ${card.isActive 
                    ? `<button class="btn btn-deactivate" onclick="deactivateCard('${card._id}')">🚫 Deactivate</button>`
                    : `<button class="btn btn-reactivate" onclick="reactivateCard('${card._id}')">✅ Reactivate</button>`
                }
            </div>
        </div>`;
    }).join('');
}

// Display all cards
function displayAllCards(cards) {
    const container = document.getElementById('allCardsContainer');
    
    if (cards.length === 0) {
        container.innerHTML = `
            <div class="empty-state">
                <h3>📭 No Cards Found</h3>
                <p>No cards match the selected filters.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = cards.map(card => {
        const fullname = card.userId ? card.userId.fullname : 'N/A';
        const email = card.userId ? card.userId.email : 'N/A';
        const balance = card.cardBalance ?? 0;

        return `
        <div class="card-application ${card.status}">
            <div class="card-header">
                <div class="user-info">
                    <h3>${fullname}</h3>
                    <p>${email}</p>
                </div>
                <div style="display: flex; gap: 10px; align-items: center;">
                    <span class="status-badge ${card.status}">${card.status}</span>
                    ${card.status === 'approved' ? `
                        <span class="status-badge ${card.isActive ? 'approved' : 'rejected'}">
                            ${card.isActive ? 'Active' : 'Inactive'}
                        </span>
                    ` : ''}
                </div>
            </div>
            
            <div class="card-details">
                <div class="detail-item">
                    <label>Card Holder Name</label>
                    <span>${card.cardHolderName}</span>
                </div>
                <div class="detail-item">
                    <label>Card Type</label>
                    <span>${card.cardType.toUpperCase()}</span>
                </div>
                <div class="detail-item">
                    <label>Card Number</label>
                    <span>${card.cardNumber.replace(/(.{4})/g, '$1 ').trim()}</span>
                </div>
                <div class="detail-item">
                    <label>Balance</label>
                    <span>$${balance.toLocaleString()}</span>
                </div>
                <div class="detail-item">
                    <label>Created By</label>
                    <span>${card.createdBy.toUpperCase()}</span>
                </div>
                <div class="detail-item">
                    <label>Applied On</label>
                    <span>${new Date(card.createdAt).toLocaleDateString()}</span>
                </div>
                ${card.rejectionReason ? `
                    <div class="detail-item" style="grid-column: 1 / -1;">
                        <label>Rejection Reason</label>
                        <span style="color: #dc3545;">${card.rejectionReason}</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="card-actions">
                ${card.status === 'pending' ? `
                    <button class="btn btn-approve" onclick="approveCard('${card._id}')">✅ Approve</button>
                    <button class="btn btn-reject" onclick="openRejectionModal('${card._id}')">❌ Reject</button>
                ` : card.status === 'approved' ? `
                    ${card.isActive 
                        ? `<button class="btn btn-deactivate" onclick="deactivateCard('${card._id}')">🚫 Deactivate</button>`
                        : `<button class="btn btn-reactivate" onclick="reactivateCard('${card._id}')">✅ Reactivate</button>`
                    }
                ` : ''}
            </div>
        </div>`;
    }).join('');
}

        // Approve card
      async function approveCard(cardId) {
            if (!confirm('Are you sure you want to approve this card application?')) {
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/admin/approve-card/${cardId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                const result = await response.json();
                
                if (response.ok) {
                    alert('✅ Card approved successfully!');
                    loadPendingCards();
                    loadStats();
                } else {
                    alert(`❌ Error: ${result.message}`);
                }
            } catch (error) {
                alert('❌ Network error. Please try again.');
                console.error('Error approving card:', error);
            }
        }

                            // Deactivate card
        async function deactivateCard(cardId) {
            if (!confirm('Are you sure you want to deactivate this card? The user will not be able to use it.')) {
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/admin/deactivate-card/${cardId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                const result = await response.json();
                
                if (response.ok) {
                    alert('🚫 Card deactivated successfully!');
                    loadApprovedCards();
                    loadAllCards();
                    loadStats();
                } else {
                    alert(`❌ Error: ${result.message}`);
                }
            } catch (error) {
                alert('❌ Network error. Please try again.');
                console.error('Error deactivating card:', error);
            }
        }


              // Reactivate card
        async function reactivateCard(cardId) {
            if (!confirm('Are you sure you want to reactivate this card?')) {
                return;
            }

            try {
                const response = await fetch(`${BACKEND_URL}/api/admin/reactivate-card/${cardId}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                    }
                });

                const result = await response.json();
                
                if (response.ok) {
                    alert('✅ Card reactivated successfully!');
                    loadApprovedCards();
                    loadAllCards();
                    loadStats();
                } else {
                    alert(`❌ Error: ${result.message}`);
                }
            } catch (error) {
                alert('❌ Network error. Please try again.');
                console.error('Error reactivating card:', error);
            }
        }
                // Filter approved cards
        function filterCards() {
            const statusFilter = document.getElementById('statusFilter').value;
            const cardTypeFilter = document.getElementById('cardTypeFilter').value;
            
            let url = `${BACKEND_URL}/api/admin/all-cards?status=approved`;
            
            if (statusFilter !== '') {
                url += `&isActive=${statusFilter}`;
            }
            
            if (cardTypeFilter !== '') {
                url += `&cardType=${cardTypeFilter}`;
            }
            
            fetch(url, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
                }
            })
            .then(response => response.json())
            .then(result => {
                if (result.cards) {
                    displayApprovedCards(result.cards);
                }
            })
            .catch(error => console.error('Error filtering cards:', error));
        }

        // Filter all cards
        function filterAllCards() {
            const statusFilter = document.getElementById('allStatusFilter').value;
            const activeFilter = document.getElementById('allActiveFilter').value;
            const cardTypeFilter = document.getElementById('allCardTypeFilter').value;
            
            let filteredCards = [...allCardsData];
            
            if (statusFilter) {
                filteredCards = filteredCards.filter(card => card.status === statusFilter);
            }
            
            if (activeFilter !== '') {
                filteredCards = filteredCards.filter(card => card.isActive === (activeFilter === 'true'));
            }
            
            if (cardTypeFilter) {
                filteredCards = filteredCards.filter(card => card.cardType === cardTypeFilter);
            }
            
            displayAllCards(filteredCards);
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('rejectionModal');
            if (event.target === modal) {
                closeRejectionModal();
            }
        }

        function openCardCreationPage() {
    // Option 1: Open in new tab (recommended)
    window.open('adminusercard', '_blank');
    
    // Option 2: Open in same window
    // window.location.href = 'admin-card-creation.html';
    
    // Option 3: Open in popup window
    // window.open('admin-card-creation.html', 'cardCreation', 'width=1200,height=800,scrollbars=yes');
}

// Load sent emails
window.loadSentEmails = async function() {
  const tbody = document.getElementById('sentEmailsTableBody');
  if (!tbody) return;
  
  tbody.innerHTML = '<tr><td colspan="6" class="loading">Loading emails...</td></tr>';
  
  try {
    const response = await fetch(`${BACKEND_URL}/api/admin/auth/sent-emails`, {
      headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
    });
    
    const result = await response.json();
    
    if (response.ok && result.emails) {
      tbody.innerHTML = result.emails.map(email => `
        <tr>
          <td>${email.senderId?.username || email.senderEmail} (${email.senderType})</td>
          <td>${email.recipientName || email.recipientEmail}</td>
          <td>${email.subject}</td>
          <td style="max-width: 300px; overflow: hidden; text-overflow: ellipsis;">${email.message}</td>
          <td><span class="status-${email.status}">${email.status}</span></td>
          <td>${new Date(email.sentAt).toLocaleString()}</td>
        </tr>
      `).join('');
    } else {
      tbody.innerHTML = '<tr><td colspan="6">Failed to load emails</td></tr>';
    }
  } catch (error) {
    console.error('Error loading emails:', error);
    tbody.innerHTML = '<tr><td colspan="6">Error loading emails</td></tr>';
  }
};

// Fund Admin Wallet Handler
const fundAdminWalletForm = document.getElementById("fundAdminWalletForm");

fundAdminWalletForm?.addEventListener("submit", async (e) => {
  e.preventDefault();
  
  const email = document.getElementById("adminEmailForFunding").value.trim();
  const amount = parseFloat(document.getElementById("adminFundAmount").value);
  const token = localStorage.getItem("adminToken");

  try {
    // First, get admin ID by email
    const adminRes = await fetch(`https://newbank-api.onrender.com/api/admin/get-by-email?email=${email}`, {
      headers: { Authorization: `Bearer ${token}` }
    });

    if (!adminRes.ok) {
      alert("Admin not found");
      return;
    }

    const adminData = await adminRes.json();

    // Then fund the wallet
    const res = await fetch("https://newbank-api.onrender.com/api/admin/auth/fund-wallet", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({
        adminId: adminData._id,
        amount: amount
      })
    });

    const data = await res.json();
    
    if (!res.ok) {
      alert(data.message || "Failed to fund wallet");
    } else {
      alert(`Successfully funded ${adminData.username}'s wallet with $${amount}`);
      fundAdminWalletForm.reset();
    }
  } catch (error) {
    console.error("Fund wallet error:", error);
    alert("An error occurred. Check console.");
  }
});

// send email form handler
  // Send Email Form
  // const sendEmailForm = document.getElementById('sendEmailForm');
  // if (sendEmailForm) {
  //   sendEmailForm.addEventListener('submit', async (e) => {
  //     e.preventDefault();
  //     const formData = new FormData(e.target);
  //     const data = Object.fromEntries(formData);
      
  //     try {
  //       const response = await fetch(`${BACKEND_URL}/api/admin/auth/send-email`, {
  //         method: 'POST',
  //         headers: { 
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${localStorage.getItem("adminToken")}` 
  //         },
  //         body: JSON.stringify(data)
  //       });
        
  //       const result = await response.json();
  //       if (response.ok) {
  //         showMessage('Email sent successfully!');
  //         e.target.reset();
  //       } else {
  //         showMessage(result.message || 'Failed to send email', 'error');
  //       }
  //     } catch (error) {
  //       showMessage('Error sending email', 'error');
  //       console.error(error);
  //     }
  //   });
  // }

  // transfer

// const transferForm = document.getElementById('transferForm');
// if (transferForm) {
//   transferForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const formData = new FormData(e.target);
//     const data = Object.fromEntries(formData); // This will now include both senderDescription and receiverDescription
    
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/admin/auth/transfer-funds`, {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${localStorage.getItem("adminToken")}` 
//         },
//         body: JSON.stringify(data) // Sends both descriptions to backend
//       });
      
//       const result = await response.json();
//       if (response.ok) {
//         showMessage('Funds transferred successfully!');
//         e.target.reset();
//       } else {
//         showMessage(result.message || 'Failed to transfer funds', 'error');
//       }
//     } catch (error) {
//       showMessage('Error transferring funds', 'error');
//       console.error(error);
//     }
//   });
// }

// Fund User Form
  // const fundUserForm = document.getElementById('fundUserForm');
  // if (fundUserForm) {
  //   fundUserForm.addEventListener('submit', async (e) => {
  //     e.preventDefault();
  //     const formData = new FormData(e.target);
  //     const data = Object.fromEntries(formData);
      
  //     try {
  //       const response = await fetch(`${BACKEND_URL}/api/admin/auth/fund-user`, {
  //         method: 'POST',
  //         headers: { 
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${localStorage.getItem("adminToken")}` 
  //         },
  //         body: JSON.stringify(data)
  //       });
        
  //       const result = await response.json();
  //       if (response.ok) {
  //         showMessage('User account funded successfully!');
  //         e.target.reset();
  //       } else {
  //         showMessage(result.message || 'Failed to fund user account', 'error');
  //       }
  //     } catch (error) {
  //       showMessage('Error funding user account', 'error');
  //       console.error(error);
  //     }
  //   });
  // }


    // Reactivate User Form

//   const reactivateUserForm = document.getElementById('reactivateUserForm');
// if (reactivateUserForm) {
//   reactivateUserForm.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const email = e.target.email.value;
    
//     try {
//       const response = await fetch(`${BACKEND_URL}/api/admin/auth/users/${email}/reactivate`, {
//         method: 'PUT',
//         headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
//       });
      
//       const result = await response.json();
//       if (response.ok) {
//         showMessage('User reactivated successfully!');
//         e.target.reset();
//       } else {
//         showMessage(result.message || 'Failed to reactivate user', 'error');
//       }
//     } catch (error) {
//       showMessage('Error reactivating user', 'error');
//       console.error(error);
//     }
//   });
// }


  // Deactivate User Form
  // const deactivateUserForm = document.getElementById('deactivateUserForm');
  // if (deactivateUserForm) {
  //   deactivateUserForm.addEventListener('submit', async (e) => {
  //     e.preventDefault();
  //     const email = e.target.email.value;
      
  //     try {
  //       const response = await fetch(`${BACKEND_URL}/api/admin/auth/users/${email}/deactivate`, {
  //         method: 'PUT',
  //         headers: { 'Authorization': `Bearer ${localStorage.getItem("adminToken")}` }
  //       });
        
  //       const result = await response.json();
  //       if (response.ok) {
  //         showMessage('User deactivated successfully!');
  //         e.target.reset();
  //       } else {
  //         showMessage(result.message || 'Failed to deactivate user', 'error');
  //       }
  //     } catch (error) {
  //       showMessage('Error deactivating user', 'error');
  //       console.error(error);
  //     }
  //   });
  // }

  
  // Delete User Form
  // const deleteUserForm = document.getElementById('deleteUserForm');
  // if (deleteUserForm) {
  //   deleteUserForm.addEventListener('submit', async (e) => {
  //     e.preventDefault();
  //     const email = e.target.email.value;
      
  //     if (!confirm(`Are you sure you want to delete user: ${email}?`)) return;
      
  //     try {
  //       const response = await fetch(`${BACKEND_URL}/api/admin/auth/users/${email}`, {
  //         method: 'DELETE',
  //         headers: { 'Authorization': `Bearer ${localStorage.getItem('adminToken')}` }
  //       });
        
  //       const result = await response.json();
  //       if (response.ok) {
  //         showMessage('User deleted successfully!');
  //         e.target.reset();
  //       } else {
  //         showMessage(result.message || 'Failed to delete user', 'error');
  //       }
  //     } catch (error) {
  //       showMessage('Error deleting user', 'error');
  //       console.error(error);
  //     }
  //   });
  // }

  
  // Create User Form
  // const createUserForm = document.getElementById('createUserForm');
  // if (createUserForm) {
  //   createUserForm.addEventListener('submit', async (e) => {
  //     e.preventDefault();
  //     const formData = new FormData(e.target);
  //     const data = Object.fromEntries(formData);
      
  //     try {
  //       const response = await fetch(`${BACKEND_URL}/api/users/register`, {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify(data)
  //       });
        
  //       const result = await response.json();
  //       if (response.ok) {
  //         showMessage('User created successfully!');
  //         e.target.reset();
  //       } else {
  //         showMessage(result.message || 'Failed to create user', 'error');
  //       }
  //     } catch (error) {
  //       showMessage('Error creating user', 'error');
  //       console.error(error);
  //     }
  //   });
  // }

  // Display specific user's chat history
// function displayChatHistory(visitorId) {
//   const display = document.getElementById('chatHistoryDisplay');
//   if (!display) return;
  
//   const history = window.adminChatHistory[visitorId];
  
//   if (history && history.length > 0) {
//     display.innerHTML = `
//       <h3>Chat History with ${visitorId}</h3>
//       <div style="max-height: 500px; overflow-y: auto; border: 1px solid #ddd; padding: 10px; border-radius: 5px;">
//         ${history.map(msg => `
//           <div style="padding: 8px; margin-bottom: 5px; background: ${msg.sender === 'Admin' ? '#e3f2fd' : '#f5f5f5'}; border-radius: 5px;">
//             <strong>${msg.sender}:</strong> ${msg.text}
//             <div style="font-size: 11px; color: #666; margin-top: 5px;">
//               ${new Date(msg.timestamp).toLocaleString()}
//             </div>
//           </div>
//         `).join('')}
//       </div>
//     `;
//   } else {
//     display.innerHTML = `<p>No messages found for ${visitorId}</p>`;
//   }
// }