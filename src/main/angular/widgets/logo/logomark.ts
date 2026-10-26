import { Component, input } from '@angular/core';

@Component({
    selector: 'logomark',
    standalone: true,
    imports: [],
    templateUrl: 'logomark.html',
})
export class LogoMarkComponent {
    size = input<number>(44);
    variant = input<string>('color');

    id:string
    fill:string
    fg:string = "#ffffff"

    Math = Math;

    ngOnInit() {
        if (this.variant() === 'color') {
            this.id = "texter-grad"
            this.fill = `url(#${this.id})`
        } else {
            this.fill = "currentColor"
        }
    }
}