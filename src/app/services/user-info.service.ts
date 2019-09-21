import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { UserInfo } from '../interfaces/user-info';

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  private collection = 'userInfoCollection';

  constructor(private afs: AngularFirestore) { }

  createUser(userId: string, userAlias: string) {
    const document = this.collection + '/' + userId;
    this.afs.doc(document).set({
      id: userId,
      alias: userAlias
    }).catch(
      error => console.error('Error writing new userInfo from service: ', error)
    );
  }

  getUserInfo(userId: string) {
    return this.afs.doc<UserInfo>(this.collection + '/' + userId).valueChanges();
  }

  updateUserInfo(userInfo: UserInfo) {
    const path = this.collection + '/' + userInfo.id;
    var updatedInfo = new UserInfo();
    if(userInfo.subscriptions != undefined) {
      updatedInfo.subscriptions = userInfo.subscriptions;
    }
    this.afs.doc(path).update({
      id: userInfo.id,
      alias: userInfo.alias,
      subscriptions: updatedInfo.subscriptions
    }).catch(
      error => console.error('Error updating userInfo from service: ', error)
    );
  }
}
