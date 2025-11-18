import { Routes } from '@angular/router';
import { LoginComponent } from './auth/pages/login/login.component';
import { AdminListComponent } from './diary/pages/admin-list/admin-list.component';
import { DetailComponent } from './diary/pages/detail/detail.component';
import { DetailPublishComponent } from './diary/pages/detail-publish/detail-publish.component';
import { ViewComponent } from './diary/pages/view/view.component';
import { KoreaDictionaryListComponent } from './diary/pages/korea-dictionary-list/korea-dictionary-list.component';
import { KoreaDictionaryUploadFileListComponent } from './admin/pages/korea-dictionary-upload-file-list/korea-dictionary-upload-file-list.component';
import { BatchHistoryComponent } from './admin/pages/batch-history/batch-history.component';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'admin-list', component: AdminListComponent },
  { path: 'detail', component: DetailComponent },
  { path: 'detail-view', component: DetailPublishComponent },
  { path: 'detail-view/:id', component: DetailPublishComponent },
  { path: 'user/:id', component: ViewComponent },
  { path: 'myblog', component: ViewComponent },
  { path: 'dictionary-list', component: KoreaDictionaryListComponent },
  {
    path: 'file-upload-list',
    component: KoreaDictionaryUploadFileListComponent,
  },
  { path: 'batch-history', component: BatchHistoryComponent },
];
