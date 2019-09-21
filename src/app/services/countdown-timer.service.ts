import { Injectable } from '@angular/core';
import { CountdownTimer } from '../interfaces/countdown-timer';
import { User } from '../interfaces/user';
import { AngularFirestore } from '@angular/fire/firestore';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CountdownTimerService {

  private collection = 'timers';
  user: User;

  constructor(private afs: AngularFirestore, private authService: AuthService) {
    this.authService.userData$.subscribe(
      (result: User) => {
        this.user = result;
      },
      (error: any) => {
        console.log('Error fetching user in CountdownTimerService: ' + error);
      }
    );
  }

  getTimers() {
    return this.afs.collection<CountdownTimer>(this.collection, ref => ref.orderBy('endDate')).valueChanges();
  }

  getPublicTimers() {
    return this.afs.collection<CountdownTimer>(this.collection, ref => ref.where('isPublic', '==', true).orderBy('endDate')).valueChanges();
  }

  getPrivateTimers() {
    return this.afs.collection<CountdownTimer>(this.collection, ref => ref.where('isPublic', '==', false)).valueChanges();
  }

  addTimer(timer: CountdownTimer) {
    const timerKey = this.afs.createId();
    const document = this.collection + '/' + timerKey;
    this.afs.doc(document).set({
      id: timerKey,
      endDate: timer.endDate.getTime(),
      isPublic: timer.isPublic,
      name: timer.name,
      userId: this.user.uid,
      subscriptions: 0,
      subscribers: new Array(),
      description: timer.description,
      categories: timer.categories
    }).catch(
      error => console.error('Error writing new timer from service: ', error)
    );
  }

  deleteTimer(timerId: string) {
    const path = this.collection + '/' + timerId;
    this.afs.doc(path).delete().catch(
      error => console.error('Error deleting timer from service: ', error)
    );
  }

  updateTimer(timer: CountdownTimer) {
    const path = this.collection + '/' + timer.id;
    this.afs.doc(path).update({
      id: timer.id,
      endDate: timer.endDate.getTime(),
      isPublic: timer.isPublic,
      name: timer.name,
      subscriptions: timer.subscriptions,
      subscribers: timer.subscribers,
      description: timer.description,
      categories: timer.categories
    }).catch(
      error => console.error('Error updating timer from service: ', error)
    );
  }

}
