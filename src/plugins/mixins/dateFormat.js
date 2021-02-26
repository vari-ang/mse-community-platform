export default {
    filters: {
        dateFormat(sec) {
            const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni",
                    "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

            const fullDate = new Date(sec*1000);

            //console.log(fullDate);
            //Thu May 19 2011 17:25:38 GMT+1000 {}
            
            //get day, month, and year
            var d = fullDate.getDate(),
                m = monthNames[fullDate.getMonth()],
                y = fullDate.getFullYear(),
                result = d + ' ' + m + ' ' + y;
            
            return result;
        }
    }
}