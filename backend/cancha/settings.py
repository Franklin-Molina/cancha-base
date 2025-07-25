"""
Django settings for cancha project.

Generated by 'django-admin startproject' using Django 5.2.

For more information on this file, see
https://docs.djangoproject.com/en/5.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/5.2/ref/settings/
"""

from pathlib import Path
import os
from dotenv import load_dotenv # Importar load_dotenv

# Cargar variables de entorno desde .env

BASE_DIR = Path(__file__).resolve().parent.parent
dotenv_path = BASE_DIR / '.env'
load_dotenv(dotenv_path)


# Imprimir para depuración


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/5.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')



# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = os.getenv('DEBUG', 'False').lower() == 'true' # Convertir a booleano

ALLOWED_HOSTS = os.getenv('ALLOWED_HOSTS').split(',') # Convertir a lista


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sites', # Añadir la app sites
    'rest_framework',
    'rest_framework_simplejwt',
    'rest_framework.authtoken', # Añadir rest_framework.authtoken

    # Añadir corsheaders
    'corsheaders',

    # Apps de django-allauth
    'allauth',
    'allauth.account',
    'allauth.socialaccount',
    'allauth.socialaccount.providers.google', # Proveedor de Google

    # Mis Apps (asegúrate de que estén aquí si no lo están ya)
    'users',
    'courts',
    'bookings',
    'payments',
    'plans',
    'matches',
    'django_filters', # Añadir django_filters
]

REST_FRAMEWORK = {
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_simplejwt.authentication.JWTAuthentication',
    )
}

MIDDLEWARE = [
    # Añadir CorsMiddleware     
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware', ###  
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'allauth.account.middleware.AccountMiddleware',
    # Middleware de django-allauth (añadir después de AuthenticationMiddleware)
    # 'allauth.account.middleware.AccountMiddleware', # Este middleware no existe en allauth 0.54.0
]

ROOT_URLCONF = 'cancha.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'cancha.wsgi.application'

# Modelo de Usuario Personalizado
AUTH_USER_MODEL = 'users.User'

# Configuración de django-allauth
AUTHENTICATION_BACKENDS = [
    # Needed to login by username in Django admin, regardless of `allauth`
    'django.contrib.auth.backends.ModelBackend',

    # `allauth` specific authentication methods, such as login by email
    'allauth.account.auth_backends.AuthenticationBackend',
]

SITE_ID = int(os.getenv('SITE_ID', 1)) # django-allauth requiere un SITE_ID

# Configuraciones adicionales de allauth (ajustar según necesidad)
ACCOUNT_EMAIL_VERIFICATION = os.getenv('ACCOUNT_EMAIL_VERIFICATION', 'optional') # Puede ser 'mandatory', 'optional', o 'none'
ACCOUNT_SIGNUP_FIELDS = ['username', 'email', 'password', 'first_name', 'last_name'] # Campos requeridos para el registro
ACCOUNT_AUTHENTICATION_METHOD = os.getenv('ACCOUNT_AUTHENTICATION_METHOD', 'username') # Usar username como método de autenticación principal para allauth 0.54.0
ACCOUNT_USERNAME_REQUIRED = True # Requerido para allauth 0.54.0
ACCOUNT_USER_MODEL_USERNAME_FIELD = 'username' # Especificar el campo de username del modelo de usuario
LOGIN_REDIRECT_URL = os.getenv('LOGIN_REDIRECT_URL', '/') # URL a la que redirigir después del login
LOGOUT_REDIRECT_URL = os.getenv('LOGOUT_REDIRECT_URL', '/') # URL a la que redirigir después del logout

# Configuración de dj-rest-auth para usar JWT y allauth
REST_AUTH = {
    'USE_JWT': True,
}

# Configuración de socialaccount para auto-registro
SOCIALACCOUNT_AUTO_SIGNUP = True

# Configuración del proveedor social (Google en este caso)
SOCIALACCOUNT_PROVIDERS = {
    'google': {
        # For each OAuth based provider, either add a ``SocialApp``
        # (``socialaccount`` app) containing the required client
        # credentials, or list them here:
        'APP': {
            'client_id': os.getenv('GOOGLE_CLIENT_ID'),
            'secret': os.getenv('GOOGLE_CLIENT_SECRET'),
            'key': '' # No se usa generalmente para Google OAuth2
        },
        'SCOPE': [
            'profile',
            'email',
        ],
        'AUTH_PARAMS': {
            'access_type': 'online',
        }
    }
}


# Database
# https://docs.djangoproject.com/en/5.2/ref/settings/#databases

DATABASES = {
    'default': {
        'ENGINE': os.getenv('DB_ENGINE',),
        'NAME': os.getenv('DB_NAME', ),
        'USER': os.getenv('DB_USER',),
        'PASSWORD': os.getenv('DB_PASSWORD'),
        'HOST': os.getenv('DB_HOST'),
        'PORT': os.getenv('DB_PORT'),
    }
}


# Password validation
# https://docs.djangoproject.com/en/5.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]

# Configuración de Password Hashers
# Se prioriza Argon2, con fallback a los otros para contraseñas existentes.
PASSWORD_HASHERS = [
    'django.contrib.auth.hashers.Argon2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2PasswordHasher',
    'django.contrib.auth.hashers.PBKDF2SHA1PasswordHasher',
    'django.contrib.auth.hashers.BCryptSHA256PasswordHasher',
    'django.contrib.auth.hashers.ScryptPasswordHasher',
]


# Internationalization
# https://docs.djangoproject.com/en/5.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = os.getenv('TIME_ZONE') # Cambiar a la zona horaria local

USE_I18N = True

USE_TZ = True


import os # Importar os

# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = os.getenv('STATIC_URL', 'static/')

# Configuración para archivos multimedia (imágenes subidas por usuarios)
MEDIA_URL = os.getenv('MEDIA_URL', '/media/')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media') # Directorio donde se guardarán los archivos subidos


# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = os.getenv('DEFAULT_AUTO_FIELD',)

# Configuración de Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
        },
    },
    'root': {
        'handlers': ['console'],
        'level': os.getenv('LOGGING_ROOT_LEVEL', 'INFO'),
    },
    'loggers': {
        'django': {
            'handlers': ['console'],
            'level': os.getenv('LOGGING_DJANGO_LEVEL', 'INFO'),
            'propagate': False,
        },
        'users': { # Añadir logger para la app users
            'handlers': ['console'],
            'level': os.getenv('LOGGING_USERS_LEVEL', 'DEBUG'), # Usar DEBUG para ver logs más detallados
            'propagate': False,
        },
    },
}


# Configuración de Simple JWT para usar username como campo de autenticación
SIMPLE_JWT = {
    "USERNAME_FIELD": os.getenv('SIMPLE_JWT_USERNAME_FIELD'),
}

# Configuración de CORS para permitir solicitudes desde el frontend durante el desarrollo
CORS_ALLOW_ALL_ORIGINS = os.getenv('CORS_ALLOW_ALL_ORIGINS', 'False').lower() == 'true' # Deshabilitar para especificar orígenes permitidos
CORS_ALLOWED_ORIGINS = os.getenv('CORS_ALLOWED_ORIGINS',).split(',') # Convertir a lista

CORS_ALLOW_CREDENTIALS = True # Permitir que las solicitudes incluyan credenciales

# Configuración de CSRF para confiar en el origen del frontend
CSRF_TRUSTED_ORIGINS = os.getenv('CSRF_TRUSTED_ORIGINS').split(',') # Convertir a lista
