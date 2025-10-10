package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Shopkeeper;
import com.example.demo.entities.User;
import com.example.demo.repositories.ShopkeeperRepo;
import com.example.demo.repositories.UserRepo;

@Service
public class ShopkeeperService {

	@Autowired
	private ShopkeeperRepo sr;
	
	@Autowired
	private UserRepo ur;
	
	public List<Shopkeeper> getAll()
	{
		return sr.findAll();
	}
	
	 public Shopkeeper saveShopkeeper(Shopkeeper srp) {
	        int uid = srp.getUser().getUid();
	        User user = ur.findById(uid).orElseThrow(() -> new RuntimeException("Invalid user ID: " + uid));
	        srp.setUser(user);
	        return sr.save(srp);	       
	    }

	public Optional<Shopkeeper> getShopkeeperById(int id) {
		return sr.findById(id);
	}
}
