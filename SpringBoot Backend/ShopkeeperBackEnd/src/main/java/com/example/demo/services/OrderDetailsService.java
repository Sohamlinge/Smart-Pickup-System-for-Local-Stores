package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.OrderDetailsSummaryDTO;
import com.example.demo.entities.OrderDetails;
import com.example.demo.repositories.OrderDetailsRepo;

@Service
public class OrderDetailsService {

    @Autowired
    private OrderDetailsRepo odr;

    public List<OrderDetails> getAllOrderDetails() {
        return odr.findAll();
    }

    public List<OrderDetailsSummaryDTO> getOrderDetailsByShopkeeperId(int shopkeeperId) {
        List<Object[]> results = odr.findOrderDetailsByShopkeeperId(shopkeeperId);

        return results.stream().map(record -> {
            Integer orderdetailsid = ((Number) record[0]).intValue();

            Object unameObj = record[1];
            String uname = unameObj != null ? unameObj.toString() : null;

            Object phonenoObj = record[2];
            String phoneno = phonenoObj != null ? phonenoObj.toString() : null;

            String pname = (record[3] != null) ? record[3].toString() : null;
            Integer qty = (record[4] != null) ? ((Number) record[4]).intValue() : null;
            Float price = (record[5] != null) ? ((Number) record[5]).floatValue() : null;

            return new OrderDetailsSummaryDTO(orderdetailsid, uname, phoneno, pname, qty, price);
        }).toList();
    }




}
