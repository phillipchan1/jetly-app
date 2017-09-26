import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

	getJWToken() {
		return localStorage.getItem('jwtoken');
	}

	login(token, callback) {
		this.storeJWToken(token);
		this.loggedIn = true;

		callback();
	}

	logout() {
		this.removeJWToken();
		this.loggedIn = false;
	}

	loggedIn:boolean = false;

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