package com.example.demo.dto;

public class LoginRequest {
	private String uname;
    private String password;

    // Getters
    public String getUname() {
        return uname;
    }

    public String getPassword() {
        return password;
    }

    // Setters
    public void setUname(String uname) {
        this.uname = uname;
    }

    public void setPassword(String password) {
        this.password = password;
    }
}
