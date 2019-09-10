package com.example.demo.model;

import com.google.gson.Gson;

public class AddMessage extends Message {
    String type;

    public AddMessage(String type, String id, String message, double latitude, double longitude, String file) {
        super(id, message, latitude, longitude, file);
        this.type = type;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    @Override
    public String toString() {
//        return "AddSensor{" +
//                "type='" + type + '\'' +
//                ", id='" + get_id() + '\'' +
//                ", name='" + getName() + '\'' +
//                ", description='" + getDescription() + '\'' +
//                ", workTime=" + getworkTime() +
//                ", data=" + getData() +
//                ", gpsData=" + getGpsData() +
//                '}';
        return new Gson().toJson(this);
    }
}
