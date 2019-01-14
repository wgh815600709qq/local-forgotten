const { ipcRenderer } = require('electron');
document.getElementById('min').addEventListener('click', toMin)
document.getElementById('close').addEventListener('click', toClose)
document.getElementById('save').addEventListener('click', toSave)
document.getElementById('delete').addEventListener('click', toDelete)
document.getElementById('refresh').addEventListener('click', toRefresh)
window.selectedItem = null;

function addListEvent() {
  var list = document.getElementsByClassName('list-item')
  for (var i = 0; i < list.length; i++) {
    list[i].removeEventListener('click', eventHandle)
    list[i].addEventListener('click', eventHandle)
  }
}
function eventHandle(e) {
  let id = e.target.getAttribute('data-key');
  let title = e.target.innerText;
  let content = e.target.getAttribute('data-content');
  let rule = e.target.getAttribute('data-rule');
  window.selectedItem = {
    id: id,
    rule: rule,
    title: title,
    rule: rule
  }
  document.getElementById('rule').value = rule
  document.getElementById('title').value = title
  document.getElementById('content').innerHTML = content
}

var socket = io('http://localhost:8889');

// 客户端进入首页调用一次更新；
toRefresh();


function toRefresh() {
  socket.emit('client-refresh');
}

function toMin() {
  console.log('min')
  ipcRenderer.send('minWindow', 'loginWindow')
}

function toClose() {
  console.log('close')
  ipcRenderer.send('closeWindow', 'loginWindow')
}


// 保存
function toSave() {
  let title = document.getElementById('title').value
  let content = document.getElementById('content').value
  let rule = document.getElementById('rule').value
  socket.emit('add-rules', {
    title: title,
    content: content,
    rule: rule
  })
}

// 删除
function toDelete() {
  if (window.selectedItem) {
    socket.emit('delete-rules', window.selectedItem)
  } else {
    window.alert('未选中')
  }
}

socket.on('refresh', function (list) {
  console.log('refresh', list)
  var newList = ''
  for (var i = 0; i < list.length; i++) {
    newList = newList + `<div class="list-item" data-key='${list[i].id}' data-content="${list[i].content}" data-rule="${list[i].rule}">${list[i].title}</div>`
  }
  document.getElementById('rule').value = '* * * * * *'
  document.getElementById('title').value = ''
  document.getElementById('content').value = ''
  document.getElementById('item-list').innerHTML = newList
  addListEvent();
});

socket.on('message', function (msg) {
  if (window.Notification.permission != 'granted') {
    Notification.requestPermission(function (status) {
      //status是授权状态，如果用户允许显示桌面通知，则status为'granted'
      console.log('status: ' + status);
      //permission只读属性:
      //  default 用户没有接收或拒绝授权 不能显示通知
      //  granted 用户接受授权 允许显示通知
      //  denied  用户拒绝授权 不允许显示通知
      var permission = Notification.permission;
      console.log('permission: ' + permission);
    });
  }

  new Notification(msg.title, { "icon": "", "body": msg.content })

})

