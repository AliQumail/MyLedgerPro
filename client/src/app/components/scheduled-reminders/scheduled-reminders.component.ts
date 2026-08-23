import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { faPlus, faClock, faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrashCan } from '@fortawesome/free-regular-svg-icons';
import { AuthService } from 'src/app/services/auth.service';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { ReminderScheduleService } from 'src/app/services/reminder-schedule/reminder-schedule.service';
import { ConfirmDialogService } from 'src/app/shared/confirm-dialog/confirm-dialog.service';

@Component({
  selector: 'app-scheduled-reminders',
  templateUrl: './scheduled-reminders.component.html',
  styleUrls: ['./scheduled-reminders.component.css']
})
export class ScheduledRemindersComponent implements OnInit {
  constructor(
    private modalService: NgbModal,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService,
    private authService: AuthService,
    private customerService: CustomerService,
    private reminderScheduleService: ReminderScheduleService,
    private confirmDialog: ConfirmDialogService
  ) {}

  faPlus = faPlus;
  faClock = faClock;
  faTrashCan = faTrashCan;
  faPenToSquare = faPenToSquare;

  userId: any;
  schedules: any[] = [];
  customers: any[] = [];
  scheduledCustomerIds: Set<string> = new Set();

  editingScheduleId: string | null = null;
  editingCustomerName: string = '';
  selectedCustomerIds: Set<string> = new Set();

  weekDays = [
    { value: 0, label: 'Sunday' },
    { value: 1, label: 'Monday' },
    { value: 2, label: 'Tuesday' },
    { value: 3, label: 'Wednesday' },
    { value: 4, label: 'Thursday' },
    { value: 5, label: 'Friday' },
    { value: 6, label: 'Saturday' },
  ];

  scheduleForm: FormGroup = new FormGroup({
    frequency: new FormControl('Weekly', Validators.required),
    timeOfDay: new FormControl('09:00', Validators.required),
    dayOfWeek: new FormControl(1),
    dayOfMonth: new FormControl(1),
  });

  ngOnInit() {
    this.authService.isAuthenticated();
    this.userId = localStorage.getItem('userId');
    this.loadCustomers();
    this.loadSchedules();
  }

  loadCustomers() {
    this.customerService.getCustomerSummary({ id: this.userId }).subscribe(
      (res: any) => {
        this.customers = (res || []).map((c: any) => ({ id: c.customerId, name: c.customerName }));
      },
      () => {}
    );
  }

  loadSchedules() {
    this.spinner.show();
    this.reminderScheduleService.list(this.userId).subscribe(
      (res: any) => {
        this.spinner.hide();
        this.schedules = res || [];
        this.scheduledCustomerIds = new Set(this.schedules.map((s) => s.customerId));
      },
      () => {
        this.spinner.hide();
        this.toastr.error('Failed to load scheduled reminders');
      }
    );
  }

  get availableCustomers() {
    return this.customers.filter((c) => !this.scheduledCustomerIds.has(c.id));
  }

  get allAvailableSelected(): boolean {
    return this.availableCustomers.length > 0 &&
      this.availableCustomers.every((c) => this.selectedCustomerIds.has(c.id));
  }

  toggleCustomerSelection(customerId: string) {
    if (this.selectedCustomerIds.has(customerId)) {
      this.selectedCustomerIds.delete(customerId);
    } else {
      this.selectedCustomerIds.add(customerId);
    }
  }

  toggleSelectAll() {
    if (this.allAvailableSelected) {
      this.selectedCustomerIds.clear();
    } else {
      this.selectedCustomerIds = new Set(this.availableCustomers.map((c) => c.id));
    }
  }

  openCreate(content: any) {
    this.editingScheduleId = null;
    this.selectedCustomerIds = new Set();
    this.scheduleForm.reset({
      frequency: 'Weekly',
      timeOfDay: '09:00',
      dayOfWeek: 1,
      dayOfMonth: 1,
    });
    this.modalService.open(content, { backdrop: 'static', backdropClass: 'customBackdrop' });
  }

