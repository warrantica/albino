function saveOptions(){
  var theme = document.getElementById('theme').value;

  chrome.storage.sync.set({
    theme: theme
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
  })
}

document.addEventListener('DOMContentLoaded', restoreOptions);
document.getElementById('saveButton').addEventListener('click', saveOptions);
