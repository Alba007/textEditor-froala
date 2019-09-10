package com.example.demo.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;


@Document(collection = "forbidden_words")
public class Forbidden_words {
    @Id
    private String id;
    private String word;

    public Forbidden_words(String id, String word) {
        this.id = id;
        this.word = word;
    }

    public Forbidden_words() {
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getWord() {
        return word;
    }

    public void setWord(String word) {
        this.word = word;
    }


}
