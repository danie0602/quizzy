var express = require("express");
var router = express.Router();

var database = require("../database");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("loginpage", { title: "Express", session: req.session });
});

router.post("/login", function (request, response, next) {
  var user_name = request.body.user_name;

  var user_password = request.body.user_password;

  if (user_name && user_password) {
    query = `
        SELECT * FROM students 
        WHERE student_code = "${user_name}"
        `;

    database.query(query, function (error, data) {
      if (data.length > 0) {
        console.log(data);
        console.log(data[0].first_name);
        for (var count = 0; count < data.length; count++) {
          if (data[count].student_password == user_password) {
            var userid = data[count].student_id;
            request.session.userid = userid;
            console.log(userid);
            // userid = request.session.userid;
            console.log(request.session.userid);
            request.session.user_name = user_name;

            console.log(userid);
            response.render("QuizPage", {
              data: data,
              username: user_name,
              userid: userid,
            });
          } else {
            response.send("Incorrect Password");
          }
        }
      } else {
        response.send("Incorrect Username");
      }
      response.end();
    });
  } else {
    response.send("Please Enter Username and Password Details");
    response.end();
  }
});

router.get("/home/:userid", function (req, res, next) {
  var userid = req.session.userid;
  query = `
        SELECT * FROM students 
        WHERE student_id = "${userid}"
        `;

  database.query(query, function (error, data) {
    res.render("QuizPage", {
      userid,
      data,
    });
  });
});
router.get("/logout", function (request, response, next) {
  console.log(request.session);
  request.session.destroy();

  response.redirect("/");
});

router.get("/createuser", function (req, res, next) {
  res.render("createuser");
});

router.post("/createuser", function (request, response, next) {
  var student_code = request.body.user_name;

  var student_password = request.body.user_password;

  var first_name = request.body.first_name;

  var last_name = request.body.last_name;

  query = `
        SELECT * FROM students 
        WHERE student_code = "${student_code}"
        `;

  database.query(query, function (error, data) {
    if (data.length > 0) {
      response.send("Username has been used. Please try another one");
    } else {
      var query = `
      INSERT INTO students 
      (student_code, student_password, first_name, last_name) 
      VALUES ("${student_code}", "${student_password}", "${first_name}", "${last_name}")
      `;

      database.query(query, function (error, data) {
        if (error) {
          throw error;
        } else {
          console.log("create account successfully");
          response.render("createsuccesspage");
        }
      });
    }
  });
});

router.get("/createsuccesspage", function (req, res, next) {
  res.render("createsuccesspage");
});

router.get("/getstudentlist", async (req, res) => {
  const users = database.query(
    "SELECT * FROM students",
    function (err, result, fields) {
      if (err) throw err;
      console.log(result);
    }
  );
  res.send("get user list");
});

router.get("/test/:userid", async (req, res) => {
  var userid = req.session.userid;

  query = `SELECT * FROM subjects`;

  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else {
      console.log(userid);
      console.log(data);
      res.render("test", { userid, datas: data });
    }
  });
});

//SELECT s.title as "Subject", q.question, q.option, q.answer
//FROM subjects s
///INNER JOIN subjects_questions sq
//ON s.subject_id = sq.subject_id
//INNER JOIN questions q
//ON sq.question_id = q.question_id
//WHERE s.subject_id = 1;

router.get("/test/:userid/:subjectid", async (req, res) => {
  var userid = req.session.userid;
  var subjectid = req.params.subjectid;
  console.log(userid);
  query = `
  SELECT s.title as "Subject", q.question, q.option, q.answer
  FROM subjects s
  INNER JOIN subjects_questions sq
  ON s.subject_id = sq.subject_id
  INNER JOIN questions q
  ON sq.question_id = q.question_id
  WHERE s.subject_id = "${req.params.subjectid}";
  `;

  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else {
      console.log(userid);
      console.log(data);
      res.render("testcontent", { datas: data, userid, subjectid });
    }
  });
});

