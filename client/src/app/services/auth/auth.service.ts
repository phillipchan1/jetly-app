import { Injectable } from '@angular/core';
import { Http, Headers} from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthService {

	verifyLoggedStatus() {
		let headers = new Headers();
		this.createAuthorizationHeader(headers);

		return this.http.get(
				'api/auth/verify/', {
					headers: headers
				})
			.map(res => res.json());
	}

	getJWToken():string {
		return localStorage.getItem('jwtoken');
	}

	loggedIn:boolean = false;

	login(token, callback):void {
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

	private createAuthorizationHeader(headers: Headers) {
		headers.set('Authorization', this.getJWToken());
	}

	private removeJWToken():void {
		localStorage.removeItem('jwtoken');
	}

	private storeJWToken(token):void {
		if (token) {
			localStorage.setItem('jwtoken', token);
		}
	}

	constructor(public http:Http) {}
}