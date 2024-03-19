import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { AuthService } from './services/auth.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { RouterTestingModule } from '@angular/router/testing';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('AuthService', ['logout']);
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [RouterTestingModule], // Add RouterTestingModule to imports
      providers: [{ provide: AuthService, useValue: spy }]
    }).compileComponents();

    // Initialize the authServiceSpy
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    // Provide a mock loggedInUser observable
    authServiceSpy.loggedInUser = new BehaviorSubject<any>(null);
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user from localStorage', () => {
    const mockUser = { id: 1, username: 'admin' };
    spyOn(localStorage, 'getItem').and.returnValue(JSON.stringify(mockUser));
    // Simulate the loggedInUser observable behavior
    authServiceSpy.loggedInUser = new BehaviorSubject<any>(mockUser);
    component.ngOnInit();
    expect(component.user).toEqual(mockUser);
  });

  it('should subscribe to loggedInUser and update user', () => {
   // User object emitted by loggedInUser observable
   const mockLoggedInUser = { id: 1, username: 'admin' };
   // Emit the mockLoggedInUser from the loggedInUser observable
   authServiceSpy.loggedInUser.next(mockLoggedInUser);
   // Expect the user property to be updated with the emitted user object
   expect(component.user).toEqual(mockLoggedInUser);
  });

  it('should call logout method of AuthService and set user to null', () => {
    component.logout();
    expect(authServiceSpy.logout).toHaveBeenCalled();
    expect(component.user).toBeNull();
  });
});