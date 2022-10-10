import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Product } from '../common/product';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = 'http://localhost:8080/api/products';

  constructor(private httpClient: HttpClient) { }

  getProductList(theCategoryID: number): Observable<Product[]>{

    //need to build url based on category id 
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryID}`;

    return this.httpClient.get<GetResponse>(searchUrl).pipe(
      map(response => response._embedded.products)
    )
  }
  
}
interface GetResponse {
  _embedded: {
    products: Product[];
  }
}
