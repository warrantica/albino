function saveOptions(){
  var theme = document.getElementById('theme').value;
  var defaultForum = document.getElementById('defaultForum').value;

  chrome.storage.sync.set({
    theme: theme,
    defaultForum: defaultForum
  }, function(){
    //Notify user
    console.log("Options saved");
  });
}

function restoreOptions(){
  chrome.storage.sync.get({
    theme: 'default'
  }, function(item){
    document.getElementById('theme').value = item.theme;
    document.getElementById('defaultForum').value = item.defaultForum;
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveButton').addEventListener('click', saveOptions);
