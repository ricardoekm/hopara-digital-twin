import cv2


def get_margin_crop_area(image, min_area_ratio=0.8):
    height, width = image.shape[:2]
    total_area = height * width

    gray_image = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    _, binary_image = cv2.threshold(gray_image, 1, 255, cv2.THRESH_BINARY)

    # Aplicar operações morfológicas para melhorar continuidade
    # kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))  # Ajuste o tamanho do kernel se necessário
    # morphed_image = cv2.morphologyEx(binary_image, cv2.MORPH_DILATE, kernel)

    borders = cv2.Canny(binary_image, 50, 150)

    contours, _ = cv2.findContours(borders, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    rectangles = []
    for contour in contours:
        x, y, w, h = cv2.boundingRect(contour)
        area = w * h
        rectangles.append((x, y, w, h, area))

    rectangles = sorted(rectangles, key=lambda r: r[4], reverse=True)
    valid_rectangles = list(filter(lambda x: x[4] > (total_area*min_area_ratio), rectangles))

    if not valid_rectangles:
        return None

    x, y, w, h, area = valid_rectangles[-1]
    crop_margin = 5
    x += crop_margin
    w -= 2*crop_margin
    h -= 2*crop_margin
    if w <= 0 or h <= 0:
        return None
    return [x, y, w, h]
