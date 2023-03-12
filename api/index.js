const BASE_URL = 'http://localhost:3000';

var api = {};

api.getAll = function () {
  return fetch(`${BASE_URL}/reserve/0/10000000000000`).then(r => r.json());
}

api.reserveSlot = function (tennantName, time, reserved) {
  return fetch(`${BASE_URL}/reserve`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      time,
      tennantName,
      reserved
    })
  }).then(r => {
    if (r.ok){
      return r.json();
    }
    else{
      return r.text();
    }
  });
}
