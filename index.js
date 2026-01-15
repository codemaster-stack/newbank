
// =================== MODAL HANDLING ===================

// Utility to get element safely
const $ = (selector) => document.querySelector(selector);

// Modal elements
const loginModal = $("#loginModal");
const signupModal = $("#signupModal");
const forgotModal = $("#forgotModal");
const resetModal = $("#resetPasswordModal");

// Open and close modal helpers
const openModal = (modal) => modal?.classList.add("active");
const closeModal = (modal) => modal?.classList.remove("active");

// ----- ONLINE BANKING BUTTON -----
const onlineBankingBtn = document.querySelector(".button-olb");
onlineBankingBtn?.addEventListener("click", () => openModal(loginModal));

// ----- LOGIN MODAL BUTTONS -----
$("#closeLogin")?.addEventListener("click", () => closeModal(loginModal));
$("#showSignup")?.addEventListener("click", () => {
  closeModal(loginModal);
  openModal(signupModal);
});
$("#showForgot")?.addEventListener("click", () => {
  closeModal(loginModal);
  openModal(forgotModal);
});

// ----- SIGNUP MODAL BUTTONS -----
$("#closeSignup")?.addEventListener("click", () => closeModal(signupModal));
$("#backToLogin")?.addEventListener("click", () => {
  closeModal(signupModal);
  openModal(loginModal);
});

// ----- FORGOT PASSWORD MODAL BUTTONS -----
$("#closeForgot")?.addEventListener("click", () => closeModal(forgotModal));
$("#backToLoginFromForgot")?.addEventListener("click", () => {
  closeModal(forgotModal);
  openModal(loginModal);
});

// ----- RESET PASSWORD MODAL BUTTON -----
$("#closeReset")?.addEventListener("click", () => closeModal(resetModal));

// =================== FORM HANDLERS ===================
const API_URL = "https://valley.pvbonline.online/api/users"; // update if deployed

// Utility function to handle button loading state
const setButtonLoading = (button, isLoading, text = "Processing...") => {
  if (isLoading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent;
    button.innerHTML = `<span class="spinner"></span> ${text}`;
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || button.textContent;
  }
};


const loginForm = $("#loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = loginForm.querySelector("button[type='submit']");
    setButtonLoading(button, true);

    const data = {
      email: $("#email").value,
      password: $("#password").value,
    };
    
    try {
      const res = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      
      if (res.ok) {
        alert("Login successful!");
        localStorage.setItem("token", result.token);
        window.location.href = "/userpage.html";
      } else {
        // Check if account is deactivated
        if (result.type === 'ACCOUNT_DEACTIVATED') {
          alert(`${result.message}\n\nContact Information:\n📧 Email: support@pvbonline.online\n💬 Live Chat: Available 24/7 on our website`);
        } else {
          alert(result.message || "Login failed.");
        }
      }
    } catch (err) {
      alert("Login failed. Please try again.");
    } finally {
      setButtonLoading(button, false);
    }
  });
}


// ----- SIGNUP -----
const signupForm = $("#signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = signupForm.querySelector("button[type='submit']");
    setButtonLoading(button, true);

    const data = {
      fullname: $("#fullName").value,
      email: $("#signupEmail").value,
      phone: $("#phone").value,
      password: $("#signupPassword").value,
    };
    try {
      const res = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (res.ok) {
        alert("Registration successful!");
        closeModal(signupModal);
        openModal(loginModal);
      } else {
        alert(result.message || "Signup failed.");
      }
    } catch (err) {
      alert("Signup failed. Please try again.");
    } finally {
      setButtonLoading(button, false);
    }
  });
}

