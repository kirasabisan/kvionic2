import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { DishDetailPage } from '../../pages/dishdetail/dishdetail';
/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {
  comment: FormGroup;
  stars: number = 3;
  myComment = '';
  
 
  

  constructor(public navCtrl: NavController, 
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController,
    private formBuilder: FormBuilder) {

      this.comment = this.formBuilder.group({
        author: ['', Validators.required],
        rating: 3,
        comment: ['', Validators.required],
        date: new Date().toISOString()

      })
  }

  presentCommentModal() {
    let commentModal = this.modalCtrl.create(Comment);
    commentModal.present();
  }

  
  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
    console.log('View Dismiss');
  }

  onSubmit() {
    
    let myComment = this.comment.value;
    this.viewCtrl.dismiss(myComment);
  }
    
}