router.post("/submit/:userid/:subjectid", async (req, res) => {
  console.log(req.session.userid);
  var userid = req.session.userid;
  var subjectid = req.params.subjectid;
  var answers = req.body;
  console.log(answers);

  const values = Object.values(answers);
  console.log(values);

  query = `
  SELECT s.title as "Subject", q.question, q.option, q.answer
  FROM subjects s
  INNER JOIN subjects_questions sq
  ON s.subject_id = sq.subject_id
  INNER JOIN questions q
  ON sq.question_id = q.question_id
  WHERE s.subject_id = "${req.params.subjectid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else {
      let point = 0;
      for (let i = 0; i < 20; i++) {
        console.log(data[i].answer);
        console.log(values[i]);
        if (data[i].answer == values[i]) {
          console.log("You have one point!");
          point += 1;
        } else console.log("You missed it!");
      }
      console.log(point);
      var query = `
      INSERT INTO results 
      (student_id, subject_id, mark) 
      VALUES ("${userid}", "${subjectid}", "${point}")
      `;
      database.query(query, function (error, data) {
        if (error) {
          throw err;
        } else res.render("scorepage", { point: point, userid });
      });
    }
  });
});

router.get("/result/:userid", async (req, res) => {
  var userid = req.session.userid;
  query = `
  SELECT s.title as "subject", r.date, r.mark , st.first_name
  FROM students st
  INNER JOIN results r
  ON st.student_id = r.student_id
  INNER JOIN subjects s
  ON r.subject_id = s.subject_id
  WHERE st.student_id = "${userid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else res.render("resultpage", { datas: data, userid });
  });
});

router.get("/myaccount/:userid", async (req, res) => {
  var userid = req.session.userid;
  query = `
  SELECT * FROM students WHERE student_id = "${userid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else console.log(userid);
    console.log(data);
    res.render("myaccount", {
      data,
      userid,
    });
  });
});

router.get("/myaccount/:userid/updatepassword", async (req, res) => {
  var userid = req.session.userid;
  query = `
  SELECT * FROM students WHERE student_id = "${userid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else console.log(userid);
    console.log(data);
    res.render("updatepassword", {
      data,
      userid,
    });
  });
});

router.post("/myaccount/:userid/updatepassword", async (req, res) => {
  var userid = req.params.userid;
  console.log(req.body.password);
  var newPassword = req.body.password;

  query = `
  UPDATE students SET student_password = "${newPassword}" WHERE student_id = "${userid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else console.log(userid);
    console.log("update password successfully");
    res.redirect("/myaccount/:userid");
  });
});

router.get("/myaccount/:userid/updateusername", async (req, res) => {
  var userid = req.session.userid;
  query = `
  SELECT * FROM students WHERE student_id = "${userid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else console.log(userid);
    console.log(data);
    res.render("updateusername", {
      data,
      userid,
    });
  });
});

router.post("/myaccount/:userid/updateusername", async (req, res) => {
  var userid = req.params.userid;
  console.log(req.body.username);
  var newUsername = req.body.username;
  query = `
  SELECT * FROM students 
  WHERE student_code = "${newUsername}"
  `;

  database.query(query, function (error, data) {
    if (data.length === 0) {
      query = `
  UPDATE students SET student_code = "${newUsername}" WHERE student_id = "${userid}";
  `;
      database.query(query, function (error, data) {
        if (error) {
          throw err;
        } else console.log(userid);
        console.log("update username successfully");
        res.redirect("/myaccount/:userid");
      });
    } else res.send("Username has been used. Please try another one");
  });
});

router.get("/myaccount/:userid/updatefirstname", async (req, res) => {
  var userid = req.session.userid;
  query = `
  SELECT * FROM students WHERE student_id = "${userid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else console.log(userid);
    console.log(data);
    res.render("updatefirstname", {
      data,
      userid,
    });
  });
});

router.get("/myaccount/:userid/updatelastname", async (req, res) => {
  var userid = req.session.userid;
  query = `
  SELECT * FROM students WHERE student_id = "${userid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else console.log(userid);
    console.log(data);
    res.render("updatelastname", {
      data,
      userid,
    });
  });
});

router.post("/myaccount/:userid/updatefirstname", async (req, res) => {
  var userid = req.params.userid;
  console.log(req.body.firstname);
  var newFirstname = req.body.firstname;

  query = `
  UPDATE students SET first_name = "${newFirstname}" WHERE student_id = "${userid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else console.log(userid);
    console.log("update first name successfully");
    res.redirect("/myaccount/:userid");
  });
});

router.post("/myaccount/:userid/updatelastname", async (req, res) => {
  var userid = req.params.userid;
  console.log(req.body.lastname);
  var newLastname = req.body.lastname;

  query = `
  UPDATE students SET first_name = "${newLastname}" WHERE student_id = "${userid}";
  `;
  database.query(query, function (error, data) {
    if (error) {
      throw err;
    } else console.log(userid);
    console.log("update last name successfully");
    res.redirect("/myaccount/:userid");
  });
});

module.exports = router;
