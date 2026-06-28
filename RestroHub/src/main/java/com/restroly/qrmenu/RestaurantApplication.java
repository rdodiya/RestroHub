package com.restroly.qrmenu;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.domain.EntityScan;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;
import org.springframework.context.annotation.ComponentScan;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@ComponentScan(basePackages = "com.restroly.qrmenu")
@EnableJpaRepositories(basePackages = "com.restroly.qrmenu")
@EntityScan(basePackages = "com.restroly.qrmenu")
@EnableAsync
public class RestaurantApplication extends SpringBootServletInitializer {

	public static void main(String[] args) {
		SpringApplication.run(RestaurantApplication.class, args);
	}

}
