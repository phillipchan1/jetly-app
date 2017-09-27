import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';
import { UrlService } from '../../services/utils/url.service';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

	constructor(
		private route:ActivatedRoute,
		private router:Router,
		public urlService:UrlService,
		public authService:AuthService
		) {

		let token = this.urlService.getQueryParameterByName('token', null);

		if (token) {
			this.authService.login(
				token,
				function() {
					router.navigate(['/board'])
				}
			);
		}

		if (authService.loggedIn) {
			this.router.navigate(['/board']);
		}
	}

	ngOnInit() {}
}
