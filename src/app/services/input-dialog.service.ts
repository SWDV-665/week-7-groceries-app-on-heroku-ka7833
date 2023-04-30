import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { GroceriesService } from './groceries.service';

@Injectable({
  providedIn: 'root'
})
export class InputDialogService {

  constructor(private alertController: AlertController, private dataService: GroceriesService) { }

 // it item is available it should be editItem if not addItem
  async showPrompt(item?: any, index?: number, id?: any) {
    const alert = await this.alertController.create({
      header: item ? 'Edit Item': 'Add Item',
      message: item? "Please enter item...": "Please enter item",
      inputs: [{
        name: "name",
        placeholder: "Name",
        value: item ? item.name: null
      },
      {
        type: "number",
        name: "quantity",
        placeholder: "Quantity",
        value: item ? item.quantity : null,
        min: 0,
        max: 100
      }
      ],
      buttons: [{
        text: "Cancel",
        handler: data => {
          console.log("Cancel clicked")
        }
      },
      {
        text: "Save",
        handler: item => {
          console.log("Save clicked", item);
          //this.items[index] = item
          if(index !== undefined) {
            this.dataService.editItem(item, index, id)
          }
          else {
            this.dataService.addItem(item);
          }
        }
      }]
    });

    await alert.present();
  }
}
