const header = document.querySelector("header");


var about=document.getElementById("myabout")
about.addEventListener("click",function(){
	var a =new Audio("sound/Tbne9iqUf64ba924cac96b1d5d02605041f2f052atKMGmOqPT.mp3")
	a.play()
})

var project=document.getElementById("myproject")
project.addEventListener("click",function(){
	var a =new Audio("sound/1683565933220yb9hqs0v-voicemaker.in-speech.mp3")
	a.play()
})

var contact=document.getElementById("mycontact")
contact.addEventListener("click",function(){
	var a =new Audio("sound/contact.mp3")
	a.play()
})
var cv=document.getElementById("cv")
cv.addEventListener("click",function(){
	var a =new Audio("sound/cv.mp3")
	a.play()
})


var certificate=document.getElementById("certificate")
certificate.addEventListener("click",function(){
	var a =new Audio("sound/certificate.mp3")
	a.play()
})

var backtohome=document.getElementById("back")
backtohome.addEventListener("mouseenter",function(){
	var a =new Audio("sound/backtohome.mp3")
	a.play()
})

var fimiliar=document.getElementById("fimiliar")
fimiliar.addEventListener("click",function(){
	var a =new Audio("sound/fimiliar.mp3")
	a.play()
})


var github=document.getElementById("github")
github.addEventListener("mouseenter",function(){

	
	var a =new Audio("sound/github.mp3")
	a.play()
})



  var t=100
  setInterval(function(){
	if(t==45){
	   t=70
	   document.getElementById("top").style.marginTop="-100px"
    }
	else{
		document.getElementById("top").style.marginTop="0px"
		t=45
	}
	document.getElementById("top").style.height=t+"px"
  },1000)

window.addEventListener ("scroll", function() {
	header.classList.toggle ("sticky", window.scrollY > 0);
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

const sr = ScrollReveal ({
	distance: '40px',
	duration: 2000,
	reset: true
})

sr.reveal('.home-text',{delay:350, origin:'left'})
sr.reveal('.home-img',{delay:350, origin:'right'})

sr.reveal('.sub-service,.about,.portfolio,.service,.cta,.contact',{delay:200, origin:'bottom'})