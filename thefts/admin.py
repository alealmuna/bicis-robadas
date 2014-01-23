from base.admin import OSMAdmin

from django.contrib import admin

from thefts.models import Report


class ReportAdmin(OSMAdmin):
    """ Configuration for the User admin page"""
    list_display = ('user', 'date')

admin.site.register(Report, ReportAdmin)
