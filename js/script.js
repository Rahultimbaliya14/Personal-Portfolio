const header = document.querySelector("header");

// Active navigation highlighting
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.navlist a');

function updateActiveNav() {
	const scrollPos = window.scrollY + 100; // Offset for header height
	
	sections.forEach(section => {
		const sectionTop = section.offsetTop;
		const sectionHeight = section.offsetHeight;
		const sectionId = section.getAttribute('id');
		
		if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
			// Remove active class from all nav links
			navLinks.forEach(link => {
				link.classList.remove('active');
			});
			
			// Add active class to current section's nav link
			const activeLink = document.querySelector(`.navlist a[href="#${sectionId}"]`);
			if (activeLink) {
				activeLink.classList.add('active');
			}
		}
	});
}

// Update active nav on scroll
window.addEventListener('scroll', updateActiveNav);

// Update active nav on page load
document.addEventListener('DOMContentLoaded', updateActiveNav);

// Feedback Form Functionality
function clearFeedbackForm() {
	const form = document.getElementById('feedbackForm');
	if (form) {
		form.reset();
		// Remove any error states
		const inputs = form.querySelectorAll('input, textarea');
		inputs.forEach(input => {
			input.classList.remove('error');
		});
	}
}

// Handle feedback form submission
function handleFeedbackSubmit(event) {
	event.preventDefault();
	
	const form = event.target;
	const emailInput = form.querySelector('#feedbackEmail');
	const feedbackInput = form.querySelector('#feedbackMessage');
	const email = emailInput.value.trim();
	const feedback = feedbackInput.value.trim();
	
	// Remove previous error states
	removeFeedbackError();
	
	let hasErrors = false;
	
	// Validate email field
	if (!email) {
		addFeedbackError(emailInput);
		hasErrors = true;
	}
	
	// Validate feedback field
	if (!feedback) {
		addFeedbackError(feedbackInput);
		hasErrors = true;
	}
	
	// Show error message if fields are empty
	if (hasErrors) {
		showCustomAlert('Please fill in all fields.', 'error');
		return;
	}
	
	// Validate email format
	if (!isValidEmail(email)) {
		addFeedbackError(emailInput);
		showCustomAlert('Please enter a valid email address.', 'error');
		return;
	}
	
	// Submit feedback via API
	submitFeedbackToAPI(email, feedback);
}

// Function to submit feedback to API
async function submitFeedbackToAPI(email, feedback) {
	try {
		// Show loading state
		const submitBtn = document.querySelector('.submit-btn');
		const originalText = submitBtn.textContent;
		submitBtn.textContent = 'Submitting...';
		submitBtn.disabled = true;
		
		// Prepare the data to send
		const feedbackData = {
			email: email,
			comment: feedback,
			timestamp: new Date().toISOString(),
		};
		
		// Replace this URL with your actual API endpoint
		const API_ENDPOINT = 'https://node-rahul-timbaliya.vercel.app/api/feedback/create';
		
		// Make the API call
		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(feedbackData)
		});
		
		// Reset button state
		submitBtn.textContent = originalText;
		submitBtn.disabled = false;
		
		// Handle response
		if (response.ok) {
			const result = await response.json();
			showCustomAlert('Thank you for your feedback! I will get back to you soon.', 'success');
			
			// Clear form after successful submission
			setTimeout(() => {
				clearFeedbackForm();
			}, 2000);
		} else {
			// Handle API error response
			const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
			showCustomAlert(`Failed to submit feedback: ${errorData.message || 'Please try again later.'}`, 'error');
		}
		
	} catch (error) {
		// Handle network or other errors
		console.error('Error submitting feedback:', error);
		
		// Reset button state
		const submitBtn = document.querySelector('.submit-btn');
		submitBtn.textContent = 'Submit Feedback';
		submitBtn.disabled = false;
		
		// Show error message
		showCustomAlert('Failed to submit feedback. Please check your internet connection and try again.', 'error');
	}
}

