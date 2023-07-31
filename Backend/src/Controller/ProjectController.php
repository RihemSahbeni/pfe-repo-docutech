<?php

namespace App\Controller;


use App\Entity\Project;

use App\Entity\User;
use App\Repository\ProjectRepository;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;

use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\SerializerInterface;



class ProjectController extends AbstractController
{
    #[Route('/api/project/allforuser', name: 'app_get_allforuser_json', methods: ['GET'])]
    public function allforuser(EntityManagerInterface $entityManager, Security $security): JsonResponse
    {
        // Récupération de l'utilisateur connecté
        $user = $security->getUser();
    
        // Vérification si l'utilisateur est connecté
        if (!$user) {
            // Retourner une réponse vide ou une erreur si l'utilisateur n'est pas connecté
            return new JsonResponse([]);
        }
    
        // Récupération de tous les projets
        $projectRepository = $entityManager->getRepository(Project::class);
        $projects = $projectRepository->findAll();
    
        $filteredProjects = [];
        foreach ($projects as $project) {
            // Vérification si le projet est défini
            if ($project !== null) {
                $alldocsofproject = [];
                $PDocs = $project->getDocs();
                foreach ($PDocs as $doc) {
                    if($doc->getIdCloned()!== null)
                    $alldocsofproject[] = [
                        'id' => $doc->getIdCloned()->getId(),
                        //'id' => $doc->getId(), 
                    ];
                }
                // Vérification si l'utilisateur est affecté au projet
                if ($project->getPUsers()->contains($user) || $project->getCreator() === $user) {
                    $filteredProjects[] = [
                        'id' => $project->getId(),
                        'Title' => $project->getTitle(),
                        'CreationDate' => $project->getCreationDate(),
                        'Creator' => $project->getCreator(),
                        'PUsers' => $project->getPUsers(),
                        'docs' => $alldocsofproject,
                        'StartDate' => $project->getStartDate(),
                        'EndDate' => $project->getEndDate(),
                        'Description' => $project->getDescription(),
                    ];
                }
            }
        }
    
        return new JsonResponse($filteredProjects);
    }
    
