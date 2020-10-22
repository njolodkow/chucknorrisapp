import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.css']
})
export class ButtonComponent {

  @Input() text: string = "Button";
  @Input() processing: boolean = false;
  @Input() disabled: boolean = false;
  @Input() width: number = 100;
  @Input() fontSize: number = 18;
  @Input() color: string = '#5564eb';
  @Output() onClick = new EventEmitter<any>();

  constructor() { }

  onClickButton(event) {
    this.onClick.emit(event);
  }

}
