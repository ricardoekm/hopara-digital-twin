import magic


def is_gltf(buffer: bytes) -> bool:
    return buffer.startswith(b'glTF')


def is_svg(buffer: bytes) -> bool:
    head = buffer[:1024].decode("utf-8", errors="ignore").lower()
    return "<svg" in head

def discover_mimetype(buffer: bytes) -> str:
    if is_gltf(buffer):
        return 'model/gltf-binary'
    if is_svg(buffer):
        return 'image/svg+xml'
    return magic.from_buffer(buffer, mime=True)

