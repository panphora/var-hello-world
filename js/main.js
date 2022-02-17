/*

  EXAMPLE

  <form action="https://app.convertkit.com/forms/2980971/subscriptions" method="POST">
    <input id="email" type="email" name="email_address" placeholder="Email address">
    <div class="spacer"></div>
    <div class="spacer"></div>
    <button type="submit">Get early access</button>
  </form>   

*/

function initConvertKitForm ({formElem}) {
  formElem.addEventListener("submit", function (event) {
    event.preventDefault();
    let formDataObj = new FormData(formElem);

    if (!crostini) {
      console.error("FORM ERROR: form requires 'crostini' toast notification library in order to display error/success messages to user");
      return;
    }

    let email = formDataObj.get("email_address");

    if (!email) {
      console.error("FORM ERROR: needs a field with a name 'email_address'");
      return;
    }

    if (email === "test@test.com") {
      signupSuccess({formElem});
      return;
    }

    formDataObj.append("token", "");
    formDataObj.append("user", "");
    formDataObj.append("referrer", document.referrer);

    fetch(formElem.action, {
      method: "POST",
      body: formDataObj,
      headers: {
        "Accept": "application/json"
      }
    })
    .then(res => res.json())
    .then(res => {
      if (res.status === "success") {
        signupSuccess({formElem});
      } else {
        if (res.errors.fields.includes("email_address")) {
          crostini("Error: Invalid email address.", {type: "error"});
        } else {
          crostini("Error: Please try again.", {type: "error"});
        }
      }
    })
    .catch(err => {
      crostini("Error signing up, please try again.", {type: "error"});
    });
  });
}

function signupSuccess ({formElem}) {
  crostini("Success! Check email to confirm!");
  formElem.reset();
}

initConvertKitForm({formElem: document.querySelector("form")});