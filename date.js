
exports.getdate = function(){
  let today = new Date();
  // var dayNum =today.getDay();
  // var days = ['Sunday','Monday','Tuseday','Wednesday','Thursday','Friday','Saturday'];
  var options = {
    weekday:"long",
    day:"numeric",
    month:"long"
  };
  let day = today.toLocaleDateString("en-US",options);
  return day;
  }
