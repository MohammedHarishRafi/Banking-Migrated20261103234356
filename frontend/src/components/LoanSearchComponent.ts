import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loansearch',
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
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px;">
            <div>
                <h2 style="margin:0; color:#2c3e50;">🔍 Loan Account & Customer Search</h2>
                <p style="color:#718096; font-size:14px; margin:4px 0 0 0;">
                    Authorized Bank Staff Portal — Search customer loan accounts and KYC profiles.
                </p>
            </div>
            <div>
                <span style="background:#edf2f7; color:#2d3748; padding:6px 14px; border-radius:20px; font-size:13px; font-weight:600; border:1px solid #cbd5e0;">
                    🏢 Authorized Branch: <strong>{officerBranch}</strong>
                </span>
            </div>
        </div>
    
        
        <ng-container *ngIf="!!(errorMessage)">
            <div class="alert alert-error" id="searchErrorMessage">
                <strong>⚠️ Notice:</strong> {errorMessage}
            </div>
        </ng-container>
    
        <ng-container *ngIf="!!(infoMessage)">
            <div class="alert alert-info">
                ℹ️ {infoMessage}
            </div>
        </ng-container>
    
        
        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:20px; margin-bottom:25px;">
            <form (ngSubmit)="onSubmit()" action="/loan-search" method="get" id="searchForm">
                <div style="display:grid; grid-template-columns: 220px 1fr 140px; gap:15px; align-items:end;">
                    <div>
                        <label style="font-weight:600; font-size:13px; color:#4a5568;">Search By Category</label>
                        <select name="searchType" id="searchTypeSelect" (change)="updateSearchPlaceholder()" style="margin-top:6px; margin-bottom:0;" [(ngModel)]="formData['searchType']">
                            <option value="ACCOUNT_NUMBER" {selected={searchType == 'ACCOUNT_NUMBER'}}>Loan Account No</option>
                            <option value="CUSTOMER_ID" {selected={searchType == 'CUSTOMER_ID'}}>Customer ID</option>
                            <option value="PHONE" {selected={searchType == 'PHONE'}}>Registered Mobile</option>
                            <option value="NAME" {selected={searchType == 'NAME'}}>Customer Name</option>
                        </select>
                    </div>
    
                    <div>
                        <label style="font-weight:600; font-size:13px; color:#4a5568;" id="queryInputLabel">Search Query</label>
                        <input type="text" name="query" id="queryInput" placeholder="Enter 12-character Account Number (e.g. LN0000000004)" required maxlength="50" style="margin-top:6px; margin-bottom:0;" [(ngModel)]="formData['query']" />
                    </div>
    
                    <div>
                        <button type="submit" class="btn" style="height:44px; margin-bottom:0; display:flex; align-items:center; justify-content:center; gap:6px;">
                            <span>🔎 Search</span>
                        </button>
                    </div>
                </div>
    
                <div style="margin-top:10px; font-size:12px; color:#718096;" id="queryFormatHint">
                    💡 Exact Loan Account Number format: 2 uppercase letters followed by 10 digits (e.g., <strong>LN0000000004</strong>).
                </div>
            </form>
        </div>
    
        
        <ng-container *ngIf="hasSearched">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                <h3 style="margin:0; color:#2d3748;">
                    Search Results 
                     0 }}">
                        <span style="font-size:14px; font-weight:normal; color:#718096;">
                            (Found {results?.totalElements} matching record{results?.totalElements > 1 ? 's' : ''})
                        </span>
                    </ng-container>
                </h3>
            </div>
    
            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(results != null && results?.totalElements > 0)">
                    <table>
                        <thead>
                            <tr>
                                <th>Account No</th>
                                <th>Customer ID</th>
                                <th>Customer Name</th>
                                <th>Mobile</th>
                                <th>Branch</th>
                                <th>Sanctioned</th>
                                <th>Outstanding</th>
                                <th>Repayment</th>
                                <th>DPD</th>
                                <th>Status</th>
                                <th style="text-align:center;">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            <ng-container *ngFor="let row of (data.results?.content || [])">
                                <tr>
                                    <td>
                                        <strong style="color:#2b6cb0; font-family:monospace; font-size:14px;">
                                            {row?.accountNumber}
                                        </strong>
                                    </td>
                                    <td>
                                        <span style="font-family:monospace; color:#4a5568;">
                                            {row?.customerId}
                                        </span>
                                    </td>
                                    <td><strong>{row?.customerName}</strong></td>
                                    <td>{row?.maskedPhone}</td>
                                    <td>
                                        <span style="background:#edf2f7; color:#4a5568; padding:3px 8px; border-radius:12px; font-size:12px; font-weight:600;">
                                            {row?.branch}
                                        </span>
                                    </td>
                                    <td>₹{(row?.amount) | number:'1.2-2'}</td>
                                    <td><strong style="color:{row?.remaining > 0 ? '#c53030' : '#276749'};">₹{(row?.remaining) | number:'1.2-2'}</strong></td>
                                    <td>
                                        <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(row?.repaymentStatus == 'OVERDUE')">
                                                <span style="color:#9b2c2c; background:#fed7d7; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:700;">
                                                    ⚠️ OVERDUE
                                                     0 }}">
                                                        (₹{(row?.overdueAmount) | number:'1.0-0'})
                                                    </ng-container>
                                                </span>
                                            </ng-container>
      <ng-container *ngSwitchCase="!!(row?.repaymentStatus == 'CURRENT')">
                                                <span style="color:#22543d; background:#c6f6d5; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">CURRENT</span>
                                            </ng-container>
      <ng-container *ngSwitchCase="!!(row?.repaymentStatus == 'CLOSED')">
                                                <span style="color:#4a5568; background:#e2e8f0; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">CLOSED</span>
                                            </ng-container>
      <ng-container *ngSwitchDefault>
                                                <span style="color:#744210; background:#feebc8; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">{row?.repaymentStatus}</span>
                                            </ng-container>
    </ng-container>
                                    </td>
                                    <td>
                                        <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(row?.dpd > 0)">
                                                <span style="color:#742a2a; background:#fed7d7; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:700;">
                                                    {row?.dpd} DPD
                                                </span>
                                            </ng-container>
      <ng-container *ngSwitchCase="!!(row?.status == 'CLOSED')">
                                                <span style="color:#a0aec0; font-size:12px;">-</span>
                                            </ng-container>
      <ng-container *ngSwitchDefault>
                                                <span style="color:#22543d; background:#c6f6d5; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">0 DPD</span>
                                            </ng-container>
    </ng-container>
                                    </td>
                                    <td>
                                        <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(row?.status == 'ACTIVE')">
                                                <span style="color:#276749; background:#c6f6d5; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">ACTIVE</span>
                                            </ng-container>
      <ng-container *ngSwitchCase="!!(row?.status == 'CLOSED')">
                                                <span style="color:#4a5568; background:#e2e8f0; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">CLOSED</span>
                                            </ng-container>
      <ng-container *ngSwitchDefault>
                                                <span style="color:#b7791f; background:#feebc8; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">{row?.status}</span>
                                            </ng-container>
    </ng-container>
                                    </td>
                                    <td style="text-align:center;">
                                        <a href="/loan-details?loanId={{ row?.loanId }}" class="btn" style="display:inline-block; text-decoration:none; text-align:center; padding:6px 14px; font-size:12px; width:auto; background:#24446B; color:#ffffff; font-weight:600; border-radius:4px;">
                                            Profile
                                        </a>
                                    </td>
                                </tr>
                            </ng-container>
                        </tbody>
                    </table>
    
                    
                     1 }}">
                        <div style="display:flex; justify-content:space-between; align-items:center; margin-top:20px; padding-top:15px; border-top:1px solid #edf2f7;">
                            <div style="font-size:13px; color:#718096;">
                                Page <strong>{results?.number + 1}</strong> of <strong>{results?.totalPages}</strong>
                            </div>
                            <div style="display:flex; gap:8px;">
                                <ng-container *ngIf="results?.hasPrevious()">
                                    <a href="/loan-search?searchType={{ searchType }}&query={{ query }}&page={{ results?.number - 1 }}&size={{ size }}" class="btn btn-secondary" style="padding:6px 14px; width:auto; font-size:13px; text-decoration:none;">
                                        &laquo; Previous
                                    </a>
                                </ng-container>
                                <ng-container *ngIf="results?.hasNext()">
                                    <a href="/loan-search?searchType={{ searchType }}&query={{ query }}&page={{ results?.number + 1 }}&size={{ size }}" class="btn btn-secondary" style="padding:6px 14px; width:auto; font-size:13px; text-decoration:none;">
                                        Next &raquo;
                                    </a>
                                </ng-container>
                            </div>
                        </div>
                    </ng-container>
                </ng-container>
      <ng-container *ngSwitchDefault>
                    <div style="background:#fffaf0; border:1px solid #feebc8; padding:25px; border-radius:8px; text-align:center; color:#744210; margin-top:10px;">
                        <p style="font-size:16px; font-weight:600; margin:0 0 6px 0;">No Loan Account Records Match Your Criteria</p>
                        <p style="font-size:13px; color:#975a16; margin:0;">
                            Please verify the input and ensure the account belongs to your authorized branch.
                        </p>
                    </div>
                </ng-container>
    </ng-container>
        </ng-container>
    </div>
  `
})
export class LoanSearchComponent implements OnInit, OnDestroy {
  param: Record<string, any> = {};
  errorMessage: string = '';
  private _activeTimers: Array<{ type: 'timeout' | 'interval'; id: any }> = [];
  private _activeListeners: Array<{ target: EventTarget; type: string; listener: any; options?: any }> = [];
  _csrf: any = undefined;
  hasSearched: any = undefined;
  infoMessage: any = undefined;
  officerBranch: any = undefined;
  query: any = undefined;
  results: any = undefined;
  row: any = undefined;
  searchType: any = undefined;
  size: any = undefined;
  userObj: any = undefined;
  formData: Record<string, any> = {
    'parameterName': '',
    'query': '',
    'searchType': '',
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
    (window as any).updateSearchPlaceholder = this.updateSearchPlaceholder.bind(this);
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
      function updateSearchPlaceholder() {
              const type = document.getElementById('searchTypeSelect').value;
              const input = document.getElementById('queryInput');
              const hint = document.getElementById('queryFormatHint');
              if (type === 'ACCOUNT_NUMBER') {
                  input.placeholder = "Enter 12-character Account Number (e.g. LN0000000004)";
                  input.maxLength = 12;
                  hint.innerHTML = "💡 Exact Loan Account Number format: 2 uppercase letters followed by 10 digits (e.g., <strong>LN0000000004</strong>).";
              } else if (type === 'CUSTOMER_ID') {
                  input.placeholder = "Enter Customer ID (e.g. CUST000001 or 1)";
                  input.maxLength = 25;
                  hint.innerHTML = "💡 Secondary search: Exact Customer ID match within your authorized branch.";
              } else if (type === 'PHONE') {
                  input.placeholder = "Enter 10-digit mobile number (e.g. 9876543210)";
                  input.maxLength = 15;
                  hint.innerHTML = "💡 Secondary search: Registered phone number matching authorized customer accounts.";
              } else if (type === 'NAME') {
                  input.placeholder = "Enter customer name (e.g. John Doe)";
                  input.maxLength = 50;
                  hint.innerHTML = "💡 Secondary search: Case-insensitive customer name match within your branch.";
              }
          }
          // Set initial placeholder on page load
          this.registerListener(document, 'DOMContentLoaded', updateSearchPlaceholder);
    } catch (e) { console.warn(e); }
    this._csrf = this.data?.['_csrf'] ?? this._csrf;
    this.hasSearched = this.data?.['hasSearched'] ?? this.hasSearched;
    this.infoMessage = this.data?.['infoMessage'] ?? this.infoMessage;
    this.officerBranch = this.data?.['officerBranch'] ?? this.officerBranch;
    this.query = this.data?.['query'] ?? this.query;
    this.results = this.data?.['results'] ?? this.results;
    this.row = this.data?.['row'] ?? this.row;
    this.searchType = this.data?.['searchType'] ?? this.searchType;
    this.size = this.data?.['size'] ?? this.size;
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

  updateSearchPlaceholder(...args: any[]): void {
    try {
      if (typeof (window as any).updateSearchPlaceholder === 'function') {
        (window as any).updateSearchPlaceholder(...args);
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

export default LoanSearchComponent;