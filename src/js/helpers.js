module.exports = {
  convertTheirStupidDateTimeFormatToISO(utime){
    //utime format: mm/dd/yyyy hh:mm:ss
    let y = utime.substr(6, 4);
    let m = utime.substr(0, 2);
    let d = utime.substr(3, 2);
    let t = utime.substr(11, 8);
    return y+'-'+m+'-'+d+'T'+t;
  },

  sanitiseContent(html){
    let content = $('<div>').append(html);
    //no eval for you!
    $(content).find('script').remove();
    $(content).find('.review-section').remove();
    $(content).find('.edit-history').remove();
    //no polls for you!
    $(content).find('.q-poll').remove();
    $(content).find('.button-container').remove();
    return content.html();
  },

  setRightPaneCurtains(showContent){
    if(showContent){
      $('#rightPane').removeClass('wrapUp');
      $('#rightPane .loading').removeClass('active');
    }else{
      $('#rightPane').addClass('wrapUp');
      $('#rightPane .loading').addClass('active');
    }
  },

  showFAB(){
    window.setTimeout(() => {
      let rightPane = document.getElementById('rightPane');
      if(rightPane.offsetHeight < rightPane.scrollHeight){
        $('#fab').addClass('enable');
      }else{
        $('#fab').removeClass('enable');
      }
    }, 50);
  }
}
