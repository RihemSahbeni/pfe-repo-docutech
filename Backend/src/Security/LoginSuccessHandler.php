<?php
namespace App\Security;

use App\Entity\User;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Security\Core\Exception\CustomUserMessageAuthenticationException;
use Symfony\Component\Security\Http\Authentication\AuthenticationSuccessHandlerInterface;
use Symfony\Component\Security\Core\Authentication\Token\TokenInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\JsonResponse;
use Lexik\Bundle\JWTAuthenticationBundle\Services\JWTTokenManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\Serializer\Normalizer\ObjectNormalizer;
use Symfony\Component\Serializer\Serializer;

class LoginSuccessHandler implements AuthenticationSuccessHandlerInterface
{
    private $jwtManager;
    private $container;

    public function __construct(JWTTokenManagerInterface $jwtManager, ContainerInterface $container)
    {
        $this->jwtManager = $jwtManager;
        $this->container = $container;
    }
   /* public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        // Get the authenticated user
        $user = $token->getUser();

        // Check if user status is active
        if($user->getStatus() === 'desactiver') {
            throw new CustomUserMessageAuthenticationException('Votre compte est désactivé.');
        }

        // Check if password is valid
        $password = $request->get('password');
        $encoder = $this->container->get('security.password_encoder');
        if (!$encoder->isPasswordValid($user, $password)) {
            throw new CustomUserMessageAuthenticationException('L\'adresse email ou le mot de passe est incorrect.');
        }

        // Generate the JWT token
        $token = $this->jwtManager->create($user);

        // Return the user data and the JWT token as a JSON response
        return new JsonResponse([
            "id"=>$user->getId(),
            "firstname"=>$user->getFirstname(),
            "lastname"=>$user->getLastname(),
            "email"=>$user->getEmail(),
            "phoneNumber"=>$user->getPhoneNumber(),
            "isActivated"=>$user->getIsActivated(),
            "isVerified"=>$user->getIsVerified(),
            "status"=>$user->getStatus(),
            'token' => $token,
        ]);
    }*/

    public function onAuthenticationSuccess(Request $request, TokenInterface $token): Response
    {
        // Get the authenticated user
        $user = $token->getUser();

        // Generate the JWT token
        $token = $this->jwtManager->create($user);


        // Return the user data and the JWT token as a JSON response
        return new JsonResponse([
            "id"=>$user->getId(),
            "firstname"=>$user->getFirstname(),
            "lastname"=>$user->getLastname(),
            "email"=>$user->getEmail(),
            "phoneNumber"=>$user->getPhoneNumber(),
            "status"=>$user->getstatus(),
            'token' => $token,
        ]);
    }
}