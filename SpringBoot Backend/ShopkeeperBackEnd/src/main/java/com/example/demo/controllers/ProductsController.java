package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Product;
import com.example.demo.services.ProductService;

@RestController
@RequestMapping("/shopkeeper/products")
//@CrossOrigin(origins = "http://localhost:5173")
public class ProductsController {

	@Autowired
	private ProductService ps;
	
	@GetMapping("/getall")
	public List<Product> getPro()
	{
		return ps.getPro();
	}
	
	@GetMapping("/bysubcategory/{subcatid}")
	public List<Product> getProductsBySubCategory(@PathVariable int subcatid) {
	    return ps.getProductsBySubCategoryId(subcatid);
	}

}
