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
			navLinks.forEach(link => link.classList.remove('active'));
			const activeLink = document.querySelector(`.navlist a[href="#${sectionId}"]`);
			if (activeLink) activeLink.classList.add('active');
		}
	});
}

window.addEventListener('scroll', updateActiveNav);
document.addEventListener('DOMContentLoaded', updateActiveNav);

// ---------------------------------------------------------------------
// Feedback Form
// ---------------------------------------------------------------------

function clearFeedbackForm() {
	const form = document.getElementById('feedbackForm');
	if (form) {
		form.reset();
		const inputs = form.querySelectorAll('input, textarea');
		inputs.forEach(input => input.classList.remove('error-input'));
	}
}

function handleFeedbackSubmit(event) {
	event.preventDefault();

	const form = event.target;
	const emailInput = form.querySelector('#feedbackEmail');
	const feedbackInput = form.querySelector('#feedbackMessage');
	const email = emailInput.value.trim();
	const feedback = feedbackInput.value.trim();

	removeFeedbackError();

	let hasErrors = false;

	if (!email) {
		addFeedbackError(emailInput);
		hasErrors = true;
	}
	if (!feedback) {
		addFeedbackError(feedbackInput);
		hasErrors = true;
	}

	if (hasErrors) {
		showCustomAlert('Please fill in all fields.', 'error');
		return;
	}

	if (!isValidEmail(email)) {
		addFeedbackError(emailInput);
		showCustomAlert('Please enter a valid email address.', 'error');
		return;
	}

	submitFeedbackToAPI(email, feedback);
}

async function submitFeedbackToAPI(email, feedback) {
	try {
		const submitBtn = document.querySelector('.submit-btn');
		const originalText = submitBtn.textContent;
		submitBtn.textContent = 'Submitting...';
		submitBtn.disabled = true;

		const feedbackData = {
			email: email,
			comment: feedback,
			timestamp: new Date().toISOString(),
		};

		const API_ENDPOINT = 'https://node-rahul-timbaliya.vercel.app/api/feedback/create';

		const response = await fetch(API_ENDPOINT, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json'
			},
			body: JSON.stringify(feedbackData)
		});

		submitBtn.textContent = originalText;
		submitBtn.disabled = false;

		if (response.ok) {
			showCustomAlert('Thank you for your feedback! I will get back to you soon.', 'success');
			setTimeout(() => clearFeedbackForm(), 2000);
		} else {
			const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
			showCustomAlert(`Failed to submit feedback: ${errorData.message || 'Please try again later.'}`, 'error');
		}

	} catch (error) {
		console.error('Error submitting feedback:', error);
		const submitBtn = document.querySelector('.submit-btn');
		submitBtn.textContent = 'Submit feedback';
		submitBtn.disabled = false;
		showCustomAlert('Failed to submit feedback. Please check your internet connection and try again.', 'error');
	}
}

function addFeedbackError(input) {
	if (input) {
		input.classList.add('error-input', 'shake-animation');
		setTimeout(() => input.classList.remove('shake-animation'), 500);
	}
}

function removeFeedbackError() {
	const feedbackForm = document.getElementById('feedbackForm');
	if (feedbackForm) {
		feedbackForm.querySelectorAll('input, textarea').forEach(input => {
			input.classList.remove('error-input', 'shake-animation');
		});
	}
}

document.addEventListener('DOMContentLoaded', function() {
	const feedbackForm = document.getElementById('feedbackForm');
	if (feedbackForm) {
		feedbackForm.addEventListener('submit', handleFeedbackSubmit);
		feedbackForm.querySelectorAll('input, textarea').forEach(input => {
			input.addEventListener('input', function() {
				if (this.classList.contains('error-input')) {
					this.classList.remove('error-input', 'shake-animation');
				}
			});
		});
	}
});

// ---------------------------------------------------------------------
// Smooth scroll
// ---------------------------------------------------------------------

navLinks.forEach(link => {
	link.addEventListener('click', function(e) {
		e.preventDefault();
		const targetId = this.getAttribute('href');
		const targetSection = document.querySelector(targetId);
		if (targetSection) {
			const headerHeight = header ? header.offsetHeight : 0;
			const targetPosition = targetSection.offsetTop - headerHeight;
			window.scrollTo({ top: targetPosition, behavior: 'smooth' });
		}
	});
});

