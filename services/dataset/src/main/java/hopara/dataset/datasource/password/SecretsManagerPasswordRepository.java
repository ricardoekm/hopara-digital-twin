package hopara.dataset.datasource.password;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import hopara.dataset.web.TenantService;
import software.amazon.awssdk.services.secretsmanager.SecretsManagerClient;
import software.amazon.awssdk.services.secretsmanager.model.CreateSecretRequest;
import software.amazon.awssdk.services.secretsmanager.model.DeleteSecretRequest;
import software.amazon.awssdk.services.secretsmanager.model.GetSecretValueRequest;
import software.amazon.awssdk.services.secretsmanager.model.ResourceExistsException;
import software.amazon.awssdk.services.secretsmanager.model.ResourceNotFoundException;
import software.amazon.awssdk.services.secretsmanager.model.UpdateSecretRequest;

public class SecretsManagerPasswordRepository implements PasswordRepository {
    @Autowired
    SecretsManagerClient secretClient;

    @Autowired
    TenantService tenantService;
    
    @Value("${env:dev}")
    private String env;

    private String getPasswordSecretKey(String name) {
        return "password_" + tenantService.getTenant() + "_" + name;
    }

    public void save(String name, String password) {
        var secret = new Secret(getPasswordSecretKey(name),password);
        try {            
            var saveRequest = CreateSecretRequest.builder()
                                                 .name(secret.getKey(env))
                                                 .description("secret created by dataset API")
                                                 .secretString(secret.getValue())
                                                 .build();
            
            secretClient.createSecret(saveRequest);
        } catch(ResourceExistsException e) {
            var updateRequest = UpdateSecretRequest.builder()
                                                   .secretId(secret.getKey(env))
                                                   .secretString(secret.getValue())
                                                   .build();

            secretClient.updateSecret(updateRequest);
        }
    }

    public String find(String name) {
        var secretKey = getPasswordSecretKey(name);
        var secret = new Secret(secretKey);
        try {
            var valueRequest = GetSecretValueRequest.builder()
                                                    .secretId(secret.getKey(env))
                                                    .build();

            return secretClient.getSecretValue(valueRequest).secretString();
        } catch(ResourceNotFoundException e) {
            throw new SecretNotFoundException(secretKey);
        } catch(Exception e) {
            throw new RuntimeException("Error finding secret " + secret.getKey(env), e);
        }
    }

    public void delete(String name) {
        var secret = new Secret(getPasswordSecretKey(name));
        var deleteRequest = DeleteSecretRequest.builder()
                                               .secretId(secret.getKey(env))
                                               .build();

        secretClient.deleteSecret(deleteRequest);
    }  
}
