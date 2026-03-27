package hopara.dataset.web.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.security.oauth2.jwt.JwtDecoder;
import org.springframework.stereotype.Component;

@Component
public class JwtService {
	@Autowired
	JwtDecoder jwtDecoder;

	@Value("${auth.enabled:true}")
    Boolean authEnabled;

	public Jwt getJwt() {
		if ( !authEnabled ) {
			return null;
		}

		Authentication token = SecurityContextHolder.getContext().getAuthentication();
		if (token == null) {
			return null;
		}

		return (Jwt) token.getCredentials();
	}

	public Object getClaim(String key) {
		var jwt = getJwt();
		if (jwt == null) {
			return null;
		}
		return jwt.getClaim(key);
	}

	public String getStringClaim(String key) {
		var jwt = getJwt();
		if (jwt == null) {
			return "";
		}
		return jwt.getClaimAsString(key);
	}

	public Boolean getBooleanClaim(String key) {
		var jwt = getJwt();
		if (jwt == null) {
			return false;
		}
		var value = jwt.getClaimAsBoolean(key);
		if (value == null) {
			return false;
		}
		return value;
	}
}