// ---------------------------------------------------------------------
// About section entrance animation
// ---------------------------------------------------------------------

function shuffleCardsAnimation() {
	const expCards = document.querySelectorAll('.experience-section .experience-item');
	const eduCards = document.querySelectorAll('.education-section .education-item');
	const allCards = [...expCards, ...eduCards];
	const aboutSection = document.querySelector('.about');

	if (!aboutSection || allCards.length === 0) return;

	allCards.forEach(card => {
		card.style.transition = 'transform 0.6s cubic-bezier(.22,1,.36,1), opacity 0.6s';
		card.style.transform = 'translateY(24px)';
		card.style.opacity = '0';
	});

	setTimeout(() => {
		allCards.forEach((card, i) => {
			setTimeout(() => {
				card.style.transform = 'translateY(0)';
				card.style.opacity = '1';
			}, i * 70);
		});
	}, 150);
}

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

// ---------------------------------------------------------------------
// Email Modal
// ---------------------------------------------------------------------

function showEmailModal() {
	const modal = document.getElementById('emailModal');
	if (modal) modal.classList.add('show');
}

function hideEmailModal() {
	const modal = document.getElementById('emailModal');
	if (modal) modal.classList.remove('show');
}

async function handleEmailSubmit() {
	const emailInput = document.getElementById('emailInput');
	const email = emailInput.value.trim();
	const sendBtn = document.getElementById('sendEmail');

	removeEmailError();

	if (!email) {
		addEmailError();
		showCustomAlert('Please enter your email address!', 'error');
		return;
	}

	if (!isValidEmail(email)) {
		addEmailError();
		showCustomAlert('Please enter a valid email address!', 'error');
		return;
	}

	if (sendBtn) {
		sendBtn.disabled = true;
		sendBtn.textContent = 'Sending...';
		sendBtn.style.opacity = '0.7';
	}

	try {
		const response = await fetch('https://node-rahul-timbaliya.vercel.app/api/mail/send', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
			},
			body: JSON.stringify({ email: email }),
			mode: 'cors',
		});

		if (response.ok) {
			try { await response.json(); } catch (jsonError) { /* non-JSON success response */ }
			showCustomAlert('Thank you for subscribing! You will receive updates about my latest projects.', 'success');
			hideEmailModal();
			emailInput.value = '';
			removeEmailError();
		} else {
			let errorData;
			try {
				errorData = await response.json();
			} catch (jsonError) {
				try {
					const errorText = await response.text();
					errorData = { message: errorText || `HTTP ${response.status}: ${response.statusText}` };
				} catch (textError) {
					errorData = { message: `HTTP ${response.status}: ${response.statusText}` };
				}
			}
			showCustomAlert(`Failed to send email: ${errorData.message || 'Please try again later.'}`, 'error');
		}
	} catch (error) {
		console.error('Email send error:', error);
		if (error.name === 'TypeError' && error.message.includes('fetch')) {
			showCustomAlert('CORS error: Unable to connect to the API. Please check if the server allows cross-origin requests.', 'error');
		} else if (error.name === 'AbortError') {
			showCustomAlert('Request timeout. Please try again.', 'error');
		} else {
			showCustomAlert(`Network error: ${error.message}. Please check your connection and try again.`, 'error');
		}
	} finally {
		if (sendBtn) {
			sendBtn.disabled = false;
			sendBtn.textContent = 'Subscribe';
			sendBtn.style.opacity = '1';
		}
	}
}

function isValidEmail(email) {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
}

function addEmailError() {
	const emailInput = document.getElementById('emailInput');
	if (emailInput) {
		emailInput.classList.add('error-input', 'shake-animation');
		setTimeout(() => emailInput.classList.remove('shake-animation'), 500);
	}
}

function removeEmailError() {
	const emailInput = document.getElementById('emailInput');
	if (emailInput) emailInput.classList.remove('error-input', 'shake-animation');
}

