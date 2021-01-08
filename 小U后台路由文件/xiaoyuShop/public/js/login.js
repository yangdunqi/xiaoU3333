window.onload = function () {
    var checked = document.getElementById("checked");
    var no_checked = document.getElementById("no_checked");
    checked.onclick = function () {
        checked.style.display = "none";
        no_checked.style.display = "inline";
    }
    no_checked.onclick = function () {
        checked.style.display = "inline";
        no_checked.style.display = "none";
    }
}