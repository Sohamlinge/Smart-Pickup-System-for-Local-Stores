package com.eurekaserver;

import java.util.Arrays;

import org.springframework.cloud.gateway.route.RouteLocator;
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.reactive.CorsWebFilter;
import org.springframework.web.cors.reactive.UrlBasedCorsConfigurationSource;

@Configuration
public class ReouteHelper {
	
	@Bean
	CorsWebFilter corsWebFilter() {
	    UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
	    CorsConfiguration config = new CorsConfiguration();
	    
	    config.setAllowCredentials(true);
	    config.setAllowedOrigins(Arrays.asList("http://localhost:5173")); // Ensure it matches your frontend URL
	    config.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
	    config.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
	    config.setExposedHeaders(Arrays.asList("Authorization")); // Expose headers if needed
	    
	    source.registerCorsConfiguration("/**", config);

	    return new CorsWebFilter(source);
	}

	
	
	
	@Bean
	public RouteLocator customRouteLocator(RouteLocatorBuilder builder) {
		return builder.routes()
				.route("LoginRegistrationProject",r->r.path("/auth/**")
//					.uri("http://localhost:8081"))
					  .uri("lb://LoginRegistrationProject"))
				.route("Admin",r->r.path("/admin/**")
					.uri("http://localhost:7105"))
//				    .uri("lb://Admin"))
				.route("CustomerApp",r->r.path("/customer/**")
						.uri("http://localhost:7106"))
//						.uri("lb://CustomerApp"))
				.route("SHOPKEEPERBACKEND",r->r.path("/shopkeeper/**")
						.uri("http://localhost:8082"))
//						.uri("lb://SHOPKEEPERBACKEND"))
				.build();
		
	}

}