function showCustomAlert(message, type = 'info') {
	const existingAlert = document.querySelector('.custom-alert');
	if (existingAlert) existingAlert.remove();

	const alertDiv = document.createElement('div');
	alertDiv.className = `custom-alert alert-${type}`;
	alertDiv.innerHTML = `
		<div class="alert-content">
			<div class="alert-icon">${type === 'error' ? '⚠️' : type === 'success' ? '✅' : 'ℹ️'}</div>
			<div class="alert-message">${message}</div>
			<button class="alert-close" onclick="this.parentElement.parentElement.remove()">&times;</button>
		</div>
	`;

	document.body.appendChild(alertDiv);
	setTimeout(() => alertDiv.classList.add('show'), 10);

	setTimeout(() => {
		if (alertDiv.parentElement) {
			alertDiv.classList.remove('show');
			setTimeout(() => { if (alertDiv.parentElement) alertDiv.remove(); }, 300);
		}
	}, 4000);
}

window.addEventListener('DOMContentLoaded', function() {
	setTimeout(showEmailModal, 1500);

	const sendBtn = document.getElementById('sendEmail');
	if (sendBtn) sendBtn.addEventListener('click', handleEmailSubmit);

	const cancelBtn = document.getElementById('cancelModal');
	if (cancelBtn) cancelBtn.addEventListener('click', hideEmailModal);

	const modal = document.getElementById('emailModal');
	if (modal) {
		modal.addEventListener('click', function(e) {
			if (e.target === modal) hideEmailModal();
		});
	}

	const emailInput = document.getElementById('emailInput');
	if (emailInput) {
		emailInput.addEventListener('keypress', function(e) {
			if (e.key === 'Enter') handleEmailSubmit();
		});
		emailInput.addEventListener('input', removeEmailError);
		emailInput.addEventListener('focus', removeEmailError);
	}

	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			const modal = document.getElementById('emailModal');
			if (modal && modal.classList.contains('show')) hideEmailModal();
		}
	});
});

// ---------------------------------------------------------------------
// Header, mobile nav, back-to-top
// ---------------------------------------------------------------------

window.addEventListener("scroll", function () {
	if (header) header.classList.toggle("sticky", window.scrollY > 0);
});

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
	document.querySelectorAll('.navlist a').forEach(link => {
		link.addEventListener('click', () => {
			if (window.innerWidth <= 970) closeMenu();
		});
	});
}

const backToTopBtn = document.querySelector('.top');
if (backToTopBtn) {
	backToTopBtn.addEventListener('click', function(e) {
		e.preventDefault();
		window.scrollTo({ top: 0, behavior: 'smooth' });
	});

	window.addEventListener('scroll', function() {
		backToTopBtn.classList.toggle('hide', window.scrollY < 200);
	});
}

