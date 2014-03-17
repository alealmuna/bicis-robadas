""" this document defines the project urls """

from django.conf import settings
from django.conf.urls import patterns, include, url
from django.contrib import admin


admin.autodiscover()

urlpatterns = patterns(
    '',
    url(r'^admin/', include(admin.site.urls)),
    url(r'^accounts/', include('users.urls')),
    url(r'^$', 'base.views.index', name='home'),
    url(r'^facebook/', include('django_facebook.urls')),
)


if settings.DEBUG:
    urlpatterns += patterns('',
                           (r'^%s(?P<path>.*)$' % settings.MEDIA_URL[1:],
                            'django.views.static.serve', {
                                'document_root': settings.MEDIA_ROOT}))
