import { Component, input } from '@angular/core';
import {LogoMarkComponent} from "./logomark";

@Component({
    selector: 'applogo',
    standalone: true,
    imports: [LogoMarkComponent],
    templateUrl: 'applogo.html',
})
export class AppLogoComponent {
    size = input<number>(44);
    tone = input<string>('dark');
    showTagline = input<boolean>(true);
    className = input<string>('');

    word:string
    tag:string
    Math = Math

    ngOnInit() {
        if (this.tone() === 'dark') {
            this.word = "text-[#1A1660]"
            this.tag = "text-slate-500"
        } else {
            this.word = "text-white"
            this.tag = "text-indigo-200"
        }
    }
}