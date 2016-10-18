module.exports = {
  convertTheirStupidDateTimeFormatToISO(utime){
    //utime format: mm/dd/yyyy hh:mm:ss
    let y = utime.substr(6, 4);
    let m = utime.substr(0, 2);
    let d = utime.substr(3, 2);
    let t = utime.substr(11, 8);
    return y+'-'+m+'-'+d+'T'+t;
  }
}
