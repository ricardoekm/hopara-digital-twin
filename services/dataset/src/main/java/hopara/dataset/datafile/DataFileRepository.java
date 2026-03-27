package hopara.dataset.datafile;

public interface DataFileRepository {
    public void save(DataFile dataFile);
    public void delete(DataFile dataFile);
    public DataFile findByName(String name, DataFilePath path);
    public DataFiles list(DataFilePath path);
    public FileContent getContent(DataFile dataFile);
}