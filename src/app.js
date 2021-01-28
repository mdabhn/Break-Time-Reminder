const electron = require('electron');
const BrowserWindow = electron.remote.BrowserWindow;
const currentWindow = electron.remote.getCurrentWindow()

let time;
let targetTime;
let timeChecker;
let tempWindo;

var add_minutes = function (dt, minutes) {
  return new Date(dt.getTime() + minutes * 60000);
  // return new Date(dt.getTime() + minutes * 1000);
}

const startBreakTimer = () => {
  if (time > 0) {
    breaker()
  }
}

var now;

const breaker = () => {
  targetTime = add_minutes(new Date(), time).toString()
  let time_left = add_minutes(new Date(), time);
  timeChecker = setInterval(() => {
    now = new Date().getTime();
    var timeleft = time_left - now;
    var hours = Math.floor((timeleft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    var minutes = Math.floor((timeleft % (1000 * 60 * 60)) / (1000 * 60));
    var seconds = Math.floor((timeleft % (1000 * 60)) / 1000);
    document.getElementById('show-time-left').style.display = 'block'
    document.getElementById('next-break-time').innerHTML = '' + hours + ':' + minutes + ':' + seconds
    if (targetTime === new Date().toString()) {
      targetTime = add_minutes(new Date(), time).toString()
      time_left = add_minutes(new Date(), time);
      TempWinShow()
      timeleft = 0;
      timeChecker;
    }
  }, 1000)
}

let checkBreakTime = 0;
let breakFor = 15; //15 sec break

const TempWinShow = () => {
  let chx = setInterval(() => {
    checkBreakTime++;
    if (checkBreakTime == breakFor) {
      checkBreakTime = 0;
      clearInterval(chx)
      if (tempWindo) tempWindo.close()
    }
  }, 1000)

  tempWindo = new BrowserWindow({
    fullscreen: true,
    frame: false,
    isAlwaysOnTop: true,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: true,
    },
  });

  tempWindo.loadURL(`${__dirname}/break.html`);
  tempWindo.on('closed', (e) => {
    tempWindo = null
    clearInterval(timeChecker)
    breaker()
  })
}



const selectOpt = document.getElementById('time-selected');

selectOpt.addEventListener('change', () => {
  setTimeout(() => {
    currentWindow.hide()
  }, 5000)

  time = document.getElementById('time-selected').value;
  time = parseInt(time) + (breakFor / 1000);
  clearInterval(timeChecker)
  startBreakTimer();
});

document.getElementById('close-btn').addEventListener('click', () => {
  time = NaN
  document.getElementById('show-time-left').style.display = 'none'
  document.getElementById('time-selected').value = 'Select Time Here'
  clearInterval(timeChecker)
})