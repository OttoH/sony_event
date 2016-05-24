var socket = io.connect();
var switchFlag = 0; // 0:stop 1:start 2:execute

document.querySelector('#start_btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (switchFlag === 0) {
        socket.emit('start', {});
        switchFlag = 1;
        document.querySelector('.info-set-content').textContent = '抽獎就緒';
        console.log('...start trigger...');
    }

}, false);

document.querySelector('#lottery_btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (switchFlag === 1) {
        socket.emit('lottery', {});
        switchFlag = 2;
        document.querySelector('.info-set-content').textContent = '抽獎執行中';
        console.log('...lottery trigger...');
    }

}, false);

document.querySelector('#stop_btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (switchFlag === 2 || switchFlag === 1) {
        socket.emit('stop', {});
        switchFlag = 0;
        document.querySelector('.info-set-content').textContent = '抽獎結束';
        console.log('...lottery stop...');
    }
}, false);
