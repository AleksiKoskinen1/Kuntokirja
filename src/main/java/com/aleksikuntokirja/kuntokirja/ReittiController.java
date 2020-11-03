package com.aleksikuntokirja.kuntokirja;


import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller 
public class ReittiController {
	
	@RequestMapping(value = "/") //reittien root
	public String index() {
		return "index"; 
	}
	
	@RequestMapping(value = "/idle") //reittien root
	public String idle() {
		return "idlecheck"; 
	}
	
}
