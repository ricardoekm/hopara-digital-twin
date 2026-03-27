package hopara.dataset;

import java.util.ArrayList;
import java.util.HashMap;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.server.resource.authentication.JwtAuthenticationToken;
import org.springframework.test.context.ContextConfiguration;
import org.springframework.test.context.TestPropertySource;
import org.springframework.transaction.annotation.Transactional;

import hopara.dataset.column.ColumnRepository;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.table.TableRepository;
import hopara.dataset.view.ViewRepository;

@SpringBootTest
@ContextConfiguration(classes= {Application.class,TransactionManagerFactory.class})
@TestPropertySource("/test.properties")
@Transactional("composedTransactionManager")
public class IntegrationTest {

    @Autowired
    ViewRepository viewRepository;

    @Autowired
    TableRepository tableRepository;
    
    @Autowired
    ColumnRepository columnRepository;

	@Autowired
	DataSourceRepository dataSourceRepository;
    
    @BeforeEach
    public void deleteTestObjects() {
        // Transactions arent working so well on SingleStore
        viewRepository.deleteAll("test_");
        columnRepository.deleteAll("test_");   
    }

	@BeforeAll
	public static void setCurrentDs() {
		DataSourceRepository.setDefaultName("hopara");
	}

	protected String getTestDataSource() {
		return "hopara";
	}

	@BeforeAll
	public static void setToken() {
		var claims = new HashMap<String,Object>();
		
		var tenants = new ArrayList<String>();
		tenants.add("hopara.io");		
		claims.put("tenants", tenants);
		
		var headers = new HashMap<String,Object>();
		headers.put("any", "header");
		
		var jwt = new Jwt("legal",null,null,headers,claims);
		var jwtAuthentication = new JwtAuthenticationToken(jwt);
		
		SecurityContextHolder.getContext().setAuthentication(jwtAuthentication);
	}
}
