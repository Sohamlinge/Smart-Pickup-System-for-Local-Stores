package com.example.demo.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.entities.Shopkeeper;
import com.example.demo.entities.User;
import com.example.demo.services.ShopkeeperService;

@RestController
@RequestMapping("/auth/registerShopkeeper")
//@CrossOrigin(origins = "http://localhost:5173")
public class ShopkeeperController {

	@Autowired
	private ShopkeeperService ss;

	@GetMapping("/getall")
	public List<Shopkeeper> getAll() {
		return ss.getAll();
	}

	@PostMapping("/register")
	public Shopkeeper save(@RequestBody Shopkeeper sr) {
		return ss.saveShopkeeper(sr);
	}
	
	@GetMapping("/getShopkeeperId/{id}")
	public Optional<Shopkeeper> getShopkeeperById(@PathVariable int id) {
		return ss.getShopkeeperById(id);
		
	}

}
