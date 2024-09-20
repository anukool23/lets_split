const moment = require('moment')


function dateGenerator(reqFormat){
     const dateToday = moment().format(reqFormat);
    return dateToday
}

module.exports = dateGenerator;