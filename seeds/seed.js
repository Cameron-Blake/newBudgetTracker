var mongoose = require("mongoose");
var db = require("../models");

mongoose.connect("mongodb://localhost/budget",
    {useNewUrlParser: true,
    useFindandModify: false,
    useUnifiedTopology: true}
);

var transactionSeed = [
    {
      name: "pizza",
      value: 15,
      date: new Date(Date.now())
    },
    {
        name: "house",
        value: 300000,
        date: new Date(Date.now())
    },
    {
        name: "internet",
        value: 75,
        date: new Date(Date.now())
    }
];

db.Transaction.deleteMany({})
  .then(() => db.Transaction.collection.insertMany(transactionSeed))
  .then(data => {
    console.log(data.result.n + " updated");
    process.exit(0);
  })
  .catch(err => {
    console.error(err);
    process.exit(1);
  });