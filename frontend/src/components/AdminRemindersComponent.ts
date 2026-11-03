import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-adminreminders',
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
    
    
    <div class="wide-card" style="max-width: 1400px; margin: 20px auto; padding: 25px;">
    
        
        <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:2px solid #edf2f7; padding-bottom:15px; margin-bottom:25px; flex-wrap:wrap; gap:15px;">
            <div>
                <h2 style="margin:0; color:#1e293b; font-size:24px; font-weight:800; display:flex; align-items:center; gap:10px;">
                    🔔 DPD 1–3 Automated Loan Reminder Interactive Demo
                </h2>
                <p style="color:#64748b; font-size:14px; margin:6px 0 0 0;">
                    Demonstrate automated reminder dispatches, DPD 1–3 email notices, webhook lifecycle, and SMS fallback for overdue borrowers.
                </p>
            </div>
            <div style="display:flex; gap:10px; align-items:center;">
                <span style="background:#e0f2fe; color:#0369a1; padding:6px 14px; border-radius:20px; font-size:13px; font-weight:600;">
                    📅 System Business Date: <strong>{today}</strong>
                </span>
                <span style="background:#fef3c7; color:#92400e; padding:6px 14px; border-radius:20px; font-size:13px; font-weight:600;">
                    ⏰ Scheduler: <strong>Daily at 9:00 AM (Asia/Kolkata)</strong>
                </span>
            </div>
        </div>
    
        
        <ng-container *ngIf="param?.success == 'loan_created_and_sent'">
            <div class="alert alert-success" style="background:#ecfdf5; border:1px solid #10b981; color:#065f46; padding:14px 18px; border-radius:8px; margin-bottom:20px; box-shadow:0 2px 4px rgba(16,185,129,0.1);">
                <div style="font-weight:700; font-size:15px; margin-bottom:4px;">✉️ Overdue Loan Created & Reminder Email Sent!</div>
                <div>The delinquent installment was recorded and the DPD reminder email has been dispatched immediately to the recipient's email address. Check your inbox!</div>
            </div>
        </ng-container>
        <ng-container *ngIf="param?.success == 'loan_created'">
            <div class="alert alert-success" style="background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; padding:12px 18px; border-radius:8px; margin-bottom:20px;">
                ✅ <strong>Demo Overdue Installment Created!</strong> The customer and delinquent installment are now primed for automated reminder processing.
            </div>
        </ng-container>
        <ng-container *ngIf="param?.success == 'scheduler_executed'">
            <div class="alert alert-success" style="background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; padding:12px 18px; border-radius:8px; margin-bottom:20px;">
                ⚡ <strong>Reminder Engine Executed!</strong> Overdue installments have been processed, reminder notices dispatched, and audit logs recorded.
            </div>
        </ng-container>
        <ng-container *ngIf="param?.success != null &amp;&amp; param?.success?.startsWith('webhook_')">
            <div class="alert alert-info" style="background:#eff6ff; border:1px solid #bfdbfe; color:#1e40af; padding:12px 18px; border-radius:8px; margin-bottom:20px;">
                📡 <strong>Provider Webhook Simulated!</strong> Status transition successfully reconciled in database.
            </div>
        </ng-container>
    
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap:25px; margin-bottom:30px;">
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:22px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                <h3 style="margin-top:0; color:#1e293b; font-size:17px; font-weight:700; border-bottom:1px solid #f1f5f9; padding-bottom:10px; display:flex; align-items:center; gap:8px;">
                    🎯 Step 1: Create or Setup Overdue Borrower
                </h3>
                <p style="color:#64748b; font-size:13px; margin-bottom:18px;">
                    Create a loan installment with a due date in the past (1, 2, or 3 days overdue) to trigger the workflow.
                </p>
    
                <form (ngSubmit)="onSubmit()" action="/admin/reminders/demo/create-overdue-loan" method="post">
                    <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
    
                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">Borrower Name</label>
                        <input type="text" name="customerName" placeholder="Enter borrower name" required style="width:100%; padding:9px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;" [(ngModel)]="formData['customerName']" />
                    </div>
    
                    <div style="margin-bottom:12px;">
                        <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">
                            Recipient Email (Enter recipient email to receive reminder notice)
                        </label>
                        <input type="email" name="customerEmail" placeholder="e.g. customer@example.com" required style="width:100%; padding:9px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;" [(ngModel)]="formData['customerEmail']" />
                    </div>
    
                    <div style="display:grid; grid-template-columns: 1fr 1fr; gap:12px; margin-bottom:12px;">
                        <div>
                            <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">Mobile Number</label>
                            <input type="text" name="customerPhone" placeholder="Enter 10-digit mobile" required style="width:100%; padding:9px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;" [(ngModel)]="formData['customerPhone']" />
                        </div>
                        <div>
                            <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">Overdue EMI (&#8377;)</label>
                            <input type="number" step="0.01" name="emiAmount" placeholder="e.g. 4500.00" required style="width:100%; padding:9px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px;" [(ngModel)]="formData['emiAmount']" />
                        </div>
                    </div>
    
                    <div style="margin-bottom:18px;">
                        <label style="display:block; font-size:12px; font-weight:700; color:#475569; margin-bottom:4px;">Delinquency Window (Days Past Due)</label>
                        <select name="dpdDays" style="width:100%; padding:9px; border:1px solid #cbd5e1; border-radius:6px; font-size:13px; background:#ffffff;" [(ngModel)]="formData['dpdDays']">
                            <option value="1">DPD 1: 1 Day Overdue (Friendly Notice | &#8377;0 Penalty)</option>
                            <option value="2">DPD 2: 2 Days Overdue (Second Notice | &#8377;150 Penalty)</option>
                            <option value="3">DPD 3: 3 Days Overdue (Final Notice Before IVR | &#8377;300 Penalty)</option>
                        </select>
                    </div>
    
                    <div style="margin-bottom:18px; background:#eff6ff; border:1px solid #bfdbfe; border-radius:6px; padding:10px 14px;">
                        <label style="display:flex; align-items:center; gap:8px; font-size:13px; font-weight:700; color:#1e40af; cursor:pointer; margin:0;">
                            <input type="checkbox" name="sendImmediately" value="true" checked="checked" style="width:16px; height:16px; cursor:pointer;" [(ngModel)]="formData['sendImmediately']" />
                            ⚡ Send Reminder Email Immediately (Demo Mode)
                        </label>
                        <div style="font-size:11px; color:#64748b; margin-top:4px; margin-left:24px;">
                            Sends the DPD notice to the recipient's inbox immediately upon submitting.
                        </div>
                    </div>
    
                    <button type="submit" class="btn btn-primary" style="background:#2563eb; color:#ffffff; font-weight:700; border:none; border-radius:6px; padding:11px 16px; cursor:pointer; display:flex; align-items:center; justify-content:center; gap:8px; width:100%;">
                        🚀 Create Overdue Loan & Send Email Now
                    </button>
                </form>
            </div>
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:22px; box-shadow:0 2px 6px rgba(0,0,0,0.03); display:flex; flex-direction:column; justify-content:space-between;">
                <div>
                    <h3 style="margin-top:0; color:#1e293b; font-size:17px; font-weight:700; border-bottom:1px solid #f1f5f9; padding-bottom:10px; display:flex; align-items:center; gap:8px;">
                        ⚡ Step 2: Trigger Reminder Workflow
                    </h3>
                    <p style="color:#64748b; font-size:13px; line-height:1.6;">
                        The DPD engine identifies unpaid installments where <code>dueDate</code> is 1, 2, or 3 calendar days ago.
                        It computes accurate penalties, enforces database unique claims to prevent duplicates, and dispatches the customized notice.
                    </p>
    
                    <div style="background:#f8fafc; border-left:4px solid #2563eb; padding:12px 16px; margin:15px 0; font-size:13px; color:#334155;">
                        <div style="font-weight:700; margin-bottom:4px;">📋 Automated Process Flow:</div>
                        1. Re-verifies payment status (skips paid loans)<br />
                        2. Checks channel eligibility (Email or SMS)<br />
                        3. Acquires atomic DB claim (no duplicates)<br />
                        4. Dispatches outside DB transaction with retries<br />
                        5. Records audit log with provider message ID
                    </div>
                </div>
    
                <form (ngSubmit)="onSubmit()" action="/admin/reminders/demo/trigger-now" method="post" style="margin-top:15px;">
                    <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
                    <button type="submit" class="btn" style="background:#059669; color:#ffffff; font-size:15px; font-weight:700; border:none; border-radius:6px; padding:12px; cursor:pointer;">
                        ⚡ Trigger DPD 1–3 Reminder Engine Now
                    </button>
                </form>
            </div>
        </div>
    
        
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; margin-bottom:30px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:15px;">
                <h3 style="margin:0; font-size:17px; font-weight:700; color:#1e293b;">
                    📋 Delinquent Installments Eligible for Reminders Today
                </h3>
                <span style="font-size:12px; color:#64748b;">
                    Found: <strong>{overdueInstallments != null ? overdueInstallments?.size() : 0}</strong> records
                </span>
            </div>
    
            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!((!overdueInstallments || overdueInstallments?.length === 0))">
                    <div style="text-align:center; padding:30px; color:#64748b; font-size:14px; background:#f8fafc; border-radius:6px;">
                        ℹ️ No overdue installments found for today. Use the form above to create a demo delinquent loan!
                    </div>
                </ng-container>
      <ng-container *ngSwitchDefault>
                    <div style="overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; font-size:13px;">
                            <thead>
                                <tr style="background:#f1f5f9; text-align:left; color:#475569;">
                                    <th style="padding:10px 14px;">Customer Name</th>
                                    <th style="padding:10px 14px;">Recipient Email</th>
                                    <th style="padding:10px 14px;">Loan Account</th>
                                    <th style="padding:10px 14px;">Due Date</th>
                                    <th style="padding:10px 14px;">Overdue Amount</th>
                                    <th style="padding:10px 14px;">DPD Calculation</th>
                                </tr>
                            </thead>
                            <tbody>
                                <ng-container *ngFor="let inst of (overdueInstallments || [])">
                                    <tr style="border-bottom:1px solid #e2e8f0;">
                                        <td style="padding:12px 14px; font-weight:600;">{inst?.loan?.user?.name}</td>
                                        <td style="padding:12px 14px; font-family:monospace;">{inst?.loan?.user?.email}</td>
                                        <td style="padding:12px 14px; font-family:monospace; font-weight:700;">{inst?.loan?.accountNumber}</td>
                                        <td style="padding:12px 14px;">{inst?.dueDate}</td>
                                        <td style="padding:12px 14px; font-weight:700; color:#b91c1c;">
                                            &#8377; {inst?.emiAmount - inst?.paidAmount}
                                        </td>
                                        <td style="padding:12px 14px;">
                                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(today?.toEpochDay() - inst?.dueDate?.toEpochDay() == 1)">
                                                    <span style="background:#dbeafe; color:#1d4ed8; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">DPD 1 (Friendly)</span>
                                                </ng-container>
      <ng-container *ngSwitchCase="!!(today?.toEpochDay() - inst?.dueDate?.toEpochDay() == 2)">
                                                    <span style="background:#fef3c7; color:#b45309; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">DPD 2 (Notice)</span>
                                                </ng-container>
      <ng-container *ngSwitchCase="!!(today?.toEpochDay() - inst?.dueDate?.toEpochDay() == 3)">
                                                    <span style="background:#fee2e2; color:#b91c1c; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">DPD 3 (Final Notice)</span>
                                                </ng-container>
      <ng-container *ngSwitchDefault>
                                                    <span style="background:#f1f5f9; color:#475569; padding:3px 8px; border-radius:10px; font-size:11px;">
                                                        {today?.toEpochDay() - inst?.dueDate?.toEpochDay()} Days
                                                    </span>
                                                </ng-container>
    </ng-container>
                                        </td>
                                    </tr>
                                </ng-container>
                            </tbody>
                        </table>
                    </div>
                </ng-container>
    </ng-container>
        </div>
    
    </div>
  `
})
export class AdminRemindersComponent implements OnInit, OnDestroy {
  param: Record<string, any> = {};
  private _activeTimers: Array<{ type: 'timeout' | 'interval'; id: any }> = [];
  private _activeListeners: Array<{ target: EventTarget; type: string; listener: any; options?: any }> = [];
  _csrf: any = undefined;
  inst: any = undefined;
  overdueInstallments: any = undefined;
  today: any = undefined;
  userObj: any = undefined;
  formData: Record<string, any> = {
    'parameterName': '',
    'customerName': '',
    'customerEmail': '',
    'customerPhone': '',
    'emiAmount': '',
    'sendImmediately': '',
    'dpdDays': '',
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
    this.inst = this.data?.['inst'] ?? this.inst;
    this.overdueInstallments = this.data?.['overdueInstallments'] ?? this.overdueInstallments;
    this.today = this.data?.['today'] ?? this.today;
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

export default AdminRemindersComponent;