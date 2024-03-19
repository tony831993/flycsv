import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from './auth.service';
import { environment } from 'src/environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    localStorage.clear(); // Clear localStorage after each test
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user', () => {
    const mockUser = { id: 1, username: 'testuser' };
    const username = 'testuser';
    const password = 'password';
    service.login(username, password).subscribe(user => {
      expect(user).toEqual(mockUser);
    });

    const req = httpMock.expectOne(environment.loginUrl);
    expect(req.request.method).toBe('POST');
    req.flush(mockUser);
  });

  it('should check if user is logged in', () => {
    expect(service.isLoggedIn()).toBeFalsy(); // Expect user not logged in initially

    localStorage.setItem('user', JSON.stringify({ id: 1, username: 'testuser' }));
    expect(service.isLoggedIn()).toBeTruthy(); // Expect user to be logged in after setting user in localStorage
  });

  it('should get logged in user details', () => {
    const mockUser = { id: 1, username: 'testuser' };
    localStorage.setItem('user', JSON.stringify(mockUser));
    expect(service.getLoggedInUser()).toEqual(mockUser); // Expect logged in user details to be retrieved from localStorage
  });

  it('should logout a user', () => {
    spyOn(service['router'], 'navigate'); // Spy on router.navigate method
    service.logout();
    expect(localStorage.getItem('user')).toBeNull(); // Expect user data to be removed from localStorage
    expect(service['router'].navigate).toHaveBeenCalledWith(['login']); // Expect router.navigate to be called with ['login']
  });
});