// Function to add red highlighting to feedback form inputs
function addFeedbackError(input) {
	if (input) {
		input.classList.add('error-input');
		// Add shake animation
		input.classList.add('shake-animation');
		// Remove shake animation after it completes
		setTimeout(() => {
			input.classList.remove('shake-animation');
		}, 500);
	}
}

// Function to remove red highlighting from feedback form inputs
function removeFeedbackError() {
	const feedbackForm = document.getElementById('feedbackForm');
	if (feedbackForm) {
		const inputs = feedbackForm.querySelectorAll('input, textarea');
		inputs.forEach(input => {
			input.classList.remove('error-input');
			input.classList.remove('shake-animation');
		});
	}
}

// Add event listener for feedback form
document.addEventListener('DOMContentLoaded', function() {
	const feedbackForm = document.getElementById('feedbackForm');
	if (feedbackForm) {
		feedbackForm.addEventListener('submit', handleFeedbackSubmit);
		
		// Remove error styling when user starts typing
		const inputs = feedbackForm.querySelectorAll('input, textarea');
		inputs.forEach(input => {
			input.addEventListener('input', function() {
				if (this.classList.contains('error-input')) {
					this.classList.remove('error-input');
					this.classList.remove('shake-animation');
				}
			});
		});
	}
});

// Smooth scrolling for navigation links
navLinks.forEach(link => {
	link.addEventListener('click', function(e) {
		e.preventDefault();
		
		const targetId = this.getAttribute('href');
		const targetSection = document.querySelector(targetId);
		
		if (targetSection) {
			const headerHeight = header.offsetHeight;
			const targetPosition = targetSection.offsetTop - headerHeight;
			
			window.scrollTo({
				top: targetPosition,
				behavior: 'smooth'
			});
		}
	});
});

function shuffleCardsAnimation() {
	const expCards = document.querySelectorAll('.experience-section .experience-item');
	const eduCards = document.querySelectorAll('.education-section .education-item');
	const allCards = [...expCards, ...eduCards];
	const aboutSection = document.querySelector('.about');

	if (!aboutSection || allCards.length === 0) return;

	// Initial shuffle: random rotation and offset
	allCards.forEach((card, i) => {
		card.style.transition = 'transform 0.7s cubic-bezier(.68,-0.55,.27,1.55), box-shadow 0.7s';
		card.style.transform = `translateY(-120px) rotate(${Math.random() * 30 - 15}deg) scale(0.85)`;
		card.style.opacity = '0.5';
		card.style.zIndex = 1;
	});

	// Animate to arranged position after short delay
	setTimeout(() => {
		allCards.forEach((card, i) => {
			card.style.transform = `translateY(0) rotate(0deg) scale(1)`;
			card.style.opacity = '1';
			card.style.zIndex = 2;
		});
	}, 500);
}

// Run animation when about section enters viewport
function onAboutInView() {
	const about = document.querySelector('.about');
	if (!about) return;
	const rect = about.getBoundingClientRect();
	const inView = rect.top < window.innerHeight && rect.bottom > 0;
	if (inView && !about.dataset.shuffled) {
		shuffleCardsAnimation();
		about.dataset.shuffled = "true";
	}
}
window.addEventListener('scroll', onAboutInView);
window.addEventListener('DOMContentLoaded', onAboutInView);

// Email Modal Functionality
function showEmailModal() {
	const modal = document.getElementById('emailModal');
	if (modal) {
		modal.classList.add('show');
	}
}

function hideEmailModal() {
	const modal = document.getElementById('emailModal');
	if (modal) {
		modal.classList.remove('show');
	}
}

