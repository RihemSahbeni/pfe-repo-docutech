<?php

namespace App\Controller;


use App\Entity\Doc;
use App\Entity\Element;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

class ElementController extends AbstractController
{

    #[Route('/api/elemnt/create', name: 'app_add_element_json', methods: ['POST'])]
    public function addElement(Request $request, EntityManagerInterface $entityManager): JsonResponse
    {
        // On récupère les données du body de la requête
        $data = json_decode($request->getContent(), true);
        // On vérifie que le document existe
        $documentRepository = $entityManager->getRepository(Doc::class);
        $document = $documentRepository->find($data['document_id']);
        if (!$document) {
            return new JsonResponse(['message' => 'Document non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // On crée un nouvel élément
        $element = new Element();
        $element->setType($data['type']);
        $element->setSequence($data['sequence']);
        $element->setTypeofvalue($data['typeofvalue']);
        $element->setValue($data['value']);
        $element->setDoc($document);

        // On ajoute l'élément au document
        $document->addElement($element);

        // On persiste les entités en base de données
        $entityManager->persist($element);
        $entityManager->persist($document);
        $entityManager->flush();

        // On retourne l'élément créé avec les données associées du document
        return new JsonResponse([
            'id' => $element->getId(),
            'type' => $element->getType(),
           'sequence' => $element->getSequence(),
           'typeofvalue'=>$element->getTypeofvalue(),
            'Value'=>$element->getValue(),
            'document' => [
                'id' => $document->getId(),
                'titre' => $document->getTitre(),
                'status' => $document->getStatus(),
                'type' => $document->getType(),
                'updated_at' => $document->getUpdatedAT() ? $document->getUpdatedAT()->format('Y-m-d H:i:s') : null,
                'updated_by' => $document->getUpdatedBy(),
                'created_at' => $document->getCreatedAT() ? $document->getCreatedAT()->format('Y-m-d H:i:s') : null,
                'created_by' => $document->getCreatedBy(),
                'project' => $document->getIDproject() ? [
                    'id' => $document->getIDproject()->getId(),
                    'title' => $document->getIDproject()->getTitle(),

                ] : null,
            ],
        ]);
    }

    #[Route('/api/elements/doc/{id}', name: 'app_elements_doc_json', methods: ['GET'])]
    public function getElements(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $docRepository = $entityManager->getRepository(Doc::class);
        $doc = $docRepository->find($id);

        if (!$doc) {
            return new JsonResponse(['message' => 'Document non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $elements = $doc->getElement();
        if (empty($elements)) {
            return new JsonResponse(['message' => 'Aucun élément trouvé'], Response::HTTP_NOT_FOUND);
        }

        $elementData = [];
        foreach ($elements as $element) {
            $elementData[] = [
                'id' => $element->getId(),
                'type' => $element->getType(),
                'sequence' => $element->getSequence(),
                'typeofvalue'=>$element->getTypeofvalue(),
                'value'=>$element->getValue(),
                'doc' => [
                    'id' => $doc->getId(),
                    'title' => $doc->gettitre(),
                ],
            ];
        }

        return new JsonResponse($elementData);
    }



    #[Route('/api/elements/update-element/{elementId}', name: 'app_update_element', methods: ['PUT'])]
    public function updateElement(EntityManagerInterface $entityManager, Request $request, int $elementId): JsonResponse
    {
       

        $elementRepository = $entityManager->getRepository(Element::class);
        $element = $elementRepository->findOneBy(['id' => $elementId]);

        if (!$element) {
            return new JsonResponse(['message' => 'Element non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if(isset($data['type']))
        $element->setType($data['type']);
        if(isset($data['sequence']))
        $element->setSequence($data['sequence']);
        if(isset($data['typeofvalue']))
        $element->setTypeofvalue($data['typeofvalue']);
        if(isset($data['value'])){
            $jsonData = ['data' =>$data['value']];
                $element->setValue($jsonData);
        }

        $entityManager->persist($element);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Element mis à jour avec succès']);
    }
    #[Route('/api/elements/doc/{docId}', name: 'app_add_element_to_doc', methods: ['POST'])]
    public function addElementToDoc(Request $request, EntityManagerInterface $entityManager, int $docId): JsonResponse
    {
        $docRepository = $entityManager->getRepository(Doc::class);
        $doc = $docRepository->find($docId);

        if (!$doc) {
            return new JsonResponse(['message' => 'Document non trouvé'], Response::HTTP_NOT_FOUND);
        }

        // récupérer les données de l'élément envoyées dans la requête
        $requestData = json_decode($request->getContent(), true);
        $type=$requestData['type'];
        $sequence=$requestData['sequence'];
        $typeofvalue=$requestData['typeofvalue'];
        $jsonData = ['data' =>$requestData['value']];
        $value=$jsonData;


        // créer un nouvel élément
        $element = new Element();
        $element->setType($type);
        $element->setSequence($sequence);
        $element->setTypeofvalue($typeofvalue);
        $element->setValue($value);
        $element->setDoc($doc);
        $entityManager->persist($element);
        $entityManager->flush();

        // retourner les données de l'élément ajouté
        $responseData = [
            'id' => $element->getId(),
            'type' => $element->getType(),
            'sequence' => $element->getSequence(),
            'typeofvalue'=>$element->getTypeofvalue(),
            'doc' => [
                'id' => $doc->getId(),
                'title' => $doc->gettitre(),
            ],
        ];

        return new JsonResponse($responseData, Response::HTTP_CREATED);
    }
    #[Route('/api/elements/doc/{docId}/delete/{elementId}', name: 'app_element_delete', methods: ['DELETE'])]
    public function deleteElementID(EntityManagerInterface $entityManager, int $docId, int $elementId): JsonResponse
    {
        $docRepository = $entityManager->getRepository(Doc::class);
        $doc = $docRepository->find($docId);

        if (!$doc) {
            return new JsonResponse(['message' => 'Document non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $elementRepository = $entityManager->getRepository(Element::class);
        $element = $elementRepository->find($elementId);

        if (!$element) {
            return new JsonResponse(['message' => 'Elément non trouvé'], Response::HTTP_NOT_FOUND);
        }

        if ($element->getDoc() !== $doc) {
            return new JsonResponse(['message' => 'L\'élément ne correspond pas au document'], Response::HTTP_BAD_REQUEST);
        }

        $entityManager->remove($element);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Elément supprimé avec succès']);
    }
    #[Route('/api/elements/delete/{id}', name: 'app_element_delete', methods: ['DELETE'])]
    public function deleteElement(EntityManagerInterface $entityManager, int $id): JsonResponse
    {
        $elementRepository = $entityManager->getRepository(Element::class);
        $element = $elementRepository->find($id);

        if (!$element) {
            return new JsonResponse(['message' => 'Élément non trouvé'], Response::HTTP_NOT_FOUND);
        }

        $doc = $element->getDoc();
        if (!$doc) {
            return new JsonResponse(['message' => 'Document non trouvé pour cet élément'], Response::HTTP_NOT_FOUND);
        }

        $doc->removeElement($element);
        $entityManager->remove($element);
        $entityManager->flush();

        return new JsonResponse(['message' => 'Élément supprimé avec succès']);
    }
    #[Route('/element', name: 'app_element')]
    public function index(): JsonResponse
    {
        return $this->json([
            'message' => 'Welcome to your new controller!',
            'path' => 'src/Controller/ElementController.php',
        ]);
    }
}
