import Vars from './vars';

module.exports = {

  applyTheme(themeName, fontSize, fontFace){
    let elementStyle = document.documentElement.style;

    //apply colors
    let theme = Vars.getTheme(themeName);
    let base = Vars.getBase(theme.base);

    let border = base.brightness === 'light'
      ? 'rgba(0, 0, 0, 0.12)'
      : 'rgba(255, 255, 255, 0.12)';

    elementStyle.setProperty('--primary', theme.primary);
    elementStyle.setProperty('--accent', theme.accent);
    elementStyle.setProperty('--text-on-primary', theme.textOnPrimary);
    elementStyle.setProperty('--text-on-accent', theme.textOnAccent);

    elementStyle.setProperty('--text', base.text);
    elementStyle.setProperty('--subtitle', base.subtitle);
    elementStyle.setProperty('--fore', base.fore);
    elementStyle.setProperty('--back', base.back);
    elementStyle.setProperty('--hover', base.hover);
    elementStyle.setProperty('--border', border);

    //apply font
    elementStyle.setProperty('--font-face', fontFace);
    elementStyle.setProperty('--font-size', fontSize + 'px');

  },

  convertTimeFormatToISO(utime){
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