// ----- FORGOT PASSWORD -----
const forgotForm = $("#forgotForm");
if (forgotForm) {
  forgotForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = forgotForm.querySelector("button[type='submit']");
    setButtonLoading(button, true);

    const email = $("#forgotEmail").value; // <-- fixed
    try {
      const res = await fetch(`${API_URL}/forgot`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await res.json();
      if (res.ok) {
        alert(result.message || "Reset link sent. Check your email.");
        forgotForm.reset();
      } else {
        alert(result.message || "Failed to send reset link.");
      }
    } catch (err) {
      alert("Failed to send reset link. Please try again.");
    } finally {
      setButtonLoading(button, false);
    }
  });
}

// ----- RESET PASSWORD -----
// const resetForm = $("#resetPasswordForm");
// // const resetModal = $("#resetPasswordModal");
// // const loginModal = $("#loginModal");
// // const signupModal = $("#signupModal");
// // const forgotModal = $("#forgotModal");

// if (resetForm) {
//   document.addEventListener("DOMContentLoaded", () => {
//     const urlParams = new URLSearchParams(window.location.search);
//     const token = urlParams.get("resetToken");

//     if (token) {
//       // Open reset modal automatically
//       closeModal(loginModal);
//       closeModal(signupModal);
//       closeModal(forgotModal);
//       openModal(resetModal);

//       // Populate hidden input
//       const resetTokenInput = $("#resetToken");
//       if (resetTokenInput) resetTokenInput.value = token;
//     }

//     resetForm.addEventListener("submit", async (e) => {
//       e.preventDefault();

//       const password = $("#newPassword").value;
//       const confirmPassword = $("#confirmNewPassword").value;

//       if (password !== confirmPassword) {
//         alert("Passwords do not match!");
//         return;
//       }

//       const button = resetForm.querySelector("button[type='submit']");
//       setButtonLoading(button, true);

//       try {
//         const res = await fetch(`${API_URL}/reset`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ token, password }),
//         });

//         const result = await res.json();
//         if (res.ok) {
//           alert(result.message || "Password reset successful!");
//           setTimeout(() => {
//             closeModal(resetModal);
//             openModal(loginModal);
//           }, 1500);
//         } else {
//           alert(result.message || "Reset failed.");
//         }
//       } catch (err) {
//         alert("Reset failed. Please try again.");
//       } finally {
//         setButtonLoading(button, false);
//       }
//     });
//   });
// }
document.addEventListener("DOMContentLoaded", () => {
  const resetModal = document.getElementById("resetPasswordModal");
  const resetForm = document.getElementById("resetPasswordForm");
  const resetTokenInput = document.getElementById("resetToken");

  // 1️⃣ Check URL for resetToken
  const urlParams = new URLSearchParams(window.location.search);
  const resetToken = urlParams.get("resetToken");

  if (resetToken && resetModal && resetForm && resetTokenInput) {
    // Open modal and populate hidden input
    resetModal.style.display = "block";
    resetTokenInput.value = resetToken;

    // Optionally remove token from URL for cleanliness
    window.history.replaceState({}, document.title, window.location.pathname);
  }

  // 2️⃣ Handle form submission
  if (resetForm) {
    resetForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const button = resetForm.querySelector("button[type='submit']");
      button.disabled = true;
      button.textContent = "Processing...";

      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmNewPassword").value;
      const token = resetTokenInput.value;

      if (!token) {
        alert("Invalid or expired reset link. Please request a new password reset.");
        button.disabled = false;
        button.textContent = "Reset Password";
        return;
      }

      if (newPassword !== confirmPassword) {
        alert("Passwords do not match.");
        button.disabled = false;
        button.textContent = "Reset Password";
        return;
      }

      try {
        const res = await fetch(`${API_URL}/reset`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, password: newPassword }),
        });

        const data = await res.json();

        if (res.ok) {
          alert(data.message || "Password reset successful! You can now log in.");
          resetForm.reset();
          resetModal.style.display = "none";
        } else {
          alert(data.message || "Failed to reset password.");
        }
      } catch (err) {
        console.error("Reset password error:", err);
        alert("Something went wrong. Please try again.");
      } finally {
        button.disabled = false;
        button.textContent = "Reset Password";
      }
    });
  }

  // 3️⃣ Close modal when clicking close button
  const closeBtn = document.getElementById("closeReset");
  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      resetModal.style.display = "none";
    });
  }

  // Optional: close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target === resetModal) resetModal.style.display = "none";
  });
});




