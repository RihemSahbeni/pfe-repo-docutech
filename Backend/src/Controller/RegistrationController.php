<?php
  
namespace App\Controller;
  
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Doctrine\Persistence\ManagerRegistry;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use App\Entity\User;
  

class RegistrationController extends AbstractController
{
    #[Route('/user_Register', name: 'user_Register', methods:'POST')]
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
        $em->persist($user);
        $em->flush();
  
        return $this->json(['status'=> 'success','message' => 'Registered Successfully']);
    }

    /**
     * @Route("/login", name="login", methods={"POST"})
     */
    public function login(Request $request,
                          UserPasswordHasherInterface $passwordHasher,
                          UserRepository $userRepository,
                          JWTTokenManagerInterface $JWTManager): JsonResponse
    {


        $decoded = json_decode($request->getContent());

        $email = $decoded->email;
        $password = $decoded->password;


        if(!$email){return new JsonResponse(['status'=> 'error','message' => 'please provide email'],201);}
        if(!$password){return new JsonResponse(['status'=> 'error','message' => 'please provide password'],201);}


        $user = $userRepository->findOneBy(['email' => $email]);
        if (!$user) {
            return new JsonResponse(['status'=> 'error','message' => 'user not found'],201);
        }

        if(!$passwordHasher->isPasswordValid($user,$password)){
            return new JsonResponse(['status'=> 'error','message' => 'password incorrect'],201);
        }

        if($user->getStatus()==0){
            return new JsonResponse(['status'=> 'error','message' => 'user is not active'],201);
        }

        $token = $JWTManager->create($user);
        return new JsonResponse([
            "id"=>$user->getId(),
            "firstname"=>$user->getFirstname(),
            "lastname"=>$user->getLastname(),
            "email"=>$user->getEmail(),
            "phoneNumber"=>$user->getPhoneNumber(),
            "status"=>$user->getstatus(),
            'token' => $token,
        ],200);
    }

    /**
     * @Route(path="/logout", name="app_logout")
     * @return void
     */
    public function logout()
    {
    }

    

}