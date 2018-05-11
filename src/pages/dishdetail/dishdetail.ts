import { Component, Inject } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ActionSheetController, ModalController, ViewController } from 'ionic-angular';
import { Dish } from '../../shared/dish';
import { Comment } from '../../shared/comment';
import { FavoriteProvider } from '../../providers/favorite/favorite';
import { CommentPage } from '../../pages/comment/comment';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { SocialSharing } from '@ionic-native/social-sharing';

/**
 * Generated class for the DishdetailPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-dishdetail',
  templateUrl: 'dishdetail.html',
})
export class DishDetailPage {
  dish: Dish;
  errMess: string;
  avgstars: string;
  numcomments: number;
  favorite: boolean = false;
  total: number;

  constructor(public navCtrl: NavController, public navParams: NavParams,
    @Inject('BaseURL') public BaseURL,
    public favoriteservice: FavoriteProvider,
    public toastCtrl: ToastController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    private socialSharing: SocialSharing) {
    this.dish = navParams.get('dish');
    this.favorite = favoriteservice.isFavorite(this.dish.id);
    this.numcomments = this.dish.comments.length;

    let total = 0;
    this.dish.comments.forEach(comment => total += comment.rating );
    this.avgstars = (total/this.numcomments).toFixed(2);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad DishdetailPage');
  }

  addToFavorites() {
    console.log('Adding to Favorites', this.dish.id);
    this.favorite = this.favoriteservice.addFavorite(this.dish.id);
    this.toastCtrl.create({
      message: 'Dish ' + this.dish.id + ' added as favorite successfully',
      position: 'middle',
      duration: 3000}).present();
      
  }

  presentCommentModal() {
    let commentModal = this.modalCtrl.create(CommentPage);
    commentModal.present();
    commentModal.onDidDismiss(comment => {if(comment){
      this.dish.comments.push(comment);
      this.total = this.total + comment.rating
    }});
  }

  openComments() {
    let modal = this.modalCtrl.create(CommentPage);
    modal.onDidDismiss((myComment) => {
      if (myComment){
        this.dish.comments.push(myComment);
        this.numcomments = this.dish.comments.length;
        let total = 0;
        this.dish.comments.forEach(comment => total += comment.rating);
        this.avgstars = (total / this.numcomments).toFixed(2);
      }
    })
    modal.present();
  }

openMenu() {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'Select Actions',
    buttons: [
      {
        text: 'Add to Favorites',
        role: 'Add to Favorites',
        handler: () => {
          this.favorite = this.favoriteservice.addFavorite(this.dish.id);
        }
      },
      {
        text: 'Add Comment',
        role: 'Add Comment',
        handler: () => {
          this.presentCommentModal();
        }
      },
      {
        text: 'Cancel',
        role: 'cancel',
        handler: () => {
          console.log('Cancel clicked');
        }
      }
    ]
  });
  actionSheet.present();
  }

presentActionSheet() {
  let actionSheet = this.actionSheetCtrl.create({
    title: 'Select Actions',
    buttons: [
      {
        text: 'Share via Facebook',
        handler: () => {
          this.socialSharing.shareViaFacebook(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
          .then(() => console.log('Posted successfully to Facebook'))
          .catch(() => console.log('Failed to post fo Facebook'));
        }
      },
      {
        text: 'Share via Twitter',
        handler: () => {
          this.socialSharing.shareViaTwitter(this.dish.name + ' -- ' + this.dish.description, this.BaseURL + this.dish.image, '')
          .then(() => console.log('Posted successfully to Twitter'))
          .catch(() => console.log('Failed to post to Twitter'));
        }
      },
    ]
  });
}
}