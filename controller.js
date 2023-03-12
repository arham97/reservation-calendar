angular.module('app.controllers', [])
  .controller('ReservationController', function ($scope, ReservationService) {
    let calendar = document.querySelector('.calendar');
    let month_list = calendar.querySelector('.month-list');

    month_list.classList.add('hideonce');
    $scope.selectedDateReserved = false;
    $scope.newcontact = {time: '', tennantName: ''};
    $scope.currentDate = new Date();
    $scope.currentMonth = { value: $scope.currentDate.getMonth() };
    $scope.currentYear = { value: $scope.currentDate.getFullYear() };
    $scope.generateCalendar = function (month, year) {
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
    
      month_picker.innerHTML = datasrc.month_names[$scope.currentMonth.value];
    
      calendar_header_year.innerHTML = $scope.currentYear.value;
    
      let first_day = new Date($scope.currentYear.value, $scope.currentMonth.value);
    
    
      for (let i = 0; i <= days_of_month[$scope.currentMonth.value] + first_day.getDay() - 1; i++) {
    
        let day = document.createElement('div');
        // day.onclick = function () {console.log("month: ", month, ":: day: ", i - first_day.getDay() + 1, ":: year:", year)};
    
        if (i >= first_day.getDay()) {
          day.innerHTML = i - first_day.getDay() + 1;
          day.onclick = function () {
            console.log(document.getElementById('openmodal').click());
            let isReserved = false;
            document.getElementById('message-text').value = i - first_day.getDay() + 1 + "/" + (parseInt($scope.currentMonth.value)+1) + "/" + $scope.currentYear.value;
            $scope.newcontact.time = new Date(parseInt($scope.currentYear.value), parseInt($scope.currentMonth.value), i - first_day.getDay() + 1);
            $scope.contacts.forEach((contact) => {
              let [date, month, year] = contact.date.split("/");
              console.log(date, month, year, (parseInt(date) === i - first_day.getDay() + 1) && parseInt(month) === (parseInt($scope.currentMonth.value)+1) && parseInt(year) === $scope.currentYear.value);
              if ((parseInt(date) === i - first_day.getDay() + 1) && parseInt(month) === (parseInt($scope.currentMonth.value)+1) && parseInt(year) === $scope.currentYear.value){
                isReserved = true;
                document.getElementById("recipient-name").value = contact.tennantName;
                $scope.newcontact.tennantName = contact.tennantName;
                $scope.newcontact.time = new Date(parseInt(contact.time)*1000);
              }
            });
            if (isReserved){
              $scope.selectedDateReserved = true;
            }
            else{
              $scope.selectedDateReserved = false;
              document.getElementById("recipient-name").value = '';
            }
            $scope.$apply();
            document.getElementById('openmodal').click();
          }
    
          if (i - first_day.getDay() + 1 === $scope.currentDate.getDate() &&
            year === $scope.currentDate.getFullYear() &&
            month === $scope.currentDate.getMonth()
          ) {
            day.classList.add('current-date');
          }
        }
        calendar_days.appendChild(day);
      }
    };
    const dayTextFormate = document.querySelector('.day-text-formate');
    const timeFormate = document.querySelector('.time-formate');
    const dateFormate = document.querySelector('.date-formate');


    $scope.contacts = [];

    datasrc.month_names.forEach((e, index) => {

      let month = document.createElement('div');
      month.innerHTML = `<div>${e}</div>`;

      month_list.append(month);
      month.onclick = () => {
        $scope.currentMonth = {value : index};
        $scope.generateCalendar();
        month_list.classList.replace('show', 'hide');
        dayTextFormate.classList.remove('hideTime');
        dayTextFormate.classList.add('showtime');
        timeFormate.classList.remove('hideTime');
        timeFormate.classList.add('showtime');
        dateFormate.classList.remove('hideTime');
        dateFormate.classList.add('showtime');
      };
    });
    $scope.generateCalendar();

    const todayShowTime = document.querySelector('.time-formate');
    const todayShowDate = document.querySelector('.date-formate');

    const currshowDate = new Date();
    const showCurrentDateOption = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    };
    const currentDateFormate = new Intl.DateTimeFormat(
      'en-US',
      showCurrentDateOption
    ).format(currshowDate);
    todayShowDate.textContent = currentDateFormate;
    setInterval(() => {
      const timer = new Date();
      const option = {
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
      };
      const formateTimer = new Intl.DateTimeFormat('en-us', option).format(timer);
      let time = `${`${timer.getHours()}`.padStart(
        2,
        '0'
      )}:${`${timer.getMinutes()}`.padStart(
        2,
        '0'
      )}: ${`${timer.getSeconds()}`.padStart(2, '0')}`;
      todayShowTime.textContent = formateTimer;
    }, 1000);


    ReservationService.list().then(r => {
      $scope.contacts = r;
      $scope.$apply();
    });

    $scope.saveContact = function () {
      console.log($scope);
      ReservationService.add($scope.newcontact).then((res => {
        $scope.contacts = res;
        $scope.newcontact = {};
        $scope.$apply();
        document.getElementById('closeModalBtn').click();
        document.getElementById('openSuccessModal').click();
      }));
    }

    $scope.delete = function (tennant) {
      let t = {};
      if (!tennant){
        console.log($scope.newcontact);
        t = {tennantName: $scope.newcontact.tennantName, time: ((new Date($scope.newcontact.time)).getTime()/1000)};
      }
      else{
        t = {...tennant};
      }
      console.log("finalllllllllllll", t);
      ReservationService.delete(t).then(r => {
        $scope.contacts = r;
        $scope.$apply();
        document.getElementById('closeModalBtn').click();
        document.getElementById('openSuccessModal').click();
      });
    };

    
    $scope.preYearClick = function () { //preYearClick
      $scope.currentYear.value -= 1;
      // $scope.$apply();
      $scope.generateCalendar();
    };

    $scope.nextYearClick = function () {
      $scope.currentYear.value += 1;
      // $scope.$apply();
      $scope.generateCalendar();
    }


    $scope.edit = function (id) {
      $scope.newcontact = angular.copy(ReservationService.get(id));
    }

    $scope.monthPickerClick = function () {      
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
  });