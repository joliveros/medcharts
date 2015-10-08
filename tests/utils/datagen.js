var _ = require('lodash')
, ms = require('ms')
, pdebug = require('../../src/debug')('datagen');

exports.generateArrayOfPoints = function(n) {
  var data = [];
  for (var i = 0; i < n; i++) {
    var x = i;
    var y = Math.random() * 100;
    var point = {x: x, y:y};
    data.push(point);
  }
  return data;
};

exports.generateArrayOfNameObjects = function(n) {
  var names = [
    "Henrietta",
    "Meaghan",
    "Miguelina",
    "Hoyt",
    "Felecia",
    "Karisa",
    "Gaynell",
    "Meda",
    "Natisha",
    "Annika"
  ];
  var numbers = [];
  for (var i = 0; i < n; i++) {
    var j = Math.floor(Math.random() * 100);
    numbers.push(j);
  }
  var data = new Array(n);
  numbers.forEach( function(value, idx) {
    var i = idx % 10;
    var name = names[i];
    var o = {
      label: name,
      value: value
    };
    data.push(o);
  });
  return data;
};

exports.generatePartsOfWhole = function() {
  var data = [];
  var names = [
    "Henrietta",
    "Meaghan",
    "Miguelina",
    "Hoyt",
    "Felecia",
    "Karisa",
    "Gaynell",
    "Meda",
    "Natisha",
    "Annika"
  ];
  var numbers = [];
  var total = 0;
  while (total < 100) {
    var j = Math.floor(Math.random() * 100);
    var j1 = j/2.0;
    if (j1 < 10.0) {
      continue;
    }
    total += j1;
    numbers.push(j1);
  }
  numbers.pop();
  numbers.pop();
  var sum = numbers.reduce(function(sum, num) {
    return sum + num;
  });
  var remainder = 100 - sum;
  numbers.push(remainder);
  var numbers = numbers.sort(function(v) { return v; });
  numbers.forEach( function(value, idx) {
    var i = idx % 10;
    var name = names[i];
    var o = {
      label: name,
      value: value
    };
    data.push(o);
  });
  return data;
}

exports.generateArrayOfNumbers = function(n) {
  var data = [];
  for (var i = 0; i < n; i++) {
    var j = Math.floor(Math.random() * 100);
    data.push(j);
  }
  return data;
};

exports.generateArrayOfControlResultObjects = function(n) {
  var maxValue = 1000;
  var minValue = 0;
  var UpperControlLevel = _.random(minValue, maxValue);
  var LowerControlLevel = _.random(minValue, UpperControlLevel-1);

  function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }
  var currentDate = new Date();
  var initialDate = currentDate - ms('30 d');
  initialDate = new Date(initialDate);
  var data = [];
  for (var i = 0; i < n; i++) {
    var date = randomDate(initialDate, currentDate);
    var value = _.random(LowerControlLevel, UpperControlLevel);
    var point = {
      date: date
      , value: value
      , ucl: UpperControlLevel
      , lcl: LowerControlLevel
    };
    pdebug(point)
    data.push(point);
  }
  return data.sort(function(a, b) {
    return a.date - b.date;
  });
};

exports.generateArrayOfTimeObjects = function(n) {
  function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  randomDate(new Date(2000, 0, 1), new Date())
  var data = [];
  for (var i = 0; i < n; i++) {
    var date = randomDate(new Date(2012, 0, 1), new Date());
    var value = Math.random() * 1000;
    var point = {
      date: date
      , value: value};
    data.push(point);
  }
  return data.sort(function(a, b) {
    return a.date - b.date;
  });
};

exports.generateArrayOfTimeOHLCObjects = function(n) {
  function randomDate(start, end) {
      return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  }

  randomDate(new Date(2000, 0, 1), new Date())
  var data = [];
  for (var i = 0; i < n; i++) {
    var date = randomDate(new Date(2012, 0, 1), new Date());
    var ohlc = {
                  open: Math.random() * 1000,
                  close: Math.random() * 1000
                };
    ohlc.high = Math.max(ohlc.open, ohlc.close) * (1 + Math.random());
    ohlc.low = Math.min(ohlc.open, ohlc.close) * (1 - Math.random());
    ohlc.x = date.valueOf();

    data.push(ohlc);
  }
  return data.sort(function(a, b) {
    return a.x - b.x;
  });
};


exports.generateArrayOfObjects = function(n) {
  var data = [];
  for (var i = 0; i < n; i++) {
    var x = Math.random() * 100;
    var y = Math.random() * 1000;
    var point = {x:x, y:y};
    data.push(point);
  }
  return data;
};
