import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1
  currentCategoryName?: string;
  searchMode: boolean = false;

  //new properties for pagination
  thePageNumber : number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  
  previousKeyword: string | null= null;

  constructor(private productService: ProductService,
              private cartService: CartService,
              private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts();
    })
  }

  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');

    if(this.searchMode){
      this.handleSearchProducts();
    }
    this.handleListProducts();
  }

  handleSearchProducts() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    //if we have a different keyword than previous one
    //then set the pagenumber to 1

    if(this.previousKeyword != theKeyword){
      this.thePageNumber = 1;
    }

    this.previousKeyword = theKeyword;

    console.log(`keyword=${theKeyword}, thPageNumber=${this.thePageNumber}`);

    //search for the products using keyword
    this.productService.searchProductsPaginate(this.thePageNumber-1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());

  }

  handleListProducts(){
    //check if 'id' parameter is available
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      //get the 'id' param string and convert it to number
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    } else {
      // category id is not available, default id is 1
      this.currentCategoryId = 1;
      this.currentCategoryName = "Books";
    }

    //check if we have a different category than previous
    //angular will reuse a component

    //if we have a different category id than previous set the page number back to 1

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);


      //get the products for the id
    this.productService.getProductListPaginate(this.thePageNumber - 1,
                                              this.thePageSize,
                                              this.currentCategoryId)
                                              .subscribe(this.processResult());                       

    }

    updatePageSize(pageSize: string){
      this.thePageSize = +pageSize;
      this.thePageNumber = 1;
      this.listProducts();

    }

    processResult(){
      return(data: any) => {
        this.products = data._embedded.products;
        this.thePageNumber = data.page.number +1;
        this.thePageSize = data.page.site;
        this.theTotalElements = data.page.totalElements

      }
    }

    addTocart(theProduct: Product){
      console.log(`Adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`);

      const theCartItem = new CartItem(theProduct);

      this.cartService.addToCart(theCartItem);

    }

}
