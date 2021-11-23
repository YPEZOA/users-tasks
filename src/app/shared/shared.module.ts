import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HeaderComponent } from './components/header/header.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { RouterModule } from '@angular/router';
import { ModalComponent } from './components/modal/modal.component';
import { BsModalRef, BsModalService, ModalModule } from 'ngx-bootstrap/modal';

@NgModule({
  declarations: [HeaderComponent, PageNotFoundComponent, ModalComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, RouterModule, ModalModule],
  exports: [HeaderComponent, ModalComponent],
  providers: [BsModalService, BsModalRef]
})
export class SharedModule { }
