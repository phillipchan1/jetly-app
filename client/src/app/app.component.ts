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

	constructor(
		public authService:AuthService,
		public urlService:UrlService,
		private route:ActivatedRoute,
		private router:Router
		) {
			// if accepting token don't do anything
			if (!this.urlService.getQueryParameterByName('token', null)) {

				// if user is not logged in, always redirect to login page
				if (!authService.isLoggedIn()) {
			 		this.router.navigate(['/login']);
			 	}
			}

		}
	}