// Show About Modal
function showAboutModal() {
  const modal = document.getElementById("aboutModal");
  if (modal) modal.style.display = "block";
}

// Close About Modal
function closeAboutModal() {
  const modal = document.getElementById("aboutModal");
  if (modal) modal.style.display = "none";
}

// Optional: close when clicking outside modal
window.addEventListener("click", function (event) {
  const modal = document.getElementById("aboutModal");
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
// end about us



// form submition
function openContactSupportModal() {
  document.getElementById("contactSupportModal").style.display = "block";
}

function closeContactSupportModal() {
  document.getElementById("contactSupportModal").style.display = "none";
}
// ----- CONTACT SUPPORT -----
const supportForm = document.getElementById("supportForm");

if (supportForm) {
  supportForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const button = supportForm.querySelector("button[type='submit']");
    setButtonLoading(button, true);

    const data = {
      name: "Guest User", // optional, since we don’t have auth
      email: document.getElementById("supportEmail").value,
      phone: document.getElementById("supportPhone").value,
      subject: document.getElementById("supportSubject").value,
      message: document.getElementById("supportMessage").value,
    };

    try {
      const res = await fetch("https://valley.pvbonline.online/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();

      if (res.ok) {
        alert(result.message || "Message sent successfully! Our team will reach out to you shortly via your mail");
        supportForm.reset();
        closeContactSupportModal();
      } else {
        alert(result.message || "Failed to send message.");
      }
    } catch (err) {
      alert("Error sending message. Please try again.");
    } finally {
      setButtonLoading(button, false);
    }
  });
}

// form submition end

// send email
function showContactModal() {
  document.getElementById("contactModal").style.display = "block";
}

function closeContactModal() {
  document.getElementById("contactModal").style.display = "none";
}

// Optional: close when clicking outside the modal
window.addEventListener("click", function (event) {
  const modal = document.getElementById("contactModal");
  if (event.target === modal) {
    closeContactModal();
  }
});


document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("contactName").value;
  const email = document.getElementById("contactEmail").value;
  const subject = document.getElementById("contactSubject").value;
  const message = document.getElementById("contactMessage").value;

  const adminEmail = "support@pvbonline.online"; // replace with your real admin email

  const mailtoLink = `mailto:${adminEmail}?cc=${encodeURIComponent(email)}&subject=${encodeURIComponent(subject)}&body=${encodeURIComponent("From: " + name + " (" + email + ")\n\n" + message)}`;

  window.location.href = mailtoLink;

  alert("Your default email app will open. Please send the message.");
  closeContactModal();
});

// send email end



// loan

// ================= Loan Services Modal =================
function showLoanModal() {
  document.getElementById("loanModal").style.display = "block";
}

function closeLoanModal() {
  document.getElementById("loanModal").style.display = "none";
}

// ================= Personal / Business Section =================
function showPersonalLoan() {
  showLoanModal();
  document.getElementById("personalLoanSection").style.display = "block";
  document.getElementById("businessLoanSection").style.display = "none";
}

function showBusinessLoan() {
  showLoanModal();
  document.getElementById("personalLoanSection").style.display = "none";
  document.getElementById("businessLoanSection").style.display = "block";
}

// ================= Loan Application Modal =================
function showLoanApplication() {
  document.getElementById("loanApplicationModal").style.display = "block";
}

function closeLoanApplication() {
  document.getElementById("loanApplicationModal").style.display = "none";
}

// ================= Close Modals when clicking outside =================
window.addEventListener("click", function (event) {
  const loanModal = document.getElementById("loanModal");
  const loanAppModal = document.getElementById("loanApplicationModal");

  if (event.target === loanModal) closeLoanModal();
  if (event.target === loanAppModal) closeLoanApplication();
});

