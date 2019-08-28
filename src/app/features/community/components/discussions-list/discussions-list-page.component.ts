import { Component, OnInit, OnDestroy } from '@angular/core';
import {Router, ActivatedRoute} from '@angular/router';
import {DiscussionService} from '../../services/discussion.service';
import {MenuService} from '../../services/menu.service';

@Component({
  selector: 'app-discussions-list-page',
  templateUrl: './discussions-list-page.component.html',
  styleUrls: ['./discussions-list-page.component.scss']
})
export class DiscussionsListPageComponent implements OnInit,OnDestroy {

  showReset: boolean;
  discussionsList: any[];
  countData: number;
  selCategory: string;
  categoryList: any;
  dropDownList: any[];
  searchParams: {
    p: number,
    s: number,
    searchTxt: string
    tags: string;
  };
  paramsSubs: any;

  constructor(private route:ActivatedRoute,private router: Router, private discussionService: DiscussionService, private menuService: MenuService) { }

  ngOnInit() {
    this.searchParams = {
      p: 0,
      s: 17,
      searchTxt: "",
      tags: ""
    }
    this.paramsSubs = this.route.params.subscribe(params => {
      this.initiate();
    });
  }
  ngOnDestroy(){
    this.paramsSubs.unsubscribe();
  }

  initiate(){
    this.countData = 0;
    this.discussionsList = [];
    this.categoryList = null;
    this.selCategory = "";
    if(this.route.snapshot.params['category']){
      this.selCategory = this.route.snapshot.params['category'];
    }
    if(this.route.snapshot.params['searchTxt']){
      this.searchParams.searchTxt = this.route.snapshot.params['searchTxt'];
    }
    this.getAllCategories();
  }

  onSearchChange(event:any) {
    const value = event.target.value;
    if (value !== "") {
      this.showReset = true
    } else {
      this.showReset = false;
    }
    this.searchParams.searchTxt = value;
    if(event.key === "Enter"){
      this.submitSearch();
    }
  }

  submitSearch(){
    this.router.navigate(['/community/discussions', {category: this.selCategory, searchTxt:  this.searchParams.searchTxt}]);
  }

  onTabChange(value) {
    this.selCategory = value;
    this.router.navigate(['/community/discussions', {category: this.selCategory, searchTxt:  this.searchParams.searchTxt}]);
  }

  resetSearch(event: any) {
    if(event.clientX!=0){ // this is to make sure it is an event not raise by hitting enter key
      this.searchParams.searchTxt = "";
      this.showReset = false;
      this.search();
    }
  }

  getAllCategories(){
    this.menuService.getMenus("564071623e60f5b66f62df27","").subscribe( (response:any) =>{
      const data = response;
      let tags = [];
      this.categoryList = {};
      if(data.length > 0){
        for(let i in data){
          this.categoryList[ data[i].id ] = {id: data[i].id, label: data[i].displayMenuName, tagIds:[], totalCount:0, discussionLatest:null};
          if(data[i].tags){
            for(let j in data[i].tags){
              this.categoryList[ data[i].id ].tagIds[j] = data[i].tags[j].id; 
            }
            tags[i] = data[i].id + "_" + this.categoryList[ data[i].id ].tagIds.join("_"); // this si just to pass extrs key in tags which is menu item id
          }
        }
        this.dropDownList = JSON.parse(JSON.stringify(this.categoryList));
        this.search();
      }
    });
  }


  search() {
    if(this.selCategory==""){
      this.menuService.getMenus("564071623e60f5b66f62df27",this.searchParams.searchTxt).subscribe( (response:any) =>{
        const data = response;
        let tags = [];
        this.categoryList = {};
        if(data.length > 0){
          for(let i in data){
            this.categoryList[ data[i].id ] = {id: data[i].id, label: data[i].displayMenuName, tagIds:[], totalCount:0, discussionLatest:null};
            if(data[i].tags){
              for(let j in data[i].tags){
                this.categoryList[ data[i].id ].tagIds[j] = data[i].tags[j].id; 
              }
              tags[i] = data[i].id + "_" + this.categoryList[ data[i].id ].tagIds.join("_"); // this si just to pass extrs key in tags which is menu item id
            }
          }

          this.discussionService.summary(tags.join(",")).subscribe((response:any) =>{
            for(let i in data){
              this.categoryList[data[i].id].totalCount = response.data[data[i].id].totalCount;
              if(response.data[data[i].id].discussPage && response.data[data[i].id].discussPage.content && response.data[data[i].id].discussPage.content[0]){
                this.categoryList[data[i].id].discussionLatest = response.data[data[i].id].discussPage.content[0];
              }
            }
          });
        }
      });
    }
    else{
      this.searchParams.tags = this.dropDownList[this.selCategory].tagIds.join(",");
      this.showDiscussions();
      this.showDiscussionsCount();
    }
  }

  showDiscussions(){
    this.discussionService.searchDiscussions(this.searchParams).subscribe( (response:any) =>{
      const data = response.data;
      this.discussionsList = [];
      if(data.content){
        this.discussionsList = data.content;
      }
    });
  }

  showDiscussionsCount(){
    this.discussionService.searchDiscussionsCount({"searchTxt": this.searchParams.searchTxt,"contentTypes": "total"}).subscribe( (response:any) =>{
      this.countData = response.data.z;
    });
  }
}