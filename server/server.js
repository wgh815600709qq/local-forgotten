var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var schedule = require('node-schedule');
var fs = require('fs');
var path = require('path');

var rulesMatch = [];
io.on('connection', function (socket) {
  console.log('Server connected');
  socket.on('add-rules', (msg) => addRules(msg));
  socket.on('delete-rules', (msg) => deleteRules(msg));
  socket.on('client-refresh', () => init());
});


app.set('port', process.env.PORT || 8889);

var server = http.listen(app.get('port'), function () {
  console.log('start at port:' + server.address().port);
});

var init = () => {
  var _path = path.resolve(__dirname, './rule.json')
  var result = fs.readFileSync(_path, 'utf8')
  result = JSON.parse(result)
  io.emit('refresh', result)
}


// 添加规则
var addRules = (msg) => {
  let success = false
  let key = excelRules(msg)
  let id = createUnitId()
  rulesMatch.push({ id: id, key: key })
  var _path = path.resolve(__dirname, './rule.json')
  var result = fs.readFileSync(_path, 'utf8')
  result = JSON.parse(result)
  if (key && id) {
    result.push({
      id: id,
      title: msg.title,
      content: msg.content,
      rule: msg.rule
    })
    console.log('rulesMatch', rulesMatch)
    fs.writeFileSync(_path, JSON.stringify(result, null, 2));
    success = true
  }
  var newList = fs.readFileSync(_path, 'utf8')
  newList = JSON.parse(newList)
  if (success) {
    io.emit('refresh', newList)
  } else {
    console.log('Add rules fail')
  }
}

// 删除规则
var deleteRules = (msg) => {
  let success = false
  let Id = +msg.id
  let isexist = rulesMatch.find(it => {
    return it.id == Id
  })
  console.log('---------', isexist)
  if (isexist) {
    isexist.key.cancel();
  }
  var _path = path.resolve(__dirname, './rule.json')
  var result = fs.readFileSync(_path, 'utf8')
  result = JSON.parse(result)
  let matchIndex = rulesMatch.findIndex(it => {
    return it.id === Id
  })
  rulesMatch.splice(matchIndex, 1);
  console.log('rulesMatch', rulesMatch)
  let newResult = result.filter(item => {
    return item.id !== Id
  })
  console.log('newResult', newResult)
  fs.writeFileSync(_path, JSON.stringify(newResult, null, 2));
  success = true
  if (success) {
    io.emit('refresh', newResult)
  } else {
    console.log('delete rules fail')
  }
}

// 执行规则
var excelRules = (msg) => {
  var key = schedule.scheduleJob(msg.rule, function () { // 规则
    console.log(msg.rule + 'is excel')
    io.emit('message', msg)
  });
  return key
}


var createUnitId = () => {
  return parseInt(Math.random() * 1e9)
}
