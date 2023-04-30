import { Component, OnInit } from '@angular/core';
// import { GroceryItem } from '../GroceryItem';
import { ToastController, AlertController } from '@ionic/angular';
// import { ITEMS } from '../Items';
import { GroceriesService } from '../services/groceries.service';
import { InputDialogService } from '../services/input-dialog.service';
import { Share } from '@capacitor/share';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})

export class Tab1Page implements OnInit {

  title = "Grocery";
  items = [];
  errorMessage: string;
  // Array of objects
  //items: GroceryItem[] = ITEMS;
  // items = [
  //   {
  //     name: "Milk",
  //     quantity: 2
  //   },
  //   {
  //     name: "Bread",
  //     quantity: 1
  //   },
  //   {
  //     name: "Banana",
  //     quantity: 3
  //   },
  //   {
  //     name: "Sugar",
  //     quantity: 1
  //   }
  // ];

  // in order to use a service you have to add it as a provider into the constructor
  // constructor(private groceryService: GroceryService, private toastController: ToastController, private alertController: AlertController) { }
  constructor(private dataService: GroceriesService, private inputDialogService: InputDialogService, private toastController: ToastController, private alertController: AlertController) {
    dataService.dataChanged$.subscribe((dataChanged: boolean) => {
      this.loadItems();
    });
  }

  loadItems(){
    this.dataService.getItems().subscribe(
      items => this.items = items,
      error => this.errorMessage = <any>error);
  }

 // life cycle method - when the view gets loaded this methods gets called which calls the load items
 ionViewDidLoad(){
  // this.loadItems();
 }

  ngOnInit(){
    this.loadItems();
    //this.groceryService.getGroceries().subscribe((items) => this.items = items)
  }

  async editItem(item: any, index: number, id: any) {
    console.log("Editing item - ", item, index);
    const toast = await this.toastController.create({
      message: 'Editing Item - ' + index,
      duration: 1500
    });

    await toast.present();
    this.inputDialogService.showPrompt(item, index, id);
  }

  async removeItem(id) {
    console.log("Removing item -", id);
    const toast = await this.toastController.create({
      message: 'Removing Item - ' + id,
      duration: 1500
    });

    //this.items.splice(index, 1);
    await toast.present();
    this.dataService.removeItem(id);
  }

   async shareItem(item: any, index: any) {
     let message = "Grocery Item - Name: " + item.name + " - Quantity: " + item.quantity
     let subject = "Shared via Groceries app";

      await Share.share({
      title: 'See cool stuff',
      text: 'Really awesome thing you need to see right meow',
      dialogTitle: 'Share with buddies'//
      //url: 'http://ionicframework.com/',
    }).then(() => {
      console.log("Shared successfully")
    }).catch((error) => {
      console.error("Error while sharing ", error)
    })
  }

  addItem() {
    console.log("Adding item -");
    this.inputDialogService.showPrompt()
  }
}
