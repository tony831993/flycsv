<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Doctrine\Persistence\ManagerRegistry;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;

use App\Entity\Employee;
use App\Entity\User;

#[Route('/api', name: 'api_')]
class EmployeeController extends AbstractController
{
    // #[Route('/employee', name: 'app_employee')]
    // public function index(): JsonResponse
    // {
    //     return $this->json([
    //         'message' => 'Welcome to your new controller!',
    //         'path' => 'src/Controller/EmployeeController.php',
    //     ]);
    // }

    #[Route('/csv/upload', name: 'csv_upload', methods:['post'] )]
    public function login(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $csvFile = $request->files->get('csv_file');
        $user_id = $request->request->get('user_id');

        $user = $entityManager->getRepository(User::class)->find($user_id);
        if(!$user) {
            return $this->json(['error' => 'Unable to save data. Invalid user.'], Response::HTTP_BAD_REQUEST);
        }

        if (!$csvFile) {
            return $this->json(['error' => 'No file uploaded'], Response::HTTP_BAD_REQUEST);
        }
         // Check if the file is a CSV file
         if ($csvFile->getClientOriginalExtension() !== 'csv') {
            return $this->json(['error' => 'Invalid file format. Only CSV files are allowed.'], Response::HTTP_BAD_REQUEST);
        }

        $fileContent = file_get_contents($csvFile->getPathname());
        $lines = explode("\n", $fileContent);
        $count = 0;
        foreach ($lines as $line) {
            $data = str_getcsv($line);
            if (count($data) == 4 && $count != 0) {
                // Create Employee entity and persist it to the database
                $employee = new Employee();
                $employee->setEmployeeID((int)$data[0]);
                $employee->setUserId((int)$user_id);
                $employee->setFirstName($data[1]);
                $employee->setLastName($data[2]);
                $employee->setSalary((float)$data[3]);
                $entityManager->persist($employee);
            }
            $count++;
        }
        $entityManager->flush();

        $resp = (object) [
            'message' => 'CSV uploaded successfully.',
        ];
        return $this->json($resp);
        
    }
}
