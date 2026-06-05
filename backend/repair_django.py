import os
import django

def patch_django():
    path = os.path.join(os.path.dirname(django.__file__), 'template', 'context.py')
    if not os.path.exists(path):
        print("❌ No se encontró el archivo de Django.")
        return

    with open(path, 'r', encoding='utf-8') as f:
        content = f.read()

    # Aplicar parches de compatibilidad para Python 3.14
    old_line1 = 'duplicate.dicts = self.dicts[:]'
    new_line1 = 'setattr(duplicate, "dicts", self.dicts[:])'
    
    old_line2 = 'duplicate = super().__copy__()'
    new_line2 = 'import copy; duplicate = copy.copy(super())'

    if old_line1 in content or old_line2 in content:
        content = content.replace(old_line1, new_line1)
        content = content.replace(old_line2, new_line2)
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print("✅ Motor de Django reparado con éxito.")
    else:
        print("ℹ️ El archivo ya parece estar corregido o la versión es distinta.")

if __name__ == "__main__":
    patch_django()
