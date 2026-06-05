import os
import django

def super_patch():
    path = os.path.join(os.path.dirname(django.__file__), 'template', 'context.py')
    
    with open(path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 1. Insertar el import necesario al principio del archivo
    if "import copy\n" not in lines:
        lines.insert(0, "import copy\n")
    
    content = "".join(lines)

    # 2. Corregir el error de la línea 39 (AttributeError)
    content = content.replace('duplicate.dicts = self.dicts[:]', 'setattr(duplicate, "dicts", self.dicts[:])')
    
    # 3. Corregir el error de la línea 159 (TypeError)
    # Buscamos la forma rota y la cambiamos por la forma compatible con Python 3.14
    content = content.replace('duplicate = super().__copy__()', 'duplicate = copy.copy(super())')

    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("🚀 Motor Django reconstruido y compatible con Python 3.14")

if __name__ == "__main__":
    super_patch()
