package com.example.demo.dto;

public class LoginResponse {
    private String message;
    private Integer rid;
    private String uname;

    public LoginResponse(String message, Integer rid, String uname) {
        this.message = message;
        this.rid = rid;
        this.uname = uname;
    }

    public String getMessage() {
        return message;
    }

    public Integer getRid() {
        return rid;
    }

    public String getUname() {
        return uname;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setRid(Integer rid) {
        this.rid = rid;
    }

    public void setUname(String uname) {
        this.uname = uname;
    }
}
