package hopara.dataset.web;

import com.fasterxml.jackson.databind.ObjectMapper;

import hopara.dataset.datasource.DataSource;
import hopara.dataset.datasource.DataSourceRepository;
import hopara.dataset.filter.FilterFactory;

public class ObjectMother {
    public static DataSourceRepository getDataSourceRepositoryStub() {
		return new DataSourceRepository() {
			public DataSource getCurrent() {
				return new DataSource();
			}
		};
	}

	public static FilterFactory getFilterFactory() {
		return new FilterFactory(new ObjectMapper(), getDataSourceRepositoryStub());
	}
}
