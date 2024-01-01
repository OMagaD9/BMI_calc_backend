const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "views", "index.html"));
});

app.route("/bmicalculator")
  .get((req, res) => {
    res.sendFile(path.join(__dirname, "public", "bmicalculator.html"));
  })
  .post(handleBMICalculation);

function handleBMICalculation(req, res) {
  const { weight, height, age, gender, weightUnit, heightUnit } = req.body;

  const weightInKg = weightUnit === "lbs" ? weight * 0.453592 : parseFloat(weight);
  const heightInM = heightUnit === "in" ? height * 0.0254 : parseFloat(height);

  if (isNaN(weightInKg) || weightInKg <= 0 || isNaN(heightInM) || heightInM <= 0) {
    return res.status(400).send("Invalid input. Please enter valid weight and height.");
  }

  const bmi = calculateBMI(weightInKg, heightInM);
  const interpretation = interpretBMI(bmi, age, gender);

  res.json({
    bmi: bmi.toFixed(2),
    interpretation: interpretation,
  });
}

function calculateBMI(weight, height) {
  return weight / Math.pow(height, 2);
}

function interpretBMI(bmi, age, gender) {
  if (bmi < 18.5) {
    return "Underweight";
  } else if (bmi >= 18.5 && bmi < 24 && gender === "female") {
    return "Normal Weight";
  } else if (bmi >= 18.5 && bmi < 25 && gender === "male") {
    return "Normal Weight";
  } else if (bmi >= 24 && bmi < 30 && gender === "female") {
    return "Overweight";
  } else if (bmi >= 25 && bmi < 30 && gender === "male") {
    return "Overweight";
  } else {
    return "Obese";
  }
}
app.listen(port, () => {
  console.log(`Server is listening at http://localhost:${port}`);
});
