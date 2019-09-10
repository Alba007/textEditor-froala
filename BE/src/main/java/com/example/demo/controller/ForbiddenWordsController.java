package com.example.demo.controller;

import com.example.demo.model.Forbidden_words;
import com.example.demo.repository.ForbiddenWordsRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@CrossOrigin
@RestController
@RequestMapping("/api")
public class ForbiddenWordsController {

    private final SimpMessagingTemplate template;


    @Autowired
    public ForbiddenWordsRepos forbiddenWordsRepos;


    @Autowired
    ForbiddenWordsController(SimpMessagingTemplate template) {
        this.template = template;
    }


    @RequestMapping(value = "/forbWords", method = RequestMethod.GET)
    public List<Forbidden_words> getForbWords() {
        return forbiddenWordsRepos.findAll();
    }


    @RequestMapping(value = "/forbWords/{id}", method = RequestMethod.GET)
    public Forbidden_words getForbWords(@PathVariable("id") String id) {
        return forbiddenWordsRepos.findById(id).orElse(null);
    }


    @RequestMapping(value = "/forbWords", method = RequestMethod.POST)
    public Forbidden_words postForbWord(@RequestBody Forbidden_words word) {
        forbiddenWordsRepos.save(word);
        return word;
    }


    @RequestMapping(value = "/forbWords/{id}", method = RequestMethod.PUT)
    public Forbidden_words editMessage(@PathVariable("id") String id, @Valid @RequestBody Forbidden_words word) {
        word.setId(id);
        forbiddenWordsRepos.save(word);
        return word;
    }

    @RequestMapping(value = "/forbWords/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable String id) {
        forbiddenWordsRepos.deleteById(id);
    }
}