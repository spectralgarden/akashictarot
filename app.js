function search() {
  const searchTerm = document.getElementById("searchInput").value;
  const divs = document.getElementsByTagName("div");
  for (const div of divs) {
    if (div.textContent.toLowerCase().includes(searchTerm.toLowerCase())) {
      event.preventDefault();

      // Remove the class from all the divs
      for (const elem of divs) {
        elem.classList.remove("selected-div");
      }

      // Add the class to the selected div
      div.classList.add("selected-div");
      const offsetTop = window.innerHeight / 2 - div.offsetHeight / 2;
      div.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
      break;
    }
  }
}

document.getElementById("searchInput").addEventListener("click", function() {
  this.placeholder = "";
});

const randomScrollButton = document.getElementById("random-scroll-button");
const scrollDivs = document.getElementsByClassName("scroll-div");

randomScrollButton.addEventListener("click", function() {
  const randomIndex = Math.floor(Math.random() * scrollDivs.length);
  const randomDiv = scrollDivs[randomIndex];
  
  // Remove the class from all the scroll-divs
  for (const div of scrollDivs) {
    div.classList.remove("selected-div");
  }
  
  // Add the class to the selected div
  randomDiv.classList.add("selected-div");
  
  const offsetTop = window.innerHeight / 2 - randomDiv.offsetHeight / 2;
  randomDiv.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
});