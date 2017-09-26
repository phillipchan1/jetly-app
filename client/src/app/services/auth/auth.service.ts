import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

	isLoggedIn() {
		if (this.getJWToken()) {
			this.loggedIn = true;
			return true;
		} else {
			return false;
		}
	}

	getJWToken() {
		return localStorage.getItem('jwtoken');
	}

	login(token, callback) {
		this.storeJWToken(token);
		this.loggedIn = true;

		if (callback) {
			callback();
		}
	}

	logout() {
		this.removeJWToken();
		this.loggedIn = false;
	}

	private loggedIn:boolean = false;

	private removeJWToken() {
		localStorage.removeItem('jwtoken');
	}

	private storeJWToken(token) {
		if (token) {
			localStorage.setItem('jwtoken', token);
		}
	}

	constructor() {}
}