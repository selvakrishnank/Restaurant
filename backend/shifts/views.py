from rest_framework.views import APIView
from rest_framework.response import Response
from .models import Shift
from .serializers import ShiftSerializer


class ShiftListView(APIView):

    def get(self, request):

        date = request.GET.get("date")

        if date:
            shifts = Shift.objects.filter(date=date)
        else:
            shifts = Shift.objects.all()

        serializer = ShiftSerializer(shifts, many=True)

        return Response(serializer.data)
    

class CreateShiftView(APIView):

    def post(self, request):
        
        serializer = ShiftSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)

        return Response(serializer.errors)


class StartShiftView(APIView):

    def patch(self, request, shift_id):

        shift = Shift.objects.get(id=shift_id)

        shift.status = "active"

        shift.save()

        return Response({
            "message": "Shift started"
        })


class DeleteShiftView(APIView):

    def delete(self, request, shift_id):

        shift = Shift.objects.get(id=shift_id)

        shift.delete()

        return Response({
            "message": "Shift deleted"
        })
    

class EndShiftView(APIView):

    def patch(self, request, shift_id):

        shift = Shift.objects.get(id=shift_id)

        shift.status = "completed"

        shift.save()

        return Response({"message": "Shift ended"})    