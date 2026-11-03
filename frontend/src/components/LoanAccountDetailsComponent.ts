import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-loanaccountdetails',
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
    
    
    <div class="wide-card" style="max-width: 1400px; margin: 0 auto; padding: 25px;">
    
        
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:20px; border-bottom:2px solid #edf2f7; padding-bottom:15px; flex-wrap:wrap; gap:15px;">
            <div>
                <div style="display:flex; align-items:center; gap:12px;">
                    <h2 style="margin:0; color:#1e293b; font-size:24px; font-weight:800; letter-spacing:-0.5px;">
                        🎯 360° Loan Account Profile
                    </h2>
                    <span style="background:#e0e7ff; color:#4338ca; padding:5px 12px; border-radius:14px; font-size:13px; font-weight:700; font-family:monospace;">
                        {loanDetails?.accountNumber}
                    </span>
                    <span style="background:#f1f5f9; color:#475569; padding:5px 12px; border-radius:14px; font-size:12px; font-weight:600;">
                        🏢 Branch: {loanDetails?.branch}
                    </span>
                </div>
                <p style="color:#64748b; font-size:14px; margin:6px 0 0 0;">
                    Unified real-time banking intelligence dashboard for authorized loan officers and collections specialists.
                </p>
            </div>
    
            
            <div style="display:flex; align-items:center; gap:12px; flex-wrap:wrap;">
                <div style="background:#f8fafc; border:1px solid #cbd5e1; padding:6px 14px; border-radius:8px; font-size:13px; color:#334155;">
                    <span style="color:#64748b;">⏱️ Last refreshed:</span>
                    <strong style="color:#0f172a;">{loanDetails?.lastRefreshedFormatted}</strong>
                </div>
    
                
                <a href="/loan-details?loanId={{ loanDetails?.loanId }}&refresh=true" class="btn btn-outline-primary" style="display:inline-flex; align-items:center; gap:6px; padding:7px 14px; font-size:13px; font-weight:600; text-decoration:none; border:1px solid #6366f1; color:#6366f1; border-radius:6px; background:#ffffff;">
                    🔄 Refresh Data
                </a>
    
                
                <a href="/loan-details/{loanDetails?.loanId}/statement.pdf" target="_blank" class="btn btn-primary" style="display:inline-flex; align-items:center; gap:6px; padding:7px 16px; font-size:13px; font-weight:600; text-decoration:none; background:#4f46e5; color:#ffffff; border-radius:6px; border:none; box-shadow:0 2px 4px rgba(79,70,229,0.2);">
                    📄 Download Statement (PDF)
                </a>
    
                <a href="/loan-search" class="btn btn-secondary" style="padding:7px 14px; font-size:13px; text-decoration:none; background:#e2e8f0; color:#334155; border-radius:6px; border:none;">
                    &larr; Search
                </a>
            </div>
        </div>
    
        
        <ng-container *ngIf="isRefreshed">
            <div class="alert alert-success" style="background:#ecfdf5; border:1px solid #a7f3d0; color:#065f46; padding:12px 18px; border-radius:8px; margin-bottom:20px; font-size:14px; display:flex; align-items:center; justify-content:space-between;">
                <div>
                    <strong>✅ Data Refreshed Successfully:</strong> Authoritative loan and installment records have been synchronized as of <strong>{loanDetails?.lastRefreshedFormatted}.</strong>
                </div>
                <span style="font-size:12px; font-weight:600; opacity:0.8;">Correlation ID: {loanDetails?.correlationId}</span>
            </div>
        </ng-container>
    
        
        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(420px, 1fr)); gap:20px; margin-bottom:25px;">
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:16px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
                        👤 Customer Profile
                    </h3>
                    <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.customerProfile?.status == 'SUCCESS')">
                            <span style="background:#dcfce7; color:#15803d; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">
                                KYC: {loanDetails?.customerProfile?.data.kycStatus}
                            </span>
                        </ng-container>
      <ng-container *ngSwitchDefault>
                            <span style="background:#fee2e2; color:#b91c1c; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">
                                {loanDetails?.customerProfile?.status}
                            </span>
                        </ng-container>
    </ng-container>
                </div>
    
                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.customerProfile?.status == 'SUCCESS')">
                        <ng-container *ngIf="cust?.contactDetailUpdateRequired">
                            <div style="background:#fffbeb; border:1px solid #fde68a; color:#92400e; padding:10px 14px; border-radius:6px; font-size:13px; margin-bottom:14px; display:flex; align-items:center; gap:8px;">
                                <span>⚠️</span>
                                <div>
                                    <strong>Contact Detail Update Required:</strong> Customer communication bounced or email/mobile is invalid. Please request updated contact details during borrower outreach.
                                </div>
                            </div>
                        </ng-container>
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; font-size:13px;">
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Customer Name</div>
                                <div style="color:#0f172a; font-weight:700; font-size:15px; margin-top:2px;">{cust?.fullName}</div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Customer ID</div>
                                <div style="color:#4338ca; font-weight:600; font-family:monospace; margin-top:2px;">{cust?.customerId}</div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Date of Birth</div>
                                <div style="color:#334155; margin-top:2px;">{cust?.dateOfBirth}</div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Preferred Contact</div>
                                <div style="color:#334155; margin-top:2px;">{cust?.preferredContactMethod}</div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Mobile Number</div>
                                <div style="color:#334155; font-family:monospace; margin-top:2px;">
                                    {cust?.maskedPhone} <span style="color:#94a3b8; font-size:11px;">(Masked)</span>
                                </div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Email Address</div>
                                <div style="color:#334155; font-family:monospace; margin-top:2px;">
                                    {cust?.maskedEmail} <span style="color:#94a3b8; font-size:11px;">(Masked)</span>
                                </div>
                            </div>
                            <div style="grid-column: span 2;">
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Permanent Address</div>
                                <div style="color:#334155; margin-top:2px;">{cust?.address}</div>
                            </div>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchDefault>
                        <div style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px; border-radius:6px; font-size:13px;">
                            ⚠️ <strong>Customer Profile Unavailable:</strong> {loanDetails?.customerProfile?.errorMessage}
                        </div>
                    </ng-container>
    </ng-container>
            </div>
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:16px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
                        💳 Loan Account Details
                    </h3>
                    <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.loanDetails?.data?.loanStatus == 'APPROVED')">
                            <span style="background:#dcfce7; color:#15803d; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">ACTIVE / APPROVED</span>
                        </ng-container>
      <ng-container *ngSwitchCase="!!(loanDetails?.loanDetails?.data?.loanStatus == 'CLOSED')">
                            <span style="background:#f1f5f9; color:#475569; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">CLOSED</span>
                        </ng-container>
      <ng-container *ngSwitchDefault>
                            <span style="background:#fef3c7; color:#b45309; padding:3px 8px; border-radius:10px; font-size:11px; font-weight:700;">
                                {loanDetails?.loanDetails?.data.loanStatus}
                            </span>
                        </ng-container>
    </ng-container>
                </div>
    
                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.loanDetails?.status == 'SUCCESS')">
                        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:14px; font-size:13px;">
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Loan Account Number</div>
                                <div style="color:#0f172a; font-weight:700; font-family:monospace; font-size:14px; margin-top:2px;">{ld?.loanAccountNumber}</div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Loan Product Type</div>
                                <div style="color:#334155; font-weight:600; margin-top:2px;">{ld?.productType}</div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Sanctioned Amount</div>
                                <div style="color:#0f172a; font-weight:700; font-size:15px; margin-top:2px;">
                                    ₹{(ld?.sanctionedAmount) | number:'1.2-2'}
                                </div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Disbursed Amount</div>
                                <div style="color:#0f172a; font-weight:700; font-size:15px; margin-top:2px;">
                                    ₹{(ld?.disbursedAmount) | number:'1.2-2'}
                                </div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Disbursement Date</div>
                                <div style="color:#334155; margin-top:2px;">{ld?.disbursementDate}</div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Interest Rate & Type</div>
                                <div style="color:#334155; font-weight:600; margin-top:2px;">
                                    {ld?.interestRate}% p.a. ({ld?.interestType})
                                </div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Tenure</div>
                                <div style="color:#334155; margin-top:2px;">{ld?.tenureMonths} Months</div>
                            </div>
                            <div>
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Monthly EMI</div>
                                <div style="color:#4338ca; font-weight:800; font-size:15px; margin-top:2px;">
                                    ₹{(ld?.monthlyEmi) | number:'1.2-2'}
                                </div>
                            </div>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchDefault>
                        <div style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px; border-radius:6px; font-size:13px;">
                            ⚠️ <strong>Loan Details Unavailable:</strong> {loanDetails?.loanDetails?.errorMessage}
                        </div>
                    </ng-container>
    </ng-container>
            </div>
        </div>
    
        
        <div style="display:grid; grid-template-columns: 2fr 1fr; gap:20px; margin-bottom:25px;">
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:16px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
                        💰 Outstanding Balance Summary
                    </h3>
                    <span style="font-size:11px; color:#64748b;">Accounting Rule: Exact BigDecimal Half-Up</span>
                </div>
    
                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.outstandingSummary?.status == 'SUCCESS')">
                        <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap:15px;">
                            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Principal Outstanding</div>
                                <div style="color:#0f172a; font-size:18px; font-weight:800; margin-top:4px;">
                                    ₹{(os?.principalOutstanding) | number:'1.2-2'}
                                </div>
                            </div>
                            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Accrued Interest</div>
                                <div style="color:#0f172a; font-size:18px; font-weight:800; margin-top:4px;">
                                    ₹{(os?.accruedInterest) | number:'1.2-2'}
                                </div>
                            </div>
                            <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px;">
                                <div style="color:#64748b; font-size:11px; font-weight:700; text-transform:uppercase;">Penalties & Late Fees</div>
                                <div style="color:#b91c1c; font-size:18px; font-weight:800; margin-top:4px;">
                                    ₹{(os?.penaltiesAndLateFees) | number:'1.2-2'}
                                </div>
                            </div>
                            <div style="background:#eef2ff; border:1px solid #c7d2fe; border-radius:8px; padding:12px;">
                                <div style="color:#4338ca; font-size:11px; font-weight:700; text-transform:uppercase;">Total Payable Amount</div>
                                <div style="color:#3730a3; font-size:20px; font-weight:800; margin-top:4px;">
                                    ₹{(os?.totalPayable) | number:'1.2-2'}
                                </div>
                            </div>
                        </div>
    
                        
                        <div style="margin-top:14px; background:#fafafa; border:1px dashed #d4d4d8; border-radius:6px; padding:10px 14px; font-size:12px; display:flex; justify-content:space-between; align-items:center;">
                            <div>
                                <strong>🏦 Indicative Foreclosure Amount:</strong>
                                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(os?.foreclosureAmount != null)">
                                        <span style="font-size:14px; font-weight:800; color:#0f172a; margin-left:8px;">
                                            ₹{(os?.foreclosureAmount) | number:'1.2-2'}
                                        </span>
                                    </ng-container>
      <ng-container *ngSwitchDefault>
                                        <span style="color:#71717a; font-style:italic; margin-left:8px;">{os?.foreclosureStatus}</span>
                                    </ng-container>
    </ng-container>
                            </div>
                            <span style="color:#a1a1aa; font-size:11px;">Subject to authoritative CBS verification at settlement date</span>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchDefault>
                        <div style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px; border-radius:6px; font-size:13px;">
                            ⚠️ <strong>Outstanding Balance Calculation Unavailable:</strong> {loanDetails?.outstandingSummary?.errorMessage}
                        </div>
                    </ng-container>
    </ng-container>
            </div>
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:16px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
                        ⚠️ Delinquency & DPD
                    </h3>
                </div>
    
                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.delinquency?.status == 'SUCCESS')">
                        <div style="display:flex; flex-direction:column; gap:12px;">
                            <div style="display:flex; justify-content:space-between; align-items:center; background:#f8fafc; padding:8px 12px; border-radius:6px;">
                                <span style="color:#64748b; font-size:12px; font-weight:600;">Days Past Due (DPD):</span>
                                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(del?.dpd == 0)">
                                        <span style="background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:12px; font-weight:800; font-size:13px;">0 Days (Regular)</span>
                                    </ng-container>
      <ng-container *ngSwitchCase="!!(del?.dpd <= 30)">
                                        <span style="background:#fef3c7; color:#b45309; padding:3px 10px; border-radius:12px; font-weight:800; font-size:13px;">{del?.dpd} Days (SMA-0)</span>
                                    </ng-container>
      <ng-container *ngSwitchCase="!!(del?.dpd <= 60)">
                                        <span style="background:#ffedd5; color:#c2410c; padding:3px 10px; border-radius:12px; font-weight:800; font-size:13px;">{del?.dpd} Days (SMA-1)</span>
                                    </ng-container>
      <ng-container *ngSwitchCase="!!(del?.dpd <= 90)">
                                        <span style="background:#fee2e2; color:#b91c1c; padding:3px 10px; border-radius:12px; font-weight:800; font-size:13px;">{del?.dpd} Days (SMA-2)</span>
                                    </ng-container>
      <ng-container *ngSwitchDefault>
                                        <span style="background:#991b1b; color:#ffffff; padding:3px 10px; border-radius:12px; font-weight:800; font-size:13px;">{del?.dpd} Days (NPA)</span>
                                    </ng-container>
    </ng-container>
                            </div>
    
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 6px; font-size:13px;">
                                <span style="color:#64748b;">Delinquency Bucket:</span>
                                <strong style="color:#0f172a;">{del?.delinquencyBucket}</strong>
                            </div>
    
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 6px; font-size:13px;">
                                <span style="color:#64748b;">Overdue Amount:</span>
                                <strong style="color:{del?.overdueAmount > 0 ? '#b91c1c' : '#15803d'}; font-size:14px;">
                                    ₹{(del?.overdueAmount) | number:'1.2-2'}
                                </strong>
                            </div>
    
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 6px; font-size:13px;">
                                <span style="color:#64748b;">Account Classification:</span>
                                <strong style="color:#0f172a;">{del?.accountStatus}</strong>
                            </div>
    
                            <div style="display:flex; justify-content:space-between; align-items:center; padding:4px 6px; font-size:12px; border-top:1px solid #f1f5f9; padding-top:8px;">
                                <span style="color:#94a3b8;">Last Reminder Sent:</span>
                                <span style="color:#64748b;">{del?.lastReminderSent}</span>
                            </div>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchDefault>
                        <div style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px; border-radius:6px; font-size:13px;">
                            ⚠️ <strong>Delinquency Data Unavailable:</strong> {loanDetails?.delinquency?.errorMessage}
                        </div>
                    </ng-container>
    </ng-container>
            </div>
        </div>
    
        
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03); margin-bottom:25px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
                <h3 style="margin:0; font-size:16px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
                    📅 Complete Repayment Schedule (Amortization)
                </h3>
                <span style="font-size:12px; color:#64748b;">Automated DPD Calculation strictly applied on unpaid installments past due</span>
            </div>
    
            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.repaymentSchedule?.status == 'SUCCESS')">
                    <div style="overflow-x:auto;">
                        <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
                            <thead>
                                <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0; color:#475569; font-size:11px; text-transform:uppercase; letter-spacing:0.5px;">
                                    <th style="padding:10px 12px;">Inst #</th>
                                    <th style="padding:10px 12px;">Due Date</th>
                                    <th style="padding:10px 12px; text-align:right;">EMI Amount</th>
                                    <th style="padding:10px 12px; text-align:right;">Principal</th>
                                    <th style="padding:10px 12px; text-align:right;">Interest</th>
                                    <th style="padding:10px 12px; text-align:right;">Paid Amount</th>
                                    <th style="padding:10px 12px; text-align:center;">Payment Status</th>
                                    <th style="padding:10px 12px; text-align:center;">DPD</th>
                                </tr>
                            </thead>
                            <tbody>
                                <ng-container *ngFor="let inst of (data.rs?.installments || [])">
                                    <tr style="border-bottom:1px solid #f1f5f9; background:{inst?.status == 'OVERDUE' ? '#fff1f2' : ((inst?.status == 'PAID' || inst?.status == 'COMPLETED') ? '#f0fdf4' : (inst?.status == 'PARTIALLY_PAID' ? '#fffbeb' : '#ffffff'))};">
                                        <td style="padding:10px 12px; font-weight:700; color:#334155;">{{ { inst?.installmentNumber }}}</td>
                                        <td style="padding:10px 12px; color:#334155;">{inst?.dueDate}</td>
                                        <td style="padding:10px 12px; text-align:right; font-weight:700; color:#0f172a;">
                                            ₹{(inst?.emiAmount) | number:'1.2-2'}
                                        </td>
                                        <td style="padding:10px 12px; text-align:right; color:#64748b;">
                                            ₹{(inst?.principalComponent) | number:'1.2-2'}
                                        </td>
                                        <td style="padding:10px 12px; text-align:right; color:#64748b;">
                                            ₹{(inst?.interestComponent) | number:'1.2-2'}
                                        </td>
                                        <td style="padding:10px 12px; text-align:right; font-weight:600; color:{inst?.paidAmount > 0 ? '#15803d' : '#94a3b8'};">
                                            ₹{(inst?.paidAmount) | number:'1.2-2'}
                                        </td>
                                        <td style="padding:10px 12px; text-align:center;">
                                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(inst?.status == 'PAID' || inst?.status == 'COMPLETED')">
                                                    <span style="background:#dcfce7; color:#15803d; padding:3px 10px; border-radius:10px; font-size:11px; font-weight:700;">PAID</span>
                                                </ng-container>
      <ng-container *ngSwitchCase="!!(inst?.status == 'PARTIALLY_PAID')">
                                                    <span style="background:#fef3c7; color:#b45309; border:1px solid #fde68a; padding:3px 10px; border-radius:10px; font-size:11px; font-weight:700;">PARTIALLY PAID</span>
                                                </ng-container>
      <ng-container *ngSwitchCase="!!(inst?.status == 'OVERDUE')">
                                                    <span style="background:#fee2e2; color:#b91c1c; border:1px solid #fca5a5; padding:3px 10px; border-radius:10px; font-size:11px; font-weight:800; animation:pulse 2s infinite;">⚠️ OVERDUE</span>
                                                </ng-container>
      <ng-container *ngSwitchDefault>
                                                    <span style="background:#e0f2fe; color:#0369a1; padding:3px 10px; border-radius:10px; font-size:11px; font-weight:700;">DUE</span>
                                                </ng-container>
    </ng-container>
                                        </td>
                                        <td style="padding:10px 12px; text-align:center; font-weight:700; color:{inst?.dpd > 0 ? '#b91c1c' : '#64748b'};">
                                            {inst?.dpd}
                                        </td>
                                    </tr>
                                </ng-container>
                            </tbody>
                        </table>
                    </div>
                </ng-container>
      <ng-container *ngSwitchDefault>
                    <div style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px; border-radius:6px; font-size:13px;">
                        ⚠️ <strong>Repayment Schedule Unavailable:</strong> {loanDetails?.repaymentSchedule?.errorMessage}
                    </div>
                </ng-container>
    </ng-container>
        </div>
    
        
        <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03); margin-bottom:25px;">
            <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
                <h3 style="margin:0; font-size:16px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
                    📜 Verified Payment Transactions
                </h3>
                <span style="font-size:12px; color:#64748b;">Direct ledger transactions (No fabricated repayment data)</span>
            </div>
    
            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.paymentHistory?.status == 'SUCCESS')">
                    <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!((!ph?.transactions || ph?.transactions?.length === 0))">
                            <div style="text-align:center; padding:30px; color:#64748b; font-size:14px; background:#f8fafc; border-radius:8px; border:1px dashed #cbd5e1;">
                                ℹ️ No repayment transactions have been recorded for this loan account yet.
                            </div>
                        </ng-container>
      <ng-container *ngSwitchDefault>
                            <div style="overflow-x:auto;">
                                <table style="width:100%; border-collapse:collapse; font-size:13px; text-align:left;">
                                    <thead>
                                        <tr style="background:#f8fafc; border-bottom:2px solid #e2e8f0; color:#475569; font-size:11px; text-transform:uppercase;">
                                            <th style="padding:10px 12px;">Payment Date</th>
                                            <th style="padding:10px 12px; text-align:right;">Amount Paid</th>
                                            <th style="padding:10px 12px; text-align:center;">Mode</th>
                                            <th style="padding:10px 12px;">Transaction Reference</th>
                                            <th style="padding:10px 12px; text-align:center;">Status</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <ng-container *ngFor="let tx of (data.ph?.transactions || [])">
                                            <tr style="border-bottom:1px solid #f1f5f9;">
                                                <td style="padding:10px 12px; color:#334155;">{tx?.paymentDate}</td>
                                                <td style="padding:10px 12px; text-align:right; font-weight:700; color:#15803d;">
                                                    ₹{(tx?.amount) | number:'1.2-2'}
                                                </td>
                                                <td style="padding:10px 12px; text-align:center;">
                                                    <span style="background:#f1f5f9; color:#475569; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:600;">
                                                        {tx?.paymentMode}
                                                    </span>
                                                </td>
                                                <td style="padding:10px 12px; font-family:monospace; color:#4338ca;">{tx?.transactionReference}</td>
                                                <td style="padding:10px 12px; text-align:center;">
                                                    <span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:700;">
                                                        {tx?.status}
                                                    </span>
                                                </td>
                                            </tr>
                                        </ng-container>
                                    </tbody>
                                </table>
                            </div>
                        </ng-container>
    </ng-container>
                </ng-container>
      <ng-container *ngSwitchDefault>
                    <div style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px; border-radius:6px; font-size:13px;">
                        ⚠️ <strong>Payment History Unavailable:</strong> {loanDetails?.paymentHistory?.errorMessage}
                    </div>
                </ng-container>
    </ng-container>
        </div>
    
        
        <div style="display:grid; grid-template-columns: 1fr 1fr; gap:20px; margin-bottom:25px;">
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:16px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
                        🛡️ Collateral & Guarantor Security
                    </h3>
                </div>
    
                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.collateralGuarantor?.status == 'SUCCESS')">
                        <div style="margin-bottom:16px;">
                            <h4 style="margin:0 0 8px 0; font-size:13px; font-weight:700; color:#475569; text-transform:uppercase;">Pledged Collateral Assets</h4>
                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!((!cg?.collaterals || cg?.collaterals?.length === 0))">
                                    <div style="font-size:12px; color:#64748b; background:#f8fafc; padding:10px; border-radius:6px; border:1px dashed #cbd5e1;">
                                        No physical or liquid collateral pledged (Unsecured loan facility).
                                    </div>
                                </ng-container>
      <ng-container *ngSwitchDefault>
                                    <ng-container *ngFor="let c of (data.cg?.collaterals || [])">
                                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; margin-bottom:8px; font-size:13px;">
                                            <div style="display:flex; justify-content:space-between;">
                                                <strong style="color:#0f172a;">{c?.collateralType}</strong>
                                                <span style="font-weight:700; color:#15803d;">₹{(c?.estimatedValue) | number:'1.2-2'}</span>
                                            </div>
                                            <div style="color:#64748b; font-size:12px; margin-top:4px;">{c?.description}</div>
                                            <div style="font-size:11px; color:#4338ca; margin-top:2px;">Lien Status: {c?.lienStatus}</div>
                                        </div>
                                    </ng-container>
                                </ng-container>
    </ng-container>
                        </div>
    
                        
                        <div>
                            <h4 style="margin:0 0 8px 0; font-size:13px; font-weight:700; color:#475569; text-transform:uppercase;">Guarantor Details</h4>
                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!((!cg?.guarantors || cg?.guarantors?.length === 0))">
                                    <div style="font-size:12px; color:#64748b; background:#f8fafc; padding:10px; border-radius:6px; border:1px dashed #cbd5e1;">
                                        No third-party guarantor assigned to this facility.
                                    </div>
                                </ng-container>
      <ng-container *ngSwitchDefault>
                                    <ng-container *ngFor="let g of (data.cg?.guarantors || [])">
                                        <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:6px; padding:10px; margin-bottom:8px; font-size:13px;">
                                            <div style="display:flex; justify-content:space-between;">
                                                <strong style="color:#0f172a;">{g?.name}</strong>
                                                <span style="background:#dcfce7; color:#15803d; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:700;">KYC: {g?.kycStatus}</span>
                                            </div>
                                            <div style="color:#64748b; font-size:12px; margin-top:4px;">Relationship: {g?.relationship} | Phone: {g?.phone}</div>
                                        </div>
                                    </ng-container>
                                </ng-container>
    </ng-container>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchDefault>
                        <div style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px; border-radius:6px; font-size:13px;">
                            ⚠️ <strong>Collateral & Guarantor Information Unavailable:</strong> {loanDetails?.collateralGuarantor?.errorMessage}
                        </div>
                    </ng-container>
    </ng-container>
            </div>
    
            
            <div style="background:#ffffff; border:1px solid #e2e8f0; border-radius:10px; padding:20px; box-shadow:0 2px 6px rgba(0,0,0,0.03);">
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #f1f5f9; padding-bottom:12px; margin-bottom:16px;">
                    <h3 style="margin:0; font-size:16px; font-weight:700; color:#1e293b; display:flex; align-items:center; gap:8px;">
                        🏦 Linked Accounts & CBS Auto-Debit
                    </h3>
                </div>
    
                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(loanDetails?.linkedAccount?.status == 'SUCCESS')">
                        <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!((!la?.accounts || la?.accounts?.length === 0))">
                                <div style="font-size:12px; color:#64748b; background:#f8fafc; padding:15px; border-radius:6px; border:1px dashed #cbd5e1; text-align:center;">
                                    ℹ️ No savings/current bank account is linked for auto-debit on this loan account.
                                </div>
                            </ng-container>
      <ng-container *ngSwitchDefault>
                                <ng-container *ngFor="let acc of (data.la?.accounts || [])">
                                    <div style="background:#f8fafc; border:1px solid #e2e8f0; border-radius:8px; padding:12px; margin-bottom:10px; font-size:13px;">
                                        <div style="display:flex; justify-content:space-between; align-items:center;">
                                            <strong style="color:#0f172a;">{acc?.bankName} ({acc?.accountType})</strong>
                                            <ng-container *ngIf="acc?.autoDebitEnabled">
                                                <span style="background:#e0e7ff; color:#4338ca; padding:2px 8px; border-radius:6px; font-size:11px; font-weight:700;">AUTO-DEBIT ACTIVE</span>
                                            </ng-container>
                                        </div>
                                        <div style="margin-top:6px; font-family:monospace; color:#334155; font-size:14px;">
                                            Account: {acc?.maskedAccountNumber}
                                        </div>
                                        <div style="margin-top:8px; padding-top:8px; border-top:1px dashed #cbd5e1; display:flex; justify-content:space-between; font-size:12px;">
                                            <span style="color:#64748b;">Live CBS Balance:</span>
                                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(acc?.accountBalance != null)">
                                                    <strong style="color:#15803d;">₹{(acc?.accountBalance) | number:'1.2-2'}</strong>
                                                </ng-container>
      <ng-container *ngSwitchDefault>
                                                    <span style="color:#94a3b8; font-style:italic;">{acc?.coreBankingStatus}</span>
                                                </ng-container>
    </ng-container>
                                        </div>
                                    </div>
                                </ng-container>
                            </ng-container>
    </ng-container>
                    </ng-container>
      <ng-container *ngSwitchCase="!!(loanDetails?.linkedAccount?.status == 'UNAVAILABLE')">
                        <div style="background:#f8fafc; border:1px solid #cbd5e1; color:#475569; padding:16px; border-radius:8px; font-size:13px;">
                            <div style="font-weight:700; margin-bottom:6px; color:#1e293b;">
                                ℹ️ Core Banking Integration Notice:
                            </div>
                            <p style="margin:0; font-size:12px; line-height:1.5;">
                                {loanDetails?.linkedAccount?.errorMessage}
                            </p>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchDefault>
                        <div style="background:#fef2f2; border:1px solid #fecaca; color:#991b1b; padding:12px; border-radius:6px; font-size:13px;">
                            ⚠️ <strong>Linked Account Information Error:</strong> {loanDetails?.linkedAccount?.errorMessage}
                        </div>
                    </ng-container>
    </ng-container>
            </div>
        </div>
    </div>
  `
})
export class LoanAccountDetailsComponent implements OnInit, OnDestroy {
  param: Record<string, any> = {};
  private _activeTimers: Array<{ type: 'timeout' | 'interval'; id: any }> = [];
  private _activeListeners: Array<{ target: EventTarget; type: string; listener: any; options?: any }> = [];
  _csrf: any = undefined;
  acc: any = undefined;
  c: any = undefined;
  cust: any = undefined;
  del: any = undefined;
  g: any = undefined;
  inst: any = undefined;
  isRefreshed: any = undefined;
  ld: any = undefined;
  loanDetails: any = undefined;
  os: any = undefined;
  tx: any = undefined;
  userObj: any = undefined;
  formData: Record<string, any> = {
    'parameterName': '',
  };
  backendActionNotice: string = '';
  isSubmitting: boolean = false;
  submitError: string | null = null;
  submitSuccess: string | boolean = false;
  userObj: any = undefined;
  cust: any = undefined;
  ld: any = undefined;
  os: any = undefined;
  del: any = undefined;
  rs: any = undefined;
  ph: any = undefined;
  cg: any = undefined;
  la: any = undefined;
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
      // Visual pulse effect for overdue badges
          const style = document.createElement('style');
          style.innerHTML = `
              @keyframes pulse {
                  0% { opacity: 1; }
                  50% { opacity: 0.6; }
                  100% { opacity: 1; }
              }
          `;
          document.head.appendChild(style);
    } catch (e) { console.warn(e); }
    this._csrf = this.data?.['_csrf'] ?? this._csrf;
    this.acc = this.data?.['acc'] ?? this.acc;
    this.c = this.data?.['c'] ?? this.c;
    this.cust = this.data?.['cust'] ?? this.cust;
    this.del = this.data?.['del'] ?? this.del;
    this.g = this.data?.['g'] ?? this.g;
    this.inst = this.data?.['inst'] ?? this.inst;
    this.isRefreshed = this.data?.['isRefreshed'] ?? this.isRefreshed;
    this.ld = this.data?.['ld'] ?? this.ld;
    this.loanDetails = this.data?.['loanDetails'] ?? this.loanDetails;
    this.os = this.data?.['os'] ?? this.os;
    this.tx = this.data?.['tx'] ?? this.tx;
    this.userObj = this.data?.['userObj'] ?? this.userObj;
    this.userObj = Boolean((data?.sessionScope?.user || data?.user)) ? (data?.sessionScope?.user || data?.user) : (data?.currentUser || data?.user || null);
    this.cust = loanDetails.customerProfile.data;
    this.ld = loanDetails.loanDetails.data;
    this.os = loanDetails.outstandingSummary.data;
    this.del = loanDetails.delinquency.data;
    this.rs = loanDetails.repaymentSchedule.data;
    this.ph = loanDetails.paymentHistory.data;
    this.cg = loanDetails.collateralGuarantor.data;
    this.la = loanDetails.linkedAccount.data;
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

export default LoanAccountDetailsComponent;