async function handleEmailSubmit() {
	const emailInput = document.getElementById('emailInput');
	const email = emailInput.value.trim();
	const sendBtn = document.getElementById('sendEmail');
	
	// Remove any existing error styling
	removeEmailError();
	
	if (!email) {
		// Add red highlighting for empty input
		addEmailError();
		// Show popup alert
		showCustomAlert('Please enter your email address!', 'error');
		return;
	}
	
	if (!isValidEmail(email)) {
		// Add red highlighting for invalid email
		addEmailError();
		// Show popup alert
		showCustomAlert('Please enter a valid email address!', 'error');
		return;
	}
	
	// Show loading state
	if (sendBtn) {
		sendBtn.disabled = true;
		sendBtn.textContent = 'Sending...';
		sendBtn.style.opacity = '0.7';
	}
	
	try {
		// Log the request for debugging
		console.log('Sending email request to API:', { email });
		
		// Make API call to send email
		const response = await fetch('https://node-rahul-timbaliya.vercel.app/api/mail/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({
				email: email
			}),
			mode: 'cors',
		});
		
		if (response.ok) {
			// Try to get response data
			let responseData;
			try {
				responseData = await response.json();
			} catch (jsonError) {
				console.log('Response is not JSON, treating as success');
			}
			
			// Success - show success message
			showCustomAlert('Thank you for subscribing! You will receive updates about my latest projects.', 'success');
			hideEmailModal();
			emailInput.value = ''; // Clear the input
			removeEmailError(); // Remove any error styling
		} else {
			// API returned an error status
			let errorData;
			try {
				errorData = await response.json();
				console.error('API Error Response:', errorData);
			} catch (jsonError) {
				// If response is not JSON, try to get text
				try {
					const errorText = await response.text();
					console.error('API Error Text:', errorText);
					errorData = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
				} catch (textError) {
					errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
				}
			}
			
			showCustomAlert(`Failed to send email: ${errorData.message || 'Please try again later.'}`, 'error');
		}
	} catch (error) {
		// Network or other error
		console.error('Email send error details:', {
			message: error.message,
			name: error.name,
			stack: error.stack
		});
		
		// Check for specific error types
		if (error.name === 'TypeError' && error.message.includes('fetch')) {
			showCustomAlert('CORS error: Unable to connect to the API. Please check if the server allows cross-origin requests.', 'error');
		} else if (error.name === 'AbortError') {
			showCustomAlert('Request timeout. Please try again.', 'error');
		} else {
			showCustomAlert(`Network error: ${error.message}. Please check your connection and try again.`, 'error');
		}
	} finally {
		// Reset button state
		if (sendBtn) {
			sendBtn.disabled = false;
			sendBtn.textContent = 'Send';
			sendBtn.style.opacity = '1';
		}
	}
}

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

// Function to add red highlighting to email input
function addEmailError() {
	const emailInput = document.getElementById('emailInput');
	if (emailInput) {
		emailInput.classList.add('error-input');
		// Add shake animation
		emailInput.classList.add('shake-animation');
		// Remove shake animation after it completes
		setTimeout(() => {
			emailInput.classList.remove('shake-animation');
		}, 500);
	}
}

// Function to remove red highlighting from email input
function removeEmailError() {
	const emailInput = document.getElementById('emailInput');
	if (emailInput) {
		emailInput.classList.remove('error-input');
		emailInput.classList.remove('shake-animation');
	}
}

// Function to show custom alert popup
function showCustomAlert(message, type = 'info') {
	// Remove existing alert if any
	const existingAlert = document.querySelector('.custom-alert');
	if (existingAlert) {
		existingAlert.remove();
	}
	
	// Create alert element
	const alertDiv = document.createElement('div');
	alertDiv.className = `custom-alert alert-${type}`;
	alertDiv.innerHTML = `
		<div class="alert-content">
			<div class="alert-icon">
				${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}
			</div>
			<div class="alert-message">${message}</div>
			<button class="alert-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
		</div>
	`;
	
	// Add to body
	document.body.appendChild(alertDiv);
	
	// Show with animation
	setTimeout(() => {
		alertDiv.classList.add('show');
	}, 10);
	
	// Auto remove after 4 seconds
	setTimeout(() => {
		if (alertDiv.parentElement) {
			alertDiv.classList.remove('show');
			setTimeout(() => {
				if (alertDiv.parentElement) {
					alertDiv.remove();
				}
			}, 300);
		}
	}, 4000);
}

