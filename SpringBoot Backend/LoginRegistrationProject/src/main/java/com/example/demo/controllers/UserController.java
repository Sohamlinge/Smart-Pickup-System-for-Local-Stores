package com.example.demo.controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.entities.LoginCheck;
import com.example.demo.entities.User;
import com.example.demo.services.UserService;

@RestController
@RequestMapping("/auth/user")
//@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService urs;

//	@PostMapping("/login")
//	public String login(@RequestBody LoginRequest request) {
//	    boolean success = urs.validateLogin(request.getUname(), request.getPassword());
//	    return success ? "Login successful" : "Invalid credentials";
//	}
	
    @GetMapping("/all")
    public List<User> getAll() {
        return urs.getAll();
    }

    @PostMapping("/register")
    public User save(@RequestBody User ur) {
        return urs.saveUser(ur);
    }
    
    @PostMapping("/login")
    public User loginCheck(@RequestBody LoginCheck lcheck) {
    	User user = urs.getLogin(lcheck.getUname(), lcheck.getPassword());
    	if(user !=null) {
    		return user;
    	}
    	else 
    		return null;
    }
}
