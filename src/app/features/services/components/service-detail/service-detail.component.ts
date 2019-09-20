import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ServiceDetail, DBReviews } from 'src/app/core/interfaces';
import { EpcServiceService } from '../../epc-service.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AuthService } from 'src/app/core';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.scss']
})
export class ServiceDetailComponent implements OnInit {

  service: ServiceDetail;
  dbReview: DBReviews[] = [];
  reviewForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private ecpService: EpcServiceService,
    private router: Router,
    private fb: FormBuilder,
    public auth: AuthService
  ) {

    this.reviewForm = this.fb.group({
      serviceId: [""],
      rating: [0, Validators.required],
      review: ["", Validators.required],
      userName: ["", Validators.required]
    });
  }

  ngOnInit() {
    this.service = this.route.snapshot.data.detail;
    if (this.service.email) {
      this.service.email = this.service.email.replace(",", " ");
    }

    if (this.isDBService) {
      this.getDBserviceReview(this.service.id);
    } else {
      const docId: string = this.route.snapshot.params['docId'];
      this.getDBserviceReview(docId);
    }

    if (this.auth.serviceReviewForm) {
      this.reviewForm.patchValue(this.auth.serviceReviewForm);
      this.auth.removeServiceReviewForm();
    }
  }

  get isDBService(): boolean {
    return this.service.hasOwnProperty('basicProfileInfo');
  }

  getDBserviceReview(serviceId) {
    this.ecpService.getDBserviceReview(serviceId).subscribe(
      response => {
        if (response && response.content) {
          this.dbReview = response.content;
          console.log(this.dbReview, this.isDBService);
        }
      });
  }


  getDbServiceRating(percent): number {

    if (percent <= 20) {
      return 1;
    } else if (percent <= 40) {
      return 2;
    } else if (percent <= 60) {
      return 3;
    } else if (percent <= 80) {
      return 4;
    } else if (percent <= 100) {
      return 5;
    }
  }

  onReviewSubmit() {
    if (this.reviewForm.valid) {

      if (this.auth.isAuthenticate) {
        if (this.isDBService) {
          this.reviewForm.controls.serviceId.setValue(this.service.id);
        } else {
          const docId: string = this.route.snapshot.params['docId'];
          this.reviewForm.controls.serviceId.setValue(docId);
        }
        this.ecpService.addDBserviceReview(this.reviewForm.value).subscribe(
          response => {
            if (response) {
              this.dbReview.push(response);
              this.reviewForm.reset();
            }
          },
          error => {
            console.log(error);
          });
        console.log(this.reviewForm.value);
      } else {
        this.login();
      }
    }
  }

  login() {
    this.auth.redirectUrl = this.router.url;
    this.auth.serviceReviewForm = this.reviewForm.value;
    this.router.navigateByUrl('/user/signin');

  }
}