    #[Route('/api/project/RemoveUser/{projectId}/{userId}', name: 'app_remove_user_from_project', methods: ['DELETE'])]
    public function removeUserFromProject(int $projectId, int $userId, EntityManagerInterface $entityManager,
                                          ProjectRepository $projectRepository, UserRepository $userRepository): JsonResponse
    {
        $project = $projectRepository->find($projectId);
        $user = $userRepository->find($userId);

        if (!$project || !$user) {
            return new JsonResponse(['message' => 'Project ou utilisateur non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $project->removePUser($user);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateur supprimé du projet avec succès']);
    }


    #[Route('/api/project/get/{id}', name: 'app_get_project_json', methods: "GET")]
    public function getById(int $id, EntityManagerInterface $entityManager): JsonResponse
    {
        $project = $entityManager->getRepository(Project::class)->find($id);
    
        if (!$project) {
            throw $this->createNotFoundException('Le projet n\'existe pas.');
        }
    
        $PUsersData = [];
        $PUsers = $project->getPUsers();
        foreach ($PUsers as $PUser) {
            $userData = [
                'id' => $PUser->getId(),
                'email' => $PUser->getEmail(),
                'firstname' => $PUser->getFirstname(),
                'lastname' => $PUser->getLastname(),
                'status' => $PUser->getStatus(),
                'phoneNumber' => $PUser->getPhoneNumber(),
            ];
            $PUsersData[] = $userData;
        }
    
        $projectData = [
            'id' => $project->getId(),
            'Title' => $project->getTitle(),
            'CreationDate' => $project->getCreationDate(),
            'Creator' => [
        'id' => $project->getCreator()->getId(),
        'email' => $project->getCreator()->getEmail(),
        'firstname' => $project->getCreator()->getFirstname(),
        'lastname' => $project->getCreator()->getLastname(),
        'status' => $project->getCreator()->getStatus(),
        'phoneNumber' => $project->getCreator()->getPhoneNumber(),
    ],
            'PUsers' => $PUsersData,
            'docs' => $project->getDocs(),
            'StartDate' => $project->getStartDate(),
            'EndDate' => $project->getEndDate(),
            'Description' => $project->getDescription(),
        ];
    
        return new JsonResponse($projectData);
    }
    
    #[Route('/api/project/all', name: 'app_get_all_json', methods: "GET")]
    public function All(EntityManagerInterface $entityManager): JsonResponse
    {
        $projects = $entityManager->getRepository(Project::class)->findAll();

        $projectData = [];
        foreach ($projects as $project) {
            $projectData[] = [
                'id' => $project->getId(),
                'Title' => $project->getTitle(),
                'CreationDate' => $project->getCreationDate(),
                'creator_id'=>$project->getCreator()->getId(),
                'Creator' => $project->getCreator(),
                'PUsers' => $project->getPUsers(),
                'docs' => $project->getDocs(),
                'StartDate' => $project->getStartDate(),
                'EndDate' => $project->getEndDate(),
                'Description' => $project->getDescription(),
            ];
        }

        return new JsonResponse($projectData);
    }

    #[Route('/api/project/create', name: 'app_add_project_json', methods:"POST")]
    public function create(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $Title = $data['Title'];
        $Description = $data['Description'];
        $PUsers = $data['PUsers'];
        $StartDate = new \DateTime($data['StartDate']);
        $EndDate = new \DateTime($data['EndDate']);

        // Vérifier si un projet avec le même titre existe déjà
        $existingProject = $entityManager->getRepository(Project::class)->findOneBy(['Title' => $Title]);
        if ($existingProject !== null) {
            return new JsonResponse([
                'status' => 'error',
                'message' => 'Un projet avec le même titre existe déjà',
            ], JsonResponse::HTTP_BAD_REQUEST);
        }

        // Créer le projet uniquement si le titre est unique
        $project = new Project();
        $project->setTitle($Title);
        $project->setDescription($Description);
        $project->setStartDate($StartDate);
        $project->setEndDate($EndDate);

        // Vérifier si la date de création est fournie, sinon utilise la date actuelle
        if (isset($data['CreationDate'])) {
            $CreationDate = new \DateTime($data['CreationDate']);
        } else {
            $CreationDate = new \DateTime();
        }
        $project->setCreationDate($CreationDate);

        // On récupère l'utilisateur actuellement connecté pour le lier au projet en tant que créateur
        $creator = $this->getUser();
        $project->setCreator($creator);

        // Récupération des utilisateurs affectés à partir de leurs IDs
        $pUsers = $entityManager->getRepository(User::class)->findById($PUsers);
        foreach ($pUsers as $PUser) {
            $project->addPUser($PUser);
        }

        $entityManager->persist($project);
        $entityManager->flush();

        return new JsonResponse([
            'message' => 'Projet créé avec succès',
        ]);
    }


    #[Route('/api/project/Update/{id}', name: 'app_edit_project_json', methods:["PUT"] )]
    public function Update(Request $request, EntityManagerInterface $entityManager, Project $project, SerializerInterface $serializer, Security $security): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $title = $data['Title'];
        $description = $data['Description'];
  

        // On récupère l'utilisateur actuellement connecté pour le lier au projet en tant que créateur
        $user = $security->getUser();

        // Vérification que l'utilisateur courant est bien le créateur du projet
        if ($project->getCreator() !== $user) {
            return new JsonResponse([
                'error' => 'Vous n\'êtes pas autorisé à modifier ce projet'
            ], 403);
        }

        // Mise à jour des champs du projet
        $project->setTitle($title);
        $project->setDescription($description);

        if($data['StartDate']){
        $startDate = new \DateTime($data['StartDate']);
        $project->setStartDate($startDate);
        }

        if($data['EndDate'])
        {$endDate = new \DateTime($data['EndDate']);
        $project->setEndDate($endDate);
        }
        $entityManager->flush();

        // Normalisation du projet pour obtenir toutes les informations sous forme de tableau
        $normalizedProject = $serializer->normalize($project, null, [
            'groups' => ['projects']
        ]);

        // Ajout des informations du document dans le tableau du projet
        $docs = $project->getDocs();
        $docData = [];
        foreach ($docs as $doc) {
            $updatedBy = ($doc->getCreatedBy() === $user->getFirstname() . ' ' . $user->getLastname()) ? $user->getFirstname() . ' ' . $user->getLastname() : $doc->getUpdatedBy();
            $docData[] = [
                'id' => $doc->getId(),
                'titre' => $doc->getTitre(),
                'type' => $doc->getType(),
                'updated_at' => $doc->getUpdatedAt() ? $doc->getUpdatedAt()->format('Y-m-d H:i:s') : null,
                'updated_by' => $updatedBy,
                'created_at' => $doc->getCreatedAt()->format('Y-m-d H:i:s'),
                'created_by' => $doc->getCreatedBy(),
                //'id_cloned' => $doc->getIdCloned() ? $doc->getIdCloned()->getId() : null,
                    'id_cloned' => $doc->getIdCloned() ? $doc->getIdCloned()->getId() : null,
            ];
        }

        // Retourner les données du projet et des documents dans la réponse JSON
        $responseData = [
            'project' => $normalizedProject,
            'docs' => $docData
        ];

        return new JsonResponse($responseData);
    }



