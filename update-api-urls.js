const fs = require("fs");
const path = require("path");

const TARGET = "https://vestra-versa.onrender.com/api/";
const REPLACEMENT = "/api/";
const exts = [".js", ".jsx", ".ts", ".tsx"];
const baseDir = path.join(__dirname, "client", "src");

function updateFile(filePath) {
  let content = fs.readFileSync(filePath, "utf8");
  if (content.includes(TARGET)) {
    content = content.split(TARGET).join(REPLACEMENT);
    fs.writeFileSync(filePath, content, "utf8");
    console.log("Updated:", filePath);
  }
}

function walk(dir) {
  fs.readdirSync(dir).forEach((file) => {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (exts.includes(path.extname(fullPath))) {
      updateFile(fullPath);
    }
  });
}

walk(baseDir);
console.log("API URL update complete.");