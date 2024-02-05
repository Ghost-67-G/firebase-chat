export function convertGMTToLocal(gmtTime) {
    var gmtDate = new Date(gmtTime);

    var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    var day = days[gmtDate.getUTCDay()];
    var date = gmtDate.getUTCDate();
    var month = months[gmtDate.getUTCMonth()];
    var year = gmtDate.getUTCFullYear();

    var hours = gmtDate.getHours();
    var minutes = gmtDate.getMinutes();
    var seconds = gmtDate.getSeconds();
    var meridiem = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12; // 0 should be converted to 12

    var formattedTime = day + ', ' + 
                        ('0' + date).slice(-2) + ' ' + 
                        month + ' ' + 
                        year + ' ' + 
                        ('0' + hours).slice(-2) + ':' + 
                        ('0' + minutes).slice(-2) + ':' + 
                        ('0' + seconds).slice(-2) + ' ' +
                        meridiem;

    return formattedTime;
}


