import * as moment from 'moment';

function presentDate(value){
  // return moment(value).format(DateFormat.DATE_TIME_LONG);
  return moment(value).format(DateFormat.DATE_TIME_WITHOUT_SEC);
}

const DateFormat = {
  DATE_TIME_LONG: 'YYYY-MM-DD HH:mm:ss',
  DATE_TIME_WITHOUT_SEC: 'YYYY-MM-DD HH:mm',
  DATE_ONLY_CHINESE: 'YYYY-MM-DD',
}

export {
  presentDate,
  DateFormat,
}
