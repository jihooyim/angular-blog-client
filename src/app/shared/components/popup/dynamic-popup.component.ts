// dynamic-popup.component.ts
import {
  Component,
  Input,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  Output,
  EventEmitter,
  OnInit,
  Type,
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-popup',
  imports: [CommonModule],
  template: `
    <div class="popup-overlay" (click)="close(null)">
      <div
        class="popup"
        [ngStyle]="{ width: width + 'px', height: height + 'px' }"
        (click)="$event.stopPropagation()"
      >
        <div class="popup-header">
          <span>{{ title }}</span>
          <button class="btn btn-sm" (click)="close(null)">X</button>
        </div>
        <div class="popup-body"><ng-template #container></ng-template></div>
      </div>
    </div>
  `,
  styleUrls: ['./dynamic-popup.component.css'],
})
export class DynamicPopupComponent implements OnInit {
  @Input() component!: Type<any>;
  @Input() width: number = 400;
  @Input() height: number = 300;
  @Input() title: string = 'Popup';
  @Input() inputs: any;

  @Output() closed = new EventEmitter<any>();

  @ViewChild('container', { read: ViewContainerRef, static: true })
  container!: ViewContainerRef;

  private componentRef!: ComponentRef<any>;

  ngOnInit(): void {
    this.container.clear();
    this.componentRef = this.container.createComponent(this.component);

    if (this.inputs) {
      Object.entries(this.inputs).forEach(([key, value]) => {
        this.componentRef.instance[key] = value;
      });
    }
    // 자식 컴포넌트에서 부모에게 값을 줄 수 있게 output 받을 수 있도록 설정
    if (this.componentRef.instance['popupClose']) {
      this.componentRef.instance['popupClose'].subscribe((result: any) => {
        this.close(result);
      });
    }
  }

  close(result: any) {
    this.closed.emit(result);
  }
}