// Event listeners for modal
window.addEventListener('DOMContentLoaded', function() {
	// Show modal after page loads (with a small delay for better UX)
	setTimeout(showEmailModal, 1500);
	
	// Send button click handler
	const sendBtn = document.getElementById('sendEmail');
	if (sendBtn) {
		sendBtn.addEventListener('click', handleEmailSubmit);
	}
	
	// Cancel button click handler
	const cancelBtn = document.getElementById('cancelModal');
	if (cancelBtn) {
		cancelBtn.addEventListener('click', hideEmailModal);
	}
	
	// Close modal when clicking outside of it
	const modal = document.getElementById('emailModal');
	if (modal) {
		modal.addEventListener('click', function(e) {
			if (e.target === modal) {
				hideEmailModal();
			}
		});
	}
	
	// Handle Enter key in email input
	const emailInput = document.getElementById('emailInput');
	if (emailInput) {
		emailInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') {
				handleEmailSubmit();
			}
		});
		
		// Remove error styling when user starts typing
		emailInput.addEventListener('input', function() {
			removeEmailError();
		});
		
		// Remove error styling when input gets focus
		emailInput.addEventListener('focus', function() {
			removeEmailError();
		});
	}
	
	// Handle Escape key to close modal
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			const modal = document.getElementById('emailModal');
			if (modal && modal.classList.contains('show')) {
				hideEmailModal();
			}
		}
	});
});

var t = 100;
setInterval(function () {
	if (t == 45) {
		t = 70
		document.getElementById("top").style.marginTop = "-100px"
	}
	else {
		document.getElementById("top").style.marginTop = "0px"
		t = 45
	}
	document.getElementById("top").style.height = t + "px"
}, 1000)

window.addEventListener("scroll", function () {
	header.classList.toggle("sticky", window.scrollY > 0);
});

let menu = document.querySelector('#menu-icon');
let navlist = document.querySelector('.navlist');

menu.onclick = () => {
	menu.classList.toggle('bx-x');
	navlist.classList.toggle('active');
};

window.onscroll = () => {
	menu.classList.remove('bx-x');
	navlist.classList.remove('active');
};

const sr = ScrollReveal({
	distance: '40px',
	duration: 2000,
	reset: true
})

sr.reveal('.home-text', { delay: 350, origin: 'left' })
sr.reveal('.home-img', { delay: 350, origin: 'right' })

sr.reveal('.sub-service,.about,.portfolio,.service,.cta,.contact', { delay: 200, origin: 'bottom' })

// --- Mobile Menu Functionality ---
const menuIcon = document.getElementById('menu-icon');
const closeMenuBtn = document.getElementById('close-menu');
const navContainer = document.querySelector('.navlist-container');
const navOverlay = document.getElementById('nav-overlay');

function openMenu() {
	navContainer.classList.add('active');
	navOverlay.classList.add('active');
	document.body.style.overflow = 'hidden';
	menuIcon.classList.add('active');
}
function closeMenu() {
	navContainer.classList.remove('active');
	navOverlay.classList.remove('active');
	document.body.style.overflow = '';
	menuIcon.classList.remove('active');
}

if (menuIcon && navContainer && navOverlay && closeMenuBtn) {
	menuIcon.addEventListener('click', openMenu);
	closeMenuBtn.addEventListener('click', closeMenu);
	navOverlay.addEventListener('click', closeMenu);
	// Close menu when a nav link is clicked (on mobile)
	document.querySelectorAll('.navlist a').forEach(link => {
		link.addEventListener('click', () => {
			if (window.innerWidth <= 970) closeMenu();
		});
	});
}
const backToTopBtn = document.querySelector('.top');
backToTopBtn.addEventListener('click', function(e) {
	e.preventDefault();
	window.scrollTo({
		top: 0,
		behavior: 'smooth'
	});
});
