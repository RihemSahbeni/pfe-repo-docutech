<?php

namespace App\Controller;

use App\Entity\Doc;
use App\Entity\History;
use App\Entity\Project;
use App\Repository\DocRepository;
use App\Repository\HistoryRepository;
use App\Repository\ProjectRepository;
use Doctrine\ORM\EntityManagerInterface;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Http\Authentication\AuthenticationUtils;
use Symfony\Component\Serializer\SerializerInterface;

class DocController extends AbstractController
{
    #[Route('/api/Doc/create', name: 'app_add_Doc_json', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $entityManager, Security $security): JsonResponse
    {
        // Check if user is authenticated
        if (!$security->isGranted('IS_AUTHENTICATED_FULLY')) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        // Get the authenticated user's username
        $user = $security->getUser();
        $FirstName = $user->getFirstName();
        $LastName = $user->getLastName();

        $data = json_decode($request->getContent(), true);
        $Titre = $data['titre'] ?? null;
        $Type = $data['type'] ?? null;
        $project_id=$data['project_id'] ?? null;
        $cloned_id=$data['clonedId']?? null;
        // create a new Doc object and set its properties
        $doc = new Doc();
        $doc->setTitre($Titre);
        $doc->setType($Type);
        $doc->setCreatedBy($FirstName . ' ' . $LastName);
        if($project_id!=null){
            $project = $entityManager->getRepository(Project::class)->find($project_id);

            if (!$project) {
                return new JsonResponse(['message' => 'Projet introuvable'], Response::HTTP_NOT_FOUND);
            }
    
        $doc->setIDproject($project);
        }
        if($cloned_id!=null){
            $d=$entityManager->getRepository(Doc::class)->find($cloned_id);
            $doc->setIdCloned($d);


        }
        $doc->setCreatedAt(new \DateTime());

        // persist the object to the database
        $entityManager->persist($doc);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Document créé avec succès',
            'id' => $doc->getId(),
        ]);
    }


    #[Route('/api/Doc/addProject/{id}', name: 'app_add_project_to_document_json', methods: ['PUT'])]
    public function addProjectToDocument(Request $request, EntityManagerInterface $entityManager, Doc $document): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $project = $data['IDproject'];
        $project = $entityManager->getRepository(Project::class)->find($project);

        if (!$project) {
            return new JsonResponse(['message' => 'Projet introuvable'], Response::HTTP_NOT_FOUND);
        }

        $document->setIDproject($project);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Projet ajouté au document avec succès']);
    }
    #[Route('/api/Doc/remove-project/{id}', name: 'app_remove_project_from_doc', methods: ['DELETE'])]
    public function removeProjectFromDoc(ProjectRepository $projectRepository, DocRepository $docRepository, EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        // Récupération du document correspondant à l'ID fourni
        $doc = $docRepository->find($id);

        // Vérification que le document existe
        if (!$doc) {
            throw $this->createNotFoundException('Document introuvable');
        }

        // Suppression du projet associé au document
        $project = $doc->getIDproject();
        if ($project) {
            $doc->setIDproject(null);
            $entityManager->flush();

            return new JsonResponse([
                'message' => 'Projet supprimé du document avec succès',
                'doc_id' => $id,
                'project_id' => $project->getId(),
            ]);
        }

        return new JsonResponse([
            'message' => 'Le document ne possède pas de projet associé',
            'doc_id' => $id,
        ]);
    }
    #[Route('/api/Doc/DELETE/{id}', name: 'app_delete_doc_json', methods:["DELETE"])]
    public function Delete(EntityManagerInterface $entityManager, Doc $doc): JsonResponse
    {
        $entityManager->beginTransaction();

        try {
            // Supprimer les éléments liés au document
            $elements = $doc->getElement();
            foreach ($elements as $element) {
                $entityManager->remove($element);
            }

            // Supprimer l'historique lié au document
            $history = $doc->getHistories();
            foreach ($history as $entry) {
                $entityManager->remove($entry);
            }

            // Supprimer le document
            $entityManager->remove($doc);
            $entityManager->flush();

            $entityManager->commit();

            return new JsonResponse(['message' => 'Document, éléments et historique supprimés avec succès']);
        } catch (\Exception $e) {
            $entityManager->rollback();

            return new JsonResponse(['error' => 'Une erreur est survenue lors de la suppression du document'], 500);
        }
    }

    //update automatique du historique lors update du doc
    #[Route('/api/doc/updateH/{id}', name: 'app_update_doc_json', methods: ['PUT'])]
    public function editDocH(Request $request, EntityManagerInterface $entityManager, Doc $doc, UserInterface $user, HistoryRepository $historyRepository): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier si l'utilisateur est le créateur du document
        /*if ($doc->getCreatedBy() !== $user->getFirstName() . ' ' . $user->getLastName()) {
            return new JsonResponse(['message' => 'Vous n\'êtes pas autorisé à modifier ce document'], Response::HTTP_FORBIDDEN);
        }*/

        // Vérifier si l'utilisateur est affecté au projet du document
        $project = $doc->getIDproject();
        if ($project && !$project->getPusers()->contains($user)) {
            return new JsonResponse(['message' => 'Vous n\'êtes pas autorisé à modifier ce document'], Response::HTTP_FORBIDDEN);
        }

        // Mise à jour des champs
        $doc->setTitre($data['titre']);
        $doc->setType($data['type'] ?? null);
        $doc->setUpdatedAt(new \DateTime()); // Mise à jour avec la date actuelle
        $doc->setUpdatedBy($user->getFirstName() . ' ' . $user->getLastName()); // Mise à jour avec le nom d'utilisateur actuellement connecté

        // Vérification de l'existence du projet
        if (isset($data['IDproject'])) {
            $newProject = $entityManager->getRepository(Project::class)->find($data['IDproject']);
            if (!$newProject) {
                return new JsonResponse(['message' => 'Projet introuvable'], Response::HTTP_NOT_FOUND);
            }
            // Vérifier si l'utilisateur est affecté au nouveau projet
            if (!$newProject->getPusers()->contains($user)) {
                return new JsonResponse(['message' => 'Vous n\'êtes pas autorisé à modifier ce document pour le projet spécifié'], Response::HTTP_FORBIDDEN);
            }
            $doc->setIDproject($newProject);
        }

        // Vérification de l'existence du document cloné
        if (isset($data['IdCloned'])) {
            $clonedDoc = $entityManager->getRepository(Doc::class)->find($data['IdCloned']);
            if (!$clonedDoc) {
                return new JsonResponse(['message' => 'Document cloné introuvable'], Response::HTTP_NOT_FOUND);
            }
            // Vérifier si le document cloné appartient au même projet
            if ($clonedDoc->getIDproject() !== $doc->getIDproject()) {
                return new JsonResponse(['message' => 'Le document cloné doit appartenir au même projet'], Response::HTTP_BAD_REQUEST);
            }
            $doc->setIdCloned($clonedDoc);
        }

        // Créer un nouvel enregistrement dans la table history
        $history = new History();
        $history->setUser($user);
        $history->setDoc($doc);
        $history->setCreationDate(new \DateTime());

        $historyRepository->save($history);

        $entityManager->flush();

        return new JsonResponse(['message' => 'Document modifié avec succès', 'doc_id' => $doc->getId()]);
    }

    #[Route('/api/doc/update/{id}', name: 'app_update_doc_json', methods: ['PUT'])]
    public function editDoc(Request $request, EntityManagerInterface $entityManager, Doc $doc, UserInterface $user): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        // Vérifier si l'utilisateur est le créateur du document
        /*if ($doc->getCreatedBy() !== $user->getFirstName() . ' ' . $user->getLastName()) {
            return new JsonResponse(['message' => 'Vous n\'êtes pas autorisé à modifier ce document'], Response::HTTP_FORBIDDEN);
        }*/

        // Vérifier si l'utilisateur est affecté au projet du document
        $project = $doc->getIDproject();
        if ($project && !$project->getPusers()->contains($user)) {
            return new JsonResponse(['message' => 'Vous n\'êtes pas autorisé à modifier ce document'], Response::HTTP_FORBIDDEN);
        }

        // Mise à jour des champs
        $doc->setTitre($data['titre']);
        $doc->setType($data['type'] ?? null);
        $doc->setUpdatedAt(new \DateTime()); // Mise à jour avec la date actuelle
        $doc->setUpdatedBy($user->getFirstName() . ' ' . $user->getLastName()); // Mise à jour avec le nom d'utilisateur actuellement connecté

        // Vérification de l'existence du projet
        if (isset($data['IDproject'])) {
            $newProject = $entityManager->getRepository(Project::class)->find($data['IDproject']);
            if (!$newProject) {
                return new JsonResponse(['message' => 'Projet introuvable'], Response::HTTP_NOT_FOUND);
            }
            // Vérifier si l'utilisateur est affecté au nouveau projet
            if (!$newProject->getPusers()->contains($user)) {
                return new JsonResponse(['message' => 'Vous n\'êtes pas autorisé à modifier ce document pour le projet spécifié'], Response::HTTP_FORBIDDEN);
            }
            $doc->setIDproject($newProject);
        }

        // Vérification de l'existence du document cloné
        if (isset($data['IdCloned'])) {
            $clonedDoc = $entityManager->getRepository(Doc::class)->find($data['IdCloned']);
            if (!$clonedDoc) {
                return new JsonResponse(['message' => 'Document cloné introuvable'], Response::HTTP_NOT_FOUND);
            }
            // Vérifier si le document cloné appartient au même projet
            if ($clonedDoc->getIDproject() !== $doc->getIDproject()) {
                return new JsonResponse(['message' => 'Le document cloné doit appartenir au même projet'], Response::HTTP_BAD_REQUEST);
            }
            $doc->setIdCloned($clonedDoc);
        }

        $entityManager->flush();

        return new JsonResponse(['message' => 'Document modifié avec succès', 'doc_id' => $doc->getId()]);
    }



    #[Route('/api/doc/recent', name: 'app_recent_doc_json', methods: ['GET'])]
    public function recentDoc(EntityManagerInterface $entityManager, Security $security): JsonResponse
    {
        // Check if user is authenticated
        if (!$security->isGranted('IS_AUTHENTICATED_FULLY')) {
            return new JsonResponse(['error' => 'User not authenticated'], Response::HTTP_UNAUTHORIZED);
        }

        $user = $security->getUser();

        $docRepository = $entityManager->getRepository(Doc::class);
        $docs = $docRepository->findBy([], ['UpdatedAT' => 'DESC']);

        if (empty($docs)) {
            return new JsonResponse(['message' => 'Aucun document trouvé'], Response::HTTP_NOT_FOUND);
        }

        $docData = [];
        foreach ($docs as $doc) {
            $projectData = null;
            $project = $doc->getIDproject();
            if ($project) {
                $projectData = [
                    'id' => $project->getId(),
                    'Title' => $project->getTitle(),
                    'CreationDate'=> $project->getCreationDate(),
                    'Creator'=> $project->getCreator(),
                    'PUsers'=> $project->getPUsers(),
                    'StartDate'=> $project->getStartDate(),
                    'EndDate'=> $project->getEndDate(),
                    'Description'=> $project->getDescription(),

                ];
            }

            $UpdatedAT = $doc->getUpdatedAT();
            $timestamp = $UpdatedAT ? $UpdatedAT->format('Y-m-d H:i:s') : $doc->getCreatedAt()->format('Y-m-d H:i:s');

            $createdBy = $doc->getCreatedBy();

            $docData[] = [
                'id' => $doc->getId(),
                'titre' => $doc->getTitre,
                'type' => $doc->getType(),
                'updated_at' => $UpdatedAT ? $UpdatedAT->format('Y-m-d H:i:s') : null,
                'updated_by' => ($doc->getCreatedBy() === $user->getFirstname() . ' ' . $user->getLastname()) ? $user->getFirstname() . ' ' . $user->getLastname() : $doc->getUpdatedBy(),
                'created_at' => $timestamp,
                'created_by' => $createdBy,
                'project' => $projectData,
                'id_cloned' => $doc->getIdCloned() ? $doc->getIdCloned()->getId() : null, // Ajout de IdCloned
            ];

            // Mise à jour du document pour mettre à jour le champ "updated_by" avec le nom d'utilisateur actuellement connecté
            if ($doc->getCreatedBy() === $user->getFirstname() . ' ' . $user->getLastname()) {
                $doc->setUpdatedBy($user->getFirstname() . ' ' . $user->getLastname());
                $entityManager->persist($doc);
            }
        }

        $entityManager->flush();

        return new JsonResponse($docData);
    }
 #[Route('/api/doc/{id}', name: 'app_get_doc_json', methods: ['GET'])]
    public function getDocById($id, EntityManagerInterface $entityManager): JsonResponse
    {
        // Récupération du document
        $doc = $entityManager->getRepository(Doc::class)->find($id);

        // Vérification de l'existence du document
        if (!$doc) {
            return new JsonResponse(['message' => 'Document introuvable'], Response::HTTP_NOT_FOUND);
        }

        // Construction de la réponse
        $response = [
            'id' => $doc->getId(),
            'titre' => $doc->getTitre(),
            'type' => $doc->getType(),
            'updated_by' => $doc->getUpdatedBy(),
            'updated_at' => $doc->getUpdatedAT() ? $doc->getUpdatedAT()->format('Y-m-d H:i:s') : null,
            'created_by' => $doc->getCreatedBy(),
            'created_at' => $doc->getCreatedAt(),
            'id_cloned' => $doc->getIdCloned() ? $doc->getIdCloned()->getId() : null, // Ajout de IdCloned
        ];

        if ($doc->getIDproject()) {
            $response['project'] = [
                'id' => $doc->getIDproject()->getId(),
                'name' => $doc->getIDproject()->getTitle(),
            ];
        }

        return new JsonResponse($response);
    }

    #[Route('/api/docs/filter-by-project-null', name: 'app_docs_filter_by_project_null_json', methods: ['GET'])]
    public function filterDocsByProjectNull(EntityManagerInterface $entityManager): JsonResponse
    {
        $docRepository = $entityManager->getRepository(Doc::class);
        $docs = $docRepository->findAll();

        $filteredDocs = [];
        foreach ($docs as $doc) {
            if ($doc->getIDproject() === null) {
                $filteredDocs[] = [
                    'id' => $doc->getId(),
                    'titre' => $doc->getTitre(),
                    'created_by' => $doc->getCreatedBy(),
                    'type' => $doc->getType(),
                    'created_at' => $doc->getCreatedAT()->format('Y-m-d H:i:s'),
                    'updated_at' => $doc->getUpdatedAT() ? $doc->getUpdatedAT()->format('Y-m-d H:i:s') : null,
                    'project_id' => $doc->getIDproject() ? $doc->getIDproject()->getId() : null,
                    'id_cloned' => $doc->getIdCloned() ? $doc->getIdCloned()->getId() : null, // Ajout de IdCloned
                ];
            }
        }

        return new JsonResponse($filteredDocs);
    }




    #[Route('/api/docs/filter-by-project', name: 'app_docs_filter_by_project_json', methods: ['GET'])]
    public function filterDocsByProject(EntityManagerInterface $entityManager): JsonResponse
    {
        $docRepository = $entityManager->getRepository(Doc::class);
        $docs = $docRepository->findAll();

        $filteredDocs = [];
        foreach ($docs as $doc) {
            if ($doc->getIDproject() !== null) {
                $filteredDocs[] = [
                    'id' => $doc->getId(),
                    'titre' => $doc->getTitre(),
                    'type' => $doc->getType(),
                    'created_at' => $doc->getCreatedAT()->format('Y-m-d H:i:s'),
                    'updated_at' => $doc->getUpdatedAT() ? $doc->getUpdatedAT()->format('Y-m-d H:i:s') : null,
                    'project_id' => $doc->getIDproject()->getId(),
                    'created_by' => $doc->getCreatedBy(),
                    'id_cloned' => $doc->getIdCloned() ? $doc->getIdCloned()->getId() : null, // Ajout de IdCloned
                ];
            }
        }

        return new JsonResponse($filteredDocs);
    }



    #[Route('/api/docs/filter-by-user', name: 'app_docs_filter_by_user_json', methods: ['GET'])]
    public function filterDocsByUser(EntityManagerInterface $entityManager, Security $security): JsonResponse
    {
        // Récupération de l'utilisateur connecté
        $user = $security->getUser();
    
        // Récupération de tous les documents
        $docRepository = $entityManager->getRepository(Doc::class);
        $docs = $docRepository->findAll();
    
        $filteredDocs = [];
        foreach ($docs as $doc) {
            // Vérification si l'utilisateur est affecté au projet du document
            $project = $doc->getIDproject();
            if ($project && $project->getPusers()->contains($user)) {
                $projectData = [
                    'id' => $project->getId(),
                    'Title' => $project->getTitle(),
                    
                ];
    
                $filteredDocs[] = [
                    'id' => $doc->getId(),
                    'titre' => $doc->getTitre(),
                    'created_by' => $doc->getCreatedBy(),
                    'type' => $doc->getType(),
                    'created_at' => $doc->getCreatedAt()->format('Y-m-d H:i:s'),
                    'updated_at' => $doc->getUpdatedAt() ? $doc->getUpdatedAt()->format('Y-m-d H:i:s') : null,
                    'project_id' => $doc->getIDproject() ? $doc->getIDproject()->getId() : null,
                    'project_data' => $projectData,
                ];
            }
        }
    
        return new JsonResponse($filteredDocs);
    }
    

}