  openEdit(content: any, schedule: any) {
    this.editingScheduleId = schedule.id;
    this.editingCustomerName = schedule.customerName;
    this.selectedCustomerIds = new Set([schedule.customerId]);
    this.scheduleForm.reset({
      frequency: schedule.frequency,
      timeOfDay: schedule.timeOfDay,
      dayOfWeek: schedule.dayOfWeek ?? 1,
      dayOfMonth: schedule.dayOfMonth ?? 1,
    });
    this.modalService.open(content, { backdrop: 'static', backdropClass: 'customBackdrop' });
  }

  saveSchedule() {
    if (this.scheduleForm.invalid) return;

    if (this.editingScheduleId) {
      this.updateSchedule();
    } else {
      this.createSchedules();
    }
  }

  private createSchedules() {
    if (this.selectedCustomerIds.size === 0) {
      this.toastr.error('Select at least one customer');
      return;
    }

    const value = this.scheduleForm.value;
    const request = {
      userId: this.userId,
      customerIds: Array.from(this.selectedCustomerIds),
      frequency: value.frequency,
      timeOfDay: value.timeOfDay,
      dayOfWeek: value.frequency === 'Weekly' ? value.dayOfWeek : null,
      dayOfMonth: value.frequency === 'Monthly' ? value.dayOfMonth : null,
    };

    this.spinner.show();
    this.reminderScheduleService.create(request).subscribe(
      () => {
        this.spinner.hide();
        this.toastr.success('Reminder(s) scheduled');
        this.modalService.dismissAll();
        this.loadSchedules();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error?.error || 'Failed to schedule reminder');
      }
    );
  }

  private updateSchedule() {
    const value = this.scheduleForm.value;
    const request = {
      frequency: value.frequency,
      timeOfDay: value.timeOfDay,
      dayOfWeek: value.frequency === 'Weekly' ? value.dayOfWeek : null,
      dayOfMonth: value.frequency === 'Monthly' ? value.dayOfMonth : null,
      isActive: true,
    };

    this.spinner.show();
    this.reminderScheduleService.update(this.editingScheduleId as string, request).subscribe(
      () => {
        this.spinner.hide();
        this.toastr.success('Reminder schedule updated');
        this.modalService.dismissAll();
        this.loadSchedules();
      },
      (error) => {
        this.spinner.hide();
        this.toastr.error(error?.error || 'Failed to update reminder schedule');
      }
    );
  }

  toggleActive(schedule: any) {
    this.reminderScheduleService.toggle(schedule.id, !schedule.isActive).subscribe(
      () => {
        schedule.isActive = !schedule.isActive;
        this.toastr.success(schedule.isActive ? 'Reminder resumed' : 'Reminder paused');
      },
      () => {
        this.toastr.error('Failed to update reminder');
      }
    );
  }

  async deleteSchedule(schedule: any) {
    const confirmed = await this.confirmDialog.confirm(
      'Delete this scheduled reminder?',
      'This will stop and permanently remove this reminder schedule.',
      'Delete Schedule'
    );
    if (!confirmed) return;

    this.reminderScheduleService.delete(schedule.id).subscribe(
      () => {
        this.toastr.success('Reminder schedule deleted');
        this.schedules = this.schedules.filter((s) => s.id !== schedule.id);
        this.scheduledCustomerIds.delete(schedule.customerId);
      },
      () => {
        this.toastr.error('Failed to delete reminder schedule');
      }
    );
  }

  frequencyLabel(schedule: any): string {
    if (schedule.frequency === 'Weekly') {
      const day = this.weekDays.find((d) => d.value === schedule.dayOfWeek);
      return `Weekly on ${day?.label || '-'}, ${schedule.timeOfDay}`;
    }
    if (schedule.frequency === 'Monthly') {
      return `Monthly on day ${schedule.dayOfMonth}, ${schedule.timeOfDay}`;
    }
    if (schedule.frequency === 'Daily') {
      return `Daily at ${schedule.timeOfDay}`;
    }
    return `Once at ${schedule.timeOfDay}`;
  }
}
