import { Component, OnInit } from '@angular/core';
import { AskQuestionService } from '../../services/ask-question.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageHelperService } from 'src/app/core/services/storage-helper.service';
import { SEO } from 'src/app/core/interfaces';
import { SeoService } from 'src/app/core/services/seo.service';
import { HomeService } from 'src/app/features/home/home.service';

@Component({
  selector: 'app-ask-question-page',
  templateUrl: './ask-question-page.component.html',
  styleUrls: ['./ask-question-page.component.scss']
})
export class AskQuestionPageComponent implements OnInit {

  showReset: boolean;
  showResult: boolean;
  experts: any[];
  experts2: any[];
  expertsTotal: number;
  catsList: any[];
  searchParams: {
    p: number,
    s: number,
    searchTxt: string,
    experties: string
  };
  user: any;


  constructor
    (private route: ActivatedRoute,
      private router: Router,
      private store: StorageHelperService,
      private askQuestionService: AskQuestionService,
      private homeService: HomeService,
      private seoService: SeoService
    ) {
    // Generate meta tag 
    const config: SEO = {
      title: `An Elder Spring Initiative by Tata Trusts Experts`,
      keywords: 'products,services,events,dscussions',
      description: 'An online presence for elders to find reliable products and services. And engage in Events and Discussions',
      author: `An Elder Spring Initiative by Tata Trusts`,
      image: `${window.location.origin}/assets/imgaes/landing-img/Ask-320.png`,
    }

    this.seoService.generateTags(config);

  }

  ngOnInit() {
    this.user = this.store.retrieve("ECP-USER");
    if (this.user) {
      this.user = JSON.parse(this.user);
      if (this.user.userRoleId == "EXPERT") {
        this.router.navigate(['/ask-question/expert']);
      }
    }
    this.searchParams = {
      p: 0,
      s: 3,
      searchTxt: "",
      experties: ""
    }
    this.expertsTotal = 0;
    this.showResult = false;
    if (this.route.snapshot.params['category']) {
      this.searchParams.experties = this.route.snapshot.params['category'];
    }
    this.askQuestionService.getCategoryList().subscribe((response: any) => {
      const data = response.data;
      this.catsList = [];
      if (data.content) {
        this.catsList = data.content;
      }
    });
    // this.showExperts();
    this.showExperts2();
    if (this.homeService.homeSearchtxt) {
      this.searchParams.searchTxt = this.homeService.homeSearchtxt;
      if (this.homeService.storageSearchResult) {
        const searchData: any = this.homeService.storageSearchResult;
        this.experts = searchData.experts;
        this.showResult = true;
      }
      this.showReset = true;
    }
  }

  showExperts() {
    let searchParams = JSON.parse(JSON.stringify(this.searchParams));
    searchParams.experties = "";
    this.askQuestionService.experts(searchParams).subscribe((response: any) => {
      const data = response.data;
      this.experts = [];
      if (data.content) {
        this.experts = data.content;
        this.expertsTotal = data.total;
      }
    });
  }

  showExperts2() {
    let searchParams = JSON.parse(JSON.stringify(this.searchParams));
    searchParams.searchTxt = "";
    this.askQuestionService.experts(searchParams).subscribe((response: any) => {
      const data = response.data;
      this.experts2 = [];
      if (data.content) {
        this.experts2 = data.content;
        console.log(this.experts);
      }
    });
  }

  showAllExperts() {
    this.router.navigate(['/ask-question/all'], { queryParams: { category: this.searchParams.experties, searchTxt: this.searchParams.searchTxt } });
  }

  onSearchChange(event: any) {
    const value = event.target.value;
    if (value !== "") {
      this.showReset = true
    } else {
      this.showReset = false;
      this.showResult = false;
    }
    this.searchParams.searchTxt = value;
    if (event.key == "Enter") {
      this.onSearch();
    }
  }

  resetSearch(event: any) {
    if (event.clientX != 0) { // this is to make sure it is an event not raise by hitting enter key
      this.searchParams.searchTxt = "";
      this.showReset = false;
      // this.onSearch()
    }
  }

  onSearch() {
    this.showResult = false;
    if (this.searchParams.searchTxt != "") {
      this.showResult = true;
    }
    this.showExperts();
    this.homeService.clearHomepageSearch();
  }
}