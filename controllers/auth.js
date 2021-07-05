const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/db");

// const tempData = [
//   {
//     name: "Mounica",
//     email: "mounica@gmail.com",
//     password: "mounicaweb",
//   },
//   {
//     name: "Arushi",
//     email: "arushi@gmail.com",
//     password: "arushiweb",
//   },
//   {
//     name: "Disha",
//     email: "disha@gmail.com",
//     password: "dishaweb",
//   },
// ];

exports.signup = (req, res) => {
  const { name, email, password } = req.body;

  // const isValid = tempData.findIndex((e) => e.email === email);

  client
    .query(`SELECT * FROM users where email = '${email}';`)
    .then((data) => {
      isValid = data.rows;

      if (isValid.length != 0) {
        res.status(400).json({
          error: "User already exists",
        });
      } else {
        bcrypt.hash(password, 10, (err, hash) => {
          if (err) {
            res.status(400).json({
              error: "Internal server error",
            });
          }
          const user = {
            name,
            email,
            password: hash,
          };

          // tempData.push(user);
          client
            .query(
              `INSERT INTO users (name, email, password) VALUES ('${user.name}', '${user.email}', '${user.password}');`
            )
            .then((data) => {
              const token = jwt.sign(
                {
                  email: email,
                },
                process.env.secret_key
              );
              res.status(200).json({
                message: "User added successfully",
                token: token,
              });
            })
            .catch((err) => {
              res.status(500).json({
                error: "Database error occurred",
              });
            });
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Database error occurred",
      });
    });
};

exports.signin = (req, res) => {
  const { email, password } = req.body;

  // const isValid = tempData.findIndex((e) => e.email === email);

  client
    .query(`SELECT * FROM users where email = '${email}';`)
    .then((data) => {
      userData = data.rows;

      if (userData.length == 0) {
        res.status(400).json({
          error: "User does not exist, sign up instead",
        });
      } else {
        bcrypt.compare(password, userData[0].password, (err, result) => {
          if (err) {
            res.status(500).json({
              error: "Server error",
            });
          } else if (result == true) {
            const token = jwt.sign(
              {
                email: email,
              },
              process.env.secret_key
            );
            res.status(200).json({
              message: "User signed in successfully",
              token: token,
            });
          } else {
            res.status(400).json({
              error: "Enter correct password",
            });
          }
        });
      }
    })
    .catch((err) => {
      res.status(500).json({
        error: "Database error occurred",
      });
    });
};