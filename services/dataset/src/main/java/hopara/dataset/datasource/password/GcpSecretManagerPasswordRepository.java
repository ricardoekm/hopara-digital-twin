package hopara.dataset.datasource.password;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.util.StringUtils;

import com.google.api.gax.rpc.AlreadyExistsException;
import com.google.api.gax.rpc.NotFoundException;
import com.google.cloud.secretmanager.v1.AccessSecretVersionRequest;
import com.google.cloud.secretmanager.v1.AddSecretVersionRequest;
import com.google.cloud.secretmanager.v1.CreateSecretRequest;
import com.google.cloud.secretmanager.v1.DeleteSecretRequest;
import com.google.cloud.secretmanager.v1.ProjectName;
import com.google.cloud.secretmanager.v1.Replication;
import com.google.cloud.secretmanager.v1.Secret;
import com.google.cloud.secretmanager.v1.SecretManagerServiceClient;
import com.google.cloud.secretmanager.v1.SecretName;
import com.google.cloud.secretmanager.v1.SecretPayload;
import com.google.cloud.secretmanager.v1.SecretVersionName;
import com.google.protobuf.ByteString;

import hopara.dataset.web.TenantService;

public class GcpSecretManagerPasswordRepository implements PasswordRepository {
    @Autowired
    SecretManagerServiceClient secretClient;

    @Autowired
    TenantService tenantService;

    @Value("${env:dev}")
    private String env;

    @Value("${gcp.projectId:#{null}}")
    private String configuredProjectId;

    private String getPasswordSecretKey(String name) {
        return "password_" + tenantService.getTenant() + "_" + name;
    }

    private String getProjectId() {
        if (StringUtils.hasText(configuredProjectId)) {
            return configuredProjectId;
        }

        throw new IllegalStateException("Missing gcp.projectId");
    }

    private String getSecretName(String name) {
        var secret = new hopara.dataset.datasource.password.Secret(getPasswordSecretKey(name));
        return SecretName.of(getProjectId(), secret.getKey(env)).toString();
    }

    public void save(String name, String password) {
        var secret = new hopara.dataset.datasource.password.Secret(getPasswordSecretKey(name), password);
        var secretId = secret.getKey(env);
        var project = ProjectName.of(getProjectId()).toString();

        try {
            var secretResource = Secret.newBuilder()
                                       .setReplication(Replication.newBuilder()
                                                                  .setAutomatic(Replication.Automatic.getDefaultInstance())
                                                                  .build())
                                       .build();

            var createRequest = CreateSecretRequest.newBuilder()
                                                   .setParent(project)
                                                   .setSecretId(secretId)
                                                   .setSecret(secretResource)
                                                   .build();

            secretClient.createSecret(createRequest);
        } catch (AlreadyExistsException ignored) {
            // Secret exists; we only need to add a new version below.
        }

        var addVersionRequest = AddSecretVersionRequest.newBuilder()
                                                       .setParent(SecretName.of(getProjectId(), secretId).toString())
                                                       .setPayload(SecretPayload.newBuilder()
                                                                                .setData(ByteString.copyFromUtf8(secret.getValue()))
                                                                                .build())
                                                       .build();

        secretClient.addSecretVersion(addVersionRequest);
    }

    public String find(String name) {
        try {
            var request = AccessSecretVersionRequest.newBuilder()
                                                    .setName(SecretVersionName.of(getProjectId(),
                                                                                  new hopara.dataset.datasource.password.Secret(getPasswordSecretKey(name)).getKey(env),
                                                                                  "latest")
                                                                              .toString())
                                                    .build();

            return secretClient.accessSecretVersion(request).getPayload().getData().toStringUtf8();
        } catch (NotFoundException e) {
            throw new SecretNotFoundException(getPasswordSecretKey(name));
        } catch (Exception e) {
            throw new RuntimeException("Error finding secret " + getSecretName(name), e);
        }
    }

    public void delete(String name) {
        var deleteRequest = DeleteSecretRequest.newBuilder()
                                               .setName(getSecretName(name))
                                               .build();

        secretClient.deleteSecret(deleteRequest);
    }
}
