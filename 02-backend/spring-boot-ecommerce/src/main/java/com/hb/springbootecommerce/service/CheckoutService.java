package com.hb.springbootecommerce.service;

import com.hb.springbootecommerce.dto.Purchase;
import com.hb.springbootecommerce.dto.PurchaseResponse;

public interface CheckoutService {

    PurchaseResponse placeOrder(Purchase purchase);
}
