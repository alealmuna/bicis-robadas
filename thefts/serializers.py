from rest_framework import serializers
from thefts.models import Report


class FullReportSerializer(serializers.HyperlinkedModelSerializer):
    user = serializers.RelatedField(read_only=True)

    class Meta:
        model = Report
        exclude = ('created_at', 'updated_at')
