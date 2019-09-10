package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.lang.Nullable;

@Document(collection = "message")
public class Message {
    @Id
    private String id;
    private String message;
    private double latitude;
    private double longitude;
    @Nullable
    private String file;

    public Message(String id, String message, double latitude, double longitude, String file) {
        this.id = id;
        this.message = message;
        this.latitude = latitude;
        this.longitude = longitude;
        this.file = file;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    @Nullable
    public String getFile() {
        return file;
    }

    public void setFile(@Nullable String file) {
        this.file = file;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public String EleminateTaags(String word) {
        String text = word.replaceAll("\\<.*?\\>", "");
        System.out.println(text);
        return text;

    }

    public String RemoveSpaces(String word) {
        String noSpaceMessaage = word.replaceAll("\\s", "");
        System.out.println(noSpaceMessaage);
        return noSpaceMessaage.toLowerCase();
    }


}



