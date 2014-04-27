# -*- coding: utf-8 -*-

# django
from django.views.decorators.csrf import csrf_exempt
# models
from thefts.models import Report
# serializers
from thefts.serializers import FullReportSerializer
from thefts.serializers import ReportSerializer
# rest_framework
from rest_framework import viewsets
from rest_framework.decorators import api_view
from rest_framework.response import Response


class ReportViewSet(viewsets.ModelViewSet):
    """
    API endpoint that allows reports to be viewed or edited.
    """
    queryset = Report.objects.all()
    serializer_class = FullReportSerializer
