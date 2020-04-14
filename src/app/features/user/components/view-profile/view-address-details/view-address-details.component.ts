import { Component, OnInit , Output,EventEmitter} from '@angular/core';
import { AuthService } from 'src/app/core';
import { UserService } from '../../../services/user.service';
import { Subscription } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ModalComponent } from '../../modal-component';

@Component({
  selector: 'app-view-address-details',
  templateUrl: './view-address-details.component.html',
  styleUrls: ['./view-address-details.component.scss']
})
export class ViewAddressDetailsComponent implements OnInit {
  @Output() editProfile = new EventEmitter<{ obj: any, action: "" }>();
 
  messages:any;
  subscription: Subscription;
  constructor(
    public userService: UserService,
    public auth: AuthService,
    private modalService:NgbModal
  ) { }

  ngOnInit() {
    this.subscription=this.userService.getFormEditMessage().subscribe(message=>{
      console.log(message,"message from contact detial component")
      this.messages=message;
    })
  }

  edit(actionName){
    if(this.messages=='editForm'){
      const modalRef = this.modalService.open(ModalComponent);
    }else{
      console.log(actionName)
      this.editProfile.emit({obj: "", action: actionName})
    }
  }

}
