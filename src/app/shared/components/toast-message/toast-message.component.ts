import { Component, Input, ViewChild, ElementRef } from '@angular/core';

declare var bootstrap: any;

@Component({
  selector: 'app-toast-message',
  imports: [],
  templateUrl: './toast-message.component.html',
  styleUrl: './toast-message.component.css',
})
export class ToastMessageComponent {
  message: string = '';
  bgColorClass: string = 'bg-success';

  toast: any;

  @ViewChild('toastEl', { static: true }) toastEl!: ElementRef;

  /**
   * 외부에서 호출
   * @param message 토스트에 표시할 메시지
   * @param bgColorClass bootstrap 배경 클래스 (예: bg-success, bg-danger)
   */
  show(message: string, bgColorClass: string = 'bg-success') {
    this.message = message;
    this.bgColorClass = bgColorClass;

    this.toast = new bootstrap.Toast(this.toastEl.nativeElement, {
      autohide: false,
    });
    this.toast.show();
  }

  hide() {
    if (this.toast) this.toast.hide();
  }
}
