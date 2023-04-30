import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { GroceryItem } from '../GroceryItem'
//import { Observable } from 'rxjs/dist/types/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class GroceriesService {

  items = [
    // {
    //   name: "Milk",
    //   quantity: 2
    // },
    // {
    //   name: "Bread",
    //   quantity: 1
    // },
    // {
    //   name: "Banana",
    //   quantity: 3
    // },
    // {
    //   name: "Sugar",
    //   quantity: 1
    // }
  ];

  readonly baseUrl = "https://groceries-server.herokuapp.com";    //"http://localhost:8081";

  dataChanged$: Observable<boolean>;
  private dataChangeSubject: Subject<boolean>;

  constructor(private http: HttpClient) {

    this.dataChangeSubject = new Subject<boolean>();
    this.dataChanged$ = this.dataChangeSubject.asObservable();
  }

  getItems(): Observable<any>{
    var r = this.http.get<any>(this.baseUrl + "/api/groceries").subscribe(data => {
      console.log(data)
    })
    return this.http.get<any>(this.baseUrl + "/api/groceries").pipe(
      map(this.extractData),
      catchError(this.handleError)
    );
    //return this.items;
  }

  private extractData(res: Response){
    let body = res;
    return body || {};
  }

  private handleError(error: Response | any){
    let errMsg: string;
    if (error instanceof Response) {
      const err = error || '';
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    }
    else {
      errMsg = error.message ? error.message : error.toString();
    }

    console.error(errMsg);
    return throwError(errMsg);
  }

  removeItem(id){
    this.http.delete<any>(this.baseUrl + "/api/groceries/" + id).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    })
    //this.items.splice(index, 1);
  }

  addItem(item){
    this.http.post<any>(this.baseUrl + "/api/groceries", item).subscribe(res => {
      this.items = res;
      this.dataChangeSubject.next(true);
    })
    //this.items.push(item);
  }

  editItem(item, index, id){
    this.http.put<GroceryItem[]>(this.baseUrl + "/api/groceries/" + id, item).subscribe(res => {
      this.items = res;
      // after this we need to let the view reload the items for me
      this.dataChangeSubject.next(true);
    });

    //this.items[index] = item;
  }
}
