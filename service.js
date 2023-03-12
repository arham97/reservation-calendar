angular.module('app.services', []).service('ReservationService', function () {
  //to create unique contact id
  var uid = 1;
  
  //contacts array to hold list of all contacts
  var contacts = [];
  
  //save method create a new contact if not already exists
  //else update the existing object
  this.add = function (tennant) {
    console.log(tennant);
    if (tennant){
      if (!tennant.tennantName){
        alert('Tennant Name missing');
      }
      else if (!tennant.time){
        alert('Tennant time missing');
      }
      else{
        console.log(tennant.tennantName, (parseInt((new Date(tennant.time)).getTime())/1000), true);
        return api.reserveSlot(tennant.tennantName, (parseInt((new Date(tennant.time)).getTime())/1000), true)
        .then(res => {
          console.log(res);
          console.log("b4", contacts)
          if (res?.success){
            let d = new Date(tennant.time*1000);
            let date = d.getDate();
            let month = d.getMonth()+1;
            let year = d.getFullYear();
            contacts.push({ date: `${date}/${month}/${year}`, time: (parseInt((new Date(tennant.time)).getTime())/1000), tennantName: tennant.tennantName });
          }
          else{
            alert(res);
          }
          console.log("after", contacts)
          return contacts;
        });
      }
    }
    else{
      alert('Important Fields missing');
    }
  }

  //iterate through contacts list and delete 
  //contact if found
  this.delete = function (tennant) {
    return api.reserveSlot(tennant.tennantName, tennant.time, false)
    .then(res => {
      console.log(res);
      console.log("b4", contacts)
      if (res?.success){
        for (i in contacts) {
          if (contacts[i].tennantName === tennant.tennantName) {
            contacts.splice(i, 1);
          }
        }
      }
      else{
        alert(res);
      }
      console.log("after", contacts)
      return contacts;
    });
  }

  //simply returns the contacts list
  this.list = function () {
    return api.getAll().then(r => {
      contacts = r.reserved.map(tenant => {
        let d = new Date(tenant?.time*1000);
        let date = d.getDate();
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
  
        tenant.date = `${date}/${month}/${year}`;
        return tenant;
      });
      console.log("initial", contacts);
      return contacts;
    });
  }
});