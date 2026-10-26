import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import {AppLogoComponent} from "../widgets/logo/applogo";

@Component({
    selector: 'app-root',
    standalone: true,
    imports: [RouterOutlet, RouterLink, AppLogoComponent],
    templateUrl: 'root.html',
})
export class RootLayout {
    currentYear = new Date().getFullYear();
}