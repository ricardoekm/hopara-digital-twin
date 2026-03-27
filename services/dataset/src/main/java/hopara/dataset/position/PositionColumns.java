package hopara.dataset.position;

public class PositionColumns {
    public static String PRIMARY_KEY_COLUMN_NAME = "id";
    public static String FLOOR_COLUMN_NAME = "floor";

    public static String POINT_2D_COLUMN_NAME = "point_2d";
    public static String POINT_3D_COLUMN_NAME = "point_3d";
    public static String LINE_COLUMN_NAME = "line";
    public static String POLYGON_COLUMN_NAME = "polygon";
    public static String RECTANGLE_COLUMN_NAME = "rectangle";
    public static String SCOPE_COLUMN_NAME = "hopara_scope"; // prefix to avoid dimension conflict when filtering
    public static String TENANT_COLUMN_NAME = "tenantId";

    public static String SIZE = "hopara_size";
    public static String SIZE_REFERENCE_ZOOM = "hopara_size_reference_zoom";

    public static String COLOR = "hopara_color";
    public static String SCALE = "hopara_scale";
    public static String VIEW = "hopara_view";    

    public static String Z_INDEX = "hopara_z_index";    
}
