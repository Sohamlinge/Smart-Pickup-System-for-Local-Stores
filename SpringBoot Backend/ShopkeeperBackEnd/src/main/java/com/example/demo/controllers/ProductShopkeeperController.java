package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.PriceStockDTO;
import com.example.demo.entities.ProductShopkeeper;
import com.example.demo.services.ProductShopkeeperService;

@RestController
@RequestMapping("/shopkeeper/productshopkeeper")
//@CrossOrigin(origins = "http://localhost:5173")
public class ProductShopkeeperController {

    @Autowired
    private ProductShopkeeperService pss;
    
    @GetMapping("/getall")
    public List<ProductShopkeeper> getAll()
    {
    	return pss.getAll();
    }
    
    @GetMapping("/shopkeeper/{sid}")
    public List<ProductShopkeeper> getProductsByShopkeeper(@PathVariable int sid) {
        return pss.getProductsByShopkeeperId(sid);
    }
    
    @GetMapping("/product/{pid}")
    public List<ProductShopkeeper> getShopkeepersByProduct(@PathVariable int pid) {
        return pss.getShopkeepersByProductId(pid);
    }
//    @GetMapping("/productshopkeeperid/{spid}")
//    public List<ProductShopkeeper> getProductShopkeepers(@PathVariable int spid) {
//    	return pss.getProductShopkeeper(spid);
//    }
    @GetMapping("/shopkeeper/{sid}/product/{pid}")
    public ResponseEntity<?> getPriceAndStockForShopkeeperProduct(@PathVariable int sid, @PathVariable int pid) {
        List<PriceStockDTO> dtos = pss.getPriceAndStockForShopkeeperProduct(sid, pid);

        if (dtos.isEmpty()) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(dtos);
    }
    
    /**
     * Create or update product-shopkeeper record for price & stock.
     * Shopkeeper may add new record if not existing.
     */
    @PostMapping("/shopkeeper/{sid}/product/{pid}")
    public ResponseEntity<?> createOrUpdateProductShopkeeper(
            @PathVariable int sid,
            @PathVariable int pid,
            @RequestBody PriceStockDTO priceStockDTO) {
        try {
            ProductShopkeeper saved = pss.createOrUpdateProductShopkeeper(
                    sid, pid,
                    priceStockDTO.getPrice(),
                    priceStockDTO.getStockStatus());

            return ResponseEntity.ok(saved);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.status(500).body("Server error");
        }
    }
}
