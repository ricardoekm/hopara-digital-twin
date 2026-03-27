package hopara.dataset;

import java.io.IOException;
import java.util.Arrays;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.web.client.RestTemplate;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.info.Info;

@SpringBootApplication
@EnableCaching
@EnableScheduling
@OpenAPIDefinition(info=@Info(title="Dataset", description = "The dataset component handles the write and read of data."))
public class Application {

    private Log logger = LogFactory.getLog(Application.class);
    
	public static void main(String[] args) throws IOException {
		SpringApplication.run(Application.class, args);
	}

	@Bean	
	public RestTemplate restTemplate(RestTemplateBuilder builder) {
		return builder.build();
	}
	
	@Bean 
	public CommandLineRunner commandLineRunner(ApplicationContext context) {
		return _ -> {

            if ( logger.isDebugEnabled() ) {
                logger.debug("Beans provided by Spring:");

                String[] beanNames = context.getBeanDefinitionNames();
                Arrays.sort(beanNames);
                for (String beanName : beanNames) {
                    logger.debug(beanName);
                }
            }
		};
	}
	
}
