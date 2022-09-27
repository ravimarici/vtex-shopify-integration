const scanner = require('sonarqube-scanner');
scanner(
  {
  serverUrl: "http://localhost:9000",
  login:"admin",
  password:"Ravi@123",
  options: {
    "sonar.sources": "./"
  },
},
() => process.exit()
);
