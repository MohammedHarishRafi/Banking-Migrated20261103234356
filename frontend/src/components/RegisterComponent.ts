import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-register',
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
    
    
    <div class="card">
        <h2 style="text-align:center; margin-top:0; color:#2c3e50;">Customer Registration</h2>
        <p style="text-align:center; color:#718096; font-size:13px; margin-top:-10px; margin-bottom:20px;">
            Register a new borrower account to apply and track loans.
        </p>
    
        <ng-container *ngIf="!!(errorMessage)">
            <div class="alert alert-error">{errorMessage}</div>
        </ng-container>
    
        <form (ngSubmit)="onSubmit()" action="/register" method="post">
            
            <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
    
            <label style="font-weight:600; font-size:13px; color:#4a5568;">Full Name</label>
            <input type="text" name="name" placeholder="John Doe" required [(ngModel)]="formData['name']" />
    
            <label style="font-weight:600; font-size:13px; color:#4a5568;">Email Address</label>
            <input type="email" name="email" placeholder="customer@example.com" required [(ngModel)]="formData['email']" />
    
            <label style="font-weight:600; font-size:13px; color:#4a5568;">Password</label>
            <input type="password" name="password" placeholder="Choose a password" required [(ngModel)]="formData['password']" />
    
            <button type="submit" class="btn" style="margin-top:10px;">Create Customer Account</button>
        </form>
    
        <div style="text-align:center; margin-top:20px; font-size:13px; color:#718096;">
            Already registered? <a href="/login" style="color:#e67e22; text-decoration:none; font-weight:600;">Sign In</a>
        </div>
    </div>
  `
})
export class RegisterComponent implements OnInit, OnDestroy {
  param: Record<string, any> = {};
  errorMessage: string = '';
  private _activeTimers: Array<{ type: 'timeout' | 'interval'; id: any }> = [];
  private _activeListeners: Array<{ target: EventTarget; type: string; listener: any; options?: any }> = [];
  _csrf: any = undefined;
  userObj: any = undefined;
  formData: Record<string, any> = {
    'parameterName': '',
    'name': '',
    'email': '',
    'password': '',
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

export default RegisterComponent;