package hopara.dataset.web.table;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import hopara.dataset.table.Table;
import hopara.dataset.table.TableKey;
import hopara.dataset.table.TableService;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden
public class TableController {
	@Autowired
	TableService tableService;
	
	@GetMapping("table/{tableName}")
	public Table getTable(@PathVariable("tableName") String tableName,
						  @RequestParam(value="dataSource") String dataSourceName) throws Exception {
		return tableService.find(new TableKey(dataSourceName,tableName));		
	}
}