// ================= Loan Application Form Submit =================
document.getElementById("loanApplicationForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const loanData = {
    loanType: document.getElementById("loanType").value,
    loanAmount: document.getElementById("loanAmount").value,
    applicantName: document.getElementById("applicantName").value,
    applicantEmail: document.getElementById("applicantEmail").value,
    applicantPhone: document.getElementById("applicantPhone").value,
    annualIncome: document.getElementById("annualIncome").value,
    loanPurpose: document.getElementById("loanPurpose").value,
  };

  try {
    const res = await fetch("https://valley.pvbonline.online/api/public/loans/apply", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(loanData),
    });

    const data = await res.json();

    if (res.ok) {
      alert("Loan application submitted successfully! Our team will reach out to you shortly via your mail  ");
      document.getElementById("loanApplicationForm").reset();
      closeLoanApplication();
    } else {
      alert("Error: " + data.message);
    }
  } catch (err) {
    console.error("Loan application error:", err);
    alert("Something went wrong. Please try again later.");
  }
});
// loan end


// chart

// Add this to your visitor/user chat JavaScript file

// Typing indicator handling for visitor
const socket = io("https://valley.pvbonline.online", {
  transports: ["websocket"],
  withCredentials: true
});

// Unique visitor ID for this session
// const visitorId = "visitor_" + Date.now();
// ✅ Get or create persistent visitor ID using localStorage
function getOrCreateVisitorId() {
  let visitorId = localStorage.getItem('visitorId');
  
  if (!visitorId) {
    // Create new ID if doesn't exist
    visitorId = "visitor_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('visitorId', visitorId);
    console.log("🆕 Created new visitor ID:", visitorId);
  } else {
    console.log("♻️ Using existing visitor ID:", visitorId);
  }
  
  return visitorId;
}

const visitorId = getOrCreateVisitorId();

socket.on("connect", () => {
  socket.emit("joinVisitor", visitorId);
  document.getElementById("chatStatusText").innerText = "Connected";
  document.querySelector(".chat-status-dot").style.background = "green";
});

socket.on("disconnect", () => {
  document.getElementById("chatStatusText").innerText = "Disconnected";
  document.querySelector(".chat-status-dot").style.background = "red";
});

// Receive message from admin
socket.on("chatMessage", (data) => {
  appendMessage(
    data.sender === "admin" ? "Support" : "You",
    data.text,
    data.sender
  );
});

// ✨ Listen for admin typing notification
socket.on("adminTyping", (data) => {
  showAdminTypingIndicator(data.typing);
});

// ✨ Typing indicator handling
let typingTimeout;
const chatInput = document.getElementById("chatInput");

if (chatInput) {
  chatInput.addEventListener("input", () => {
    // Emit typing event to server
    socket.emit("visitorTyping", { typing: true });
    
    // Clear previous timeout
    clearTimeout(typingTimeout);
    
    // Stop typing after 2 seconds of inactivity
    typingTimeout = setTimeout(() => {
      socket.emit("visitorTyping", { typing: false });
    }, 2000);
  });
}

// ✨ Show admin typing indicator
function showAdminTypingIndicator(isTyping) {
  const chatBox = document.getElementById("chatMessages");
  let typingDiv = document.getElementById("admin-typing-indicator");
  
  if (isTyping) {
    if (!typingDiv) {
      typingDiv = document.createElement("div");
      typingDiv.id = "admin-typing-indicator";
      typingDiv.classList.add("message", "agent-message");
      typingDiv.innerHTML = `
        <div class="message-avatar">
          <i class="fas fa-user-tie"></i>
        </div>
        <div class="message-content">
          <div class="message-text" style="font-style: italic; color: #666;">
            Support is typing<span class="dots">...</span>
          </div>
        </div>
      `;
      chatBox.appendChild(typingDiv);
      
      // Animate dots
      animateTypingDots();
    }
  } else {
    if (typingDiv) {
      typingDiv.remove();
    }
  }
  
  // Auto-scroll to bottom
  chatBox.scrollTop = chatBox.scrollHeight;
}

