import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-user-policy',
  templateUrl: './user-policy.component.html',
  styleUrls: ['./user-policy.component.scss']
})
export class UserPolicyComponent implements OnInit, AfterViewInit {

  constructor() { }

  ngOnInit() {
  }

  ngAfterViewInit() {
    document.getElementById("policyHeader").focus();
  }
}
