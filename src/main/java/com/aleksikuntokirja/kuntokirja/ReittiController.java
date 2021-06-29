package com.aleksikuntokirja.kuntokirja;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;

@SuppressWarnings("unchecked")
@Controller
public class ReittiController {
	
	private static final String MY_SESSION_USER_ID = "userid";
    
	/*@RequestMapping(value = "/") //reittien root
	public String index() {
		return "index"; 
	}*/
	
    @GetMapping(value = "/")
    public String home(final Model model, final HttpSession session) {
        final List<String> id = (List<String>) session.getAttribute(MY_SESSION_USER_ID);
        
        if( !CollectionUtils.isEmpty(id)) {
        	System.out.println(id.toString());
        	
        	return "index";
        }
        else return "index";      // Ei sessiota, laitetaan aloitussivu.
    }

    
    
	
	@RequestMapping(value = "/idle") //reittien root
	public String idle() {
		return "idlecheck"; 
	}
	
}
