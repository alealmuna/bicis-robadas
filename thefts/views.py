# -*- coding: utf-8 -*-

# django
from django.views.decorators.csrf import csrf_exempt
from django.contrib.gis.geos import Polygon
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


@csrf_exempt
@api_view(['GET'])
def search(request):
    """
    Returns theft reports inside the geographical rectangle.
    """
    ll = request.GET.get('ll', u'0,0')  # lower left rectangle coordinates
    ur = request.GET.get('ur', u'1,1')  # upper rigth rectangle coordinates
    ll = tuple([float(coord) for coord in ll.split(',')])
    ur = tuple([float(coord) for coord in ur.split(',')])
    lr = (ur[0], ll[1])
    ul = (ll[0], ur[1])

    vertices = (ll, lr, ur, ul, ll)
    rectangle = Polygon(vertices)

    reports = Report.objects.filter(location__within=rectangle)
    serializer = ReportSerializer(reports,  many=True)
    return Response(serializer.data)
