import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from "@angular/router"
import { DiscussionService } from '../../services/discussion.service';
import { MenuService } from '../../services/menu.service';
import { StorageHelperService } from "../../../../core/services/storage-helper.service";
import { AuthService } from "../../../../core/auth/services/auth.service";
import { Breadcrumb } from 'src/app/core/interfaces';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-discussion-detail',
  templateUrl: './discussion-detail-page.component.html',
  styleUrls: ['./discussion-detail-page.component.scss']
})
export class DiscussionDetailPageComponent implements OnInit {

  breadcrumbLinks: Breadcrumb[];
  discussionId: string;
  category: string;
  categoryName: string;
  discussion: any;
  urltxt: string;
  sortedReplies: any[];
  commentsCount: number;
  user: any;
  parentReplyId: string;
  replyId: string;
  replyForm: FormGroup;
  successMessage: String;
  currentUrl: string;
  whatsappUrl; 

  constructor(private router: Router, private route: ActivatedRoute, 
    private discussionService: DiscussionService, private menuService: MenuService, 
    private fb: FormBuilder, private store: StorageHelperService,
    private authService: AuthService, public sanitizer: DomSanitizer) { }

  ngOnInit() {
    this.currentUrl = window.location.href;
    this.whatsappUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`whatsapp://send?text=${encodeURI(this.currentUrl)}`);
    this.discussionId = this.route.snapshot.params['id'];
    this.successMessage = "";
    this.breadcrumbLinks = [
      {
        text: 'Home',
        link: '/'
      },
      {
        text: 'Community',
        link: '/community'
      },
      {
        text: 'All Articles & Discussions',
        link: '/community/discussions'
      }
    ];
    this.categoryName = "";
    if (this.route.snapshot.params['category']) {
      this.category = this.route.snapshot.params['category'];
    }
    this.parentReplyId = "";
    this.replyId = "";
    this.user = this.store.retrieve("ECP-USER");
    if (this.user) {
      this.user = JSON.parse(this.user);
    }
    let comment = this.store.retrieve("new-d-comment");
    if (comment) {
      comment = JSON.parse(comment);
      this.discussionId = comment.discussionId;
      this.category = comment.category;
      this.parentReplyId = comment.parentReplyId;
      this.store.clear("new-d-comment");
    }
    this.replyForm =  this.fb.group({
      commentTxt: [ comment ? comment.commentTxt : "" ,Validators.required]
    });
    this.getDiscussion();
  }

  addComment() {
    Object.keys(this.replyForm.controls).forEach(field => {
      const control = this.replyForm.get(field);
      control.markAsTouched({ onlySelf: true });
    });
    let comment = {...this.replyForm.value};
    if (!this.replyForm.valid) {
      return;
    }
    if (!this.user) {
      this.store.store("new-d-comment", 
      JSON.stringify({ 
          discussionId: this.discussionId, 
          category: this.category,
          parentReplyId: this.parentReplyId,
          replyId: this.replyId,
          commentTxt: comment.commentTxt
         }));
      this.authService.redirectUrl = "community/discussion/" + this.discussionId + (this.category ? "/" + this.category : "");
      this.router.navigate(['/user/signin']);
      return;
    }
    if(this.replyId){
      this.discussionService.editComment(this.replyId, comment.commentTxt).subscribe((response: any) => {
        if (response.data.replies) {
          this.replyForm.reset();
          this.getDiscussion();
          this.successMessage = "Reply Submitted successfully.";
        }
      });
    }
    else{
      this.discussionService.addComment({ type: 0 }, this.discussionId, this.parentReplyId, comment.commentTxt).subscribe((response: any) => {
        if (response.data.replies) {
          this.replyForm.reset();
          this.getDiscussion();
          this.successMessage = "Reply Submitted successfully.";
        }
      });
    }
    
  }

  // likeDiscussion() {
  //   this.discussionService.likeDiscussionReply(this.discussionId).subscribe((response: any) => {
  //     if (response.data.id) {
  //       this.discussion.aggrLikeCount = response.data.aggrLikeCount;
  //     }
  //   });
  // }

  likeReply(reply) {
    if(reply.likedByUser){
      this.discussionService.unlikeReply(this.discussionId, reply.id).subscribe((response: any) => {
        if (response.data.id) {
          reply.likeCount = reply.likeCount - 1;
          reply.likedByUser = false;
        }
      });  
    }
    else{
      this.discussionService.likeReply(this.discussionId, reply.id).subscribe((response: any) => {
        if (response.data.id) {
          reply.likeCount = reply.likeCount + 1;
          reply.likedByUser = true;
        }
      });
    }
  }

  getDiscussion() {
    if (this.category) {
      this.menuService.getMenuItem(this.category).subscribe((response: any) => {
        if (response[0]) {
          this.categoryName = response[0].displayMenuName;
          this.breadcrumbLinks.push({
            text: this.categoryName,
            link: ['/community/discussions'],
            queryParams: { category: this.category }
          });
        }
      });
    }

    this.discussionService.getDiscussion(this.discussionId).subscribe((response: any) => {
      if (response.data.discuss) {
        this.discussion = response.data.discuss;
        this.sortedReplies = response.data.sortedReplies;
        this.commentsCount = 0;
        if(this.sortedReplies){
          this.commentsCount = Object.keys(this.sortedReplies).length;
        }
      }
    });
  }

  setParentReplyId(id) {
    this.parentReplyId = id;
    this.replyId = "";
    this.successMessage = "";
  }

  editReply(parentReplyId, reply) {
    this.parentReplyId = parentReplyId;
    this.replyId = reply.id;
    this.replyForm.patchValue({commentTxt: reply.text});
    this.successMessage = "";
  }
  
  deleteReply(id:string) {
    this.parentReplyId = "";
    this.replyId = id;
    this.successMessage = "";
  }
  
  get formControl() {
    return this.replyForm.controls;
  }

  /**
   * TODO: method to be removed
   */
  setDefaultPic(e) {
    e.target.src = "/assets/images/default-thumbnail.png";
  }
}