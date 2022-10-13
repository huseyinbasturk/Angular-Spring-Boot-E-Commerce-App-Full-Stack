package com.hb.springbootecommerce.dao;

import com.hb.springbootecommerce.entity.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.web.bind.annotation.CrossOrigin;


public interface CustomerRepository extends JpaRepository<Customer, Long> {
}
