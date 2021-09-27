module.exports = function fnPrintInfo(message, option) {
  let colors = require("colors");

  let uniques = [];
  let corrects = 0;
  let incorrects = 0;
  let brokenLinks = 0;
  let porcentWorking = 0;

  message
    .sort((a, b) => {
      if (a.line > b.line) {
        return 1;
      }
      if (a.line < b.line) {
        return -1;
      }
    })
    .sort((a, b) => {
      if (a.file > b.file) {
        return 1;
      }
      if (a.file < b.file) {
        return -1;
      }
    });

  if (option.stats) {
    process.stdout.write(
      "Total  " + "\033[32m" + message.length + "\033[0m" + "\n"
    );
    uniques = message.map((element) => {
      return element.href.toString();
    });
    uniques = new Set(uniques);
    console.log("Unique", Array.from(uniques).length);
    if (option.validate) {
      brokenLinks = message.filter((element) => {
        if (element.ok == "fail") {
          return element;
        }
      });
      porcentWorking = Math.round(
        100 - (brokenLinks.length / Array.from(uniques).length) * 100
      );
      process.stdout.write(
        "Broken " + "\033[31m" + brokenLinks.length + "\033[0m" + "\n"
      );
      process.stdout.write(
        "Working " + "\033[34m" + porcentWorking + "%" + "\033[0m" + "\n"
      );
    }
  } else {
    if (option.validate) {
      corrects = message.filter((element) => {
        if (element.ok == "ok") {
          return element;
        }
      });
      incorrects = message.filter((element) => {
        if (element.ok == "fail") {
          return element;
        }
      });
      corrects.forEach((element) => {
        if (typeof element.status == "number") {
          console.log(
            "Line",
            element.line,
            element.file.italic,
            element.href.green.bold.underline,
            element.ok.green,
            element.status,
            element.text.slice(0, 30)
          );
        } else {
          console.log(
            "Line",
            element.line,
            element.file.italic,
            element.href.yellow.bold.underline,
            element.ok.green,
            element.status.yellow,
            element.text.slice(0, 30)
          );
        }
      });
      incorrects.forEach((element) => {
        console.log(
          "Line",
          element.line,
          element.file.italic,
          element.href.red.bold.underline,
          element.ok.red,
          element.status,
          element.text.slice(0, 30)
        );
      });
    } else {
      message.forEach((element) => {
        console.log(
          "Line",
          element.line,
          element.file,
          "\033[36m" + element.href + "\033[0m",
          element.text.slice(0, 30)
        );
      });
    }
  }
  console.log("");
  process.exit();
};
