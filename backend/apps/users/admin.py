from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

# Registramos el modelo de forma simple para evitar el error de Python 3.14
admin.site.register(User)
