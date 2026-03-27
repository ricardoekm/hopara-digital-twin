package hopara.dataset.bean;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.web.client.RestTemplate;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.impl.io.PoolingHttpClientConnectionManager;
import org.apache.hc.core5.http.io.SocketConfig;
import org.apache.hc.core5.util.Timeout;

@Configuration
public class RestTemplateFactory {

	@Value("${httpConnectionTimeout:5000}")
	private int connectionTimeout;
	
	@Value("${httpReadTimeout:5000}")
	private int readTimeout;
	
	@Value("${httpMaxConnectionsPerHost:50}")
	private int maxConnectionsPerHost;
	
	@Value("${httpMaxConnectionsTotal:100}")
	private int maxConnectionsTotal;

	@Bean
	public RestTemplate restTemplate() {
        HttpComponentsClientHttpRequestFactory factory = new HttpComponentsClientHttpRequestFactory();
        factory.setHttpClient(getHttpClient());
		factory.setConnectTimeout(connectionTimeout);
		return new RestTemplate(factory);
	}

	private CloseableHttpClient getHttpClient() {
		var socketConfigBuilder = SocketConfig.custom();
		socketConfigBuilder.setSoTimeout(Timeout.ofMilliseconds(readTimeout))
						   .setSoKeepAlive(true);

		var poolManager = new PoolingHttpClientConnectionManager();
		poolManager.setDefaultMaxPerRoute(maxConnectionsPerHost);
		poolManager.setMaxTotal(maxConnectionsTotal);
		poolManager.setDefaultSocketConfig(socketConfigBuilder.build());

		return HttpClients.custom().setConnectionManager(poolManager).build();
	}
}

