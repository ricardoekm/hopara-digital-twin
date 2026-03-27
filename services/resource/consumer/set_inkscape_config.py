import os
import xml.etree.ElementTree as eT


def update_preferences(file_path, xpath, key, value):
    tree = eT.parse(file_path)
    root = tree.getroot()
    for group in root.findall(xpath):
        group.set(key, value)
    tree.write(file_path)


if __name__ == '__main__':
    update_preferences(os.path.expanduser('~/.config/inkscape/preferences.xml'),
                       './/group[@id="options"]/group[@id="transform"]',
                       'stroke', '1')
    update_preferences(os.path.expanduser('~/.config/inkscape/preferences.xml'),
                       './/group[@id="dialogs"]/group[@id="import"]',
                       'ask', '0')
    update_preferences(os.path.expanduser('~/.config/inkscape/preferences.xml'),
                       './/group[@id="dialogs"]/group[@id="import"]',
                       'ask_svg', '0')
