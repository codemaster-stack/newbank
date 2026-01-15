// Your existing BACKEND_URL definition
const BACKEND_URL = "https://valley.pvbonline.online"; // or however you define it

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
  // const BACKEND_URL = "https://api.pvbonline.online";
const adminToken = localStorage.getItem("adminToken");
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
      // CHANGED: Use admin endpoint with authentication
      const response = await fetch(`${BACKEND_URL}/api/admin/auth/create-user`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}` // Add admin token
        },
        body: JSON.stringify(data)
      });
      
      const result = await response.json();
      
      if (response.ok) {
        showMessage('User created successfully!', 'success');
        e.target.reset();
        // Optionally refresh user list
        if (typeof loadUsers === 'function') {
          loadUsers();
        }
      } else {
        showMessage(result.message || 'Failed to create user', 'error');
      }
    } catch (error) {
      showMessage('Error creating user', 'error');
      console.error('Create user error:', error);
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
  // ========== DEACTIVATE USER (ADMIN & SUPERADMIN) ==========
  
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
          showMessage('User deactivated successfully!', 'success');
          e.target.reset();
          // Refresh deactivated users list if function exists
          if (typeof loadDeactivatedUsers === 'function') loadDeactivatedUsers();
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
  
  // ========== REACTIVATE USER (ADMIN & SUPERADMIN) ==========
  
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
          showMessage('User reactivated successfully!', 'success');
          e.target.reset();
          if (typeof loadDeactivatedUsers === 'function') loadDeactivatedUsers();
        } else if (response.status === 403) {
          // Permission denied - show clear message
          showMessage(result.message || 'You do not have permission to reactivate this user', 'error');
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
  

  // Reactivate User Form

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
    data.amount = parseFloat(data.amount); // ensure number

    // ✅ Check if admin wallet is sufficient before sending request
    const walletEl = document.getElementById('walletBalance');
    if (walletEl) {
      const currentWallet = parseFloat(walletEl.textContent.replace(/[^0-9.-]+/g, ''));
      if (data.amount > currentWallet) {
        showMessage('Insufficient wallet balance. Please top up your wallet.', 'error');
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
        return;
      }
    }

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

        // ✅ Update wallet UI after successful funding if backend returns new balance
        if (result.adminNewWallet !== undefined && walletEl) {
          walletEl.textContent = `$${result.adminNewWallet.toFixed(2)}`;
        }

      } else {
        showMessage(result.message || 'Failed to fund user account', 'error');
      }

    } catch (error) {
      console.error(error);
      showMessage('Error funding user account', 'error');
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

 
const sendEmailForm = document.getElementById('sendEmailForm');
if (sendEmailForm) {
  sendEmailForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span class="spinner"></span> Sending...';
    submitBtn.disabled = true;
    
    // const formData = new FormData(e.target);
    // const data = Object.fromEntries(formData);
    const formData = new FormData(e.target);
    
    try {
      // const response = await fetch(`${BACKEND_URL}/api/admin/auth/send-email`, {
      //   method: 'POST',
      //   headers: { 
      //     'Content-Type': 'application/json',
      //     'Authorization': `Bearer ${localStorage.getItem("adminToken")}` 
      //   },
      //   body: JSON.stringify(data)
      // });
       const response = await fetch(`${BACKEND_URL}/api/admin/auth/send-email`, {
       method: 'POST',
        headers: { 
        'Authorization': `Bearer ${localStorage.getItem("adminToken")}` 
      },
       body: formData // Send FormData directly (no JSON.stringify)
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
if (document.getElementById('cardManagement')) {
    initializeCardManagement();
  }
  loadWalletBalance();
});


function openMailModal() {
  document.getElementById("mailModal").style.display = "block";

  // Fetch messages
  fetch("https://valley.pvbonline.online/api/admin/auth/messages", { credentials: "include" })
  
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

const socket = io("https://valley.pvbonline.online");

// Load chat history from memory on page load
window.addEventListener('DOMContentLoaded', () => {
  loadAllChatHistory();
});

// Admin joins the admin room
socket.emit("joinAdmin", "admin_" + Date.now());

// Request chat history from server for all visitors
socket.emit("requestChatHistory");

// Receive chat history from server
// socket.on("chatHistory", (data) => {
//   console.log("📚 Received chat history from server:", data);
  
//   // Store all conversation history
//   if (data && typeof data === 'object') {
//     Object.keys(data).forEach(visitorId => {
//       if (!chatHistory[visitorId]) {
//         chatHistory[visitorId] = [];
//       }
      
//       // Merge server history with local history
//       data[visitorId].forEach(msg => {
//         chatHistory[visitorId].push({
//           sender: msg.sender || msg.from || "User",
//           text: msg.text || msg.message,
//           html: `<strong>${msg.sender || msg.from || "User"}:</strong> ${msg.text || msg.message}`,
//           timestamp: msg.timestamp || Date.now()
//         });
//       });
//     });
//      saveAllChatHistory();
    
//     // If a user is selected, reload their chat
//     if (selectedVisitorId && chatHistory[selectedVisitorId]) {
//       loadChatHistory(selectedVisitorId);
//     }
//   }
// });
// Receive chat history from server
// Receive chat history from server
socket.on("chatHistory", (data) => {
  console.log("📚 Received chat history from server:", data);
  
  // ✅ First, populate the users list with everyone who has chatted
  const usersUl = document.getElementById("usersUl");
  if (usersUl && data && typeof data === 'object') {
    const visitorIds = Object.keys(data);
    
    if (visitorIds.length > 0) {
      // Clear "waiting" message
      usersUl.innerHTML = "";
      
      // Add each visitor to the list
      visitorIds.forEach(visitorId => {
        if (!document.getElementById(`visitor-${visitorId}`)) {
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
        }
      });
      
      console.log(`✅ Added ${visitorIds.length} user(s) to chat list`);
    }
  }
  
  // Store all conversation history
  if (data && typeof data === 'object') {
    Object.keys(data).forEach(visitorId => {
      if (!chatHistory[visitorId]) {
        chatHistory[visitorId] = [];
      }
      
      // Merge server history with local history
      data[visitorId].forEach(msg => {
        // ✅ Handle both text and file messages
        let htmlContent = '';
        
        if (msg.isFile) {
          // File message
          let filePreview = '';
          if (msg.fileType && msg.fileType.startsWith("image/")) {
            filePreview = `<br><img src="${msg.fileData}" alt="${msg.fileName}" style="max-width: 150px; border-radius: 5px; margin-top: 5px; cursor: pointer;" onclick="window.open('${msg.fileData}', '_blank')">`;
          } else if (msg.fileName && msg.fileData) {
            filePreview = `<br><a href="${msg.fileData}" download="${msg.fileName}" style="display: inline-block; padding: 8px; background: #e3f2fd; border-radius: 5px; margin-top: 5px; text-decoration: none;"><i class="fas fa-file-alt"></i> ${msg.fileName}</a>`;
          }
          htmlContent = `<strong>${msg.sender || msg.from || "User"}:</strong> ${msg.text || msg.message}${filePreview}`;
        } else {
          // Text message
          htmlContent = `<strong>${msg.sender || msg.from || "User"}:</strong> ${msg.text || msg.message}`;
        }
        
        chatHistory[visitorId].push({
          sender: msg.sender || msg.from || "User",
          text: msg.text || msg.message,
          html: htmlContent,
          isFile: msg.isFile || false,
          fileName: msg.fileName,
          fileType: msg.fileType,
          fileData: msg.fileData,
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

// function selectUser(visitorId, email) {
//   // Save current chat before switching (if there was a previous user)
//   if (selectedVisitorId) {
//     saveChatHistory(selectedVisitorId);
//   }
  
//   selectedVisitorId = visitorId;
  
//   // Clear chat window
//   const chatWindow = document.getElementById("chatWindow");
//   chatWindow.innerHTML = "";
  
//   // Add header
//   const headerDiv = document.createElement("div");
//   headerDiv.style.padding = "10px";
//   headerDiv.style.backgroundColor = "#f5f5f5";
//   headerDiv.style.borderBottom = "2px solid #ddd";
//   headerDiv.style.marginBottom = "10px";
//   headerDiv.innerHTML = `<strong>Chatting with:</strong> ${email}`;
//   chatWindow.appendChild(headerDiv);
  function selectUser(visitorId, email) {
  if (selectedVisitorId) {
    saveChatHistory(selectedVisitorId);
  }
  
  selectedVisitorId = visitorId;
  
  const chatWindow = document.getElementById("chatWindow");
  chatWindow.innerHTML = "";
  
  // ✅ UPDATED: Header with End Chat button
  const headerDiv = document.createElement("div");
  headerDiv.style.padding = "10px";
  headerDiv.style.backgroundColor = "#f5f5f5";
  headerDiv.style.borderBottom = "2px solid #ddd";
  headerDiv.style.marginBottom = "10px";
  headerDiv.style.display = "flex";
  headerDiv.style.justifyContent = "space-between";
  headerDiv.style.alignItems = "center";
  headerDiv.innerHTML = `
    <strong>Chatting with: ${email}</strong>
    <button onclick="endChatSession('${visitorId}')" style="background: #dc3545; color: white; border: none; padding: 5px 15px; border-radius: 5px; cursor: pointer; font-size: 12px;">
      🔚 End Chat
    </button>
  `;
  chatWindow.appendChild(headerDiv);
  
  // ✅ Mark as read
  socket.emit("markAsRead", { visitorId: visitorId });
  
  // ✅ Remove unread badge
  const userLi = document.getElementById(`visitor-${visitorId}`);
  if (userLi) {
    const badge = userLi.querySelector('.unread-badge');
    if (badge) badge.remove();
    userLi.style.backgroundColor = "#e3f2fd";
    userLi.style.fontWeight = "normal";
  }
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

function endChatSession(visitorId) {
  if (!confirm(`End chat with ${visitorId}?\n\nThis will delete all chat history for both you and the user.`)) {
    return;
  }
  
  socket.emit("endChat", { visitorId: visitorId });
}

socket.on("chatEndedConfirm", (data) => {
  console.log("✅ Chat ended for:", data.visitorId);
  
  delete chatHistory[data.visitorId];
  saveAllChatHistory();
  
  const userLi = document.getElementById(`visitor-${data.visitorId}`);
  if (userLi) userLi.remove();
  
  if (selectedVisitorId === data.visitorId) {
    const chatWindow = document.getElementById("chatWindow");
    chatWindow.innerHTML = `
      <div style="text-align: center; padding: 50px; color: #999;">
        <p>Chat session ended</p>
        <p style="font-size: 14px;">Select another user to continue</p>
      </div>
    `;
    selectedVisitorId = null;
  }
  
  alert("✅ Chat session ended successfully");
});

socket.on("newUnreadMessage", (data) => {
  const userLi = document.getElementById(`visitor-${data.visitorId}`);
  if (!userLi || selectedVisitorId === data.visitorId) return;
  
  let badge = userLi.querySelector('.unread-badge');
  if (!badge) {
    badge = document.createElement('span');
    badge.className = 'unread-badge';
    badge.style.cssText = 'background: #dc3545; color: white; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-left: 10px; font-weight: bold;';
    userLi.appendChild(badge);
  }
  badge.textContent = data.messageCount;
  userLi.style.backgroundColor = "#fff3cd";
  userLi.style.fontWeight = "bold";
});


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

  // socket.emit("adminMessage", { visitorId: selectedVisitorId, text: message });
  socket.emit("adminMessage", { 
  visitorId: selectedVisitorId, 
  text: message,
  adminEmail: localStorage.getItem("adminEmail"),
  adminName: localStorage.getItem("adminUsername")
});

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

// Admin file handling
let adminSelectedFile = null;

function handleAdminFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  if (file.size > 5 * 1024 * 1024) {
    alert("❌ File size must be less than 5MB");
    return;
  }
  
  adminSelectedFile = file;
  showAdminFilePreview(file);
}

function showAdminFilePreview(file) {
  const previewDiv = document.getElementById("adminFilePreview");
  const previewImage = document.getElementById("adminPreviewImage");
  const previewFileName = document.getElementById("adminPreviewFileName");
  
  previewDiv.style.display = "block";
  previewFileName.textContent = file.name;
  
  if (file.type.startsWith("image/")) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
      previewImage.style.display = "block";
    };
    reader.readAsDataURL(file);
  } else {
    previewImage.style.display = "none";
  }
}

function cancelAdminFileUpload() {
  adminSelectedFile = null;
  document.getElementById("adminFilePreview").style.display = "none";
  document.getElementById("adminFileInput").value = "";
}

// UPDATE sendMessage function
function sendMessage() {
  if (!selectedVisitorId) {
    alert("Please select a user first.");
    return;
  }

  const input = document.getElementById("chatMessage");
  const message = input.value.trim();
  
  // Handle file upload
  if (adminSelectedFile) {
    sendAdminFileMessage(adminSelectedFile, message);
    return;
  }
  
  if (!message) return;

  socket.emit("adminTyping", { visitorId: selectedVisitorId, typing: false });
  clearTimeout(typingTimeout);

  socket.emit("adminMessage", { 
    visitorId: selectedVisitorId, 
    text: message,
    adminEmail: localStorage.getItem("adminEmail"),
    adminName: localStorage.getItem("adminUsername")
  });

  appendMessage("Admin", message);
  
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

function sendAdminFileMessage(file, caption) {
  const reader = new FileReader();
  
  reader.onload = () => {
    const fileData = {
      visitorId: selectedVisitorId,
      fileName: file.name,
      fileType: file.type,
      fileData: reader.result,
      caption: caption || "",
      timestamp: Date.now()
    };
    
    socket.emit("adminFileMessage", fileData);
    
    appendAdminFileMessage("Admin", file.name, reader.result, file.type, caption);
    
    document.getElementById("chatMessage").value = "";
    cancelAdminFileUpload();
  };
  
  reader.readAsDataURL(file);
}

function appendAdminFileMessage(sender, fileName, fileData, fileType, caption) {
  const chatWindow = document.getElementById("chatWindow");
  const msgDiv = document.createElement("div");
  msgDiv.className = "chat-message";
  msgDiv.style.padding = "8px";
  msgDiv.style.marginBottom = "5px";
  
  let filePreview = "";
  
  if (fileType.startsWith("image/")) {
    filePreview = `<img src="${fileData}" alt="${fileName}" style="max-width: 200px; border-radius: 8px; margin-top: 5px; cursor: pointer;" onclick="window.open('${fileData}', '_blank')">`;
  } else {
    filePreview = `
      <a href="${fileData}" download="${fileName}" style="display: inline-block; padding: 10px; background: #e3f2fd; border-radius: 8px; margin-top: 5px; text-decoration: none;">
        <i class="fas fa-file-alt"></i> ${fileName}
      </a>
    `;
  }
  
  msgDiv.innerHTML = `
    <strong>${sender}:</strong> 
    ${caption ? `<div>${caption}</div>` : ''}
    ${filePreview}
  `;
  
  chatWindow.appendChild(msgDiv);
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Listen for file messages from visitors
socket.on("visitorFileMessage", (data) => {
  if (data.visitorId === selectedVisitorId) {
    appendAdminFileMessage("User", data.fileName, data.fileData, data.fileType, data.caption);
  }
});

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


// Card

 // Global variables
        let currentCardId = null;
        let allCardsData = [];
        // const BACKEND_URL = 'https://api.pvbonline.online';

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
                // const response = await fetch(`${BACKEND_URL}/api/admin/all-cards?status=approved`, {
                const response = await fetch(`${BACKEND_URL}/api/admin/all-cards?isApproved=true`, {
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
                    // const totalCards = cards.length;
                    // const pendingCards = cards.filter(card => card.status === 'pending').length;
                    // const approvedCards = cards.filter(card => card.status === 'approved').length;
                    // const activeCards = cards.filter(card => card.status === 'approved' && card.isActive).length;
                    // Use backend stats if available, otherwise calculate
                      const totalCards = result.total || cards.length;
                     const pendingCards = result.pending || cards.filter(card => card.status === 'pending').length;
                     const approvedCards = result.approved || cards.filter(card => card.status === 'approved').length;
                      const activeCards = result.active || cards.filter(card => card.isActive).length;
                      // Use backend stats if available, otherwise calculate

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
                       <span class="status-badge pending">Pending</span>
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
                    <span class="status-badge approved">${card.isApproved ? 'Approved' : 'Pending'}</span>
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
                   <span class="status-badge ${card.isApproved ? 'approved' : 'pending'}">${card.isApproved ? 'Approved' : 'Pending'}</span>
                    ${card.isApproved ? `
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
            
            // let url = `${BACKEND_URL}/api/admin/all-cards?status=approved`;
            let url = `${BACKEND_URL}/api/admin/all-cards?isApproved=true`;
            
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
            
            // if (statusFilter) {
            //     filteredCards = filteredCards.filter(card => card.status === statusFilter);
            // }
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