// ✨ Animate typing dots
function animateTypingDots() {
  const dotsSpan = document.querySelector("#admin-typing-indicator .dots");
  if (!dotsSpan) return;
  
  let dotCount = 0;
  const interval = setInterval(() => {
    if (!document.getElementById("admin-typing-indicator")) {
      clearInterval(interval);
      return;
    }
    dotCount = (dotCount + 1) % 4;
    dotsSpan.textContent = ".".repeat(dotCount);
  }, 500);
}

function openChatModal() {
  document.getElementById("chatModal").style.display = "block";
}

function closeChatModal() {
  document.getElementById("chatModal").style.display = "none";
}

function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  if (!msg) return;
  
  // ✨ Clear typing indicator when sending message
  socket.emit("visitorTyping", { typing: false });
  clearTimeout(typingTimeout);
  
  socket.emit("visitorMessage", { visitorId, text: msg });
  appendMessage("You", msg, "visitor");
  input.value = "";
}

function handleChatKeyPress(e) {
  if (e.key === "Enter") {
    sendChatMessage();
  }
}

function appendMessage(sender, text, type) {
  const chatBox = document.getElementById("chatMessages");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type === "admin" ? "agent-message" : "user-message");
  msgDiv.innerHTML = `
    <div class="message-avatar">
      <i class="fas ${type === "admin" ? "fa-user-tie" : "fa-user"}"></i>
    </div>
    <div class="message-content">
      <div class="message-header">${sender}</div>
      <div class="message-text">${text}</div>
      <div class="message-time">${new Date().toLocaleTimeString()}</div>
    </div>
  `;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Store selected file
let selectedFile = null;

// Handle file selection
function handleFileSelect(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  // Validate file size (max 5MB)
  if (file.size > 5 * 1024 * 1024) {
    alert("❌ File size must be less than 5MB");
    return;
  }
  
  selectedFile = file;
  showFilePreview(file);
}

