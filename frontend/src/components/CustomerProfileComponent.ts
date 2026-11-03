import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-customerprofile',
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
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #edf2f7; padding-bottom:15px;">
            <div>
                <div style="display:flex; align-items:center; gap:10px;">
                    <h2 style="margin:0; color:#2c3e50;">👤 Customer Profile & Loan Portfolio</h2>
                    <span style="background:#ebf8ff; color:#2b6cb0; padding:4px 10px; border-radius:12px; font-size:12px; font-weight:700; font-family:monospace;">
                        {profile?.customerId}
                    </span>
                </div>
                <p style="color:#718096; font-size:14px; margin:4px 0 0 0;">
                    Comprehensive verified KYC and active loan accounts for customer.
                </p>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <span style="background:#edf2f7; color:#2d3748; padding:6px 14px; border-radius:20px; font-size:13px; font-weight:600; border:1px solid #cbd5e0;">
                    🏢 Branch: <strong>{profile?.branch}</strong>
                </span>
                <a href="/loan-details?loanId={{ profile?.primaryLoanId }}" class="btn btn-primary" style="padding:8px 16px; font-size:13px; width:auto; text-decoration:none; background:#4f46e5; color:#ffffff; font-weight:600; border-radius:6px;">
                    🎯 360° Account View
                </a>
                <a href="/loan-search" class="btn btn-secondary" style="padding:8px 16px; font-size:13px; width:auto; text-decoration:none;">
                    &larr; Back to Search
                </a>
            </div>
        </div>
    
        
        <div class="alert alert-info" style="display:flex; align-items:center; justify-content:space-between;">
            <div>
                <strong>🛡️ Data Privacy Notice:</strong> In compliance with banking regulations, sensitive personal data (Aadhaar, PAN, Mobile, Email) is masked by default. 
                All reveal requests require documented business justification and are recorded in the immutable audit log.
            </div>
            <span style="background:#bee3f8; color:#2b6cb0; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">
                STRICT AUDIT
            </span>
        </div>
    
        
        <ng-container *ngIf="profile?.contactDetailUpdateRequired">
            <div style="background:#fffbeb; border:1px solid #fde68a; color:#92400e; padding:12px 18px; border-radius:8px; margin-bottom:20px; font-size:14px; display:flex; align-items:center; gap:10px;">
                <span style="font-size:18px;">⚠️</span>
                <div>
                    <strong>Contact Detail Update Required:</strong> Customer communication delivery failed or email bounced. Please verify and update borrower email and mobile number during outreach.
                </div>
            </div>
        </ng-container>
    
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap:20px; margin-bottom:30px;">
            
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:18px; box-shadow:0 2px 5px rgba(0,0,0,0.03);">
                <div style="font-size:12px; font-weight:700; color:#a0aec0; text-transform:uppercase; letter-spacing:0.5px;">Customer Name</div>
                <div style="font-size:18px; font-weight:700; color:#2d3748; margin-top:4px;">
                    {profile?.customerName}
                </div>
                <div style="margin-top:14px; font-size:12px; font-weight:700; color:#a0aec0; text-transform:uppercase;">Customer ID</div>
                <div style="font-size:15px; font-weight:600; color:#4a5568; font-family:monospace; margin-top:2px;">
                    {profile?.customerId}
                </div>
                <div style="margin-top:14px; font-size:12px; font-weight:700; color:#a0aec0; text-transform:uppercase;">Primary Account Number</div>
                <div style="font-size:15px; font-weight:700; color:#2b6cb0; font-family:monospace; margin-top:2px;">
                    {profile?.primaryAccountNumber}
                </div>
            </div>
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:18px; box-shadow:0 2px 5px rgba(0,0,0,0.03);">
                
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:12px; font-weight:700; color:#a0aec0; text-transform:uppercase;">Registered Mobile</div>
                    <button type="button" class="btn" (click)="openRevealModal('PHONE', 'Registered Mobile Number')" style="padding:3px 8px; width:auto; font-size:11px; background:#4a5568; margin:0;" id="revealBtn-PHONE">
                        👁️ Reveal
                    </button>
                </div>
                <div id="fieldVal-PHONE" style="font-size:15px; font-weight:600; color:#2d3748; font-family:monospace; margin-top:4px;">
                    {profile?.maskedPhone}
                </div>
    
                
                <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:12px; font-weight:700; color:#a0aec0; text-transform:uppercase;">Email Address</div>
                    <button type="button" class="btn" (click)="openRevealModal('EMAIL', 'Customer Email Address')" style="padding:3px 8px; width:auto; font-size:11px; background:#4a5568; margin:0;" id="revealBtn-EMAIL">
                        👁️ Reveal
                    </button>
                </div>
                <div id="fieldVal-EMAIL" style="font-size:15px; font-weight:600; color:#2d3748; font-family:monospace; margin-top:4px;">
                    {profile?.maskedEmail}
                </div>
            </div>
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:8px; padding:18px; box-shadow:0 2px 5px rgba(0,0,0,0.03);">
                
                <div style="display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:12px; font-weight:700; color:#a0aec0; text-transform:uppercase;">PAN Number</div>
                    <button type="button" class="btn" (click)="openRevealModal('PAN', 'Customer PAN Number')" style="padding:3px 8px; width:auto; font-size:11px; background:#4a5568; margin:0;" id="revealBtn-PAN">
                        👁️ Reveal
                    </button>
                </div>
                <div id="fieldVal-PAN" style="font-size:15px; font-weight:600; color:#2d3748; font-family:monospace; margin-top:4px;">
                    {profile?.maskedPan}
                </div>
    
                
                <div style="margin-top:16px; display:flex; justify-content:space-between; align-items:center;">
                    <div style="font-size:12px; font-weight:700; color:#a0aec0; text-transform:uppercase;">Aadhaar Number</div>
                    <button type="button" class="btn" (click)="openRevealModal('AADHAAR', 'Customer Aadhaar Number')" style="padding:3px 8px; width:auto; font-size:11px; background:#4a5568; margin:0;" id="revealBtn-AADHAAR">
                        👁️ Reveal
                    </button>
                </div>
                <div id="fieldVal-AADHAAR" style="font-size:15px; font-weight:600; color:#2d3748; font-family:monospace; margin-top:4px;">
                    {profile?.maskedAadhaar}
                </div>
            </div>
    
        </div>
    
        
        <h3 style="color:#2d3748; margin-top:20px; border-bottom:2px solid #edf2f7; padding-bottom:10px;">
            Authorized Customer Loan Accounts
        </h3>
    
        <table>
            <thead>
                <tr>
                    <th>Loan Account No</th>
                    <th>Principal Amount</th>
                    <th>Interest Rate</th>
                    <th>Tenure</th>
                    <th>Monthly EMI</th>
                    <th>Outstanding Balance</th>
                    <th>Status</th>
                    <th>Branch</th>
                    <th>Origination Date</th>
                </tr>
            </thead>
            <tbody>
                <ng-container *ngFor="let loan of (data.profile?.loans || [])">
                    <tr>
                        <td>
                            <strong style="color:#2b6cb0; font-family:monospace; font-size:14px;">
                                {loan?.accountNumber}
                            </strong>
                        </td>
                        <td>₹{loan?.amount}</td>
                        <td>{loan?.interest}%</td>
                        <td>{loan?.months} Months</td>
                        <td>₹{loan?.emi}</td>
                        <td>
                            <strong style="color:{loan?.remaining > 0 ? '#c53030' : '#276749'};">
                                ₹{loan?.remaining}
                            </strong>
                        </td>
                        <td>
                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loan?.status == 'ACTIVE')">
                                    <span style="color:#276749; background:#c6f6d5; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">ACTIVE</span>
                                </ng-container>
      <ng-container *ngSwitchCase="!!(loan?.status == 'CLOSED')">
                                    <span style="color:#4a5568; background:#e2e8f0; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">CLOSED</span>
                                </ng-container>
      <ng-container *ngSwitchDefault>
                                    <span style="color:#b7791f; background:#feebc8; padding:3px 8px; border-radius:10px; font-size:12px; font-weight:600;">{loan?.status}</span>
                                </ng-container>
    </ng-container>
                        </td>
                        <td>
                            <span style="background:#edf2f7; color:#4a5568; padding:3px 8px; border-radius:12px; font-size:12px; font-weight:600;">
                                {loan?.branch}
                            </span>
                        </td>
                        <td style="font-size:13px; color:#718096;">{loan?.createdAt}</td>
                    </tr>
                </ng-container>
            </tbody>
        </table>
    
    </div>
    
    
    <div id="revealModal" style="display:none; position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.5); z-index:9999; justify-content:center; align-items:center;">
        <div style="background:#ffffff; border-radius:10px; width:460px; max-width:90%; padding:25px; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
            <h3 style="margin-top:0; color:#2c3e50; display:flex; align-items:center; gap:8px;">
                🔒 Authorize Sensitive Data Reveal
            </h3>
            <p style="color:#718096; font-size:13px; margin-top:-5px;">
                Requesting unmasked access to <strong id="modalFieldLabel" style="color:#2d3748;"></strong>.
            </p>
    
            <div id="modalAlert" style="display:none;" class="alert alert-error"></div>
    
            <form (ngSubmit)="onSubmit()" id="revealForm" (ngSubmit)="submitRevealRequest(event)">
                <input type="hidden" id="revealTargetField" value="" />
                <input type="hidden" id="revealLoanId" />
    
                <label style="font-weight:600; font-size:13px; color:#4a5568;">
                    Business Justification / Purpose of Access <span style="color:#e53e3e;">*</span>
                </label>
                <textarea id="revealReason" rows="3" required minlength="8" maxlength="255" placeholder="e.g. Identity verification for loan disbursal or court notice compliance." style="width:100%; padding:10px; border:1px solid #cbd5e0; border-radius:6px; font-size:13px; box-sizing:border-box; margin-top:6px; margin-bottom:12px;"></textarea>
                
                <div style="font-size:11px; color:#a0aec0; margin-bottom:15px;">
                    Note: Minimum 8 characters. Your Officer ID, timestamp, and IP address will be recorded in the audit trail.
                </div>
    
                <div style="display:flex; justify-content:flex-end; gap:10px;">
                    <button type="button" class="btn btn-secondary" (click)="closeRevealModal()" style="width:auto; padding:8px 18px; font-size:13px;">
                        Cancel
                    </button>
                    <button type="submit" class="btn" id="confirmRevealBtn" style="width:auto; padding:8px 18px; font-size:13px; background:#e67e22;">
                        Confirm & Reveal
                    </button>
                </div>
            </form>
        </div>
    </div>
  `
})
export class CustomerProfileComponent implements OnInit, OnDestroy {
  param: Record<string, any> = {};
  private _activeTimers: Array<{ type: 'timeout' | 'interval'; id: any }> = [];
  private _activeListeners: Array<{ target: EventTarget; type: string; listener: any; options?: any }> = [];
  _csrf: any = undefined;
  loan: any = undefined;
  profile: any = undefined;
  userObj: any = undefined;
  formData: Record<string, any> = {
    'parameterName': '',
    'revealTargetField': '',
    'revealLoanId': '',
    'revealReason': '',
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
    (window as any).openRevealModal = this.openRevealModal.bind(this);
    (window as any).closeRevealModal = this.closeRevealModal.bind(this);
    (window as any).submitRevealRequest = this.submitRevealRequest.bind(this);
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
      let activeField = null;
          function openRevealModal(field, label) {
              activeField = field;
              document.getElementById('revealTargetField').value = field;
              document.getElementById('modalFieldLabel').innerText = label;
              document.getElementById('revealReason').value = '';
              document.getElementById('modalAlert').style.display = 'none';
              document.getElementById('revealModal').style.display = 'flex';
              document.getElementById('revealReason').focus();
          }
          function closeRevealModal() {
              document.getElementById('revealModal').style.display = 'none';
              document.getElementById('modalAlert').style.display = 'none';
              activeField = null;
          }
          function submitRevealRequest(event) {
              event.preventDefault();
              const field = document.getElementById('revealTargetField').value;
              const loanId = document.getElementById('revealLoanId').value;
              const reason = document.getElementById('revealReason').value.trim();
              const modalAlert = document.getElementById('modalAlert');
              const confirmBtn = document.getElementById('confirmRevealBtn');
              if (reason.length < 8) {
                  modalAlert.innerText = 'Justification must be at least 8 characters long.';
                  modalAlert.style.display = 'block';
                  return;
              }
              const csrfTokenMeta = document.querySelector('meta[name="_csrf"]');
              const csrfHeaderMeta = document.querySelector('meta[name="_csrf_header"]');
              confirmBtn.disabled = true;
              confirmBtn.innerText = 'Verifying...';
              fetch('/loan-search/reveal', {
                  method: 'POST',
                  headers: {
                      'Content-Type': 'application/json',
                      [csrfHeader]: csrfToken
                  },
                  body: JSON.stringify({
                      loanId: parseInt(loanId),
                      field: field,
                      reason: reason
                  })
              })
              .then(response => response.json().then(data => ({ status: response.status, body: data })))
              .then(result => {
                  confirmBtn.disabled = false;
                  confirmBtn.innerText = 'Confirm & Reveal';
                  if (result.status === 200 && result.body.success) {
                      // Update field value in DOM
                      const targetEl = document.getElementById('fieldVal-' + field);
                      if (targetEl) {
                          targetEl.innerHTML = '<span style="color:#276749; font-weight:700;">' + result.body.unmaskedValue + '</span> ' +
                              '<span style="font-size:11px; background:#c6f6d5; color:#22543d; padding:2px 6px; border-radius:8px; margin-left:6px;">REVEALED</span>';
                      }
                      // Disable button
                      const btnEl = document.getElementById('revealBtn-' + field);
                      if (btnEl) {
                          btnEl.disabled = true;
                          btnEl.innerText = 'Unmasked';
                          btnEl.style.background = '#a0aec0';
                          btnEl.style.cursor = 'default';
                      }
                      closeRevealModal();
                  } else {
                      modalAlert.innerText = result.body.message || 'Authorization failed or loan is outside your permitted branch.';
                      modalAlert.style.display = 'block';
                  }
              })
              .catch(err => {
                  confirmBtn.disabled = false;
                  confirmBtn.innerText = 'Confirm & Reveal';
                  modalAlert.innerText = 'Error communicating with security service: ' + err.message;
                  modalAlert.style.display = 'block';
              });
          }
    } catch (e) { console.warn(e); }
    this._csrf = this.data?.['_csrf'] ?? this._csrf;
    this.loan = this.data?.['loan'] ?? this.loan;
    this.profile = this.data?.['profile'] ?? this.profile;
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

  closeRevealModal(...args: any[]): void {
    try {
      if (typeof (window as any).closeRevealModal === 'function') {
        (window as any).closeRevealModal(...args);
      }
    } catch (e) {}
  }

  logoutNow(...args: any[]): void {
    try {
      if (typeof (window as any).logoutNow === 'function') {
        (window as any).logoutNow(...args);
      }
    } catch (e) {}
  }

  openRevealModal(...args: any[]): void {
    try {
      if (typeof (window as any).openRevealModal === 'function') {
        (window as any).openRevealModal(...args);
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

  submitRevealRequest(...args: any[]): void {
    try {
      if (typeof (window as any).submitRevealRequest === 'function') {
        (window as any).submitRevealRequest(...args);
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

export default CustomerProfileComponent;