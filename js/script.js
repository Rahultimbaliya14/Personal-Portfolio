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

var about = document.getElementById("myabout")
about.addEventListener("click", function () {
	var a = new Audio("sound/Tbne9iqUf64ba924cac96b1d5d02605041f2f052atKMGmOqPT.mp3")
	a.play()
})

var project = document.getElementById("myproject")
project.addEventListener("click", function () {
	var a = new Audio("sound/1683565933220yb9hqs0v-voicemaker.in-speech.mp3")
	a.play()
})

var contact = document.getElementById("mycontact")
contact.addEventListener("click", function () {
	var a = new Audio("sound/contact.mp3")
	a.play()
})
var cv = document.getElementById("cv")
cv.addEventListener("click", function () {
	var a = new Audio("sound/cv.mp3")
	a.play()
})


var certificate = document.getElementById("certificate")
certificate.addEventListener("click", function () {
	var a = new Audio("sound/certificate.mp3")
	a.play()
})

var backtohome = document.getElementById("back")
backtohome.addEventListener("mouseenter", function () {
	var a = new Audio("sound/backtohome.mp3")
	a.play()
})

var fimiliar = document.getElementById("fimiliar")
fimiliar.addEventListener("click", function () {
	var a = new Audio("sound/fimiliar.mp3")
	a.play()
})


var github = document.getElementById("github")
github.addEventListener("mouseenter", function () {
	var a = new Audio("sound/github.mp3")
	a.play()
})



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
// --- End Mobile Menu Functionality ---