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

    #[Route('/employee/savedata', name: 'employee_save_data', methods:['post'] )]
    public function saveData(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        try {
            $entityManager = $doctrine->getManager();
            $parameters = json_decode($request->getContent(), true);
            if(!isset($parameters['user_id'])) {
                return $this->json(['error' => 'Please provide a valid user.'], Response::HTTP_BAD_REQUEST);
            }
            if(!isset($parameters['data'])) {
                return $this->json(['error' => 'Please provide valid data.'], Response::HTTP_BAD_REQUEST);
            }
            $user = $entityManager->getRepository(User::class)->find($parameters['user_id']);
            if(!$user) {
                return $this->json(['error' => 'Invalid user.'], Response::HTTP_BAD_REQUEST);
            }

            $records = json_decode($parameters['data']);
            foreach ($records as $record) {
                $employee = new Employee();
                $employee->setEmployeeID((int)$record->employee_id);
                $employee->setUserId((int)$parameters['user_id']);
                $employee->setFirstName($record->firstname);
                $employee->setLastName($record->lastname);
                $employee->setSalary((float)$record->salary);
                $entityManager->persist($employee);
            }
            $entityManager->flush();
            $resp = (object) [
                'message' => 'Records saved successfully.',
            ];
            return $this->json($resp);
        } catch(\Exception $ex){
            $resp = (object) [
                'error' => 'Failure: '. $ex->getMessage(),
            ];
            return $this->json($resp, 500);
        }
    }

    #[Route('/employee/getdata', name: 'employee_get_data', methods:['post'] )]
    public function getData(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        $entityManager = $doctrine->getManager();
        $parameters = json_decode($request->getContent(), true);
        if(!isset($parameters['user_id'])) {
            return $this->json(['error' => 'Please provide a valid user.'], Response::HTTP_BAD_REQUEST);
        }

        $user = $entityManager->getRepository(User::class)->find($parameters['user_id']);
        if(!$user) {
            return $this->json(['error' => 'Invalid user.'], Response::HTTP_BAD_REQUEST);
        }

        $employees = $entityManager->getRepository(Employee::class)->findBy(['user_id' => $parameters['user_id']]);
        if (!$employees) {
            return $this->json([]);
        }

        // Serialize the employees and return as JSON response
        $serializedEmployees = [];
        foreach ($employees as $employee) {
            $serializedEmployees[] = [
                'id' => $employee->getId(),
                'employee_id' => $employee->getEmployeeID(),
                'firstname' => $employee->getFirstName(),
                'lastname' => $employee->getLastName(),
                'salary' => $employee->getSalary(),
            ];
        }

        return $this->json($serializedEmployees);
    }

    #[Route('/employee/csv/upload', name: 'csv_upload', methods:['post'] )]
    public function upload(ManagerRegistry $doctrine, Request $request): JsonResponse
    {
        try {
            $entityManager = $doctrine->getManager();
            $csvFile = $request->files->get('csv_file');
            $user_id = $request->request->get('user_id');

            $user = $entityManager->getRepository(User::class)->find($user_id);
            if(!$user) {
                return $this->json(['error' => 'Invalid user.'], Response::HTTP_BAD_REQUEST);
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
        } catch (\Exception $ex) {
            $resp = (object) [
                'error' => 'Failure: '. $ex->getMessage()
            ];
            return $this->json($resp);
        }
    }
}
