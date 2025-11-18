import {
  ApplicationRef,
  ComponentFactoryResolver,
  Injectable,
  Injector,
  Type,
  ComponentRef,
  EmbeddedViewRef,
  inject,
  createComponent,
  EnvironmentInjector,
} from '@angular/core';
import { DynamicPopupComponent } from '../components/popup/dynamic-popup.component';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class CustomPopupService {
  constructor(private appRef: ApplicationRef, private injector: Injector) {}
  open<T>(
    component: Type<T>,
    options: {
      width?: number;
      height?: number;
      title?: string;
      inputs?: Partial<T>;
    }
  ): Subject<any> {
    const result$ = new Subject<any>();

    const componentRef: ComponentRef<DynamicPopupComponent> = createComponent(
      DynamicPopupComponent,
      {
        environmentInjector: this.appRef.injector as EnvironmentInjector,
        elementInjector: this.injector,
      }
    );

    componentRef.instance.component = component;
    componentRef.instance.width = options.width ?? 400;
    componentRef.instance.height = options.height ?? 300;
    componentRef.instance.title = options.title ?? '팝업';
    if (options.inputs) {
      componentRef.instance.inputs = options.inputs;
    }
    componentRef.instance.closed.subscribe((result) => {
      result$.next(result);
      result$.complete();
      this.close(componentRef);
    });

    this.appRef.attachView(componentRef.hostView);
    const domElem = (componentRef.hostView as EmbeddedViewRef<any>)
      .rootNodes[0];
    document.body.appendChild(domElem);

    return result$;
  }

  private close(ref: ComponentRef<any>) {
    this.appRef.detachView(ref.hostView);
    ref.destroy();
  }
}
