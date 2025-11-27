import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgStyle } from '@angular/common';
@Component({
  selector: 'app-grid-text-popup',
  imports: [NgStyle],
  templateUrl: './grid-text-popup.component.html',
  styleUrl: './grid-text-popup.component.css',
})
export class GridTextPopupComponent {
  @Input() popupMessage: string = '';
  @Input() title: string = '';
  @Input() modalWidth: number = 50;
  @Input() modalHeight: number = 30;

  @Output() close = new EventEmitter<void>();

  copyButtonTitle: string = 'copy';

  copy() {
    navigator.clipboard
      .writeText(this.popupMessage)
      .then(() => {
        this.copyButtonTitle = 'copied!';
        setTimeout(() => {
          this.copyButtonTitle = 'copy';
        }, 2000);
      })
      .catch((err) => {
        console.error('복사 실패:', err);
      });
  }

  closePopup() {
    this.close.emit();
  }
}
