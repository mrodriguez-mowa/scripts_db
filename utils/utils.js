class Utils {
    static ExcelDateToJSDate(serial) {
        const utc_days  = Math.floor(serial - 25569);
        const utc_value = utc_days * 86400;                                        
        const date_info = new Date(utc_value * 1000);
     
        const fractional_day = serial - Math.floor(serial) + 0.0000001;
     
        let total_seconds = Math.floor(86400 * fractional_day);
     
        const seconds = total_seconds % 60;
     
        total_seconds -= seconds;
     
        const hours = Math.floor(total_seconds / (60 * 60));
        const minutes = Math.floor(total_seconds / 60) % 60;
     
        return new Date(date_info.getFullYear(), date_info.getMonth(), date_info.getDate(), hours, minutes, seconds);
     }
    
     static GetPeruDate = (strDate) => {
      const date = new Date(strDate);
      const utcTime = date.getTime() + (date.getTimezoneOffset() * 60000);
      // time offset for Peru -5
      const timeOffset = -5;
      const PeruTime = new Date(utcTime + (3600000 * timeOffset));
      return PeruTime;
      };
}


 module.exports = Utils