package hopara.dataset.web;

import hopara.dataset.filter.Filters;
import hopara.dataset.web.request.StringToFiltersConverter;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.oauth2.jwt.NimbusJwtDecoder;
import org.springframework.stereotype.Component;

@Component
public class AccessTokenHandler {
    String JWT_NAMESPACE = "https://hopara.app/";

    @Autowired
    StringToFiltersConverter filterConverter;

    @Value("${spring.security.oauth2.resourceserver.jwt.jwk-set-uri}")
    private String uri;

    public Filters getFilters(String accessToken) {
        if ( accessToken == null ) {
            return new Filters();
        }
        
        var decoder = NimbusJwtDecoder.withJwkSetUri(uri);
        var jwt = decoder.build().decode(accessToken);
        var source = jwt.getClaimAsString(JWT_NAMESPACE + "filters");
        if ( source != null ) {
            return filterConverter.convert(source);
        }
        return new Filters();
    }
}
