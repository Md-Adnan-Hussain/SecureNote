document.getElementById("createNote").addEventListener("click", function () {
  const password1 = document.getElementById("password1").value;
  const password2 = document.getElementById("password2").value;
  const form = document.getElementById("noteForm");

  if (password1 !== password2) {
    alert("Passwords do not match! Please try again.");
    return;
  }

  if (!form.checkValidity()) {
    form.classList.add("was-validated");
    return;
  }

  document.getElementById("noteForm").submit();
});
