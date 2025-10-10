package com.example.demo.services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.example.demo.entities.Role;
import com.example.demo.entities.User;
import com.example.demo.repositories.RoleRepo;
import com.example.demo.repositories.UserRepo;


@Service // Marks as a Spring service component
public class UserService {

    @Autowired // Injects User repository
    private UserRepo urp;

    @Autowired // Injects Role repository
    private RoleRepo rr;

    // Check if username & password match
    public boolean validateLogin(String uname, String password) {
        return urp.findByUnameAndPassword(uname, password).isPresent();
    }

    // Get all users
    public List<User> getAll() {
        return urp.findAll();
    }

    // Save user with a valid role
    public User saveUser(User ur) {
        int rid = ur.getRole().getRid(); // Get role ID
        Role role = rr.findById(rid) // Find role
                .orElseThrow(() -> new RuntimeException("Invalid role ID: " + rid));
        ur.setRole(role); // Set full role object
        return urp.save(ur); // Save user
    }
    
     public User getLogin(String uname,String password)
     {
     	User l;
     	Optional <User> ol = urp.getLogin(uname, password);
     	try
     	{
     	l = ol.get();
     	}catch(Exception e)
     	{
     		l=null;
     	}
     	return l;
     }

//    public User getLogin(String uname, String password) {
//    return urp.getLoginWithShopkeeper(uname, password).orElse(null);
//    }

}
