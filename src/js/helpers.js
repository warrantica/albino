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
    if(fontFace) elementStyle.setProperty('--font-face', fontFace);
    if(fontSize) elementStyle.setProperty('--font-size', fontSize + 'px');

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
      $('.rightPane').removeClass('rightPane--wrapUp');
      $('.loading--right').removeClass('loading--active');
    }else{
      $('.rightPane').addClass('rightPane--wrapUp');
      $('.loading--right').addClass('loading--active');
    }
  },

  FABVisibility(visibility){
    if(visibility) $('.fab').addClass('fab--enable')
    else $('.fab').removeClass('fab--enable');
  },

  vetComment(comment, isSub = false){
    comment.commentNumber = comment.comment_no;
    if(isSub){
      comment.commentNumber += '-' + comment.reply_no;
    }else if(comment.reply_count > comment.replies.length){
      comment.subData = {
        last: comment.replies.length,
        cid: comment._id,
        c: comment.reply_count
      };

      comment.showLoadMoreSubButton = true;
    }

    //avatar
    if(comment.user.avatar.medium.substr(-9, 9) === '38x38.png'){
      //unknown avatar
      comment.user.avatar.medium = 'asset/img/default_avatar.png';
    }

    //reactions
    comment.reactionData = {
      voteSum: comment.good_bad_vote.point,
      emotionSum: comment.emotion.sum,
      emotionCounts: {
        impress: comment.emotion.impress.count,
        laugh: comment.emotion.laugh.count,
        like: comment.emotion.like.count,
        love: comment.emotion.love.count,
        scary: comment.emotion.scary.count,
        surprised: comment.emotion.surprised.count,
      },
      emotionSortable: [
        {name:"impress", count:comment.emotion.impress.count},
        {name:"laugh", count:comment.emotion.laugh.count},
        {name:"like", count:comment.emotion.like.count},
        {name:"love", count:comment.emotion.love.count},
        {name:"scary", count:comment.emotion.scary.count},
        {name:"surprised", count:comment.emotion.surprised.count}
      ]
    };

    //hotness = replies + emotionSum + voteSum
    comment.hotness = 5*comment.reply_count
                    + 1*comment.emotion.sum
                    + 2*comment.good_bad_vote.point;

    //controversy = replies + scary + laugh
    comment.controversy = 5*comment.reply_count
                        + 2*comment.emotion.scary.count
                        + 1*comment.emotion.laugh.count;

    return comment;
  }
}
