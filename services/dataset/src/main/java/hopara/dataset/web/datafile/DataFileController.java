package hopara.dataset.web.datafile;

import hopara.dataset.datafile.DataFile;
import hopara.dataset.datafile.DataFileService;
import hopara.dataset.datafile.DataFileServiceHelper;
import hopara.dataset.datafile.DataFiles;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.web.Response;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import io.swagger.v3.oas.annotations.Hidden;

@RestController
@Hidden()
public class DataFileController {
	@Autowired
	DataFileService dataFileService;

    @Autowired
    DataFileServiceHelper dataFileServiceHelper;

	@Autowired
    DataSourceRepository dataSourceRepository;

    @PutMapping("data-source/{dataSourceName}/data-file/{name}")
	public DataFile save(@PathVariable(value="dataSourceName") String dataSourceName,
						 @PathVariable(value="name") String name,
                         @RequestParam("file") MultipartFile multipartFile) throws Exception {  
		dataSourceRepository.setCurrentName(dataSourceName);
		var dataFile = dataFileService.save(name, multipartFile);
        dataFileServiceHelper.refreshRelatedQueries(dataFile);
        return dataFile;
	}

	@GetMapping("data-source/{dataSourceName}/data-file")
	public DataFiles list(@PathVariable(value="dataSourceName") String dataSourceName) throws Exception {  
		dataSourceRepository.setCurrentName(dataSourceName);
		return dataFileService.list();
	}

	@SuppressWarnings("rawtypes")
    @GetMapping("data-source/{dataSourceName}/data-file/{name}/content")
	public ResponseEntity getRows(@PathVariable(value="dataSourceName") String dataSourceName,
							      @PathVariable(value="name") String name) throws Exception {  

        var fileContent = dataFileService.getContent(name);

        var headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=" + name);
        headers.add(HttpHeaders.CONTENT_TYPE, fileContent.getType());

        InputStreamResource resource = new InputStreamResource(fileContent.getInputStream());
        return ResponseEntity.ok()
                             .headers(headers)
                             .body(resource);
	}

	@DeleteMapping("data-source/{dataSourceName}/data-file/{name}")
	public Response delete(@PathVariable(value="dataSourceName") String dataSourceName,
							@PathVariable(value="name") String name) throws Exception {  
		dataSourceRepository.setCurrentName(dataSourceName);
		dataFileService.delete(name);
		return new Response(true, "File deleted");		
	}
}
