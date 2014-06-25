""" this document defines the project urls """

from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework import routers

from thefts import views

router = routers.DefaultRouter()
router.register(r'reports', views.ReportViewSet)


admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/', include('users.urls')),
    url(r'^logged-in/', 'users.views.social_auth_login',
        name='social_auth_login'),
    url(r'^$', 'base.views.index', name='home'),
    url(r'^search/$', 'thefts.views.search'),
    url(r'^', include(router.urls)),
)


if settings.DEBUG:
    urlpatterns += patterns('',
                           (r'^%s(?P<path>.*)$' % settings.MEDIA_URL[1:],
                            'django.views.static.serve', {
                                'document_root': settings.MEDIA_ROOT}))
