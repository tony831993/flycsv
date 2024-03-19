import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RecordsComponent } from './records.component';
import { UtilityService } from 'src/app/services/utility.service';
import { of, throwError } from 'rxjs';
import { SortEvent, SortableHeaderDirective } from 'src/app/directives/sortable-header.directive';
import { QueryList } from '@angular/core';

describe('RecordsComponent', () => {
  let component: RecordsComponent;
  let fixture: ComponentFixture<RecordsComponent>;
  let utilityService: jasmine.SpyObj<UtilityService>;

  beforeEach(waitForAsync(() => {
    const utilityServiceSpy = jasmine.createSpyObj('UtilityService', ['getRecords']);

    TestBed.configureTestingModule({
      declarations: [ RecordsComponent ],
      providers: [
        { provide: UtilityService, useValue: utilityServiceSpy }
      ]
    }).compileComponents();

    utilityService = TestBed.inject(UtilityService) as jasmine.SpyObj<UtilityService>;
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RecordsComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch user records on initialization', () => {
    const records = [
      { "id": 1, "employee_id": 198, "firstname": "Donald", "lastname": "OConnell", "salary": 2600 },
      { "id": 2, "employee_id": 199, "firstname": "Douglas", "lastname": "Grant", "salary": 2600 }
    ];
    utilityService.getRecords.and.returnValue(of(records));
    component.ngOnInit();
    expect(utilityService.getRecords).toHaveBeenCalled();
    expect(component.records).toEqual(records);
    expect(component.tableRecords).toEqual(records);
  });

  it('should handle error when fetching user records', () => {
    const error = 'Error fetching records';
    utilityService.getRecords.and.returnValue(throwError(error));
    component.ngOnInit();
    expect(utilityService.getRecords).toHaveBeenCalled();
    expect(component.records).toEqual([]);
    expect(component.tableRecords).toEqual([]);
  });

  it('should sort records by column and direction', () => {
    // Mock the SortableHeaderDirective instances
    // Inside the test case
    const headers: SortableHeaderDirective[] = [
      new SortableHeaderDirective(),
      new SortableHeaderDirective()
    ];
    component.headers = new QueryList<SortableHeaderDirective>();
    component.headers.reset(headers);  // Assign mocked headers to the component
    console.log(component.headers);

    const records = [
      { "id": 1, "employee_id": 198, "firstname": "Donald", "lastname": "OConnell", "salary": 2600 },
      { "id": 2, "employee_id": 199, "firstname": "Douglas", "lastname": "Grant", "salary": 2600 }
    ];
    component.records = records;

    // Sort by name in ascending order
    component.onSort({ column: 'firstname', direction: 'asc' } as SortEvent);
    expect(component.tableRecords).toEqual([
      { "id": 1, "employee_id": 198, "firstname": "Donald", "lastname": "OConnell", "salary": 2600 },
      { "id": 2, "employee_id": 199, "firstname": "Douglas", "lastname": "Grant", "salary": 2600 }
    ]);

    // Sort by age in descending order
    component.onSort({ column: 'lastname', direction: 'desc' } as SortEvent);
    expect(component.tableRecords).toEqual([
      { "id": 1, "employee_id": 198, "firstname": "Donald", "lastname": "OConnell", "salary": 2600 },
      { "id": 2, "employee_id": 199, "firstname": "Douglas", "lastname": "Grant", "salary": 2600 }
    ]);
  });
});
