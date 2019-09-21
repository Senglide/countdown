import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase';
import { BehaviorSubject } from 'rxjs';
import { User } from '../interfaces/user';
import { AlertBox } from '../interfaces/alert-box';
import { UserInfoService } from './user-info.service';
import { UserInfo } from '../interfaces/user-info';
import { Router } from '@angular/router';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    alertBox$: BehaviorSubject<AlertBox> = new BehaviorSubject(null);
    userData$: BehaviorSubject<User> = new BehaviorSubject(null);

    constructor(private afAuth: AngularFireAuth, private userInfoService: UserInfoService, private router: Router) {
        this.afAuth.authState.subscribe((user) => {
                this.setUserData(user);
            }
        );
    }

    // Email/password sing up
    emailSignUp(email: string, password: string, alias:string) {
        this.afAuth.auth.createUserWithEmailAndPassword(email, password)
            .then(user => {
                this.afAuth.auth.currentUser.sendEmailVerification()
                    .then(success => {
                        this.logout();
                        this.setMessage(`A confirmation email has send.<br>Please check your mailbox`, 'alert-success');
                        this.userInfoService.createUser(user.user.uid, alias);
                        this.router.navigate(['/login']);
                    })
                    .catch(error => this.setMessage(error, 'alert-danger'));
            })
            .catch(error => {
                this.setMessage(error.message, 'alert-danger');
            });
    }

    // Reset password
    emailResetPassword(email: string) {
        this.afAuth.auth.sendPasswordResetEmail(email)
            .then(() => this.setMessage('Please check your email', 'alert-success'))
            .catch(error => this.setMessage(error, 'alert-danger'));
    }

    editUserInfo(user: User) {
        this.afAuth.auth.currentUser.updateProfile({
            displayName: user.displayName,
            photoURL: '/assets/icon.png'
        });
        var userInfo = new UserInfo()
        userInfo.id = user.uid;
        userInfo.alias = user.displayName;
        this.userInfoService.updateUserInfo(userInfo);
    }

    // Email/password login
    emailLogin(email: string, password: string) {
        this.logout();
        this.afAuth.auth.signInWithEmailAndPassword(email, password)
            .then(user => {
                if (!user.user.emailVerified) {
                    this.logout();
                    this.setMessage(`Please confirm your registration!<br>
                        Check your mailbox: ${user.user.email}`, 'alert-danger');
                } else {
                    this.setUserData(user.user);
                    this.router.navigate(['/user-home']);
                }
            })
            .catch(error => this.setMessage(error.message, 'alert-danger'));
    }

    // Social logins
    googleLogin() {
        this.logout();
        this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider())
            .then((result) => {
                const userId = result.user.uid;
                const userAlias = result.user.email;
                this.userInfoService.getUserInfo(userId).subscribe(
                    (subscribeResult: UserInfo) => {
                        if(subscribeResult == undefined) {
                            this.userInfoService.createUser(userId, userAlias);
                            console.log(result.user);
                        }
                    }
                );
            })
            .catch(error => this.setMessage(error.message, 'alert-danger'));
    }

    // Logout
    logout() {
        this.clearMessage();
        localStorage.removeItem('currentUser');
        this.afAuth.auth.signOut();
        this.userData$.next(null);
    }


    // Message BS4 alert-box
    setMessage(msg: string, color: string) {
        this.alertBox$.next({
            message: msg,
            color: color
        });
    }

    clearMessage() {
        this.alertBox$.next(null);
    }

    // Copy fields from authState to userData$
    private setUserData(user) {
        if (user !== null) {
            this.userData$.next({
                uid: user.uid,
                displayName: user.displayName || user.email,
                photoURL: user.photoURL || '/assets/icon.png',
                email: user.email,
            });
            localStorage.setItem('currentUser', JSON.stringify(user));
        } else {
            this.userData$.next(null);
        }
    }
}