import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UtilityService } from './utility.service';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

describe('UtilityService', () => {
  let service: UtilityService;
  let authService: jasmine.SpyObj<AuthService>;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    const authServiceSpy = jasmine.createSpyObj('AuthService', ['getLoggedInUser']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        UtilityService,
        { provide: AuthService, useValue: authServiceSpy }
      ]
    });
    service = TestBed.inject(UtilityService);
    authService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should save CSV data', () => {
    const data = [
      { "employee_id": "198", "firstname": "Donald", "lastname": "OConnell", "salary": "2600" },
      { "employee_id": "199", "firstname": "Douglas", "lastname": "Grant", "salary": "2600" }
    ];
    const user = { id: 1 };
    authService.getLoggedInUser.and.returnValue(user);

    service.saveCsvData(data).subscribe(response => {
      expect(response).toEqual(data);
    });

    const req = httpMock.expectOne(`${environment.employeeUrl}/savedata`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ user_id: user.id, data });
    req.flush(data);
  });

  it('should get employee records', () => {
    const user = { id: 1 };
    authService.getLoggedInUser.and.returnValue(user);

    service.getRecords().subscribe(records => {
      expect(records).toEqual([]);
    });

    const req = httpMock.expectOne(`${environment.employeeUrl}/getdata`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ user_id: user.id });
    req.flush([]);
  });

  it('should check if file extension is valid', () => {
    const validFile = new File([''], 'test.csv');
    const invalidFile = new File([''], 'test.txt');

    expect(service.isValidCSVFile(validFile)).toBeTrue();
    expect(service.isValidCSVFile(invalidFile)).toBeFalse();
  });
});
