import io
import logging
import xml.etree.ElementTree as eT
from typing import Any, Tuple, cast

import PyPDF2
from PIL import Image, ImageOps
from pillow_heif import register_heif_opener

from common.errors import UnsupportedFileError

# Register HEIF opener so that Pillow can open HEIC/HEIF files
register_heif_opener()
logging.getLogger("PyPDF2").setLevel(logging.ERROR)


def get_svg_width_and_height(buffer: bytes) -> Tuple[int, int]:
    tree = eT.ElementTree(eT.fromstring(buffer.decode('utf-8')))
    root = cast(Any, tree.getroot())
    width = cast(Any, root.get('width', '').replace('px', ''))
    height = cast(Any, root.get('height', '').replace('px', ''))
    if not width or not height:
        view_box = root.get('viewBox')
        if view_box:
            _, _, width, height = view_box.split(' ')
    return int(float(width)), int(float(height))


def get_image_width_and_height(buffer: bytes) -> Tuple[int, int]:
    with Image.open(io.BytesIO(buffer)) as img:
        transposed_img: Any = ImageOps.exif_transpose(img)
        width, height = transposed_img.size
        return width, height


def get_pdf_width_and_height(buffer: bytes) -> Tuple[int, int]:
    pdf_reader = PyPDF2.PdfReader(io.BytesIO(buffer))
    pdf_page = pdf_reader.pages[0]
    w, h = pdf_page.mediabox.width, pdf_page.mediabox.height
    # se o documento ta rotacionado vamos inverter
    if pdf_page.rotation in [90, 270]:
        w, h = h, w
    return int(w), int(h)


def get_width_and_height(buffer: bytes, extension: str) -> Tuple[int, int]:
    try:
        if extension == 'pdf':
            return get_pdf_width_and_height(buffer)
        elif extension == 'svg':
            return get_svg_width_and_height(buffer)
        return get_image_width_and_height(buffer)
    except Exception as error:
        raise UnsupportedFileError(error.args[0])
