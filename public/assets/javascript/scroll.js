//Sticky Scroll Follow Navbar Function
$(window).scroll(function() {scrollFunction()} );
var navbar = document.getElementById("navbar");
var sticky = navbar.offsetTop;
function scrollFunction() {
  if (window.pageYOffset >= sticky) {
    navbar.classList.add("sticky")
  } 
  else {
    navbar.classList.remove("sticky");
  }
}