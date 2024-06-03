// function fetchJSONData() {
//   fetch("./QuizPage.json")
//     .then((res) => {
//       console.log("inner", res.body.getReader());

//       if (!res.ok) {
//         throw new Error(`HTTP error! Status: ${res.status}`);
//       }

//       return res.json();
//     })
//     .then((data) => console.log(data))
//     .then()
//     .catch((error) => console.error("Unable to fetch data:", error));
//   console.log("outer");
// }
// fetchJSONData();

let a = 0;
const loadQuizQuestion = async () => {
  const res = await fetch("./QuizPage.json");
  console.log("hello");
  const data = await res.json();
  console.log("goodbye");

  let randomQuiznumbers = [];
  while (randomQuiznumbers.length < 10) {
    let randomQuiznumber = Math.floor(Math.random() * 50) + 1;
    if (randomQuiznumbers.indexOf(randomQuiznumber) === -1)
      randomQuiznumbers.push(randomQuiznumber);
  }
  for (let i = 0; i < randomQuiznumbers.length; i++) {
    const randomQuiz = [data[randomQuiznumbers[i] - 1]];
    console.log(randomQuiz);
    console.log(randomQuiz[0].question);
    const answers = randomQuiz[0].option;
    answers.forEach((answer) => console.log(answer));
    a += 1;
    const quiznumber = document.createElement("span");
    document.querySelector("form").appendChild(quiznumber);
    quiznumber.innerText = a;

    const question = document.createElement("p");
    document.querySelector("form").appendChild(question);
    question.innerText = randomQuiz[0].question;
    question.setAttribute("id", randomQuiz[0].correctAnswer);
    answers.forEach((answer) => {
      console.log(answer);
      const div = document.createElement("div");
      document.querySelector("form").appendChild(div);
      const radioInput = document.createElement("input");
      document.querySelector("form").appendChild(radioInput);
      radioInput.setAttribute("type", "radio");
      radioInput.setAttribute("name", question.innerText);
      radioInput.setAttribute("id", answer.replaceAll(" ", ""));
      radioInput.setAttribute("value", answer);
      radioInput.setAttribute("required", "");
      const label = document.createElement("label");
      document.querySelector("form").appendChild(label);
      label.innerText = answer;
      label.setAttribute("for", answer);

      // randomQuizsheet.push(randomQuiz);
      // console.log(randomQuizsheet);
      //   randomQuizsheet.forEach((quiz){
      //     console.log(quiz.question)

      // })
    });
  }
  const submitButton = document.createElement("button");
  document.querySelector("form").appendChild(submitButton);
  submitButton.innerText = "Submit";
};

const form = document.querySelector("form");
form.addEventListener("submit", function (e) {
  e.preventDefault();
  const question = document.querySelectorAll("p");
  const choice = document.querySelectorAll("input:checked");

  let point = 0;
  for (let i = 0; i < 10; i++) {
    console.log(i);
    console.log(choice[i].value);
    console.log(question[i].id);

    if (choice[i].value === question[i].id) {
      console.log("You have one point!");
      point += 1;
    } else console.log("You missed it!");
  }

  console.log(point);
  const result = document.createElement("p");
  document.querySelector("form").appendChild(result);
  result.setAttribute("id", "result");
  result.innerText = point;

  const resultValue = result.innerText;
  localStorage.setItem("result", resultValue);

  window.location.href = "ResultPage.html";
  // document.querySelector("#form").submit();
});
// data.forEach((quiz) => {
//   console.log(quiz.id);
//   console.log(quiz.question);
//   const answers = quiz.option;
//   answers.forEach((answer) => console.log(answer));
//   const question = document.createElement("p");
//   document.body.append(question);
//   question.innerText = quiz.question;

//   answers.forEach((answer) => {
//     console.log(answer);
//     const div = document.createElement("div");
//     document.body.append(div);
//     const radioInput = document.createElement("input");
//     document.body.append(radioInput);
//     radioInput.setAttribute("type", "radio");
//     radioInput.setAttribute("name", question.innerText);
//     radioInput.setAttribute("id", answer);
//     radioInput.setAttribute("value", answer);
//     const label = document.createElement("label");
//     document.body.append(label);
//     label.innerText = answer;
//     label.setAttribute("for", answer);
//   });
// console.log(quiz.option[0]);
// console.log(quiz.option[1]);
// console.log(quiz.option[2]);
// console.log(quiz.option[3]);
// const question = document.createElement("p");
// document.body.append(question);
// question.innerText = quiz.question;
// const div0 = document.createElement("div");
// document.body.append(div0);
// const radioInput0 = document.createElement("input");
// document.body.append(radioInput0);
// radioInput0.setAttribute("type", "radio");
// radioInput0.setAttribute("name", quiz.question);
// radioInput0.setAttribute("id", quiz.option[0]);
// radioInput0.setAttribute("value", quiz.option[0]);
// const label0 = document.createElement("label");
// document.body.append(label0);
// label0.innerText = quiz.option[0];
// label0.setAttribute("for", quiz.option[0]);

// const div1 = document.createElement("div");
// document.body.append(div1);
// const radioInput1 = document.createElement("input");
// document.body.append(radioInput1);
// radioInput1.setAttribute("type", "radio");
// radioInput1.setAttribute("name", quiz.question);
// radioInput1.setAttribute("id", quiz.option[1]);
// radioInput1.setAttribute("value", quiz.option[1]);
// const label1 = document.createElement("label");
// document.body.append(label1);
// label1.innerText = quiz.option[1];
// label1.setAttribute("for", quiz.option[1]);

// const div2 = document.createElement("div");
// document.body.append(div2);
// const radioInput2 = document.createElement("input");
// document.body.append(radioInput2);
// radioInput2.setAttribute("type", "radio");
// radioInput2.setAttribute("name", quiz.question);
// radioInput2.setAttribute("id", quiz.option[2]);
// radioInput2.setAttribute("value", quiz.option[2]);
// const label2 = document.createElement("label");
// document.body.append(label2);
// label2.innerText = quiz.option[2];
// label2.setAttribute("for", quiz.option[2]);

// const div3 = document.createElement("div");
// document.body.append(div3);
// const radioInput3 = document.createElement("input");
// document.body.append(radioInput3);
// radioInput3.setAttribute("type", "radio");
// radioInput3.setAttribute("name", quiz.question);
// radioInput3.setAttribute("id", quiz.option[3]);
// radioInput3.setAttribute("value", quiz.option[3]);
// const label3 = document.createElement("label");
// document.body.append(label3);
// label3.innerText = quiz.option[3];
// label3.setAttribute("for", quiz.option[3]);
//   });
// };
loadQuizQuestion();

// function createQuestion() {
//   const question = document.createElement("p");
//   document.body.append(question);
//   question.innerText = res.data;

//   const radioInput = document.createElement("input");
//   document.body.append(radioInput);
//   radioInput.setAttribute("type", "radio");
//   radioInput.setAttribute("name", "Howareyou");
//   radioInput.setAttribute("id", "imokay");
//   radioInput.setAttribute("value", "imOkay");
//   const label = document.createElement("label");
//   document.body.append(label);
//   label.innerText = "I'm okay";
//   label.setAttribute("for", "imokay");
// }