// Show file preview
function showFilePreview(file) {
  const previewDiv = document.getElementById("filePreview");
  const previewImage = document.getElementById("previewImage");
  const previewFileName = document.getElementById("previewFileName");
  
  previewDiv.style.display = "block";
  previewFileName.textContent = file.name;
  
  // Show image preview if it's an image
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

// Cancel file upload
function cancelFileUpload() {
  selectedFile = null;
  document.getElementById("filePreview").style.display = "none";
  document.getElementById("chatFileInput").value = "";
}

// UPDATE sendChatMessage function to handle files
function sendChatMessage() {
  const input = document.getElementById("chatInput");
  const msg = input.value.trim();
  
  // Check if there's a file to send
  if (selectedFile) {
    sendFileMessage(selectedFile, msg);
    return;
  }
  
  // Regular text message
  if (!msg) return;
  
  socket.emit("visitorTyping", { typing: false });
  clearTimeout(typingTimeout);
  
  socket.emit("visitorMessage", { visitorId, text: msg });
  appendMessage("You", msg, "visitor");
  input.value = "";
}

// Send file via socket
function sendFileMessage(file, caption) {
  const reader = new FileReader();
  
  reader.onload = () => {
    const fileData = {
      visitorId: visitorId,
      fileName: file.name,
      fileType: file.type,
      fileData: reader.result, // Base64 data
      caption: caption || "",
      timestamp: Date.now()
    };
    
    // Emit file message
    socket.emit("visitorFileMessage", fileData);
    
    // Display in chat
    appendFileMessage("You", file.name, reader.result, file.type, caption, "visitor");
    
    // Clear input and preview
    document.getElementById("chatInput").value = "";
    cancelFileUpload();
  };
  
  reader.readAsDataURL(file);
}

// Append file message to chat
function appendFileMessage(sender, fileName, fileData, fileType, caption, type) {
  const chatBox = document.getElementById("chatMessages");
  const msgDiv = document.createElement("div");
  msgDiv.classList.add("message", type === "admin" ? "agent-message" : "user-message");
  
  let filePreview = "";
  
  // Show image preview
  if (fileType.startsWith("image/")) {
    filePreview = `<img src="${fileData}" alt="${fileName}" style="max-width: 200px; border-radius: 8px; margin-top: 5px; cursor: pointer;" onclick="window.open('${fileData}', '_blank')">`;
  } else {
    // Show file icon for documents
    filePreview = `
      <a href="${fileData}" download="${fileName}" style="display: inline-block; padding: 10px; background: #e3f2fd; border-radius: 8px; margin-top: 5px; text-decoration: none; color: #1976d2;">
        <i class="fas fa-file-alt"></i> ${fileName}
      </a>
    `;
  }
  
  msgDiv.innerHTML = `
    <div class="message-avatar">
      <i class="fas ${type === "admin" ? "fa-user-tie" : "fa-user"}"></i>
    </div>
    <div class="message-content">
      <div class="message-header">${sender}</div>
      ${caption ? `<div class="message-text">${caption}</div>` : ''}
      ${filePreview}
      <div class="message-time">${new Date().toLocaleTimeString()}</div>
    </div>
  `;
  
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

// Listen for file messages from admin
socket.on("adminFileMessage", (data) => {
  appendFileMessage("Support", data.fileName, data.fileData, data.fileType, data.caption, "admin");
});
  
socket.on("loadPreviousMessages", (messages) => {
  console.log("📚 Loading previous messages:", messages.length);
  
  if (messages.length === 0) return;
  
  const chatBox = document.getElementById("chatMessages");
  if (!chatBox) return;
  
  // Add a separator to show old messages
  const separator = document.createElement("div");
  separator.style.textAlign = "center";
  separator.style.padding = "10px";
  separator.style.color = "#999";
  separator.style.fontSize = "12px";
  separator.innerHTML = `───── Previous Messages (${messages.length}) ─────`;
  chatBox.appendChild(separator);
  
  // Load all previous messages
  messages.forEach(msg => {
    if (msg.isFile) {
      appendFileMessage(
        msg.sender === "admin" ? "Support" : "You",
        msg.fileName,
        msg.fileData,
        msg.fileType,
        msg.text,
        msg.sender
      );
    } else {
      appendMessage(
        msg.sender === "admin" ? "Support" : "You",
        msg.text,
        msg.sender
      );
    }
  });
  
  console.log("✅ Previous messages loaded for visitor");
});

socket.on("chatEnded", (data) => {
  console.log("🔚 Chat ended by admin");
  
  const chatBox = document.getElementById("chatMessages");
  if (chatBox) {
    chatBox.innerHTML = `
      <div style="text-align: center; padding: 30px; background: #fff3cd; border-radius: 10px; margin: 20px;">
        <h3 style="color: #856404;">Chat Session Ended</h3>
        <p style="color: #856404;">This conversation has been closed by support.</p>
        <p style="font-size: 14px; color: #666;">You can start a new conversation by sending a message.</p>
      </div>
    `;
  }
  
  // Clear visitor ID to start fresh next time
  localStorage.removeItem('visitorId');
  console.log("🗑️ Visitor ID cleared - new chat will start fresh");
});

  //  hamburger menu code
const hamburger = document.querySelector('.open-mobilemenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileOverlay = document.getElementById('mobileOverlay');

function toggleMobileMenu() {
    mobileMenu.classList.toggle('active');
    mobileOverlay.classList.toggle('active');
}

function closeMobileMenu() {
    mobileMenu.classList.remove('active');
    mobileOverlay.classList.remove('active');
}

hamburger.addEventListener('click', toggleMobileMenu);
mobileOverlay.addEventListener('click', closeMobileMenu);

// Close menu when nav item is clicked
const mobileNavItems = document.querySelectorAll('.mobile-menu .nav-item');
mobileNavItems.forEach(item => {
    item.addEventListener('click', closeMobileMenu);
});