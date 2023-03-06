function login() {
    const nameFromInput = document.querySelector("#name");
    localStorage.setItem("userName", nameFromInput.value);
    window.location.href = "play.html";
    localStorage.setItem("scores", JSON.stringify([{name: "TEST", score: 9, date: '9/9/9999'}]));
    //add name from the input to local storage
}