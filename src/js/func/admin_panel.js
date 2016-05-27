var socket = io.connect();
var switchFlag = 0; // 0:stop 1:start 2:execute

socket.on('award_content', function(data) {
    console.log('award_content', data);
    document.querySelector('.award-section .award-name').textContent = data.name;
    document.querySelector('.award-section .award-phone').textContent = data.phone;
});

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
        document.querySelector('.info-set-content').textContent = '抽獎結果';
        document.querySelector('.award-section').classList.remove('hidden');
        console.log('...lottery trigger...');
    }

}, false);

document.querySelector('#stop_btn').addEventListener('click', function(e) {
    e.preventDefault();
    
    if (switchFlag === 2 || switchFlag === 1) {
        socket.emit('stop', {});
        switchFlag = 0;
        document.querySelector('.info-set-content').textContent = '抽獎結束';
        document.querySelector('.award-section').classList.add('hidden');
        console.log('...lottery stop...');
    }
}, false);
