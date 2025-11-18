import {
  Component,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { OverlayService } from '../../../shared/services/overlay.service';
import { BlogService } from '../../services/blog.service';
import { Router } from '@angular/router';
import { environment } from '../../../../environments/environment.production';
import { ToastMessageComponent } from '../../../shared/components/toast-message/toast-message.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-import-popup',
  imports: [ToastMessageComponent, CommonModule],
  templateUrl: './import-popup.component.html',
  styleUrl: './import-popup.component.css',
})
export class ImportPopupComponent implements OnInit {
  selectedFile?: File;
  loading = false;
  isDone = false;
  @Output() popupClose = new EventEmitter<any>();
  @ViewChild('toastRef') toastRef!: ToastMessageComponent;

  message: string | null = null;
  messageClass: string = '';

  constructor(
    private router: Router,
    private blogService: BlogService,
    public overlay: OverlayService
  ) {}

  ngOnInit() {}

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.selectedFile = input.files[0];
    }
  }

  onClose(flag: any) {
    if (flag !== true) this.popupClose.emit({ status: 'dictionaryUpload' });
    else this.popupClose.emit({ status: 'success' });
  }

  upload() {
    this.isDone = false;

    if (this.loading) return;

    if (!this.selectedFile) {
      alert('파일을 선택해주세요.');
      return;
    }
    this.loading = true;

    const jobId = crypto.randomUUID();
    // localStorage.setItem('lastUploadJobId', jobId);

    const isLocal = window.location.hostname === 'localhost';

    const streamUrl = isLocal
      ? `/api/diary/jobs/upload/${jobId}/stream`
      : `${environment.apiBase}/diary/jobs/upload/${jobId}/stream`;

    const source = new EventSource(streamUrl, {
      withCredentials: true,
    });

    this.blogService.upload(this.selectedFile, jobId).subscribe();

    source.addEventListener('title', (event: MessageEvent) => {
      const { title } = JSON.parse(event.data);
      if (title !== '') {
        this.message = title;
        this.messageClass = 'text-info';
      }
    });

    source.addEventListener('message', (event: MessageEvent) => {
      const { message } = JSON.parse(event.data);

      if (message !== '') {
        this.message = message;
        this.messageClass = 'text-info';
      }
    });

    source.addEventListener('doneMessage', (event: MessageEvent) => {
      const { message } = JSON.parse(event.data);

      if (message !== '') {
        this.message = message;
        this.messageClass = 'text-success';
        source.close();
        this.loading = false;
      }
    });

    source.addEventListener('done', () => {
      source.close();
      this.loading = false;
      this.isDone = true;
      this.message = '파일 업로드 성공!';
      this.messageClass = 'text-success';
    });

    source.addEventListener('error', (event: MessageEvent) => {
      const error: ErrorSignal = JSON.parse(event.data);
      this.message = `오류: ${error.message}`;
      this.messageClass = 'text-danger';
      source.close();
      this.loading = false;
    });

    source.onerror = () => {
      source.close();
      this.loading = false;
      this.message = '파일 업로드 중 문제가 발생했습니다.';
      this.messageClass = 'text-danger';
    };
  }
}
