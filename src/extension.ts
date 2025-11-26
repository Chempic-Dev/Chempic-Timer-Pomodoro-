import * as vscode from 'vscode';

let timer: NodeJS.Timeout | undefined;
let timeLeft: number;
let isRunning = false;
let isBreakTime = false;
let statusBarItem: vscode.StatusBarItem;

export function activate(context: vscode.ExtensionContext){

    statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right,
         200);
    statusBarItem.text = "🍅 Pomodoro";
    statusBarItem.command = 'pomodoro-timer.start';
    statusBarItem.tooltip = "Нажми чтобы запустить POMODORO!!!";
    statusBarItem.show();

    let startCommand = vscode.commands.registerCommand('pomodoro-timer.start', () => {
        if (!isRunning && !isBreakTime) {
            startWorkTimer();
        }else if(!isRunning && isBreakTime){
            startBreakTimer();
        }else{
            resetTimer();
        }
    });

    context.subscriptions.push(startCommand);
    context.subscriptions.push(statusBarItem);
}

function startWorkTimer(){
    isRunning = true;
    isBreakTime = false;
    timeLeft = 25*60;
    
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
    statusBarItem.tooltip = "Время ботать! 🍅🍅🍅";
    
    updateWorkDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateWorkDisplay();
        
        if (timeLeft <= 0){
            workFinished();
        }
    }, 1000);
}

function startBreakTimer(){
    isRunning = true;
    isBreakTime = true;
    timeLeft = 5*60;
    
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    statusBarItem.tooltip = "Время отдыхать!";
    
    updateBreakDisplay();
    
    timer = setInterval(() => {
        timeLeft--;
        updateBreakDisplay();
        
        if (timeLeft <= 0) breakFinished();
        
    }, 1000);
}

function updateWorkDisplay(){
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    

    if(timeLeft > 600){
        statusBarItem.text = `💪 ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }else if(timeLeft > 300){
        statusBarItem.text = `🎯 ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }else if(timeLeft > 60){
        statusBarItem.text = `🔥 ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }else{
        statusBarItem.text = `⚡ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function updateBreakDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    
    if (timeLeft > 3*60) {
        statusBarItem.text = `😌 ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else if (timeLeft > 60) {
        statusBarItem.text = `☕ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    } else {
        statusBarItem.text = `⏰ ${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
}

function workFinished(){
    if(timer){
        clearInterval(timer);
        timer = undefined;
    }
    
    vscode.window.showInformationMessage('Пора отдыхать бро! У тебя 5 минут', 'ДА?');
    
    statusBarItem.text = "😴 Отдых?";
    statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
    statusBarItem.tooltip = "Наконец то перерыв 😌😌😌";
    isRunning = false;
    isBreakTime = true;
}

function breakFinished(){
    if (timer) {
        clearInterval(timer);
        timer = undefined;
    }
    
    vscode.window.showInformationMessage('Всё GG! Время снова ботать! 💪💪💪', 'OK');
    
    statusBarItem.text = "🍅 Pomodoro";
    statusBarItem.backgroundColor = undefined;
    statusBarItem.tooltip = "Нажми и поехали 25 минут ботать! 🍅";
    isRunning = false;
    isBreakTime = false;
}

function resetTimer(){
    if(timer){
        clearInterval(timer);
        timer = undefined;
    }
    
    if(isBreakTime){
        statusBarItem.text = "😴 Отдых?";
        statusBarItem.backgroundColor = new vscode.ThemeColor('statusBarItem.errorBackground');
        statusBarItem.tooltip = "Наконец то перерыв 😌😌😌";
    }else{
        statusBarItem.text = "🍅 Pomodoro";
        statusBarItem.backgroundColor = undefined;
        statusBarItem.tooltip = "Нажми и поехали 25 минут ботать! 🍅";
    }
    
    isRunning = false;

}

export function deactivate() {
    if(timer) clearInterval(timer);

}
