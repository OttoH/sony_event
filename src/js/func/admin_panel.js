var socket = io.connect();
var switchFlag = 0;

document.querySelector('#lottery_btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (switchFlag === 0) {
        socket.emit('lottery', {});
        switchFlag = 1;
        document.querySelector('.info-set-content').textContent = '抽獎開始中';
        console.log('...lottery trigger...');
    }

}, false);

document.querySelector('#stop_btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (switchFlag === 1) {
        socket.emit('stop', {});
        switchFlag = 0;
        document.querySelector('.info-set-content').textContent = '抽獎結束';
        console.log('...lottery stop...');
    }
}, false);