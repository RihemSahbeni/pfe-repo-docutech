<?php
namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Mailer;
use Symfony\Component\Mailer\Transport;
use Symfony\Component\Mime\Email;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Annotation\Route;


use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use App\Entity\ResetPassword;
use Symfony\Component\HttpFoundation\JsonResponse;
use Doctrine\Persistence\ManagerRegistry;
use App\Repository\UserRepository;
use Symfony\Component\Routing\Generator\UrlGeneratorInterface;
use Symfony\Component\Security\Csrf\TokenGenerator\TokenGeneratorInterface;
class ResetPassordController extends AbstractController
{
   
    #[Route('/sendVerificationCode', name: 'api_sendVerificationCode',methods: ['PUT'])]
    public function sendVerificationCode(Request $request, UserRepository $userRepository, ManagerRegistry $doctrine)
    {
        $decoded = json_decode($request->getContent());
        $email = $decoded->email;
        if(!$email){return $this->json(['status'=> 'error','message' => 'please provide email']);}


        $verificationCode = rand(100000, 1000000); //generer le code de verification composé de 6 chiffres
        $em = $doctrine->getManager();
        $user = $userRepository->findOneBy(['email' => $email]); //recuperer l'utilisateur avec l'email

        if (!$user){
              return $this->json(['status' => 'error', 'message' => 'User not found']);
        }

        $user->setVerificationCode($verificationCode); //modifier le code dans la base
        $em->flush();

           //envoyer le code de verifiaction par mail (un compte microsoft , le bundle mailer ne fonctionne pas avec les comptes gmail)
           $transport = Transport::fromDsn('smtp://docutechpfe2023@outlook.com:Docutech2023@smtp.office365.com:587');
           $mailer = new Mailer($transport );
           $mail = (new Email());
           $mail->from('docutechpfe2023@outlook.com ');
           $mail->to($email);
           $mail->subject('Activate account code');
           //$mail->html(body: "<div>Voici le code d'activation de votre compte : " . $verificationCode . " </div>");

// Code HTML amélioré pour la réinitialisation de mot de passe
$mail->html(body: "<div style='background-color: #f5f5f5; padding: 20px; border-radius: 5px;'>
<h2>Réinitialisation de mot de passe</h2>
<p>Nous avons reçu une demande de réinitialisation de votre mot de passe.</p>
<p>Voici le code de réinitialisation de mot de passe :</p>
<h3 style='background-color: #e0e0e0; padding: 10px; border-radius: 3px;'> " . $verificationCode . "</h3>
<p>Ce code expirera dans 1 heure.</p>
<p>Si vous n'avez pas fait cette demande, veuillez ignorer cet e-mail.</p>
<p>Cliquez sur le lien ci-dessous pour réinitialiser votre mot de passe :</p>
<a href='http://localhost:3000/Createpass'>Réinitialiser mon mot de passe</a>
<p>Si le lien ne fonctionne pas, vous pouvez copier/coller l'URL suivante dans votre navigateur :</p>
<p>http://localhost:3000/Createpass</p>
<p>Bien cordialement,</p>
<p>L'équipe de notre site</p>
</div>");

           $mailer->send($mail);

        return $this->json(['status' => 'success', 'message' => 'Email sent Successfully']);


    }

   
    #[Route('/resetPassword', name: 'api_resetPassword',methods: ['PUT'])]
    public function resetPassword(Request $request, UserRepository $userRepository, ManagerRegistry $doctrine, UserPasswordHasherInterface $passwordHasher)
    {

        $decoded = json_decode($request->getContent());
        $email = $decoded->email;
        $code = $decoded->code;
        $newPlainTextPassword = $decoded->password;

        $em = $doctrine->getManager();
        $user = $userRepository->findOneBy(['email' => $email]);

        if (!$user){
            return $this->json(['error' => 'success', 'message' => 'user not found']);
        }

        if($code == $user->getVerificationCode()){
            $newhashedPassword = $passwordHasher->hashPassword($user,$newPlainTextPassword);
            $user->setPassword($newhashedPassword);
            $em->flush();
            return $this->json(['error' => 'success', 'message' => 'password updated successfully']);
        }

        return $this->json(['error' => 'error', 'message' => 'incorrect code']);
    }


    #[Route('/api/user/{id}/modify-password', name: 'app_modify_password', methods: ['POST'])]
    public function modifyPassword(
        int $id,
        ManagerRegistry $doctrine,
        UserRepository $userRepository,
        Request $request,
        UserPasswordHasherInterface $passwordHasher,
    ): JsonResponse {
        $data = json_decode($request->getContent(), true);
        
        $user = $userRepository->find($id);

        if (!$user) {
            return new JsonResponse(['status' => 'error', 'message' => 'User not found'], 200);
        }

        if (empty($data['oldPassword']) || empty($data['newPassword']) || empty($data['confirmPassword'])) {
            return new JsonResponse(['status' => 'error', 'message' => 'Please provide all required fields.'], 200);
        }

        if (!$passwordHasher->isPasswordValid($user, $data['oldPassword'])) {
            return new JsonResponse(['status' => 'error', 'message' => 'The old password is incorrect.'], 200);
        }

        if ($data['newPassword'] !== $data['confirmPassword']) {
            return new JsonResponse(['status' => 'error', 'message' => 'The new password fields must match.'], 200);
        }

        $newPassword = $data['newPassword'];
        $user->setPassword($passwordHasher->hashPassword($user, $newPassword));

        $em = $doctrine->getManager();
        $em->persist($user);
        $em->flush();

        return new JsonResponse(['status' => 'success', 'message' => 'Your password has been changed.']);
    }



}



