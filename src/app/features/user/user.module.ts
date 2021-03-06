import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SignupComponent } from './components/signup/signup.component';
import { CoreModule } from 'src/app/core';
import { UserRoutingModule } from './user-routing.module';
import { UiModule } from 'src/app/ui';
import { SigninTypesViewComponent } from './components/signin-types-view/signin-types-view.component';
import { AdditionalInfoFormComponent } from './components/additional-info-form/additional-info-form.component';
import { UserPageComponent } from './components/user-page/user-page.component';
import { DisplayNameFormComponent } from './components/display-name-form/display-name-form.component';
import { EditProfileFormComponent } from './components/edit-profile-form/edit-profile-form.component';
import { ViewProfileComponent } from './components/view-profile/view-profile.component';
import { GeneralInfoFormComponent } from './components/general-info-form/general-info-form.component';
import { ContactDetailFormComponent } from './components/contact-detail-form/contact-detail-form.component';
import { AboutYouFormComponent } from './components/about-you-form/about-you-form.component';
import { ChangeProfilePictureFormComponent } from './components/change-profile-picture-form/change-profile-picture-form.component';
import { ViewUserDetailsComponent } from './components/view-profile/view-user-details/view-user-details.component';
import { ViewGeneralInfoComponent } from './components/view-profile/view-general-info/view-general-info.component';
import { ViewAddressDetailsComponent } from './components/view-profile/view-address-details/view-address-details.component';
import { ViewPersonalInformationComponent } from './components/view-profile/view-personal-information/view-personal-information.component';
import { ModalComponent } from './components/modal-component';
import { SharedModule } from 'src/app/shared';
import { UserWelcomeViewComponent } from './components/user-welcome-view/user-welcome-view.component';
import { MergeRequestModalComponent } from './components/merge-request-modal/merge-request-modal.component';

@NgModule({
  declarations: [
    SignupComponent,
    SigninTypesViewComponent,
    AdditionalInfoFormComponent, 
    UserPageComponent, 
    DisplayNameFormComponent, 
    EditProfileFormComponent, 
    ViewProfileComponent, 
    GeneralInfoFormComponent, 
    ContactDetailFormComponent, 
    AboutYouFormComponent, 
    ChangeProfilePictureFormComponent, 
    ViewUserDetailsComponent, 
    ViewGeneralInfoComponent, 
    ViewAddressDetailsComponent,
    MergeRequestModalComponent, 
    ViewPersonalInformationComponent,ModalComponent, UserWelcomeViewComponent],
    
  imports: [
    CommonModule,
    CoreModule,
    UiModule,
    UserRoutingModule,
    SharedModule
  ]
})
export class UserModule { }
