import { Component } from '@angular/core';
import { AuthService } from './services/auth/auth.service';
import { UrlService } from './services/utils/url.service';
import { Router, ActivatedRoute, Params} from '@angular/router';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css']
})
export class AppComponent {
	title = 'app';

	setLoginStatus() {
		var currentToken = this.authService.getJWToken();

		// if accepting token don't do anything
		if (!this.urlService.getQueryParameterByName('token', null)) {

			if (currentToken) {
				this.authService
					.verifyLoggedStatus()
					.subscribe(
						data => {

							// token is good => log user in
							if (data.success) {
								this.authService.login(currentToken, null);
							}

							// token is bad/expired
							else {
								this.router.navigate(['/login']);
								this.authService.logout();
							}
						}
					)
				}

				// no token, redirect to login page
				else {
					this.router.navigate(['/login']);
				}
		}
	}

	constructor(
		public authService:AuthService,
		public urlService:UrlService,
		private route:ActivatedRoute,
		private router:Router
		) {

			// on application load:
			this.setLoginStatus();

		}
	}