package com.example.demo.dto;

public class PriceStockDTO {
	 private double price;
     private String stockStatus;

     public PriceStockDTO(double price, String stockStatus) {
         this.price = price;
         this.stockStatus = stockStatus;
     }

     // getters and setters
     public double getPrice() {
         return price;
     }

     public void setPrice(double price) {
         this.price = price;
     }

     public String getStockStatus() {
         return stockStatus;
     }

     public void setStockStatus(String stockStatus) {
         this.stockStatus = stockStatus;
     }
}
