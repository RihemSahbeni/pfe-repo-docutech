<?php

namespace App\Controller;
use App\Repository\UserRepository;
use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

use Symfony\Component\HttpFoundation\Response;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Security\Core\Security;
use Symfony\Component\Serializer\Normalizer\AbstractNormalizer;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;
use Symfony\Component\Serializer\SerializerInterface;

class UserController extends AbstractController
{
    public function serializeUser(SerializerInterface $serializer, User $user): string
    {
        $data = $serializer->serialize($user, 'json', ['groups' => ['user']]);
        return $data;
    }
    /*#[Route('/api/projectsForUser', name: 'app_projectsForUser', methods:"GET")]
    public function projectsForUser(UserRepository $userRepository, SerializerInterface $serializer, Security $security): JsonResponse
    {
        $user = $security->getUser();
        if (!$user) {
            return new JsonResponse(['message' => 'Unauthorized'], Response::HTTP_UNAUTHORIZED);
        }

        $projects = $userRepository->find($user->getId())->getPorjectAffected();

        $normalized = $serializer->normalize($projects, null, [
            AbstractNormalizer::CIRCULAR_REFERENCE_HANDLER => function ($object) {
                return $object->getId();
            }
        ]);

        return new JsonResponse($normalized, 200, []);
    }*/

    #[Route('/api/users/Inactive/{id}', methods: ['PUT'])]
    public function updateInactive(int $id, Request $request, UserRepository $userRepository, ManagerRegistry $doctrine): JsonResponse
    {
        $decoded = json_decode($request->getContent(), true);
        //$status = $decoded['status'];

        $entityManager = $doctrine->getManager();
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $user->setStatus("Inactive");
        $entityManager->flush();

        return new JsonResponse(['message' => 'User is Inactive'], Response::HTTP_OK);
    }
    #[Route('/api/users/active/{id}', methods: ['PUT'])]
    public function updateactive(int $id, Request $request, UserRepository $userRepository, ManagerRegistry $doctrine): JsonResponse
    {
        $decoded = json_decode($request->getContent(), true);
        //$status = $decoded['status'];

        $entityManager = $doctrine->getManager();
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        $user->setStatus("active");
        $entityManager->flush();

        return new JsonResponse(['message' => 'User is active'], Response::HTTP_OK);
    }
    #[Route('/api/all', name: 'app_users', methods:"GET")]
    public function All(UserRepository $userRepository, SerializerInterface $serializer): JsonResponse
    {
        // Récupérer tous les utilisateurs
        $users = $userRepository->findAll();

        // Convertir les utilisateurs en tableau de données
        $userData = [];
        foreach ($users as $user) {
            $userData[] = [
                'id' => $user->getId(),
                'email' => $user->getEmail(),
                'firstname' => $user->getFirstname(),
                'lastname' => $user->getLastname(),
                'phoneNumber' => $user->getphoneNumber(),
                'status' => $user->getstatus(),
            ];
        }

        return new JsonResponse($userData);
    }

   
    #[Route('/api/users/{id}', name: 'app_user', methods: 'GET')]
    public function getUserById(UserRepository $userRepository, SerializerInterface $serializer, int $id): JsonResponse
    {
        // Récupérer l'utilisateur par son ID
        $user = $userRepository->find($id);

        if (!$user) {
            // Si l'utilisateur n'est pas trouvé, renvoyer une réponse avec un message d'erreur
            return new JsonResponse(['message' => 'User not found'], Response::HTTP_NOT_FOUND);
        }

        // Convertir les informations de l'utilisateur en tableau de données
        $userData = [
            'id' => $user->getId(),
            'email' => $user->getEmail(),
            'firstname' => $user->getFirstname(),
            'lastname' => $user->getLastname(),
            'status' => $user->getstatus(),
            'phoneNumber' => $user->getphoneNumber(),
        ];

        return new JsonResponse($userData);
    }
    #[Route('/users/create', name: 'app_add_user_json', methods:"POST" )]
   public function register(ManagerRegistry $doctrine, Request $request,UserPasswordHasherInterface $passwordHasher,
                          UserRepository $userRepository): Response
    {
        $em = $doctrine->getManager();
        $decoded = json_decode($request->getContent());
        $firstname = $decoded->firstname;
        $lastname = $decoded->lastname;
        $email = $decoded->email;
        $plaintextPassword = $decoded->password;
        $phoneNumber= $decoded->phoneNumber;

        if(!$firstname){return $this->json(['status'=> 'error','message' => 'please provide firstname']);}
        if(!$lastname){return $this->json(['status'=> 'error','message' => 'please provide lastname']);}
        if(!$email){return $this->json(['status'=> 'error','message' => 'please provide email']);}
        if(!$plaintextPassword){return $this->json(['status'=> 'error','message' => 'please provide password']);}
        if(!$phoneNumber){return $this->json(['status'=> 'error','message' => 'please provide phoneNumber']);}


        $userWithSameEmail = $userRepository->findOneBy(['email' => $email]);
        if ($userWithSameEmail) {
            return $this->json(['status'=> 'error','message' => 'user with same email exist']);
        }

        $user = new User();

        $hashedPassword = $passwordHasher->hashPassword($user,$plaintextPassword);

        $user->setFirstname($firstname);
        $user->setLastname( $lastname);
        $user->setPhoneNumber($phoneNumber);
        $user->setPassword($hashedPassword);
        $user->setEmail($email);
        $user->setResetToken("");
        $user->setVerificationCode("");
        $user->setStatus("active");
        $user->setroles("Utilisateur");
        $em->persist($user);
        $em->flush();
  
        return $this->json(['status'=> 'success','message' => 'created Successfully']);
    }

    #[Route('/api/users/update/{id}', name: 'api_users_update', methods:"PUT")]
    public function updateApi(int $id,Request $request,UserRepository $userRepository,ManagerRegistry $doctrine, UserPasswordHasherInterface $passwordHasher): JsonResponse
    {

        if($id == null){
            return new JsonResponse("id not specified", 200, [], true);
        }

        $decoded = json_decode($request->getContent());
        $user = $userRepository->find($id);
        $email = $decoded->email;
        $firstname= $decoded->firstname;
        $lastname= $decoded->lastname;
        $phoneNumber= $decoded->phoneNumber;
        //$status = $decoded->status;
        $user->setFirstname($firstname);
        $user->setLastname( $lastname);
        $user->setPhoneNumber($phoneNumber);
        $user->setResetToken("");
        $user->setStatus("active");
        $user->setroles("Utilisateur");
        $user->setEmail($email);
        $entityManager =$doctrine->getManager();
        $entityManager->flush();


        return new JsonResponse([
            'message' => 'user updated successfully',
        ], 200);


    }


    #[Route('/api/users/delete/{id}', name: 'api_users_delete', methods:"DELETE")]
    public function deleteApi(int $id,UserRepository $userRepository,ManagerRegistry $doctrine): JsonResponse
    {

        $user = $userRepository->find($id);

        if($user){
            $em =$doctrine->getManager();
            $em->remove($user);
            $em->flush();
            return new JsonResponse([
                'message' => 'user deleted successfully',
            ], 200);
        }

        return new JsonResponse([
            'message' => 'user not found',
        ], 404);
    }


}

