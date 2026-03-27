package hopara.dataset.web;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;

import hopara.dataset.web.security.JwtService;

@Component
public class TenantService {
    @Autowired
    JwtService jwtService;

    @Value("${env:notSet}")
    private String env;

    @Value("${auth.enabled:true}")
    Boolean authEnabled;

    private static final String DEFAULT_TENANT = "hopara.io";
    private static final ThreadLocal<String> tenantNameMap =  new ThreadLocal<String>();

    private String getCurrentTenant() {
        return tenantNameMap.get();
    }

    public void setCurrentTenant(String tenant) {
        tenantNameMap.set(tenant);
    }

    @SuppressWarnings("unchecked")
    private List<String> getUserTenants() {
        var tenants = (List<String>) jwtService.getClaim("tenants");
        if (tenants == null) {
            return new ArrayList<String>();
        }

        return tenants;
    }

    public static String sanitize(String string) {
        var sanitizedName = string.replaceAll("[\\W]", "_");
        if ( !StringUtils.hasText(sanitizedName) ) {
            throw new IllegalArgumentException("Empty string");
        }

        if ( Character.isDigit(sanitizedName.charAt(0) ) ) {
            return "a_" + sanitizedName;
        }

        return sanitizedName.toLowerCase();
    }

    public String getRawTenant() {
        if ( authEnabled == false ) {
            return DEFAULT_TENANT;
        }

        String tenantHeader = getCurrentTenant();
        if (tenantHeader == null) {
            if ( getUserTenants().size() > 0 ) {
                return getUserTenants().get(0);
            }

            if ( env.equals("dev") ) {
                return DEFAULT_TENANT;
            }
            
            throw new SecurityException("No tenant provided");
        }
        if (jwtService.getBooleanClaim("super_user") || getUserTenants().contains(tenantHeader)) {
            return tenantHeader;
        }
        throw new SecurityException("User doesnt belong to the requested tenant");
    }

    public String getTenant() {
        return sanitize(getRawTenant());
    }

    public String prefix(String string) {
        return getTenant() + "." + string;
    }
}
