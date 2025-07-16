from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import action
from .models import OpenMatch
from .models import MatchCategory
from .serializers import OpenMatchSerializer, MatchCategorySerializer
from .application.use_cases.create_open_match import CreateOpenMatchUseCase
from .application.use_cases.list_open_matches import ListOpenMatchesUseCase
from .application.use_cases.get_open_match_details import GetOpenMatchDetailsUseCase
from .application.use_cases.join_open_match import JoinOpenMatchUseCase
from .application.use_cases.leave_open_match import LeaveOpenMatchUseCase
from .application.use_cases.cancel_open_match import CancelOpenMatchUseCase
from .application.use_cases.remove_participant import RemoveParticipantUseCase
from .application.use_cases.update_open_match import UpdateOpenMatchUseCase
from .application.use_cases.list_upcoming_matches import ListUpcomingMatchesUseCase
from .infrastructure.repositories.django_match_repository import DjangoMatchRepository
from .permissions import IsMatchCreator
import asyncio

class OpenMatchViewSet(viewsets.ModelViewSet):
    queryset = OpenMatch.objects.all()
    serializer_class = OpenMatchSerializer
    permission_classes = [IsAuthenticated]

    def get_repository(self):
        return DjangoMatchRepository()

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Permiso: solo el creador puede editar
        self.check_object_permissions(request, instance)

        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        
        use_case = UpdateOpenMatchUseCase(self.get_repository())
        match = asyncio.run(use_case.execute(match_id=instance.id, match_data=serializer.validated_data))

        if getattr(instance, '_prefetched_objects_cache', None):
            # If 'prefetch_related' has been used, we need to reset it
            # in order to fetch the updated data.
            instance._prefetched_objects_cache = {}

        return Response(self.get_serializer(match).data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        validated_data = serializer.validated_data
        validated_data['creator'] = request.user

        use_case = CreateOpenMatchUseCase(self.get_repository())
        match = asyncio.run(use_case.execute(validated_data))
        
        response_serializer = self.get_serializer(match)
        return Response(response_serializer.data, status=status.HTTP_201_CREATED)

    def list(self, request, *args, **kwargs):
        use_case = ListOpenMatchesUseCase(self.get_repository())
        matches = asyncio.run(use_case.execute())
        serializer = self.get_serializer(matches, many=True)
        return Response(serializer.data)

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        use_case = GetOpenMatchDetailsUseCase(self.get_repository())
        match = asyncio.run(use_case.execute(instance.id))
        if not match:
            return Response(status=status.HTTP_404_NOT_FOUND)
        serializer = self.get_serializer(match)
        return Response(serializer.data)

    @action(detail=True, methods=['post'])
    def join(self, request, pk=None):
        use_case = JoinOpenMatchUseCase(self.get_repository())
        match = asyncio.run(use_case.execute(match_id=pk, user_id=request.user.id))
        if not match:
            return Response({'detail': 'No se pudo unir al partido.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(self.get_serializer(match).data)

    @action(detail=True, methods=['post'])
    def leave(self, request, pk=None):
        use_case = LeaveOpenMatchUseCase(self.get_repository())
        match = asyncio.run(use_case.execute(match_id=pk, user_id=request.user.id))
        if not match:
            return Response({'detail': 'No se pudo abandonar el partido.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(self.get_serializer(match).data)

    @action(detail=False, methods=['get'])
    def categories(self, request):
        categories = MatchCategory.objects.all()
        serializer = MatchCategorySerializer(categories, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['post'], permission_classes=[IsMatchCreator])
    def cancel(self, request, pk=None):
        use_case = CancelOpenMatchUseCase(self.get_repository())
        match = asyncio.run(use_case.execute(match_id=pk))
        if not match:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response(self.get_serializer(match).data)
    
    def get_permissions(self):
        """
        Instantiates and returns the list of permissions that this view requires.
        """
        if self.action in ['update', 'partial_update', 'destroy', 'cancel', 'remove_participant']:
            self.permission_classes = [IsAuthenticated, IsMatchCreator]
        else:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    @action(detail=True, methods=['post'], permission_classes=[IsMatchCreator])
    def remove_participant(self, request, pk=None):
        user_id_to_remove = request.data.get('user_id')
        if not user_id_to_remove:
            return Response({'detail': 'user_id es requerido.'}, status=status.HTTP_400_BAD_REQUEST)
        
        use_case = RemoveParticipantUseCase(self.get_repository())
        match = asyncio.run(use_case.execute(match_id=pk, user_id_to_remove=user_id_to_remove))
        
        if not match:
            return Response({'detail': 'No se pudo remover al participante.'}, status=status.HTTP_400_BAD_REQUEST)
        return Response(self.get_serializer(match).data)

    @action(detail=False, methods=['get'], url_path='my-upcoming-matches')
    def my_upcoming_matches(self, request):
        use_case = ListUpcomingMatchesUseCase(self.get_repository())
        matches = use_case.execute(user_id=request.user.id)
        serializer = self.get_serializer(matches, many=True)
        return Response(serializer.data)
