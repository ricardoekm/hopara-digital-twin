package hopara.dataset.bean;

import org.apache.tomcat.util.buf.EncodedSolidusHandling;
import org.duckdb.DuckDBArray;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer;
import org.springframework.boot.web.embedded.tomcat.TomcatServletWebServerFactory;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.annotation.EnableAsync;
import org.springframework.security.web.firewall.HttpFirewall;
import org.springframework.security.web.firewall.StrictHttpFirewall;
import org.springframework.web.filter.ShallowEtagHeaderFilter;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.module.SimpleModule;
import com.fasterxml.jackson.databind.ser.std.StdDelegatingSerializer;

import hopara.dataset.datafile.DataFileRepository;
import hopara.dataset.datafile.DataFileTableRepository;
import hopara.dataset.datafile.fs.FSDataFileRepository;
import hopara.dataset.datafile.fs.FSDataFileTableRepository;
import hopara.dataset.datafile.s3.S3DataFileRepository;
import hopara.dataset.datafile.s3.S3DataFileTableRepository;
import hopara.dataset.datasource.password.DatabasePasswordRepository;
import hopara.dataset.datasource.password.EnvPasswordRepository;
import hopara.dataset.datasource.password.PasswordRepository;
import hopara.dataset.datasource.password.SecretsManagerPasswordRepository;
import hopara.dataset.row.converter.PostgresJsonConverter;

import jakarta.servlet.Filter;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;

@Configuration
@EnableAsync
public class BeanFactory {
    @Value("${defaultFetchLimit:25000}")    
    private Integer defaultFetchLimit;

	@Value("${templateEndpoint:#{null}}")
	String templateEndpoint;

	@Value("${datasetEndpoint:#{null}}")
	String datasetEndpoint;

	@Value("${query.resource.timeout:#{null}}")
	String temp;

	@Value("${dataSource.passwordStrategy:#{null}}")
	String passwordStrategy;

	@Value("${dataFiles.storage:#{null}}")
	String dataFilesStorage;
    
	@Bean
	public DataFileTableRepository dataFileTableRepository() {
		if ( "fs".equals(dataFilesStorage) ) {
			return new FSDataFileTableRepository();
		}
		
		return new S3DataFileTableRepository();
	}

	@Bean
	public DataFileRepository dataFileRepository() {
		if ( "fs".equals(dataFilesStorage) ) {
			return new FSDataFileRepository();
		}
		
		return new S3DataFileRepository();
	}

	@Bean
	public SimpleModule customTypesModule() {
		var module = new SimpleModule();
		module.addSerializer(DuckDBArray.class, new StdDelegatingSerializer(new SqlArrayConverter()));
		return module;
	}

	@Bean
	public Jackson2ObjectMapperBuilderCustomizer jsonCustomizer() {
	    return builder -> builder.serializationInclusion(JsonInclude.Include.NON_NULL);
	}

	@Bean
	public PostgresJsonConverter postgresJsonConverter() {
		return new PostgresJsonConverter(new ObjectMapper());
	}
	
	@Bean
	public Integer defaultFetchLimit() {
		return defaultFetchLimit;
	}
	
	@Bean
	@Primary
	public PasswordRepository passwordRepositoryProxy() {
		return new EnvPasswordRepository();
	}

	@Bean
	public PasswordRepository passwordRepository() {
		if ( "database".equals(passwordStrategy) ) {
			return new DatabasePasswordRepository();
		}
		
		return new SecretsManagerPasswordRepository();
	}

	@Bean 
	public SecretsManagerClient secretsManagerClient() {
	    return SecretsManagerClient.builder()
	                               .region(Region.US_EAST_1)
	                               .build();
	}

	@Bean
	public Filter shallowETagHeaderFilter() {
        var etagFilter = new ShallowEtagHeaderFilter();
        etagFilter.setWriteWeakETag(true);
		return etagFilter;
	}

    @Bean public WebServerFactoryCustomizer<TomcatServletWebServerFactory> tomcatCustomizer() { 
        return factory -> factory.addConnectorCustomizers( connector -> connector.setEncodedSolidusHandling(EncodedSolidusHandling.DECODE.getValue())); 
    }

    @Bean
    public HttpFirewall allowEncodedParamsFirewall() {
        StrictHttpFirewall firewall = new StrictHttpFirewall();
        firewall.setAllowUrlEncodedSlash(true);
        firewall.setAllowBackSlash(true);
        firewall.setAllowUrlEncodedPercent(true);
        return firewall;
    }
}