    #[Route('/api/project/UpdateUser/{id}', name: 'app_edit_project_User_json', methods:["PUT"] )]
    public function UpdateUser(Request $request, EntityManagerInterface $entityManager, Project $project): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $PUsers = $data['PUsers'];

        $existingPUsers = $project->getPUsers();
        $usersToAdd = [];

        // Vérifier chaque utilisateur à ajouter
        foreach ($PUsers as $userId) {
            $user = $entityManager->getRepository(User::class)->find($userId);

            // Vérifier si l'utilisateur existe et n'est pas déjà ajouté au projet
            if ($user && !$existingPUsers->contains($user)) {
                $usersToAdd[] = $user;
            }
        }

        if (empty($usersToAdd)) {
            return new JsonResponse(['message' => 'Aucun nouvel utilisateur à ajouter , le utilissateur est deja ajouter '], Response::HTTP_BAD_REQUEST);
        }

        // Ajouter les nouveaux utilisateurs au projet
        foreach ($usersToAdd as $userToAdd) {
            $project->addPUser($userToAdd);
        }

        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateurs ajoutés au projet avec succès']);
    }
    


    #[Route('/api/project/delete/{id}', name: 'app_delete_project', methods: ['DELETE'])]
    public function delete(int $id, EntityManagerInterface $entityManager, ProjectRepository $projectRepository): JsonResponse
    {
        $project = $projectRepository->find($id);

        if (!$project) {
            return new JsonResponse(['message' => 'Project non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($project);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Project supprimé avec succès']);
    }
   /* #[Route('/project/add-user/{id}', name: 'app_add_user_to_project', methods: ['PUT'])]
    public function addUserToProject(Request $request, EntityManagerInterface $entityManager, $id): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        $PUsers = $data['PUsers'];

        $project = $entityManager->getRepository(Project::class)->find($id);
        if (!$project) {
            return new JsonResponse(['message' => 'Projet introuvable'], Response::HTTP_NOT_FOUND);
        }

        $PUsers = $entityManager->getRepository(User::class)->findById($PUsers);
        foreach ($PUsers as $PUser) {
            $project->addPUser($PUser);
        }

        if (!$PUsers) {
            return new JsonResponse(['message' => 'Utilisateur introuvable'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->persist($project);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateurs ajoutés au projet avec succès']);
    }*/



    /*#[Route('/project/add-user/{id}', name: 'app_add_user_to_project', methods: ['POST'])]
    public function addUserToProject(Request $request, EntityManagerInterface $entityManager, Project $project): JsonResponse
    {
        $data = json_decode($request->getContent(), true);

        $PUsers = $data['PUsers'];

        $PUsers = $entityManager->getRepository(User::class)->findById($PUsers);
        foreach ($PUsers as $PUser) {
            $project->addPUser($PUser);
        }
            if (!$PUsers) {
                return new JsonResponse(['message' => 'Utilisateur introuvable'], Response::HTTP_NOT_FOUND);
            }


        $entityManager->persist($project);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Utilisateurs ajoutés au projet avec succès']);
    }*/


}
