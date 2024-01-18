const deleteButton = document.getElementById("delete-button");

deleteButton.addEventListener("click", () => {
  const username = document.getElementById("username").value;

  fetch("/users", {
    method: "delete",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
    }),
  })
    .then((res) => {
      if (res.ok) return res.json();
    })
    .then((res) => {
      window.location.reload(true);
    });
});

const update = document.getElementById("update-button");

update.addEventListener("click", () => {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  fetch("/users", {
    method: "put",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  }).then((res) => {
    console.log(`main.js res`, JSON.stringify(res));
    if (res.ok) {
      window.location.reload(true);
      return res.json();
    }
  });
});
