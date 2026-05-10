package com.restroly.qrmenu.api;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController()
@RequestMapping("/api")
public class HomeContrroller {

	@GetMapping("/home")
	public String home() {
		return "Welcome To Home Page!!!";
	}
	
	@GetMapping("/public")
	public String publicAPI() {
		return "Public Space!!!";
	}
}
