package com.hb.springbootecommerce.dto;

import com.hb.springbootecommerce.entity.Address;
import com.hb.springbootecommerce.entity.Customer;
import com.hb.springbootecommerce.entity.Order;
import com.hb.springbootecommerce.entity.OrderItem;
import lombok.Data;

import java.util.Set;

@Data
public class Purchase {

    private Customer customer;
    private Address shippingAddress;
    private Address billingAddress;
    private Order order;
    private Set<OrderItem> orderItems;
}
