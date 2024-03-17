<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Entity\User;

#[Route('/api', name: 'api_')]
class UserController extends AbstractController
{

    #[Route('/user', name: 'user_index', methods:['get', 'post'] )]
    public function index(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $parameters = json_decode($request->getContent(), true);
        $data = [];
        if($parameters) {
            $user = $doctrine->getRepository(User::class)->findOneBy(array('username' => $parameters['username']), array('username' => 'ASC'),1 ,0);
            if(!$user) {
                $resp = (object) [
                    'error' => 'User doesn\'t exists with given username.',
                ];
                return $this->json($resp, 404);
            }
            $data =  [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
            ];
        } else {
            $users = $doctrine->getRepository(User::class)->findAll();
            foreach ($users as $user) {
                $data[] = [
                    'id' => $user->getId(),
                    'username' => $user->getUsername(),
                    'password' => $user->getPassword(),
                ];
            }
        }
        return $this->json($data);
    }

    #[Route('/login', name: 'user_login', methods:['post'] )]
    public function login(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $parameters = json_decode($request->getContent(), true);
        if($parameters) {
            $data = [];
            $user = $doctrine->getRepository(User::class)->findOneBy(array('username' => $parameters['username']), array('username' => 'ASC'),1 ,0);
            if(!$user) {
                $resp = (object) [
                    'error' => 'User doesn\'t exists with given username.',
                ];
                return $this->json($resp, 404);
            }
            if(!isset($parameters['password']) || $parameters['password'] !== $user->getPassword()) {
                $resp = (object) [
                    'error' => 'Invalid username / password provided.',
                ];
                return $this->json($resp, 401);
            }
            $data =  [
                'id' => $user->getId(),
                'username' => $user->getUsername(),
            ];
            return $this->json($data);
        }
        $resp = (object) [
            'error' => 'Invalid inputs provided.',
        ];
        return $this->json($resp, 404);
    }

    #[Route('/user', name: 'user_create', methods:['post'] )]
    public function create(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $parameters = json_decode($request->getContent(), true);

        $existingUser = $doctrine->getRepository(User::class)->findOneBy(array('username' => $parameters['username']), array('username' => 'ASC'),1 ,0);
        if($existingUser && $existingUser->getId() !== 0) {
            $resp = (object) [
                'error' => 'User already exists with provided username.',
            ];
            return $this->json($resp, 500);
        }

        $user = new User();
        // $user->setUsername($request->request->get('username'));
        // $user->setPassword($request->request->get('password'));
        $user->setUsername($parameters['username']);
        $user->setPassword($parameters['password']);
   
        $entityManager->persist($user);
        $entityManager->flush();
   
        $data =  [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
        ];
        $resp = (object) [
            'message' => 'User created successfully.',
            'data' => $data
        ];
        return $this->json($resp);
    }

    #[Route('/user/{id}', name: 'user_show', methods:['get'] )]
    public function show(ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $user = $doctrine->getRepository(User::class)->find($id);
        if (!$user) {
            $resp = (object) [
                'error' => 'User does not exist.',
            ];
            return $this->json($resp, 404);
        }

        $data =  [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            // 'password' => $user->getPassword(),
        ];
        $resp = (object) [
            'data' => $data
        ];

        return $this->json($resp);
    }

    #[Route('/user/{id}', name: 'user_update', methods:['put', 'patch'] )]
    public function update(ManagerRegistry $doctrine, Request $request, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $user = $entityManager->getRepository(User::class)->find($id);
        if (!$user) {
            $resp = (object) [
                'error' => 'User does not exist.',
            ];
            return $this->json($resp, 404);
        }
        // $user->setUsername($request->request->get('username'));
        // $user->setPassword($request->request->get('password'));
        $parameters = json_decode($request->getContent(), true);
        $user->setUsername($parameters['username']);
        $user->setPassword($parameters['password']);
        $entityManager->flush();
   
        $data =  [
            'id' => $user->getId(),
            'username' => $user->getUsername(),
            // 'password' => $user->getPassword(),
        ];

        $resp = (object) [
            'mmessage' => 'User updated successfully',
            'data' => $data
        ];
           
        return $this->json($data);
    }

    #[Route('/user/{id}', name: 'user_delete', methods:['delete'] )]
    public function delete(ManagerRegistry $doctrine, int $id): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $user = $entityManager->getRepository(User::class)->find($id);
   
        if (!$user) {
            $resp = (object) [
                'error' => 'User does not exist.',
            ];
            return $this->json($resp, 404);
        }
   
        $entityManager->remove($user);
        $entityManager->flush();
        $resp = (object) [
            'mmessage' => 'User deleted successfully'
        ];
   
        return $this->json(resp);
    }

}
