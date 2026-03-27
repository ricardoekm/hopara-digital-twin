package hopara.dataset.web.datasource;

import java.io.IOException;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import hopara.dataset.datasource.DataSourceRepository;

@Component
public class DataSourceFilter implements Filter {

    @Autowired
    DataSourceRepository dataSourceRepository;

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
        dataSourceRepository.setCurrentName(request.getParameter("dataSource"));

        chain.doFilter(request, response);
    }    
}
