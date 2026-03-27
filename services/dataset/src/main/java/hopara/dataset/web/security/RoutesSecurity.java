package hopara.dataset.web.security;

import java.util.ArrayList;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityCustomizer;
import org.springframework.security.config.Customizer;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;

@Configuration
public class RoutesSecurity {	
    @Value("${auth.enabled:true}")
    Boolean authEnabled;

    @Value("${allowOrigins:#{null}}")
    String allowOrigins;

    private CorsConfiguration getCorsConfiguration() {
        var corsConfiguration = new CorsConfiguration();
        corsConfiguration.applyPermitDefaultValues();
        corsConfiguration.setAllowCredentials(true);
        corsConfiguration.addAllowedMethod(HttpMethod.PUT);
        corsConfiguration.addAllowedMethod(HttpMethod.DELETE);

        var allowedOriginPatterns = new ArrayList<String>();
        allowedOriginPatterns.add("http://localhost*");
        allowedOriginPatterns.add("http://192.168*");    
        allowedOriginPatterns.add("null"); // for power BI plugin                       
    
        if ( allowOrigins != null ) {
            for ( var origin : allowOrigins.split(",") ) {
                allowedOriginPatterns.add(origin.trim());
            }
        }

        corsConfiguration.setAllowedOriginPatterns(allowedOriginPatterns);
        
        return corsConfiguration;
    }

    @Bean
    public WebSecurityCustomizer webSecurityCustomizer() {
        return (web) -> web.ignoring().requestMatchers("/health");
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        if ( authEnabled == false ) {
            // disable csrf
            return http.authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
                       .csrf(csrf -> csrf.disable())
                       .cors(cors -> cors.configurationSource(_ -> getCorsConfiguration()))
                       .headers(headers -> headers.cacheControl().disable())
                       .build();
        }

        http
            .authorizeHttpRequests(authorize -> authorize
                .requestMatchers(HttpMethod.GET, "/health").permitAll()     
                .requestMatchers(HttpMethod.GET, "/ping").permitAll()     
                .requestMatchers(HttpMethod.GET, "/swagger-ui*").permitAll()  
                .requestMatchers(HttpMethod.GET, "/swagger-ui/**").permitAll()  
                .requestMatchers(HttpMethod.GET, "/v3/api-docs/**").permitAll()                 
                .requestMatchers(HttpMethod.PUT, "/migrate/**").hasAuthority("SCOPE_tenant:admin")                         
                .requestMatchers(HttpMethod.GET, "/table/**").hasAuthority("SCOPE_row:read")
                .requestMatchers(HttpMethod.POST, "/table/**/row/**").hasAuthority("SCOPE_row:write")
                .requestMatchers(HttpMethod.POST, "/asset-place/**").hasAuthority("SCOPE_row:write")
                .requestMatchers(HttpMethod.GET, "/view/**").hasAuthority("SCOPE_row:read")
                .requestMatchers(HttpMethod.PUT, "/view/**/rollback").hasAuthority("SCOPE_row:write")
                .requestMatchers(HttpMethod.POST, "/view/**/row/**").hasAuthority("SCOPE_row:write")  
                .requestMatchers(HttpMethod.DELETE, "/view/**/row/**").hasAuthority("SCOPE_row:write")  
                .requestMatchers(HttpMethod.GET, "/floor/**").hasAuthority("SCOPE_row:read")  
                .requestMatchers(HttpMethod.POST, "/floor/**").hasAuthority("SCOPE_row:write")  
                .requestMatchers(HttpMethod.POST, "/clear-cache/**").hasAuthority("SCOPE_table:write")                         
                .requestMatchers(HttpMethod.POST, "/script/**").hasAuthority("SCOPE_table:write")                    
                .requestMatchers(HttpMethod.POST, "/template-resource/**").hasAuthority("SCOPE_table:write")                    
                .requestMatchers(HttpMethod.POST, "/view/**").hasAuthority("SCOPE_view:write")
                .requestMatchers(HttpMethod.POST, "/query/**").hasAuthority("SCOPE_view:write")
                .requestMatchers(HttpMethod.POST, "/validate-query/**").hasAuthority("SCOPE_view:write")
                .requestMatchers(HttpMethod.POST, "/query-metadata/**").hasAuthority("SCOPE_view:write")
                .requestMatchers(HttpMethod.DELETE, "/view/**").hasAuthority("SCOPE_view:write")  
                .requestMatchers(HttpMethod.GET, "/data-source/**/data-file").hasAuthority("SCOPE_row:read")                            
                .requestMatchers(HttpMethod.POST, "/data-source/**/data-file").hasAuthority("SCOPE_row:write")  
                .requestMatchers(HttpMethod.GET, "/entity-table/**").hasAuthority("SCOPE_row:read")  
                .requestMatchers(HttpMethod.POST, "/entity-table/**").hasAuthority("SCOPE_table:write")   
                .requestMatchers(HttpMethod.DELETE, "/entity-table/**").hasAuthority("SCOPE_table:write")                                                                                              
                .requestMatchers(HttpMethod.POST, "/data-source/**").hasAuthority("SCOPE_data-source:write")      
                .requestMatchers(HttpMethod.PUT, "/data-source/**").hasAuthority("SCOPE_data-source:write")   
                .requestMatchers(HttpMethod.POST, "/clone-data-source/**").hasAuthority("SCOPE_data-source:write")         
                .requestMatchers(HttpMethod.DELETE, "/data-source").hasAuthority("SCOPE_data-source:write")                 
                .requestMatchers(HttpMethod.DELETE, "/data-source/**").hasAuthority("SCOPE_data-source:write")   
                .requestMatchers(HttpMethod.GET, "/data-source/**").hasAuthority("SCOPE_data-source:read")     
                .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()
                .requestMatchers("/error").permitAll()
                .anyRequest().denyAll()
            )
            .cors(cors -> cors.configurationSource(_ -> getCorsConfiguration()))
            .oauth2ResourceServer(oauth2 -> oauth2.jwt(Customizer.withDefaults()));

        http.headers(headers -> headers.cacheControl().disable());
        
        return http.build();
    }
}