package com.example.demo.services;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.PriceStockDTO;
import com.example.demo.entities.Product;
import com.example.demo.entities.ProductShopkeeper;
import com.example.demo.entities.Shopkeeper;
import com.example.demo.repositories.ProductRepo;
import com.example.demo.repositories.ProductShopkeeperRepo;
import com.example.demo.repositories.ShopkeeperRepo;

import jakarta.transaction.Transactional;

@Service
public class ProductShopkeeperService {

    @Autowired
    private ProductShopkeeperRepo psr;
    
    @Autowired
    private ProductRepo pr;
    
    @Autowired
    private ShopkeeperRepo sr;

    public List<ProductShopkeeper> getAll()
    {
    	return psr.findAll();
    }
    
    public List<ProductShopkeeper> getProductsByShopkeeperId(int sid) {
        return psr.findByShopkeeper_Sid(sid);
    }
    
    public List<ProductShopkeeper> getShopkeepersByProductId(int pid) {
        return psr.findByProduct_Pid(pid);
    }
//    public List<ProductShopkeeper> getProductShopkeeper(int spid) {
//    	return psr.findByProductShopkeeper_Spid(spid);
//    }
    
    public List<PriceStockDTO> getPriceAndStockForShopkeeperProduct(int sid, int pid) {
        List<ProductShopkeeper> results = psr.findByShopkeeper_SidAndProduct_Pid(sid, pid);
        return results.stream()
            .map(ps -> new PriceStockDTO(ps.getPrice(), ps.getStockStatus()))
            .collect(Collectors.toList());
    }
    
    /**
     * Create or update a product-shopkeeper record.
     * If record exists, update price and stockStatus.
     * If not exist, create new.
     * Also allows setting price/stock for products not currently assigned.
     */
    @Transactional
    public ProductShopkeeper createOrUpdateProductShopkeeper(int sid, int pid, double price, String stockStatus) throws IllegalArgumentException {
        Optional<ProductShopkeeper> existingOpt = psr.findFirstByShopkeeper_SidAndProduct_Pid(sid, pid);

        Shopkeeper shopkeeper = sr.findById(sid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Shopkeeper ID"));
        Product product = pr.findById(pid)
                .orElseThrow(() -> new IllegalArgumentException("Invalid Product ID"));

        ProductShopkeeper ps;

        if (existingOpt.isPresent()) {
            // Update existing record
            ps = existingOpt.get();
            ps.setPrice(price);
            ps.setStockStatus(stockStatus);
        } else {
            // Create new record - permission granted for products not yet linked
            ps = new ProductShopkeeper();
            ps.setShopkeeper(shopkeeper);
            ps.setProduct(product);
            ps.setPrice(price);
            ps.setStockStatus(stockStatus);
        }

        return psr.save(ps);
    }
}
