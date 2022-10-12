import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
import { HbShopFormService } from 'src/app/services/hb-shop-form.service';
import { HbValidators } from 'src/app/validators/hb-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  checkoutFormGroup: FormGroup;

  totalPrice: number = 0;
  totalQuantity: number = 0;

  creditCardMonths: number[] = [];
  creditCardYears: number[] = [];

  countries: Country[] = [];

  shippingAddressStates: State[] = [];
  billingAddressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
              private hbShopFormService: HbShopFormService) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName: new FormControl('', 
                                  [Validators.required, 
                                  Validators.minLength(2), 
                                  HbValidators.notOnlyWhitespace]),

        lastName: new FormControl('', 
                                  [Validators.required, 
                                  Validators.minLength(2), 
                                  HbValidators.notOnlyWhitespace]),

        email: new FormControl('',
                              [Validators.required, 
                              Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')])

      }),
      shippingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), HbValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), HbValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), HbValidators.notOnlyWhitespace])
      }),
      billingAddress: this.formBuilder.group({
        country: new FormControl('', [Validators.required]),
        street: new FormControl('', [Validators.required, Validators.minLength(2), HbValidators.notOnlyWhitespace]),
        city: new FormControl('', [Validators.required, Validators.minLength(2), HbValidators.notOnlyWhitespace]),
        state: new FormControl('', [Validators.required]),
        zipCode: new FormControl('', [Validators.required, Validators.minLength(2), HbValidators.notOnlyWhitespace])
      }),
      creditCard: this.formBuilder.group({
        cardType: new FormControl('', [Validators.required]),
        nameOnCard:  new FormControl('', [Validators.required, Validators.minLength(2), 
                                          HbValidators.notOnlyWhitespace]),
        cardNumber: new FormControl('', [Validators.required, Validators.pattern('[0-9]{16}')]),
        securityCode: new FormControl('', [Validators.required, Validators.pattern('[0-9]{3}')]),
        expirationMonth: [''],
        expirationYear: ['']
      })
    });

    //populate credit card months
    const startMonth: number = new Date().getMonth() + 1;
    console.log("startMonth: " + startMonth);

    this.hbShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
    //populate credit card years
    this.hbShopFormService.getCreditCardYears().subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardYears = data;
      }
    );

    //populate countries
    this.hbShopFormService.getCountries().subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data))
        this.countries = data;
      }
    )

  }

  handleMonthsAndYears(){
    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard');

    const currentYear: number = new Date().getFullYear();
    const selectedYear: number = Number(creditCardFormGroup.value.expirationYear);

    //if the current year equals selected year, then start with the current month

    let startMonth: number;

    if(currentYear === selectedYear){
      startMonth = new Date().getMonth() +1;
    } else{
      startMonth = 1;
    }

    this.hbShopFormService.getCreditCardMonths(startMonth).subscribe(
      data => {
        console.log("Retrieved credit card months: " + JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )
  }

  onSubmit(){
    console.log("Handling the submit button");

    if(this.checkoutFormGroup.invalid) {
      this.checkoutFormGroup.markAllAsTouched();
    }
    console.log(this.checkoutFormGroup.get('customer').value);
    console.log("The email address is " + this.checkoutFormGroup.get('customer').value.email);

    console.log("The shipping address country is " + this.checkoutFormGroup.get('shippingAddress').value.country.name);
    console.log("The shipping address state is " + this.checkoutFormGroup.get('shippingAddress').value.state.name);

    console.log("The billing address country is " + this.checkoutFormGroup.get('billingAddress').value.country.name);
    console.log("The billing address state is " + this.checkoutFormGroup.get('billingAddress').value.state.name);

  }

  copyShippingAddressToBillingAddress(event){
    if(event.target.checked){
      this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);

      // bug fix for states
      this.billingAddressStates = this.shippingAddressStates;
    } else {
      this.checkoutFormGroup.controls['billingAddress'].reset();

      // bug fix for states
      this.billingAddressStates = [];
    }

  }

  getStates(formGroupName: string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);

    const countryCode = formGroup.value.country.code;
    const countryName = formGroup.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}`);
    console.log(`${formGroupName} country name: ${countryName}`);

    this.hbShopFormService.getStates(countryCode).subscribe(
      data => {
        if(formGroupName === 'shippingAddress'){
          this.shippingAddressStates = data;
        } else {
          this.billingAddressStates = data;
        }

        // select first item by default
        formGroup.get('state').setValue(data[0]);
      }
    );
  }

  get firstName() { return this.checkoutFormGroup.get('customer.firstName');}
  get lastName() { return this.checkoutFormGroup.get('customer.lastName');}
  get email() { return this.checkoutFormGroup.get('customer.email');}

  get shippingAddressStreet() { return this.checkoutFormGroup.get('shippingAddress.street');}
  get shippingAddressCity() { return this.checkoutFormGroup.get('shippingAddress.city');}
  get shippingAddressState() { return this.checkoutFormGroup.get('shippingAddress.state');}
  get shippingAddressCountry() { return this.checkoutFormGroup.get('shippingAddress.country');}
  get shippingAddressZipCode() { return this.checkoutFormGroup.get('shippingAddress.zipCode');}

  get billingAddressStreet() { return this.checkoutFormGroup.get('billingAddress.street');}
  get billingAddressCity() { return this.checkoutFormGroup.get('billingAddress.city');}
  get billingAddressState() { return this.checkoutFormGroup.get('billingAddress.state');}
  get billingAddressCountry() { return this.checkoutFormGroup.get('billingAddress.country');}
  get billingAddressZipCode() { return this.checkoutFormGroup.get('billingAddress.zipCode');}

  get creditCardType() { return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard() { return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardNumber() { return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode() { return this.checkoutFormGroup.get('creditCard.securityCode'); }
}
