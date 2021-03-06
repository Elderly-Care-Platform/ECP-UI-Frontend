import { Component, Input, Output, OnChanges, EventEmitter, SimpleChange } from '@angular/core';
import { AuthService } from '../../core/auth/services/auth.service';
declare var UIkit: any;

@Component({
  selector: 'app-otp-popup',
  templateUrl: './otp-popup.component.html',
  styleUrls: ['./otp-popup.component.scss']
})
export class OtpPopupComponent implements OnChanges {
  @Input() showModal: boolean;
  @Input() mobileNum: string;
  @Output() updateOtp = new EventEmitter<string>();
  otp: string;
  isUnusedOtpLeft:boolean = false;
  constructor(private authService: AuthService) {
    this.otp = ""
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    if (changes.showModal.currentValue) {
      this.update();
    }
  }

  update() {
    this.otp = "";
    if (this.showModal) {
      UIkit.modal('#modal-otp-input').show();
      if (!this.mobileNum) {
        alert("No mobile number or email address found to send otp")
      }
      else {
        if(this.isUnusedOtpLeft==false){
          this.authService.sendOtp(this.mobileNum).subscribe(response => {
            this.isUnusedOtpLeft = true;
            console.log(response);
          },
            error => {
              console.log(error);
            });
        }
     
      }
    }
    else {
      UIkit.modal('#modal-otp-input').hide();
    }
  }

  submitOtp() {
    if (this.otp) {
      UIkit.modal('#modal-otp-input').hide();
      setTimeout(() => {
        this.isUnusedOtpLeft = false;
        this.updateOtp.next(this.otp);
      }, 300);
    }
  }
  cancelOtp() {
    this.otp = "";
    this.updateOtp.next(this.otp);
  }
}
