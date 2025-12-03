import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = 'django-insecure-8l8o(-2su$6t%k424293i#x672q0$*^itfyi9r32$8j-igo7zf'

DEBUG = True

ALLOWED_HOSTS = []

INSTALLED_APPS = [
	'app',
    'crispy_forms',
    'crispy_bootstrap5',
	'django.contrib.auth',
	'django.contrib.admin',
	'django.contrib.sessions',
	'django.contrib.messages',
	'django.contrib.staticfiles',
	'django.contrib.contenttypes',
]

# o template usado
MIDDLEWARE = [
	'django.middleware.common.CommonMiddleware',
	'django.middleware.csrf.CsrfViewMiddleware',
	'django.middleware.security.SecurityMiddleware',
	'django.contrib.sessions.middleware.SessionMiddleware',
	'django.contrib.messages.middleware.MessageMiddleware',
	'django.middleware.clickjacking.XFrameOptionsMiddleware',
	'django.contrib.auth.middleware.AuthenticationMiddleware',
]

ROOT_URLCONF = 'config.urls'

TEMPLATES = [
	{
		'BACKEND': 'django.template.backends.django.DjangoTemplates',
		'DIRS': [
			os.path.join(BASE_DIR, 'app/templates'),
		],
		'APP_DIRS': True,
		'OPTIONS': {
			'context_processors': [
				'django.template.context_processors.debug',
				'django.template.context_processors.request',
				'django.contrib.auth.context_processors.auth',
				'django.contrib.messages.context_processors.messages',
			],
		},
	},
]

WSGI_APPLICATION = 'config.wsgi.application'

DATABASES = {
	'default': {
		'ENGINE': 'django.db.backends.postgresql',
		'NAME': 'AcriseG',
		'USER': 'postgres',
		'PASSWORD': '123456',
		'HOST': 'localhost',
		'PORT': '5432',
	}
}

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

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'America/Sao_Paulo'

USE_I18N = True

USE_TZ = True

STATIC_URL = 'static/'

STATIC_ROOT = os.path.join(BASE_DIR, "staticfiles")


STATICFILES_DIRS = [
	os.path.join(BASE_DIR, "app/static/"),
]

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
CRISPY_ALLOWED_TEMPLATE_PACKS = ['bootstrap5']
CRISPY_TEMPLATE_PACK = 'bootstrap5'


LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'
# Adicione isso no final do settings.py
from django.conf import global_settings

# Configurações de sessão
SESSION_COOKIE_AGE = 1209600  # 2 semanas em segundos
SESSION_SAVE_EVERY_REQUEST = True
SESSION_EXPIRE_AT_BROWSER_CLOSE = False

# Context processor customizado
def usuario_context(request):
    usuario_info = {
        'is_authenticated': 'usuario_id' in request.session,
        'id': request.session.get('usuario_id'),
        'nome': request.session.get('usuario_nome'),
        'email': request.session.get('usuario_email'),
        'tipo': request.session.get('usuario_tipo'),
    }
    return {'user_info': usuario_info}

# Adicione ao TEMPLATES context processors
TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [BASE_DIR / 'templates'],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
                'config.settings.usuario_context',  # Adicione esta linha
            ],
        },
    },
]