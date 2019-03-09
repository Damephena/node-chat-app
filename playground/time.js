var moment = require('moment');

var date = moment();
console.log(date.format('h:mm a'));

var getDefaultTimeStamp = moment().valueOf();