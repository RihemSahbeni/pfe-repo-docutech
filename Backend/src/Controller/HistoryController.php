<?php

namespace App\Controller;

use App\Entity\Doc;
use App\Entity\History;
use App\Entity\Project;
use App\Entity\User;
use App\Repository\HistoryRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\SerializerInterface;
class HistoryController extends AbstractController
{

    /**
     * @param Request $request
     * @param EntityManagerInterface $entityManager
     * @param $Slug
     * @return JsonResponse
     */
    #[Route('/api/history/create', name: 'app_add_history_json', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
    
        $history = new History();
    
        // Récupérer le document par son ID
        $doc = $entityManager->getRepository(Doc::class)->find($data['docId']);
        if (!$doc) {
            return new JsonResponse(['message' => 'Document introuvable'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        // Récupérer l'ID du projet à partir du document
        $projectId = $doc->getIDproject();
        if (!$projectId) {
            return new JsonResponse(['message' => 'ID du projet introuvable pour ce document'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        // Récupérer le projet en utilisant l'ID
        $project = $entityManager->getRepository(Project::class)->find($projectId);
        if (!$project) {
            return new JsonResponse(['message' => 'Projet introuvable pour cet ID'], JsonResponse::HTTP_NOT_FOUND);
        }
    
        // Récupérer l'utilisateur actuellement connecté (ou ajuster la logique selon votre cas d'utilisation)
        $user = $this->getUser();
    
        // Construire la description de l'historique avec le titre du document et le nom de l'utilisateur
        $description = $data['description'] .' '. $doc->getTitre() . ' effectuée par ' . $user->getFirstName() . ' ' . $user->getLastName();
    
        $history->setDescription($description);
        $history->setCreationDate(new \DateTime());
        $history->setDoc($doc);
        $history->setUser($user);
       // $history->setDoc->setIDproject($project); // Utiliser le projet obtenu
    
        // Récupérer le slug depuis les données fournies
        $slug = $data['slug'];
        $history->setSlug($slug);
    
        $entityManager->persist($history);
        $entityManager->flush();
    
        return new JsonResponse([
            'message' => 'Historique créé avec succès'
        ]);
    }
    
    #[Route('/api/history/All', name: 'app_get_all_history_json', methods: ['GET'])]
    public function getAll(EntityManagerInterface $entityManager): JsonResponse
    {
        $historyRepo = $entityManager->getRepository(History::class);
        $histories = $historyRepo->findAll();
    
        $response = [];
        foreach ($histories as $history) {
            $doc = $history->getDoc();
    
            if ($doc) {
                $project = $doc->getIDproject();
    
                $projectData = 
                [
                    'id' => $project ? $project->getId() : null,
                    'Title' => $project ? $project->getTitle() : null,
                ];
    
                $response[] = [
                    'id' => $history->getId(),
                    'description' => $history->getDescription(),
                    'slug' => $history->getSlug(),
                    'creation_date' => $history->getCreationDate()->format('Y-m-d'),
                    'doc_id' => $doc->getId(),
                    'doctitle' => $doc->getTitre(),
                    'user_id' => $history->getUser() ? $history->getUser()->getId() : null,
                    'user_firstname' => $history->getUser() ? $history->getUser()->getFirstName() : null,
                    'user_lastname' => $history->getUser() ? $history->getUser()->getLastName() : null,
                    'project_data' => $projectData,
                ];
            }
        }
    
        return new JsonResponse($response);
    }
    

    #[Route('/api/history/update/{id}', name: 'app_update_history_json', methods: ['PUT'])]
    public function update(Request $request, EntityManagerInterface $entityManager, History $history): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Mise à jour des champs
        $history->setDescription($data['Description']);
        $history->setCreationDate(new \DateTime());

        $doc = $entityManager->getRepository(Doc::class)->find($data['docId']);
        if (!$doc) {
            return new JsonResponse(['message' => 'Document introuvable'], JsonResponse::HTTP_NOT_FOUND);
        }
        $history->setDoc($doc);

        $user = $this->getUser();
        $history->setUser($user);

        $entityManager->flush();

        return new JsonResponse(['message' => 'Historique mis à jour avec succès']);
    }
    #[Route('/api/history/filter-by-doc/{id_doc}', name: 'app_get_all_history_filter_by_doc_json', methods: ['GET'])]
    public function filterByDoc(int $id_doc,EntityManagerInterface $entityManager): JsonResponse
    {
        $historyRepo = $entityManager->getRepository(History::class);
        $histories = $historyRepo->findBy(['Doc'=>$id_doc]);

        $response = [];
        foreach ($histories as $history) {
            $doc = $history->getDoc();

            $response[] = [
                'id' => $history->getId(),
                'description' => $history->getDescription(),
                'slug' => $history->getSlug(),
                'creation_date' => $history->getCreationDate()->format('Y-m-d'),
                'doc_id' => $doc ? $doc->getId() : null,
                'doctitle' => $doc ? $doc->getTitre() : null,
                'user_id' => $history->getUser() ? $history->getUser()->getId() : null,
                'user_firstname' => $history->getUser() ? $history->getUser()->getFirstName() : null,
                'user_lastname' => $history->getUser() ? $history->getUser()->getLastName() : null,
            ];
        }

        return new JsonResponse($response);
    }

    #[Route('/api/get/history/{id}', name: 'app_get_history_by_id_json', methods: ['GET'])]
    public function getById(History $history): JsonResponse
    {
        $response = [
            'id' => $history->getId(),
            'description' => $history->getDescription(),
            'creation_date' => $history->getCreationDate()->format('Y-m-d'),
            'slug' => $history->getSlug(),
            'doc' => [
                'id' => $history->getDoc()->getId(),
                'title' => $history->getDoc()->getTitre(),
                // Ajoutez d'autres propriétés du document si nécessaire
            ],
            'user' => [
                'id' => $history->getUser()->getId(),
                'first_name' => $history->getUser()->getFirstName(),
                'last_name' => $history->getUser()->getLastName(),
                // Ajoutez d'autres propriétés de l'utilisateur si nécessaire
            ],
        ];

        return new JsonResponse($response);
    }


    #[Route('/api/delete/history/{id}', name: 'app_delete_history_json', methods: ['DELETE'])]
    public function delete(History $history, EntityManagerInterface $entityManager): JsonResponse
    {
        $entityManager->remove($history);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Historique supprimé avec succès'], Response::HTTP_OK);
    }
    
}
