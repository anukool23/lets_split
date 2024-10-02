// const moment = require('moment');

// function dateGenerator(reqFormat){
//     const dateToday = moment().utcOffset("+05:30").format(reqFormat);
//     return dateToday;
// }

// module.exports = dateGenerator;


const moment = require('moment-timezone');

function dateGenerator(reqFormat){
    
    const dateToday = moment().tz('Asia/Kolkata').format(reqFormat);
    //console.log(dateToday)
    return dateToday;
}

module.exports = dateGenerator;
