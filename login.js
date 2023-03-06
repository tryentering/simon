function login() {
    const nameFromInput = document.querySelector("#name");
    localStorage.setItem("userName", nameFromInput.value);
    window.location.href = "play.html";
    //add name from the input to local storage
}