(function heroParticles() {
	const canvas = document.getElementById('hero-canvas');
	const section = document.getElementById('home');
	if (!canvas || !section) return;

	const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	if (prefersReducedMotion) {
		canvas.style.display = 'none';
		return;
	}

	const ctx = canvas.getContext('2d');
	let width, height, dpr;
	let particles = [];
	let mouse = { x: -9999, y: -9999, active: false };
	let rafId = null;

	const styles = getComputedStyle(document.documentElement);
	const dotColor = '98, 105, 122';   // --muted rgb
	const lineColor = '98, 105, 122';  // faint connective lines
	const accentColor = '37, 84, 224'; // --blue rgb

	const LINK_DIST = 130;
	const MOUSE_DIST = 170;

	function particleCount() {
		const area = width * height;
		return Math.max(28, Math.min(80, Math.round(area / 16000)));
	}

	function resize() {
		const rect = section.getBoundingClientRect();
		dpr = Math.min(window.devicePixelRatio || 1, 2);
		width = rect.width;
		height = rect.height;
		canvas.width = width * dpr;
		canvas.height = height * dpr;
		canvas.style.width = width + 'px';
		canvas.style.height = height + 'px';
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		const count = particleCount();
		particles = Array.from({ length: count }, () => ({
			x: Math.random() * width,
			y: Math.random() * height,
			vx: (Math.random() - 0.5) * 0.35,
			vy: (Math.random() - 0.5) * 0.35,
			r: Math.random() * 1.4 + 1,
		}));
	}

	function step() {
		ctx.clearRect(0, 0, width, height);

		// update + draw particles
		particles.forEach(p => {
			p.x += p.vx;
			p.y += p.vy;

			if (p.x < 0 || p.x > width) p.vx *= -1;
			if (p.y < 0 || p.y > height) p.vy *= -1;
			p.x = Math.max(0, Math.min(width, p.x));
			p.y = Math.max(0, Math.min(height, p.y));

			// gentle drift away from the cursor
			if (mouse.active) {
				const dx = p.x - mouse.x;
				const dy = p.y - mouse.y;
				const dist = Math.hypot(dx, dy);
				if (dist < MOUSE_DIST && dist > 0.1) {
					const force = (1 - dist / MOUSE_DIST) * 0.6;
					p.x += (dx / dist) * force;
					p.y += (dy / dist) * force;
				}
			}
		});

		// connective lines between nearby particles
		for (let i = 0; i < particles.length; i++) {
			for (let j = i + 1; j < particles.length; j++) {
				const a = particles[i], b = particles[j];
				const d = Math.hypot(a.x - b.x, a.y - b.y);
				if (d < LINK_DIST) {
					const alpha = (1 - d / LINK_DIST) * 0.18;
					ctx.strokeStyle = `rgba(${lineColor}, ${alpha})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(a.x, a.y);
					ctx.lineTo(b.x, b.y);
					ctx.stroke();
				}
			}
		}

		// lines + glow from cursor to nearby particles
		if (mouse.active) {
			particles.forEach(p => {
				const d = Math.hypot(p.x - mouse.x, p.y - mouse.y);
				if (d < MOUSE_DIST) {
					const alpha = (1 - d / MOUSE_DIST) * 0.5;
					ctx.strokeStyle = `rgba(${accentColor}, ${alpha})`;
					ctx.lineWidth = 1;
					ctx.beginPath();
					ctx.moveTo(p.x, p.y);
					ctx.lineTo(mouse.x, mouse.y);
					ctx.stroke();

					ctx.fillStyle = `rgba(${accentColor}, ${0.35 + alpha * 0.5})`;
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.r + 1, 0, Math.PI * 2);
					ctx.fill();
				} else {
					ctx.fillStyle = `rgba(${dotColor}, 0.45)`;
					ctx.beginPath();
					ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
					ctx.fill();
				}
			});
		} else {
			particles.forEach(p => {
				ctx.fillStyle = `rgba(${dotColor}, 0.45)`;
				ctx.beginPath();
				ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
				ctx.fill();
			});
		}

		rafId = requestAnimationFrame(step);
	}

	function handleMouseMove(e) {
		const rect = section.getBoundingClientRect();
		mouse.x = e.clientX - rect.left;
		mouse.y = e.clientY - rect.top;
		mouse.active = mouse.x >= 0 && mouse.x <= width && mouse.y >= 0 && mouse.y <= height;
	}

	function handleMouseLeave() { mouse.active = false; }

	function init() {
		resize();
		if (rafId) cancelAnimationFrame(rafId);
		step();
	}

	window.addEventListener('resize', () => { resize(); });
	section.addEventListener('mousemove', handleMouseMove);
	section.addEventListener('mouseleave', handleMouseLeave);
	// keep it alive on touch devices too, following the first touch point
	section.addEventListener('touchmove', (e) => {
		if (e.touches && e.touches[0]) {
			const rect = section.getBoundingClientRect();
			mouse.x = e.touches[0].clientX - rect.left;
			mouse.y = e.touches[0].clientY - rect.top;
			mouse.active = true;
		}
	}, { passive: true });
	section.addEventListener('touchend', handleMouseLeave);

	document.addEventListener('DOMContentLoaded', init);
})();

// ---------------------------------------------------------------------
// Scroll reveal
// ---------------------------------------------------------------------

if (window.ScrollReveal) {
	const sr = ScrollReveal({
		distance: '30px',
		duration: 900,
		easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
		reset: false
	});

	sr.reveal('.home-text', { delay: 150, origin: 'left' });
	sr.reveal('.home-img', { delay: 250, origin: 'right' });
	sr.reveal('.sub-service, .about, .portfolio, .service, .cta, .feedback', { delay: 100, origin: 'bottom', interval: 80 });
}