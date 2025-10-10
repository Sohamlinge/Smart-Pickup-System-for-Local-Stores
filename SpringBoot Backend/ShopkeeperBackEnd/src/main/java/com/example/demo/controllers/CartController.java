package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Cart;
import com.example.demo.services.CartService;

@RestController
@RequestMapping("/shopkeeper/cart")
//@CrossOrigin(origins = "http://localhost:5173")
public class CartController {
	
	@Autowired
	private CartService cs;
	
	@GetMapping("/getall")
	public List<Cart> getAll()
	{
		return cs.getAll();
	}
}
