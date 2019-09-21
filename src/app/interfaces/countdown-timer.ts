export class CountdownTimer {
  id: string;
  endDate: Date;
  isPublic: boolean;
  name: string;
  userId: string;
  subscriptions: number;
  subscribers: string[];
  description: string;
  categories: string[]
  timeRemaining: {
      years: number,
      months: number,
      days: number,
      hours: number,
      minutes: number,
      seconds: number,
      total: number
  }

  constructor(endDate: Date, isPublic: boolean, name: string) {
    this.endDate = endDate;
    this.isPublic = isPublic;
    this.name = name;
    this.timeRemaining = {
      years: 0,
      months: 0,
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      total: 0
    };
  }

  public update() {
    this.timeRemaining.total = Math.floor((this.endDate.getTime() - new Date().getTime()) / 1000);
    this.timeRemaining.years = Math.floor(this.timeRemaining.total / 31536000);
    this.timeRemaining.months = Math.floor((this.timeRemaining.total - (this.timeRemaining.years * 31536000)) / 2678400);
    this.timeRemaining.days = Math.floor((this.timeRemaining.total - (this.timeRemaining.years * 31536000) - (this.timeRemaining.months * 2592000)) / 86400);
    this.timeRemaining.hours = Math.floor((this.timeRemaining.total - (this.timeRemaining.years * 31536000) - (this.timeRemaining.months * 2592000) - (this.timeRemaining.days * 86400)) / 3600);
    this.timeRemaining.minutes = Math.floor((this.timeRemaining.total - (this.timeRemaining.years * 31536000) - (this.timeRemaining.months * 2592000) - (this.timeRemaining.days * 86400) - (this.timeRemaining.hours * 3600)) / 60);
    this.timeRemaining.seconds = Math.floor((this.timeRemaining.total - (this.timeRemaining.years * 31536000) - (this.timeRemaining.months * 2592000) - (this.timeRemaining.days * 86400) - (this.timeRemaining.hours * 3600) - (this.timeRemaining.minutes * 60)));
  }
}
