package hopara.dataset.datafile.s3;

import org.springframework.beans.factory.annotation.Autowired;

import hopara.dataset.NotFoundException;
import hopara.dataset.datafile.DataFile;
import hopara.dataset.datafile.DataFilePath;
import hopara.dataset.datafile.DataFileRepository;
import hopara.dataset.datafile.DataFiles;
import hopara.dataset.datafile.FileContent;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.DeleteObjectRequest;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsRequest;
import software.amazon.awssdk.services.s3.model.ListObjectsResponse;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.model.S3Object;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.model.HeadObjectRequest;
import software.amazon.awssdk.services.s3.model.NoSuchKeyException;
import org.springframework.util.StringUtils;

public class S3DataFileRepository implements DataFileRepository {

    @Autowired
    private S3Client s3Client;

    private DataFile findSameNameWithAnotherExtension(DataFile dataFile) {
        var files = list(dataFile.getPath());
        for ( var file : files ) {
            if ( file.hasSameName(dataFile.getName()) && !file.hasExtension(dataFile.getExtension()) ) {
                return file;
            }
        }
        
        return null;
    }

    public void save(DataFile dataFile) {              
        var request = PutObjectRequest.builder()
                                      .bucket(dataFile.getBaseDir())
                                      .key(dataFile.getRelativeFilePath())
                                      .contentType(dataFile.getMimeType())
                                      .contentLength(dataFile.getFileSize())
                                      .build();

        s3Client.putObject(request, RequestBody.fromInputStream(dataFile.getInputStream(), dataFile.getFileSize()));  
        
        // We only allow one file per name
        var duplicateFile = findSameNameWithAnotherExtension(dataFile);
        if ( duplicateFile != null ) {
            var deleteRequest = DeleteObjectRequest.builder()
                                                   .bucket(duplicateFile.getBaseDir())
                                                   .key(duplicateFile.getRelativeFilePath())
                                                   .build();
            
            s3Client.deleteObject(deleteRequest);
        }
    }  

    private Boolean exists(DataFile dataFile) {
        try {
            var headRequest = HeadObjectRequest.builder()
                                              .bucket(dataFile.getBaseDir())
                                              .key(dataFile.getRelativeFilePath())
                                              .build();
            s3Client.headObject(headRequest);
            return true;
        } catch (NoSuchKeyException e) {
            return false;
        }
    }

    public void delete(DataFile dataFile) {
        if ( !exists(dataFile) ) {
            throw new NotFoundException(dataFile.getName());
        }

        var deleteRequest = DeleteObjectRequest.builder()
                                               .bucket(dataFile.getBaseDir())
                                               .key(dataFile.getRelativeFilePath())
                                               .build();
        s3Client.deleteObject(deleteRequest);
    }

    private DataFile createDataFile(DataFilePath dataFilePath, S3Object s3Object) {
        String key = s3Object.key();
        String fileName = key.substring(key.lastIndexOf("/") + 1);
        return new DataFile(fileName, dataFilePath);
    }

    public DataFile findByName(String name, DataFilePath path) {
        var dataFile = list(path).findByName(name);
        if ( dataFile == null ) {
            throw new NotFoundException(name);
        }

        return dataFile;
    }

    private ListObjectsResponse doListObjects(DataFilePath path, String marker) {
        var request = ListObjectsRequest.builder()
                                        .bucket(path.getBaseDir())
                                        .prefix(path.getRelativeDir());
        if ( StringUtils.hasText(marker) ) {
            request = request.marker(marker);
        }

        return s3Client.listObjects(request.build());
    }

    public DataFiles list(DataFilePath path) {
        var dataFiles = new DataFiles();
        ListObjectsResponse objects = doListObjects(path, null);
        
        do {
            for (var objectSummary : objects.contents()) {
                var dataFile = createDataFile(path, objectSummary);
                dataFiles.add(dataFile);
            }
                   
            if (objects.isTruncated()) {
                objects = doListObjects(path, objects.nextMarker());
            } else {
                break;
            }
        } while (true);

        return dataFiles;
    }

    public FileContent getContent(DataFile dataFile) {
        var request = GetObjectRequest.builder()
                                      .bucket(dataFile.getBaseDir())
                                      .key(dataFile.getRelativeFilePath())
                                      .build();
        var response = s3Client.getObject(request);
        return new FileContent(response, response.response().contentType());
    }
}