// admin Wallet Balance Display
async function loadWalletBalance() {
  try {
    const response = await fetch('https://valley.pvbonline.online/api/admin/auth/wallet', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
      }
    });
    
    if (!response.ok) throw new Error('Failed to load balance');
    
    const data = await response.json();
    const walletEl = document.getElementById('walletBalance');
    
    // Handle both data.wallet and data.balance (in case backend returns different field names)
    const balance = data.wallet !== undefined ? data.wallet : (data.balance || 0);
    walletEl.textContent = `$${parseFloat(balance).toFixed(2)}`;
    
  } catch (err) {
    console.error('Wallet load error:', err);
    const walletEl = document.getElementById('walletBalance');
    if (walletEl) walletEl.textContent = 'Error';
  }
}

// Load wallet on page load
document.addEventListener('DOMContentLoaded', loadWalletBalance);

// Auto-refresh wallet every 30 seconds
setInterval(loadWalletBalance, 30000);

// async function loadWalletBalance() {
//   try {
//     const response = await fetch('https://valley.pvbonline.online/api/admin/auth/wallet', {
//       headers: {
//         'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
//       }
//     });
//     if (!response.ok) throw new Error('Failed to load balance');
    
//     const data = await response.json();
//     const walletEl = document.getElementById('walletBalance');
//     walletEl.textContent = `$${parseFloat(data.wallet).toFixed(2)}`;
//   } catch (err) {
//     console.error(err);
//     document.getElementById('walletBalance').textContent = 'Error';
//   }
// }
// // Auto-refresh wallet every 30 seconds

// document.addEventListener('DOMContentLoaded', loadWalletBalance);
// setInterval(loadWalletBalance, 30000);