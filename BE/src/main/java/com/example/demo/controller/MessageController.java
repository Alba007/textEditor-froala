package com.example.demo.controller;


import com.example.demo.model.AddMessage;
import com.example.demo.model.DeletedMess;
import com.example.demo.model.Message;
import com.example.demo.repository.ForbiddenWordsRepos;
import com.example.demo.repository.MessageRepos;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;


@CrossOrigin
@RestController
@RequestMapping("/api")
public class MessageController {

    private final SimpMessagingTemplate template;

    @Autowired
    public MessageRepos messageReposit;

    @Autowired
    public ForbiddenWordsRepos forbiddenWordsRepos;


    @Autowired
    MessageController(SimpMessagingTemplate template) {
        this.template = template;
    }


    @RequestMapping(value = "/messages", method = RequestMethod.GET)
    public List<Message> getMessages() {
        return messageReposit.findAll();
    }


    @RequestMapping(value = "/messages/{id}", method = RequestMethod.GET)
    public Message getMess(@PathVariable("id") String id) {
        return messageReposit.findById(id).orElse(null);
    }


    @RequestMapping(value = "/messages", method = RequestMethod.POST)
    public Message postMessage(@RequestBody Message mess) {
        String messageWithoutTags = mess.EleminateTaags(mess.getMessage());
        String noSpaceMessaage = mess.RemoveSpaces(messageWithoutTags);
        List<ForbiddenWordsRepos> result = forbiddenWordsRepos.findByWordLike(noSpaceMessaage);
        System.out.println(result.size());
        if (result.size() == 0) {
            messageReposit.save(mess);
            AddMessage newMess = new AddMessage("post", mess.getId(), mess.getMessage(), mess.getLatitude(), mess.getLongitude(), mess.getFile());
            this.template.convertAndSend("/topic/mess", newMess.toString());
            //System.out.println(mess.getId()) ;
        } else {
            AddMessage newMess = new AddMessage("forbidden", mess.getId(), mess.getMessage(), mess.getLatitude(), mess.getLongitude(), mess.getFile());
            this.template.convertAndSend("/topic/mess", newMess.toString());
        }
        return mess;
    }


    @RequestMapping(value = "/messages/{id}", method = RequestMethod.PUT)
    public Message editMessage(@PathVariable("id") String id, @Valid @RequestBody Message mess) {
        String messageWithoutTags = mess.EleminateTaags(mess.getMessage());
        String noSpaceMessaage = mess.RemoveSpaces(messageWithoutTags);
        List<ForbiddenWordsRepos> result = forbiddenWordsRepos.findByWordLike(noSpaceMessaage);
        ;
        System.out.println(result.size());
        if (result.size() == 0) {
            mess.setId(id);
            AddMessage editMess = new AddMessage("put", mess.getId(), mess.getMessage(), mess.getLatitude(), mess.getLongitude(), mess.getFile());
            this.template.convertAndSend("/topic/mess", editMess.toString());
            messageReposit.save(mess);
        } else {
            AddMessage editMess = new AddMessage("forbidden", mess.getId(), mess.getMessage(), mess.getLatitude(), mess.getLongitude(), mess.getFile());
            this.template.convertAndSend("/topic/mess", editMess.toString());
        }
        return mess;
    }


    @RequestMapping(value = "/messages/{id}", method = RequestMethod.DELETE)
    public void delete(@PathVariable String id) {
        DeletedMess deleted = new DeletedMess(id, "delete");
        this.template.convertAndSend("/topic/mess", deleted.toString());
        System.out.println(deleted.toString());
        messageReposit.deleteById(id);

    }
}
