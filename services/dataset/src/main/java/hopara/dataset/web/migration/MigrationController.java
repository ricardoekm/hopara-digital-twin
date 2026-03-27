package hopara.dataset.web.migration;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RestController;

import hopara.dataset.migration.MigrationService;
import hopara.dataset.web.Response;
import hopara.dataset.web.TenantService;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden
public class MigrationController {
    @Autowired
    MigrationService migrationService;

    @PutMapping("migrate/{schemaName}")
    public Response migrate(@PathVariable("schemaName") String schemaName) throws Exception {
        migrationService.migrate(TenantService.sanitize(schemaName), TenantService.sanitize(schemaName));

        return new Response(true, "Migration successfully executed!");        
    }   
}
