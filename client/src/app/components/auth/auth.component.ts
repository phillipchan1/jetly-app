import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params} from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

@Component({
	selector: 'app-auth',
	templateUrl: './auth.component.html',
	styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public authService:AuthService
		) {
		var token = this.route.snapshot.queryParams["token"];

		// if there's a token, this user is logged in
		if (token) {
			console.log(token);
		}

	}

	ngOnInit() {
	}

}
