import { Component, OnInit } from '@angular/core';
import { LocalNotifications } from '@awesome-cordova-plugins/local-notifications/ngx';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  clock: string = '';
  timerDisplay: string = '00:00';
  interval: any;

  constructor(private localNotifications: LocalNotifications) {}

  ngOnInit() {
    setInterval(() => {
      const now = new Date();
      this.clock = now.toLocaleTimeString();
    }, 1000);
  }

  startPomodoro() {
    this.startTimer(25 * 60, 'Pomodoro Done! Take a 5-min break', () => {
      this.startTimer(5 * 60, 'Break Over! Back to work!');
    });
  }

  startTimer(seconds: number, message: string, onDone?: () => void) {
    clearInterval(this.interval);
    let remaining = seconds;

    this.updateTimerDisplay(remaining);
    this.interval = setInterval(() => {
      remaining--;
      this.updateTimerDisplay(remaining);

      if (remaining <= 0) {
        clearInterval(this.interval);
        this.sendNotification(message);
        if (onDone) onDone();
      }
    }, 1000);
  }

  updateTimerDisplay(seconds: number) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    this.timerDisplay = `${this.pad(mins)}:${this.pad(secs)}`;
  }

  pad(n: number): string {
    return n < 10 ? '0' + n : n.toString();
  }

  sendNotification(message: string) {
    this.localNotifications.schedule({
      id: new Date().getTime(),
      title: 'Pomodoro App',
      text: message,
      foreground: true,
    });
  }
}