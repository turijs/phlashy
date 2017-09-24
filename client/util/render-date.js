const msInDay = 24 * 60 * 60 * 1000;

function absDay(date) {
  return Math.floor(date.getTime() / msInDay);
}

export default function renderDate(ISOString) {
  let d = new Date(ISOString);

  let day = d.getDate();
  let month = d.getMonth() + 1;
  let year = d.getFullYear();

  let minutes = d.getMinutes();
  let hours = (d.getHours() % 12) || 12;
  let meridiem = d.getHours() > 11 ? 'PM' : 'AM';

  let timePart = `${hours}:${minutes} ${meridiem}`;



  let today = new Date();

  switch(absDay(today) - absDay(d)) {
    case 0: return timePart;
    case 1: return 'Yesterday';
  }

  let datePart = `${month}/${day}`;
  if(year != today.getFullYear())
    datePart += `/${year}`;

  return datePart;
}
