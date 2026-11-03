import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adminstaff',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
<div class="alert alert-warning" role="alert" data-apex-backend-action="unmigrated" *ngIf="backendActionNotice">{backendActionNotice}</div>
<div class="alert alert-success" role="alert" *ngIf="submitSuccess">{submitSuccess === true ? "Form submitted successfully." : submitSuccess}</div>
<div class="alert alert-danger" role="alert" *ngIf="submitError">{submitError}</div>
<div class="navbar">
        <div class="logo">
            <a href="/">
                <img src="/images/bank-logo.jpg" alt="Bank of India" class="bank-logo" />
                Bank of <span class="brand-orange">India</span>
            </a>
        </div>
    
        <div class="nav">
            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(userObj != null)">
                    <span class="user-badge">
                        👤 {userObj?.name}
                        <span class="role-pill">
                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(userObj?.role == 'ROLE_CUSTOMER')">Customer</ng-container>
      <ng-container *ngSwitchCase="!!(userObj?.role == 'ROLE_LOAN_OFFICER')">Loan Officer</ng-container>
      <ng-container *ngSwitchCase="!!(userObj?.role == 'ROLE_COLLECTIONS_AGENT')">Collections Agent</ng-container>
      <ng-container *ngSwitchCase="!!(userObj?.role == 'ROLE_COLLECTIONS_MANAGER')">Collections Manager</ng-container>
      <ng-container *ngSwitchCase="!!(userObj?.role == 'ROLE_ADMIN')">Admin</ng-container>
      <ng-container *ngSwitchDefault>{userObj?.role}</ng-container>
    </ng-container>
                        </span>
                    </span>
    
                    <a href="/dashboard">Dashboard</a>
    
                    <ng-container *ngIf="userObj?.role == 'ROLE_LOAN_OFFICER' || userObj?.role == 'ROLE_COLLECTIONS_AGENT' || userObj?.role == 'ROLE_COLLECTIONS_MANAGER' || userObj?.role == 'ROLE_ADMIN'">
                        <a href="/loan-search">Loan Search</a>
                    </ng-container>
    
                    <ng-container *ngIf="userObj?.role == 'ROLE_LOAN_OFFICER' || userObj?.role == 'ROLE_ADMIN'">
                        <a href="/loan-approval.xhtml" style="font-weight:700; color:#ED7D16;">Loan Approvals (JSF)</a>
                    </ng-container>
    
                    <ng-container *ngIf="userObj?.role == 'ROLE_ADMIN'">
                        <a href="/admin/staff">Staff Management</a>
                        <a href="/admin/audit-logs">Audit Trail</a>
                        <a href="/admin/reminders/demo" style="color:#d97706; font-weight:700;">🔔 DPD Reminders Demo</a>
                    </ng-container>
    
                    <ng-container *ngIf="userObj?.role == 'ROLE_CUSTOMER'">
                        <a href="/applyLoan">Apply Loan</a>
                    </ng-container>
    
                    <a href="/settings-hub.xhtml" style="font-weight:700; color:#0050A4;">⚙️ Settings</a>
    
                    <form (ngSubmit)="onSubmit()" class="logout-form" action="/logout" method="post">
                        <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
                        <button type="submit" class="logout-btn">Log Out</button>
                    </form>
                </ng-container>
      <ng-container *ngSwitchDefault>
                    <a href="/">Home</a>
                    <a href="/login">Login</a>
                    <a href="/register">Sign Up</a>
                </ng-container>
    </ng-container>
        </div>
    </div>
    
    
    <ng-container *ngIf="userObj != null">
    <div id="sessionModal">
        <div class="modal-content">
            <h3 style="margin-top:0; color:#2d3748;">Session Inactivity Warning</h3>
            <p style="color:#718096; font-size:14px;">Your session is about to expire due to inactivity.</p>
            <div class="countdown-timer" id="sessionCountdown">60</div>
            <p style="color:#718096; font-size:13px;">Seconds remaining before automatic logout</p>
            <div style="display:flex; gap:10px; margin-top:20px;">
                <button class="btn" (click)="stayLoggedIn()">Stay Logged In</button>
                <button class="btn btn-secondary" (click)="logoutNow()">Log Out Now</button>
            </div>
        </div>
    </div>
    
    
    </ng-container>
    
    
    <div class="wide-card">
        <h2 style="margin-top:0; color:#2c3e50;">🛡️ Bank Staff Management</h2>
        <p style="color:#718096; font-size:14px; margin-top:-10px;">
            Authorized Administrator Portal: Provision staff accounts, assign roles, unlock accounts, and reset MFA.
        </p>
    
        <ng-container *ngIf="param?.success == 'provisioned'">
            <div class="alert alert-success">Staff member successfully provisioned with mandatory MFA enrollment.</div>
        </ng-container>
        <ng-container *ngIf="param?.success == 'unlocked'">
            <div class="alert alert-success">Staff account has been unlocked. Failed attempt counter reset.</div>
        </ng-container>
        <ng-container *ngIf="param?.success == 'role_updated'">
            <div class="alert alert-success">Staff role successfully updated.</div>
        </ng-container>
        <ng-container *ngIf="param?.success == 'mfa_reset'">
            <div class="alert alert-success">MFA secret has been reset for the staff member.</div>
        </ng-container>
        <ng-container *ngIf="!!(errorMessage)">
            <div class="alert alert-error">{errorMessage}</div>
        </ng-container>
    
        <h3 style="color:#2d3748; margin-top:30px; border-bottom:2px solid #edf2f7; padding-bottom:10px;">Existing Staff Directory</h3>
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Status</th>
                    <th>MFA</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <ng-container *ngFor="let staff of (staffList || [])">
                    <tr>
                        <td>{staff?.id}</td>
                        <td><strong>{staff?.name}</strong></td>
                        <td>{staff?.email}</td>
                        <td>
                            <form (ngSubmit)="onSubmit()" action="/admin/staff/role" method="post" style="display:flex; gap:6px; margin:0;">
                                <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
                                <input type="hidden" name="staffId" [(ngModel)]="formData['staffId']" />
                                <select name="newRole" style="padding:4px 8px; margin:0; width:auto; font-size:12px;" [(ngModel)]="formData['newRole']">
                                    <ng-container *ngFor="let r of (roles || [])">
                                        <option {staff?.role == r ? 'selected' : ''}>{r?.displayName}</option>
                                    </ng-container>
                                </select>
                                <button type="submit" class="btn" style="padding:4px 8px; width:auto; font-size:12px;">Change</button>
                            </form>
                        </td>
                        <td>
                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(staff?.accountNonLocked)">
                                    <span style="color:#276749; background:#c6f6d5; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">ACTIVE</span>
                                </ng-container>
      <ng-container *ngSwitchDefault>
                                    <span style="color:#c53030; background:#fed7d7; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">LOCKED (5 failures)</span>
                                </ng-container>
    </ng-container>
                        </td>
                        <td>
                            <span style="color:#2b6cb0; background:#bee3f8; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">
                                {staff?.mfaType} (Enrolled)
                            </span>
                        </td>
                        <td>
                            <div style="display:flex; gap:6px;">
                                <ng-container *ngIf="!staff?.accountNonLocked">
                                    <form (ngSubmit)="onSubmit()" action="/admin/staff/unlock" method="post" style="margin:0;">
                                        <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
                                        <input type="hidden" name="email" [(ngModel)]="formData['email']" />
                                        <button type="submit" class="btn btn-secondary" style="padding:4px 10px; width:auto; font-size:12px;">Unlock</button>
                                    </form>
                                </ng-container>
                                <form (ngSubmit)="onSubmit()" action="/admin/staff/reset-mfa" method="post" style="margin:0;">
                                    <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
                                    <input type="hidden" name="staffId" [(ngModel)]="formData['staffId']" />
                                    <button type="submit" class="btn btn-danger" style="padding:4px 10px; width:auto; font-size:12px;">Reset MFA</button>
                                </form>
                            </div>
                        </td>
                    </tr>
                </ng-container>
            </tbody>
        </table>
    
        <h3 style="color:#2d3748; margin-top:40px; border-bottom:2px solid #edf2f7; padding-bottom:10px;">➕ Provision New Staff Account</h3>
        <form (ngSubmit)="onSubmit()" action="/admin/staff/provision" method="post" style="max-width:600px; margin-top:20px;">
            <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
    
            <label style="font-weight:600; font-size:13px; color:#4a5568;">Full Name</label>
            <input type="text" name="name" placeholder="Staff Member Name" required [(ngModel)]="formData['name']" />
    
            <label style="font-weight:600; font-size:13px; color:#4a5568;">Corporate Email Address</label>
            <input type="email" name="email" placeholder="staff@bank.com" required [(ngModel)]="formData['email']" />
    
            <label style="font-weight:600; font-size:13px; color:#4a5568;">Temporary Password</label>
            <input type="password" name="password" placeholder="Min 8 characters with upper, lower, number, special" required [(ngModel)]="formData['password']" />
    
            <label style="font-weight:600; font-size:13px; color:#4a5568;">Assigned Role</label>
            <select name="role" required [(ngModel)]="formData['role']">
                <option value="ROLE_LOAN_OFFICER">Loan Officer (Origination & Processing)</option>
                <option value="ROLE_COLLECTIONS_AGENT">Collections Agent (Repayment Management)</option>
                <option value="ROLE_COLLECTIONS_MANAGER">Collections Manager (Supervision & Repayments)</option>
                <option value="ROLE_ADMIN">Administrator (Staff Provisioning & Security Auditing)</option>
            </select>
    
            <button type="submit" class="btn" style="margin-top:10px; width:auto; padding:12px 30px;">Provision Staff Member</button>
        </form>
    </div>
  `
})
export class AdminStaffComponent implements OnInit, OnDestroy {
  param: Record<string, any> = {};
  errorMessage: string = '';
  private _activeTimers: Array<{ type: 'timeout' | 'interval'; id: any }> = [];
  private _activeListeners: Array<{ target: EventTarget; type: string; listener: any; options?: any }> = [];
  _csrf: any = undefined;
  r: any = undefined;
  staff: any = undefined;
  userObj: any = undefined;
  formData: Record<string, any> = {
    'parameterName': '',
    'staffId': '',
    'email': '',
    'name': '',
    'password': '',
    'newRole': '',
    'role': '',
  };
  backendActionNotice: string = '';
  isSubmitting: boolean = false;
  submitError: string | null = null;
  submitSuccess: string | boolean = false;
  userObj: any = undefined;
  data: Record<string, any> = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.param = { ...(this.data?.['param'] || {}) };
    this.route?.queryParams?.subscribe((params) => {
      this.param = { ...params, ...(this.data?.['param'] || {}) };
      if (this.data) { this.data['param'] = this.param; }
    });
    (window as any).resetInactivity = this.resetInactivity.bind(this);
    (window as any).showWarningModal = this.showWarningModal.bind(this);
    (window as any).stayLoggedIn = this.stayLoggedIn.bind(this);
    (window as any).logoutNow = this.logoutNow.bind(this);
    try {
      // Server-side session timeout is exactly 10 minutes (600 seconds)
          // Warning displayed 60 seconds before expiration (at 540 seconds)
          const TOTAL_TIMEOUT_SEC = 600;
          const WARNING_TIME_SEC = 60;
          const INACTIVITY_LIMIT_SEC = TOTAL_TIMEOUT_SEC - WARNING_TIME_SEC; // 540 seconds
          let inactivityTimer = 0;
          let warningCountdown = WARNING_TIME_SEC;
          let countdownInterval = null;
          let modalShown = false;
          function resetInactivity() {
              if (!modalShown) {
                  inactivityTimer = 0;
              }
          }
          // Reset inactivity counter on user interactions (mouse, keyboard)
          this.registerListener(window, 'mousemove', resetInactivity);
          this.registerListener(window, 'keydown', resetInactivity);
          this.registerListener(window, 'click', resetInactivity);
          this.registerTimer('interval', window.setInterval(function() {
              if (!modalShown) {
                  inactivityTimer++;
                  if (inactivityTimer >= INACTIVITY_LIMIT_SEC) {
                      showWarningModal();
                  }
              }
          }, 1000));
          function showWarningModal() {
              modalShown = true;
              warningCountdown = WARNING_TIME_SEC;
              document.getElementById('sessionCountdown').innerText = warningCountdown;
              document.getElementById('sessionModal').style.display = 'flex';
              countdownInterval = this.registerTimer('interval', window.setInterval(function() {
                  warningCountdown--;
                  document.getElementById('sessionCountdown').innerText = warningCountdown;
                  if (warningCountdown <= 0) {
                      clearInterval(countdownInterval);
                      // Inactivity limit reached: redirect to login with expired notice
                      window.location.href = '/login?expired=true';
                  }
              }, 1000));
          }
          function stayLoggedIn() {
              // Send keep-alive request to server with CSRF header
              const csrfToken = document.querySelector('meta[name="_csrf"]').getAttribute('content');
              const csrfHeader = document.querySelector('meta[name="_csrf_header"]').getAttribute('content');
              fetch('/session/keep-alive', {
                  method: 'POST',
                  headers: {
                      [csrfHeader]: csrfToken
                  }
              }).then(response => {
                  if (response.ok) {
                      clearInterval(countdownInterval);
                      modalShown = false;
                      inactivityTimer = 0;
                      document.getElementById('sessionModal').style.display = 'none';
                  } else {
                      window.location.href = '/login?expired=true';
                  }
              }).catch(() => {
                  window.location.href = '/login?expired=true';
              });
          }
          function logoutNow() {
              // Submit logout form
              const logoutForm = document.querySelector('.logout-form');
              if (logoutForm) {
                  logoutForm.submit();
              } else {
                  window.location.href = '/login?logout=true';
              }
          }
    } catch (e) { console.warn(e); }
    this._csrf = this.data?.['_csrf'] ?? this._csrf;
    this.r = this.data?.['r'] ?? this.r;
    this.staff = this.data?.['staff'] ?? this.staff;
    this.userObj = this.data?.['userObj'] ?? this.userObj;
    this.userObj = Boolean((data?.sessionScope?.user || data?.user)) ? (data?.sessionScope?.user || data?.user) : (data?.currentUser || data?.user || null);
  }

  ngOnDestroy(): void {
    this._activeTimers.forEach(t => {
      try {
        if (t.type === 'timeout') clearTimeout(t.id);
        else if (t.type === 'interval') clearInterval(t.id);
      } catch (e) {}
    });
    this._activeListeners.forEach(l => {
      try { l.target.removeEventListener(l.type, l.listener, l.options); } catch (e) {}
    });
  }

  registerTimer(type: 'timeout' | 'interval', id: any): any {
    this._activeTimers.push({ type, id });
    return id;
  }

  registerListener(target: EventTarget, type: string, listener: any, options?: any): any {
    this._activeListeners.push({ target, type, listener, options });
    target.addEventListener(type, listener, options);
    return listener;
  }

  logoutNow(...args: any[]): void {
    try {
      if (typeof (window as any).logoutNow === 'function') {
        (window as any).logoutNow(...args);
      }
    } catch (e) {}
  }

  resetInactivity(...args: any[]): void {
    try {
      if (typeof (window as any).resetInactivity === 'function') {
        (window as any).resetInactivity(...args);
      }
    } catch (e) {}
  }

  showWarningModal(...args: any[]): void {
    try {
      if (typeof (window as any).showWarningModal === 'function') {
        (window as any).showWarningModal(...args);
      }
    } catch (e) {}
  }

  stayLoggedIn(...args: any[]): void {
    try {
      if (typeof (window as any).stayLoggedIn === 'function') {
        (window as any).stayLoggedIn(...args);
      }
    } catch (e) {}
  }

  async onSubmit(): Promise<void> {
    if (this.isSubmitting) return;
    this.isSubmitting = true;
    this.submitError = null;
    this.submitSuccess = false;
    try {
      const targetUrl = '/logout' || (typeof window !== 'undefined' ? window.location.pathname : '');
      const res = await fetch(targetUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(this.formData),
      });
      if (res.ok) {
        const resData = await res.json().catch(() => null);
        this.submitSuccess = resData?.message || 'Form submitted successfully.';
        if (resData?.redirect && typeof window !== 'undefined') {
          registerTimer('timeout', window.setTimeout(() => { window.location.href = resData.redirect; }, 1200));
        }
      } else {
        this.submitError = `Request failed with status ${res.status}`;
      }
    } catch (err: any) {
      this.submitError = err?.message || 'Submission failed';
    } finally {
      this.isSubmitting = false;
    }
  }

  onBackendAction(action: string): void {
    this.backendActionNotice = action
      ? `The original backend action '${action}' has not been migrated to an API endpoint, so the action was not sent.`
      : "This form originally submitted to '/logout' using POST. That backend action has not been migrated to an API endpoint, so the form was not submitted.";
  }
}

export default AdminStaffComponent;