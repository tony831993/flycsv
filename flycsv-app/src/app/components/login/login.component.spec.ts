import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { BehaviorSubject, throwError, of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let formBuilder: FormBuilder;

  beforeEach(async () => {
    const routerSpyObj = jasmine.createSpyObj('Router', ['navigate']);
    const authServiceSpyObj = jasmine.createSpyObj('AuthService', ['login']);

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerSpyObj },
        { provide: AuthService, useValue: authServiceSpyObj }
      ]
    })
      .compileComponents();

    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    formBuilder = TestBed.inject(FormBuilder);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set overlayDisplay to false on successful login', fakeAsync(() => {
    component.loginForm.setValue({ username: 'testUser', password: 'testPassword' });
    spyOn(component.loginForm as any, 'valid').and.returnValue(true);
    // Mock successful login response
    authServiceSpy.login.and.returnValue(of({ id: 1, username: 'testUser' }));
    // Mock loggedInUser property of AuthService
    const loggedInUserSubject = new BehaviorSubject<any>(null);
    authServiceSpy.loggedInUser = loggedInUserSubject;
    // Call onSubmit method
    component.onSubmit();
    tick(); // Finish all pending asynchronous activities
    expect(component.overlayDisplay).toBeFalse();
  }));

  it('should navigate to home on successful login', fakeAsync(() => {
    // Mock form as valid
    component.loginForm.setValue({ username: 'testUser', password: 'testPassword' });
    spyOn(component.loginForm as any, 'valid').and.returnValue(true);
    // Mock successful login response
    authServiceSpy.login.and.returnValue(of({ id: 1, username: 'testUser' }));
    // Mock loggedInUser property of AuthService
    const loggedInUserSubject = new BehaviorSubject<any>(null);
    authServiceSpy.loggedInUser = loggedInUserSubject;
    // Call onSubmit method
    component.onSubmit();
    tick(); // Finish all pending asynchronous activities
    // Expect router to have been called with 'home'
    expect(routerSpy.navigate).toHaveBeenCalledWith(['home']);
  }));

  it('should set overlayDisplay to false and loginError to true on login error', fakeAsync(() => {
    component.loginForm.setValue({ username: 'testUser', password: 'testPassword' });
    spyOn(component.loginForm as any, 'valid').and.returnValue(true); // Mock form as valid
    authServiceSpy.login.and.returnValue(throwError(new Error('Login error'))); // Mock login error
    component.onSubmit();
    tick(); // Finish all pending asynchronous activities
    expect(component.overlayDisplay).toBeFalse();
    expect(component.loginError).toBeTrue();
  }));
});
