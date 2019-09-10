package com.example.demo.repository;


import com.example.demo.model.Forbidden_words;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ForbiddenWordsRepos extends MongoRepository<Forbidden_words, String> {

    public List<ForbiddenWordsRepos> findByWordLike(String word);
}