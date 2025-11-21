import { Component, Input } from '@angular/core';
import { NgStyle } from '@angular/common'; // NgStyle 임포트

@Component({
  selector: 'app-grid-text-popup',
  imports: [NgStyle],
  templateUrl: './grid-text-popup.component.html',
  styleUrl: './grid-text-popup.component.css',
})
export class GridTextPopupComponent {
  @Input() popupMessage: string = '';
  @Input() title: string = '';
  @Input() modalWidth: number = 800;
  @Input() modalHeight: number = 300;
}
