let datasrc = {};

datasrc.month_names = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const isLeapYear = (year) => {
  return (
    (year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) ||
    (year % 100 === 0 && year % 400 === 0)
  );
};
const getFebDays = (year) => {
  return isLeapYear(year) ? 29 : 28;
};

datasrc.generateCalendar = (month, year) => {
  let month_picker = document.querySelector('#month-picker');

  let calendar = document.querySelector('.calendar');
  let calendar_days = document.querySelector('.calendar-days');
  let month_list = calendar.querySelector('.month-list');
  calendar_days.innerHTML = '';
  let calendar_header_year = document.querySelector('#year');
  let days_of_month = [
    31,
    getFebDays(year),
    31,
    30,
    31,
    30,
    31,
    31,
    30,
    31,
    30,
    31,
  ];

  let currentDate = new Date();

  month_picker.innerHTML = datasrc.month_names[month];

  calendar_header_year.innerHTML = year;

  let first_day = new Date(year, month);


  for (let i = 0; i <= days_of_month[month] + first_day.getDay() - 1; i++) {

    let day = document.createElement('div');
    // day.onclick = function () {console.log("month: ", month, ":: day: ", i - first_day.getDay() + 1, ":: year:", year)};

    if (i >= first_day.getDay()) {
      day.innerHTML = i - first_day.getDay() + 1;
      day.onclick = function () {
        console.log(document.getElementById('openmodal').click());
        selectedDay = i - first_day.getDay() + 1;
        selectedMonth = month;
        selectedYear = year;
        document.getElementById('message-text').value = i - first_day.getDay() + 1 + "/" + month + "/" + year;
        document.getElementById('openmodal').click();

      }

      if (i - first_day.getDay() + 1 === currentDate.getDate() &&
        year === currentDate.getFullYear() &&
        month === currentDate.getMonth()
      ) {
        day.classList.add('current-date');
      }
    }
    calendar_days.appendChild(day);
  }
};


function monthPickerClick () {
  let month_list = calendar.querySelector('.month-list');
  const dayTextFormate = document.querySelector('.day-text-formate');
  const timeFormate = document.querySelector('.time-formate');
  const dateFormate = document.querySelector('.date-formate');
  
  month_list.classList.remove('hideonce');
  month_list.classList.remove('hide');
  month_list.classList.add('show');
  dayTextFormate.classList.remove('showtime');
  dayTextFormate.classList.add('hidetime');
  timeFormate.classList.remove('showtime');
  timeFormate.classList.add('hideTime');
  dateFormate.classList.remove('showtime');
  dateFormate.classList.add('hideTime');
}

