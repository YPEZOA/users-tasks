import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {
  @Input() activeLoading!: boolean;
  @Output() handleConfirmationSuccess: EventEmitter<any> = new EventEmitter();

  constructor(private bsModalService: BsModalService) { }

  ngOnInit(): void {
  }

  onCloseModal(): void {
    this.bsModalService.hide();
  }

  onConfirmationSuccess(): void {
    this.handleConfirmationSuccess.emit();
  }

}
