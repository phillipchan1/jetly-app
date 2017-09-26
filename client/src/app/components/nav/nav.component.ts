import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth/auth.service';
import { Router, ActivatedRoute} from '@angular/router';

@Component({
	selector: 'app-nav',
	templateUrl: './nav.component.html',
	styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

	logout() {
		this.router.navigate(['/login']);
		this.authService.logout();
	}

	constructor(
		public authService:AuthService,
		private route:ActivatedRoute,
		private router:Router
		) {
	}

	ngOnInit() {
	}
}