package com.example.demo.services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.entities.Cart;
import com.example.demo.repositories.CartRepo;

@Service
public class CartService {
	
	@Autowired
	private CartRepo cr;
	
	public List<Cart> getAll()
	{
		return cr.findAll();
	}
}
