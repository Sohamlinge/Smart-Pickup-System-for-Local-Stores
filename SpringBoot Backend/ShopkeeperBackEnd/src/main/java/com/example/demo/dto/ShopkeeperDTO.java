package com.example.demo.dto;

public class ShopkeeperDTO {
    private int id;
    private String sname; // Assuming LoginRegistrationProject has this field
    private String gstno;
    private long sphoneno;
    private String saddress;

    // Getters and Setters
    public int getId() {
        return id;
    }
    public void setId(int id) {
        this.id = id;
    }
    public String getSname() {
        return sname;
    }
    public void setSname(String sname) {
        this.sname = sname;
    }
    public String getGstno() {
        return gstno;
    }
    public void setGstno(String gstno) {
        this.gstno = gstno;
    }
    public long getSphoneno() {
        return sphoneno;
    }
    public void setSphoneno(long sphoneno) {
        this.sphoneno = sphoneno;
    }
    public String getSaddress() {
        return saddress;
    }
    public void setSaddress(String saddress) {
        this.saddress = saddress;
    }
}
