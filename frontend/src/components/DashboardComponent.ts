import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dashboard',
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
    
    
    <div style="padding: 10px 20px 40px 20px;">
    
    <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(isStaff)">
            <div class="staff-dashboard">
    
                
                <ng-container *ngIf="param?.approved == 'true'">
                    <div class="alert alert-success" style="margin-bottom:20px;">
                        ✅ <strong>Application Approved:</strong> Loan application has been successfully sanctioned and activated. Amortization schedule has been generated.
                    </div>
                </ng-container>
                <ng-container *ngIf="param?.rejected == 'true'">
                    <div class="alert alert-info" style="margin-bottom:20px;">
                        ℹ️ <strong>Application Rejected:</strong> Loan application status updated to REJECTED.
                    </div>
                </ng-container>
                <ng-container *ngIf="param?.collectionRecorded == 'true'">
                    <div class="alert alert-success" style="margin-bottom:20px;">
                        ✅ <strong>Collection Recorded:</strong> Payment receipt generated, borrower balance updated, and installment schedule synchronized.
                    </div>
                </ng-container>
    
                
                <div class="staff-banner">
                    <div>
                        <h1 class="staff-banner-title">
                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(staffUser?.role == 'ROLE_LOAN_OFFICER')">🏛️ Loan Officer Operations Hub</ng-container>
      <ng-container *ngSwitchCase="!!(staffUser?.role == 'ROLE_COLLECTIONS_AGENT')">💳 Collections Agent Operations Hub</ng-container>
      <ng-container *ngSwitchCase="!!(staffUser?.role == 'ROLE_COLLECTIONS_MANAGER')">📊 Collections Management & Risk Portfolio</ng-container>
      <ng-container *ngSwitchDefault>🛡️ Central Staff Administration Portal</ng-container>
    </ng-container>
                        </h1>
                        <div class="staff-banner-sub">
                            <span>Staff Member: <strong>{staffUser?.name}</strong></span>
                            <span class="role-pill">{staffUser?.role}</span>
                            <ng-container *ngIf="!!(officerBranch)">
                                <span style="background:#EDF2F7; color:#2D3748; padding:3px 10px; border-radius:12px; font-weight:600; font-size:12px;">
                                    🏢 Branch: <strong>{officerBranch}</strong>
                                </span>
                            </ng-container>
                        </div>
                    </div>
    
                    
                    <div style="display:flex; gap:10px; align-items:center; flex-wrap:wrap;">
                        <ng-container *ngIf="staffUser?.role == 'ROLE_LOAN_OFFICER' || staffUser?.role == 'ROLE_ADMIN'">
                            <a href="/loan-approval.xhtml" class="btn" style="width:auto; padding:10px 18px; font-size:13px; text-decoration:none; display:inline-flex; align-items:center; gap:6px; background:#ED7D16; color:#FFFFFF;">
                                <span>⚡  Loan Approval Workflow</span>
                            </a>
                        </ng-container>
                        <a href="/loan-search" class="btn btn-secondary" style="width:auto; padding:10px 18px; font-size:13px; text-decoration:none; display:inline-flex; align-items:center; gap:6px;">
                            <span>🔍 Loan & Customer Search</span>
                        </a>
                    </div>
                </div>
    
                
                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(staffUser?.role == 'ROLE_LOAN_OFFICER')">
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Active Loans</span>
                                    <span style="color:#059669;">📈</span>
                                </div>
                                <div class="metric-value">{activeLoansCount}</div>
                                <div class="metric-hint">Currently servicing in branch</div>
                            </div>
    
                            <div class="metric-card" style="border-top:3px solid #ED7D16;">
                                <div class="metric-label">
                                    <span>Pending Applications</span>
                                    <span style="color:#ED7D16;">📝</span>
                                </div>
                                <div class="metric-value" style="color:#ED7D16;">{pendingLoansCount}</div>
                                <div class="metric-hint">Require officer review & approval</div>
                            </div>
    
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Disbursed Volume</span>
                                    <span style="color:#24446B;">🏛️</span>
                                </div>
                                <div class="metric-value">₹{(totalPrincipal) | number:'1.0-0'}</div>
                                <div class="metric-hint">Cumulative sanctioned principal</div>
                            </div>
    
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Branch Outstanding</span>
                                    <span style="color:#DC2626;">💼</span>
                                </div>
                                <div class="metric-value" style="color:#DC2626;">₹{(totalRemaining) | number:'1.0-0'}</div>
                                <div class="metric-hint">Total principal receivable</div>
                            </div>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchCase="!!(staffUser?.role == 'ROLE_COLLECTIONS_AGENT')">
                        <div class="metrics-grid">
                            <div class="metric-card" style="border-top:3px solid #DC2626;">
                                <div class="metric-label">
                                    <span>Overdue Accounts</span>
                                    <span style="color:#DC2626;">⚠️</span>
                                </div>
                                <div class="metric-value" style="color:#DC2626;">{overdueLoansCount}</div>
                                <div class="metric-hint">Accounts requiring collection action</div>
                            </div>
    
                            <div class="metric-card" style="border-top:3px solid #B91C1C;">
                                <div class="metric-label">
                                    <span>Delinquent Amount</span>
                                    <span style="color:#B91C1C;">💸</span>
                                </div>
                                <div class="metric-value" style="color:#B91C1C;">₹{(totalOverdueAmount) | number:'1.2-2'}</div>
                                <div class="metric-hint">Total overdue EMI balance</div>
                            </div>
    
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Critical DPD (>30 Days)</span>
                                    <span style="color:#F59E0B;">🚨</span>
                                </div>
                                <div class="metric-value">{dpdSma1Count + dpdSma2Count + dpdNpaCount}</div>
                                <div class="metric-hint">Accounts at risk of NPA</div>
                            </div>
    
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Total Branch Accounts</span>
                                    <span style="color:#24446B;">🏢</span>
                                </div>
                                <div class="metric-value">{totalLoansCount}</div>
                                <div class="metric-hint">Assigned branch portfolio</div>
                            </div>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchCase="!!(staffUser?.role == 'ROLE_COLLECTIONS_MANAGER')">
                        <div class="metrics-grid">
                            <div class="metric-card" style="border-top:3px solid #DC2626;">
                                <div class="metric-label">
                                    <span>Portfolio At Risk (PAR)</span>
                                    <span style="color:#DC2626;">📊</span>
                                </div>
                                <div class="metric-value" style="color:#DC2626;">{parRate}%</div>
                                <div class="metric-hint">Overdue vs Total Outstanding</div>
                            </div>
    
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Total Delinquent Amount</span>
                                    <span style="color:#B91C1C;">💸</span>
                                </div>
                                <div class="metric-value" style="color:#B91C1C;">₹{(totalOverdueAmount) | number:'1.2-2'}</div>
                                <div class="metric-hint">{overdueLoansCount} delinquent borrower accounts</div>
                            </div>
    
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Total Active Portfolio</span>
                                    <span style="color:#059669;">💼</span>
                                </div>
                                <div class="metric-value">₹{(totalRemaining) | number:'1.0-0'}</div>
                                <div class="metric-hint">{activeLoansCount} servicing loans</div>
                            </div>
    
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Total Accounts</span>
                                    <span style="color:#24446B;">🏛️</span>
                                </div>
                                <div class="metric-value">{totalLoansCount}</div>
                                <div class="metric-hint">Total branch accounts monitored</div>
                            </div>
                        </div>
    
                        
                        <div class="dpd-grid">
                            <div class="dpd-card current">
                                <div class="dpd-title">Standard (0 DPD)</div>
                                <div class="dpd-count">{dpdCurrentCount}</div>
                                <div class="dpd-amt">₹{(dpdCurrentAmount) | number:'1.0-0'}</div>
                            </div>
                            <div class="dpd-card sma0">
                                <div class="dpd-title">SMA-0 (1-30 DPD)</div>
                                <div class="dpd-count">{dpdSma0Count}</div>
                                <div class="dpd-amt">₹{(dpdSma0Amount) | number:'1.0-0'}</div>
                            </div>
                            <div class="dpd-card sma1">
                                <div class="dpd-title">SMA-1 (31-60 DPD)</div>
                                <div class="dpd-count">{dpdSma1Count}</div>
                                <div class="dpd-amt">₹{(dpdSma1Amount) | number:'1.0-0'}</div>
                            </div>
                            <div class="dpd-card sma2">
                                <div class="dpd-title">SMA-2 (61-90 DPD)</div>
                                <div class="dpd-count">{dpdSma2Count}</div>
                                <div class="dpd-amt">₹{(dpdSma2Amount) | number:'1.0-0'}</div>
                            </div>
                            <div class="dpd-card npa">
                                <div class="dpd-title" style="color:#991B1B;">NPA (90+ DPD)</div>
                                <div class="dpd-count" style="color:#991B1B;">{dpdNpaCount}</div>
                                <div class="dpd-amt" style="color:#991B1B;">₹{(dpdNpaAmount) | number:'1.0-0'}</div>
                            </div>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchDefault>
                        <div class="metrics-grid">
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Total Loans</span>
                                    <span style="color:#24446B;">🏛️</span>
                                </div>
                                <div class="metric-value">{totalLoansCount}</div>
                                <div class="metric-hint">Across authorized branches</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Active Borrowers</span>
                                    <span style="color:#059669;">👥</span>
                                </div>
                                <div class="metric-value">{activeLoansCount}</div>
                                <div class="metric-hint">Servicing loans</div>
                            </div>
                            <div class="metric-card" style="border-top:3px solid #ED7D16;">
                                <div class="metric-label">
                                    <span>Pending Applications</span>
                                    <span style="color:#ED7D16;">📝</span>
                                </div>
                                <div class="metric-value" style="color:#ED7D16;">{pendingLoansCount}</div>
                                <div class="metric-hint">Awaiting officer sanction</div>
                            </div>
                            <div class="metric-card">
                                <div class="metric-label">
                                    <span>Total Outstanding</span>
                                    <span style="color:#DC2626;">💼</span>
                                </div>
                                <div class="metric-value" style="color:#DC2626;">₹{(totalRemaining) | number:'1.0-0'}</div>
                                <div class="metric-hint">Total portfolio receivable</div>
                            </div>
                        </div>
                    </ng-container>
    </ng-container>
    
                
    
                
                <ng-container *ngIf="staffUser?.role == 'ROLE_LOAN_OFFICER' || staffUser?.role == 'ROLE_ADMIN'">
                    <div class="staff-panel">
                        <div class="staff-panel-header">
                            <h2 class="staff-panel-title">
                                <span>📝 Pending Loan Applications for Review</span>
                                <span class="status-badge status-pending">{pendingLoansCount} Pending</span>
                            </h2>
                        </div>
    
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Application / Account</th>
                                        <th>Borrower Name</th>
                                        <th>Customer ID</th>
                                        <th>Sanction Amount</th>
                                        <th>Interest & Tenure</th>
                                        <th>Est. Monthly EMI</th>
                                        <th>Branch</th>
                                        <th>Status</th>
                                        <th style="text-align:center;">Decision Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <ng-container *ngFor="let pl of (pendingLoans || [])">
                                        <tr>
                                            <td>
                                                <strong style="color:#2B6CB0; font-family:monospace; font-size:14px;">
                                                    {pl?.accountNumber}
                                                </strong>
                                            </td>
                                            <td><strong>{pl?.user?.name}</strong></td>
                                            <td><span style="font-family:monospace; color:#475569;">{pl?.customerId}</span></td>
                                            <td><strong>₹{(pl?.amount) | number:'1.2-2'}</strong></td>
                                            <td>{pl?.interest}% &bull; {pl?.months} mos</td>
                                            <td style="color:#2B6CB0; font-weight:600;">₹{(pl?.emi) | number:'1.2-2'}</td>
                                            <td>
                                                <span style="background:#EDF2F7; color:#475569; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">
                                                    {pl?.branch}
                                                </span>
                                            </td>
                                            <td>
                                                <span class="status-badge status-pending">{pl?.status}</span>
                                            </td>
                                            <td style="text-align:center;">
                                                <div class="action-btn-group">
                                                    
                                                    <a href="/loan-details?loanId={{ pl?.loanId }}" class="btn-profile" title="Open 360° Comprehensive Profile">
                                                        Profile
                                                    </a>
    
                                                    
                                                    <form (ngSubmit)="onSubmit()" action="/staff/loans/approve" method="post" style="display:inline; margin:0;">
                                                        <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
                                                        <input type="hidden" name="loanId" [(ngModel)]="formData['loanId']" />
                                                        <button type="submit" class="btn-approve" (click)="confirm('Approve and sanction loan account pl.accountNumber?')">
                                                            Approve
                                                        </button>
                                                    </form>
    
                                                    
                                                    <button type="button" class="btn-reject" (click)="openRejectModal('pl.loanId', 'pl.accountNumber', 'pl.user.name')">
                                                        Reject
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </ng-container>
                                    <ng-container *ngIf="!pendingLoans">
                                        <tr>
                                            <td colspan="9" style="text-align:center; padding:35px 20px; color:#64748B;">
                                                <div style="font-size:32px; margin-bottom:8px;">✅</div>
                                                <div style="font-size:15px; font-weight:600; color:#1E293B;">No Pending Loan Applications</div>
                                                <div style="font-size:13px; color:#94A3B8;">All applications submitted to your authorized branch have been reviewed.</div>
                                            </td>
                                        </tr>
                                    </ng-container>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ng-container>
    
                
                <ng-container *ngIf="staffUser?.role == 'ROLE_COLLECTIONS_AGENT' || staffUser?.role == 'ROLE_COLLECTIONS_MANAGER' || staffUser?.role == 'ROLE_ADMIN'">
                    <div class="staff-panel">
                        <div class="staff-panel-header">
                            <h2 class="staff-panel-title">
                                <span>⚠️ Delinquent & Overdue Loan Accounts</span>
                                <span class="status-badge status-overdue">{overdueLoansCount} Overdue</span>
                            </h2>
                        </div>
    
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Account No</th>
                                        <th>Borrower Name</th>
                                        <th>Mobile (Masked)</th>
                                        <th>Principal Sanctioned</th>
                                        <th>Outstanding Balance</th>
                                        <th>Overdue Amount</th>
                                        <th>DPD Bucket</th>
                                        <th>Branch</th>
                                        <th style="text-align:center;">Collection Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <ng-container *ngFor="let dl of (delinquentLoans || [])">
                                        <tr>
                                            <td>
                                                <strong style="color:#2B6CB0; font-family:monospace; font-size:14px;">
                                                    {dl?.accountNumber}
                                                </strong>
                                            </td>
                                            <td><strong>{dl?.user?.name}</strong></td>
                                            <td>{dl?.maskedPhone}</td>
                                            <td>₹{(dl?.amount) | number:'1.2-2'}</td>
                                            <td>
                                                <strong style="color:#DC2626;">₹{(dl?.remaining) | number:'1.2-2'}</strong>
                                            </td>
                                            <td>
                                                <strong style="color:#991B1B; background:#FEE2E2; padding:3px 8px; border-radius:6px;">
                                                    ₹{(dl?.overdueAmount > 0 ? dl?.overdueAmount : dl?.emi) | number:'1.2-2'}
                                                </strong>
                                            </td>
                                            <td>
                                                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(dl?.dpd > 90)">
                                                        <span class="dpd-pill dpd-pill-high">{dl?.dpd} DPD (NPA)</span>
                                                    </ng-container>
      <ng-container *ngSwitchCase="!!(dl?.dpd > 30)">
                                                        <span class="dpd-pill dpd-pill-high">{dl?.dpd} DPD</span>
                                                    </ng-container>
      <ng-container *ngSwitchCase="!!(dl?.dpd > 0)">
                                                        <span class="dpd-pill dpd-pill-low">{dl?.dpd} DPD</span>
                                                    </ng-container>
      <ng-container *ngSwitchDefault>
                                                        <span class="dpd-pill dpd-pill-zero">Current</span>
                                                    </ng-container>
    </ng-container>
                                            </td>
                                            <td>
                                                <span style="background:#EDF2F7; color:#475569; padding:2px 8px; border-radius:10px; font-size:11px; font-weight:600;">
                                                    {dl?.branch}
                                                </span>
                                            </td>
                                            <td style="text-align:center;">
                                                <div class="action-btn-group">
                                                    
                                                    <a href="/loan-details?loanId={{ dl?.loanId }}" class="btn-profile" title="Open 360° Comprehensive Profile">
                                                        Profile
                                                    </a>
    
                                                    
                                                    <button type="button" class="btn-collect" (click)="openCollectionModal('dl.loanId', 'dl.accountNumber', 'dl.user.name', 'dl.remaining', 'dl.overdueAmount > 0 ? dl.overdueAmount : dl.emi')">
                                                        Record Collection
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    </ng-container>
                                    <ng-container *ngIf="!delinquentLoans">
                                        <tr>
                                            <td colspan="9" style="text-align:center; padding:35px 20px; color:#64748B;">
                                                <div style="font-size:32px; margin-bottom:8px;">🎉</div>
                                                <div style="font-size:15px; font-weight:600; color:#1E293B;">Zero Delinquency</div>
                                                <div style="font-size:13px; color:#94A3B8;">All loan accounts in your authorized branch are currently up-to-date.</div>
                                            </td>
                                        </tr>
                                    </ng-container>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ng-container>
    
                
                <ng-container *ngIf="(staffUser?.role == 'ROLE_COLLECTIONS_AGENT' || staffUser?.role == 'ROLE_COLLECTIONS_MANAGER' || staffUser?.role == 'ROLE_ADMIN') &amp;&amp; Boolean(recentCollections)">
                    <div class="staff-panel">
                        <div class="staff-panel-header">
                            <h2 class="staff-panel-title">
                                <span>💳 Recent Branch Collections Activity</span>
                            </h2>
                        </div>
    
                        <div class="table-responsive">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Transaction Ref</th>
                                        <th>Loan Account</th>
                                        <th>Payment Mode</th>
                                        <th>Amount Collected</th>
                                        <th>Date & Time</th>
                                        <th>Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <ng-container *ngFor="let rc of (recentCollections || [])">
                                        <tr>
                                            <td><span style="font-family:monospace; color:#2B6CB0; font-weight:600;">{rc?.transactionReference}</span></td>
                                            <td>
                                                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!((rc?.loan != null && rc?.loan !== ''))">
                                                        <a href="/loan-details?loanId={{ rc?.loan?.loanId }}" style="text-decoration:none; font-family:monospace; font-weight:700; color:#24446B;">
                                                            {rc?.loan?.accountNumber}
                                                        </a>
                                                    </ng-container>
      <ng-container *ngSwitchDefault>
                                                        <span style="color:#94A3B8;">-</span>
                                                    </ng-container>
    </ng-container>
                                            </td>
                                            <td>
                                                <span style="background:#EDF2F7; padding:3px 8px; border-radius:6px; font-size:12px; font-weight:600;">
                                                    {rc?.paymentMode}
                                                </span>
                                            </td>
                                            <td><strong style="color:#15803D;">₹{(rc?.amount) | number:'1.2-2'}</strong></td>
                                            <td>{rc?.paymentDate}</td>
                                            <td><span class="status-badge status-active">{rc?.status}</span></td>
                                        </tr>
                                    </ng-container>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </ng-container>
    
                
                <div class="staff-panel">
                    <div class="staff-panel-header">
                        <h2 class="staff-panel-title">
                            <span>🏛️ Authorized Branch Loan Portfolio</span>
                            <span style="font-size:13px; font-weight:normal; color:#64748B;">({totalLoansCount} accounts)</span>
                        </h2>
                    </div>
    
                    <div class="table-responsive">
                        <table>
                            <thead>
                                <tr>
                                    <th>Account No</th>
                                    <th>Borrower Name</th>
                                    <th>Sanctioned (₹)</th>
                                    <th>Interest & Tenure</th>
                                    <th>Monthly EMI</th>
                                    <th>Outstanding Balance</th>
                                    <th>Repayment Status</th>
                                    <th>DPD</th>
                                    <th>Loan Status</th>
                                    <th style="text-align:center;">Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                <ng-container *ngFor="let l of (loans || [])">
                                    <tr>
                                        <td>
                                            <strong style="color:#2B6CB0; font-family:monospace; font-size:14px;">
                                                {l?.accountNumber}
                                            </strong>
                                        </td>
                                        <td><strong>{l?.user?.name}</strong></td>
                                        <td>₹{(l?.amount) | number:'1.2-2'}</td>
                                        <td>{l?.interest}% &bull; {l?.months} mos</td>
                                        <td style="color:#2B6CB0; font-weight:600;">₹{(l?.emi) | number:'1.2-2'}</td>
                                        <td>
                                            <strong style="color:{l?.remaining > 0 ? '#DC2626' : '#15803D'};">
                                                ₹{(l?.remaining) | number:'1.2-2'}
                                            </strong>
                                        </td>
                                        <td>
                                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(l?.repaymentStatus == 'OVERDUE')">
                                                    <span class="status-badge status-overdue">⚠️ Overdue</span>
                                                </ng-container>
      <ng-container *ngSwitchCase="!!(l?.repaymentStatus == 'CURRENT')">
                                                    <span class="status-badge status-active">Current</span>
                                                </ng-container>
      <ng-container *ngSwitchCase="!!(l?.repaymentStatus == 'CLOSED')">
                                                    <span class="status-badge status-closed">Closed</span>
                                                </ng-container>
      <ng-container *ngSwitchDefault>
                                                    <span class="status-badge status-pending">{l?.repaymentStatus}</span>
                                                </ng-container>
    </ng-container>
                                        </td>
                                        <td>
                                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(l?.dpd > 0)">
                                                    <span class="dpd-pill dpd-pill-high">{l?.dpd} DPD</span>
                                                </ng-container>
      <ng-container *ngSwitchCase="!!(l?.status == 'CLOSED')">
                                                    <span style="color:#94A3B8; font-size:12px;">-</span>
                                                </ng-container>
      <ng-container *ngSwitchDefault>
                                                    <span class="dpd-pill dpd-pill-zero">0 DPD</span>
                                                </ng-container>
    </ng-container>
                                        </td>
                                        <td>
                                            <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(l?.status == 'ACTIVE')">
                                                    <span class="status-badge status-active">Active</span>
                                                </ng-container>
      <ng-container *ngSwitchCase="!!(l?.status == 'CLOSED')">
                                                    <span class="status-badge status-closed">Closed</span>
                                                </ng-container>
      <ng-container *ngSwitchCase="!!(l?.status == 'REJECTED')">
                                                    <span class="status-badge status-rejected">Rejected</span>
                                                </ng-container>
      <ng-container *ngSwitchDefault>
                                                    <span class="status-badge status-pending">{l?.status}</span>
                                                </ng-container>
    </ng-container>
                                        </td>
                                        <td style="text-align:center;">
                                            
                                            <a href="/loan-details?loanId={{ l?.loanId }}" class="btn-profile" title="Open 360° Comprehensive Profile">
                                                Profile
                                            </a>
                                        </td>
                                    </tr>
                                </ng-container>
                                <ng-container *ngIf="!loans">
                                    <tr>
                                        <td colspan="10" style="text-align:center; padding:40px 20px; color:#64748B;">
                                            <div style="font-size:32px; margin-bottom:8px;">📋</div>
                                            <div style="font-size:15px; font-weight:600; color:#1E293B;">No Loan Records Found</div>
                                            <div style="font-size:13px; color:#94A3B8;">There are currently no loan records assigned to your branch.</div>
                                        </td>
                                    </tr>
                                </ng-container>
                            </tbody>
                        </table>
                    </div>
                </div>
    
            </div>
    
            
            <div id="rejectModal" class="staff-modal-backdrop">
                <div class="staff-modal-card">
                    <h3 style="margin-top:0; color:#24446B;">Reject Loan Application</h3>
                    <p style="color:#64748B; font-size:14px; margin-bottom:16px;">
                        Account: <strong id="rejectModalAccount"></strong> &bull; Borrower: <strong id="rejectModalBorrower"></strong>
                    </p>
                    <form (ngSubmit)="onSubmit()" action="/staff/loans/reject" method="post">
                        <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
                        <input type="hidden" name="loanId" id="rejectModalLoanId" [(ngModel)]="formData['loanId']" />
    
                        <label style="font-weight:600; font-size:13px; color:#334155;">Rejection Reason <span style="color:#DC2626;">*</span></label>
                        <select name="reason" style="margin-top:6px; margin-bottom:16px;" required [(ngModel)]="formData['reason']">
                            <option value="Credit score does not meet minimum bank threshold">Credit score does not meet minimum bank threshold</option>
                            <option value="Debt-to-income ratio exceeds permissible limits">Debt-to-income ratio exceeds permissible limits</option>
                            <option value="Incomplete or unverified borrower KYC documentation">Incomplete or unverified borrower KYC documentation</option>
                            <option value="Customer employment / income verification unconfirmed">Customer employment / income verification unconfirmed</option>
                            <option value="Application does not meet eligibility criteria">Other bank policy criteria not met</option>
                        </select>
    
                        <div style="display:flex; gap:10px; justify-content:flex-end;">
                            <button type="button" class="btn btn-secondary" style="width:auto; padding:8px 16px; font-size:13px;" (click)="closeRejectModal()">
                                Cancel
                            </button>
                            <button type="submit" class="btn btn-danger" style="width:auto; padding:8px 16px; font-size:13px;">
                                Confirm Rejection
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    
            
            <div id="collectionModal" class="staff-modal-backdrop">
                <div class="staff-modal-card">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:12px;">
                        <h3 style="margin:0; color:#24446B;">Record Collection Payment</h3>
                        <button type="button" (click)="closeCollectionModal()" style="background:none; border:none; font-size:18px; cursor:pointer; color:#64748B;">&times;</button>
                    </div>
                    <p style="color:#64748B; font-size:13px; margin:0 0 16px 0;">
                        Account: <strong id="collectModalAccount" style="color:#2B6CB0;"></strong> &bull; 
                        Borrower: <strong id="collectModalBorrower"></strong>
                    </p>
    
                    <div style="background:#F8FAFC; border:1px solid #E2E8F0; border-radius:8px; padding:12px; margin-bottom:16px; display:flex; justify-content:space-between;">
                        <div>
                            <div style="font-size:11px; color:#64748B; text-transform:uppercase;">Outstanding Balance</div>
                            <div style="font-size:16px; font-weight:700; color:#DC2626;" id="collectModalBalance">₹0.00</div>
                        </div>
                        <div>
                            <div style="font-size:11px; color:#64748B; text-transform:uppercase;">Overdue EMI Due</div>
                            <div style="font-size:16px; font-weight:700; color:#991B1B;" id="collectModalOverdue">₹0.00</div>
                        </div>
                    </div>
    
                    <form (ngSubmit)="onSubmit()" action="/staff/collections/record" method="post">
                        <input type="hidden" name="{_csrf?.parameterName}" [(ngModel)]="formData['{_csrf?.parameterName}']" />
                        <input type="hidden" name="loanId" id="collectModalLoanId" [(ngModel)]="formData['loanId']" />
    
                        <label style="font-weight:600; font-size:13px; color:#334155;">Collection Amount (₹) <span style="color:#DC2626;">*</span></label>
                        <input type="number" step="any" min="1" name="amount" id="collectModalAmount" required style="margin-top:6px; margin-bottom:12px;" [(ngModel)]="formData['amount']" />
    
                        <label style="font-weight:600; font-size:13px; color:#334155;">Payment Mode <span style="color:#DC2626;">*</span></label>
                        <select name="paymentMode" style="margin-top:6px; margin-bottom:12px;" required [(ngModel)]="formData['paymentMode']">
                            <option value="CASH">CASH (Physical Receipt Issued)</option>
                            <option value="UPI">UPI (QR / VPA Transfer)</option>
                            <option value="NEFT">NEFT / RTGS</option>
                            <option value="CHEQUE">Bank Cheque</option>
                            <option value="DD">Demand Draft</option>
                        </select>
    
                        <label style="font-weight:600; font-size:13px; color:#334155;">Receipt / Transaction Reference</label>
                        <input type="text" name="transactionReference" id="collectModalRef" placeholder="e.g. REC-2026-90812 or Bank Ref" maxlength="50" style="margin-top:6px; margin-bottom:18px;" [(ngModel)]="formData['transactionReference']" />
    
                        <div style="display:flex; gap:10px; justify-content:flex-end;">
                            <button type="button" class="btn btn-secondary" style="width:auto; padding:8px 16px; font-size:13px;" (click)="closeCollectionModal()">
                                Cancel
                            </button>
                            <button type="submit" class="btn" style="width:auto; padding:8px 20px; font-size:13px; background-color:#ED7D16;">
                                Confirm & Record Collection
                            </button>
                        </div>
                    </form>
                </div>
            </div>
    
            
        </ng-container>
      <ng-container *ngSwitchDefault>
            <div class="customer-dashboard">
    
                
                <div class="welcome-banner">
                    <div>
                        <h1 class="welcome-title">Welcome back, {userObj?.name}!</h1>
                        <p class="welcome-sub">Here's an overview of your loan account.</p>
                    </div>
                    <div>
                        <a href="/applyLoan" class="btn-orange-primary">
                            <span style="font-size: 16px; font-weight: 800;">+</span> Apply for Loan
                        </a>
                    </div>
                </div>
    
                
                <ng-container *ngIf="Boolean(data.successMessage) || param?.applied">
                    <div class="alert alert-success" style="margin-bottom:24px; display:flex; align-items:center; gap:12px; border-left:4px solid #059669; background:#ECFDF5; color:#065F46; padding:16px 20px; border-radius:8px;">
                        <span style="font-size:20px;">✅</span>
                        <div>
                            <strong>Application Status:</strong> {(data.successMessage != null && data.successMessage !== '') ? data.successMessage : 'Your loan application has been submitted successfully && is currently under review by our loan officers.'}
                        </div>
                    </div>
                </ng-container>
                <ng-container *ngIf="!!(errorMessage)">
                    <div class="alert alert-danger" style="margin-bottom:24px; display:flex; align-items:center; gap:12px; border-left:4px solid #DC2626; background:#FEF2F2; color:#991B1B; padding:16px 20px; border-radius:8px;">
                        <span style="font-size:20px;">⚠️</span>
                        <div>
                            {errorMessage}
                        </div>
                    </div>
                </ng-container>
    
                
                <ng-container *ngIf="param?.selectLoan">
                    <div class="alert alert-info" style="margin-bottom:24px; display:flex; align-items:center; gap:12px; border-left:4px solid #315B91;">
                        <span style="font-size:20px;">ℹ️</span>
                        <div>
                            <strong>Select Loan for Repayment:</strong> You have multiple active loan accounts. Please click the <strong>"Pay EMI"</strong> button next to the specific loan you wish to repay below.
                        </div>
                    </div>
                </ng-container>
    
                
                <div class="summary-grid">
                    
                    <div class="summary-card">
                        <div class="card-top">
                            <span class="card-label">Total Loans</span>
                            <div class="card-icon-wrap" style="background:#F0F4F8; color:#24446B;">📋</div>
                        </div>
                        <div class="card-value">
                            {totalLoanCount != null ? totalLoanCount : 0}
                        </div>
                        <div class="card-desc">All loan accounts on record</div>
                    </div>
    
                    
                    <div class="summary-card">
                        <div class="card-top">
                            <span class="card-label">Active Loans</span>
                            <div class="card-icon-wrap" style="background:#E6F7F3; color:#0F9B79;">🟢</div>
                        </div>
                        <div class="card-value">
                            {activeLoanCount != null ? activeLoanCount : 0}
                        </div>
                        <div class="card-desc">Currently servicing</div>
                    </div>
    
                    
                    <div class="summary-card">
                        <div class="card-top">
                            <span class="card-label">Pending Applications</span>
                            <div class="card-icon-wrap" style="background:#FEF3EB; color:#ED7D16;">⏳</div>
                        </div>
                        <div class="card-value">
                            {pendingLoanCount != null ? pendingLoanCount : 0}
                        </div>
                        <div class="card-desc">Awaiting sanction / review</div>
                    </div>
    
                    
                    <div class="summary-card" style="border-left: 3px solid #ED7D16;">
                        <div class="card-top">
                            <span class="card-label">Outstanding Balance</span>
                            <div class="card-icon-wrap" style="background:#FEF3EB; color:#ED7D16;">💳</div>
                        </div>
                        <div class="card-value" style="color:#ED7D16;">
                            ₹{(outstandingBalance != null ? outstandingBalance : (totalRemaining != null ? totalRemaining : 0.0)) | number:'1.2-2'}
                        </div>
                        <div class="card-desc">Total remaining principal</div>
                    </div>
                </div>
    
                
                <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!((loans != null && loans !== '') && activeLoanCount > 0)">
                        <div class="dashboard-section-card">
                            <div class="section-header">
                                <div>
                                    <h2 class="section-title">Your Loan Portfolio</h2>
                                    <p class="section-subtitle">Real-time balances and EMI installment commitments</p>
                                </div>
                                <span style="font-size:13px; color:#64748B; font-weight:600;">
                                    Showing {loans?.size()} accounts
                                </span>
                            </div>
    
                            <div class="table-responsive" style="margin-top:0; border:none;">
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Loan Account</th>
                                            <th>Product Type</th>
                                            <th>Sanctioned Amount</th>
                                            <th>Interest Rate</th>
                                            <th>Tenure</th>
                                            <th>Monthly EMI</th>
                                            <th>Outstanding Balance</th>
                                            <th>Status</th>
                                            <th style="text-align:center;">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <ng-container *ngFor="let l of (loans || [])">
                                            <tr>
                                                <td>
                                                    <strong style="color:#24446B; font-family:monospace; font-size:14px;">
                                                        <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!((l?.accountNumber != null && l?.accountNumber !== ''))">
                                                                 {l?.accountNumber}
                                                            </ng-container>
      <ng-container *ngSwitchDefault>
                                                                 {{ { l?.loanId }}}
                                                            </ng-container>
    </ng-container>
                                                    </strong>
                                                </td>
                                                <td>
                                                    {(l?.productType != null && l?.productType !== '') ? l?.productType : 'Personal Loan'}
                                                </td>
                                                <td>₹{(l?.amount) | number:'1.2-2'}</td>
                                                <td>{l?.interest}% ({(l?.interestType != null && l?.interestType !== '') ? l?.interestType : 'FIXED'})</td>
                                                <td>{l?.months} mos</td>
                                                <td style="color:#315B91; font-weight:600;">
                                                    ₹{(l?.emi) | number:'1.2-2'}
                                                </td>
                                                <td>
                                                    <strong style="color:{l?.remaining > 0 ? '#ED7D16' : '#0F9B79'};">
                                                        ₹{(l?.remaining) | number:'1.2-2'}
                                                    </strong>
                                                </td>
                                                <td>
                                                    <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(l?.status == 'ACTIVE' || l?.status == 'APPROVED')">
                                                            <span class="badge-pill badge-success">ACTIVE</span>
                                                        </ng-container>
      <ng-container *ngSwitchCase="!!(l?.status == 'CLOSED')">
                                                            <span class="badge-pill badge-secondary">CLOSED</span>
                                                        </ng-container>
      <ng-container *ngSwitchCase="!!(l?.status == 'REJECTED')">
                                                            <span class="badge-pill badge-danger">REJECTED</span>
                                                        </ng-container>
      <ng-container *ngSwitchDefault>
                                                            <span class="badge-pill badge-warning">{l?.status}</span>
                                                        </ng-container>
    </ng-container>
                                                </td>
                                                <td style="text-align:center;">
                                                    <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!(l?.status == 'PENDING' || l?.status == 'SUBMITTED' || l?.status == 'IN_REVIEW' || l?.status == 'APPLIED')">
                                                            <span style="color:#D97706; font-size:12px; font-weight:600; display:inline-block; padding:4px 10px; background:#FEF3C7; border-radius:6px;">⏳ Under Review</span>
                                                        </ng-container>
      <ng-container *ngSwitchCase="!!(l?.status == 'REJECTED')">
                                                            <span style="color:#DC2626; font-size:12px; font-weight:600; display:inline-block; padding:4px 10px; background:#FEE2E2; border-radius:6px;">❌ Rejected</span>
                                                        </ng-container>
      <ng-container *ngSwitchCase="!!(l?.remaining > 0)">
                                                            <a href="/payPage?loanId={{ l?.loanId }}" class="btn" style="padding:7px 16px; font-size:13px; width:auto; text-decoration:none; display:inline-block; background:#24446B; color:#FFFFFF; border-radius:6px; font-weight:600;">
                                                                Pay EMI
                                                            </a>
                                                        </ng-container>
      <ng-container *ngSwitchDefault>
                                                            <span style="color:#0F9B79; font-size:13px; font-weight:700;">Fully Paid</span>
                                                        </ng-container>
    </ng-container>
                                                </td>
                                            </tr>
                                        </ng-container>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </ng-container>
      <ng-container *ngSwitchDefault>
                        
                        <div style="background:#FFFFFF; border:1px solid #E2E8F0; border-radius:12px; padding:48px 32px; text-align:center; max-width:560px; margin:20px auto 32px auto; box-shadow:0 1px 3px rgba(0,0,0,0.04);">
                            <div style="font-size:52px; margin-bottom:16px;">🏦</div>
                            <h3 style="color:#172B4D; font-size:22px; font-weight:700; margin:0 0 10px 0;">No Active Loans</h3>
                            <p style="color:#64748B; font-size:14px; line-height:1.5; margin:0 0 24px 0;">
                                You don't have any active loans yet. Start a new application to get started.
                            </p>
                            <a href="/applyLoan" class="btn-orange-primary" style="margin:0 auto;">
                                Apply for a Loan
                            </a>
                        </div>
                    </ng-container>
    </ng-container>
    
                
                <div class="dashboard-section-card activity-section">
                    <div class="section-header">
                        <div>
                            <h2 class="section-title">Recent Activity</h2>
                            <p class="section-subtitle">Your latest loan applications, approvals, and repayment records</p>
                        </div>
                    </div>
    
                    <ng-container [ngSwitch]="true">
      <ng-container *ngSwitchCase="!!((recentActivities != null && recentActivities !== ''))">
                            <div class="activity-list">
                                <ng-container *ngFor="let act of (recentActivities || [])">
                                    <div class="activity-row">
                                        <div class="activity-left">
                                            <div class="activity-icon">
                                                {act?.icon}
                                            </div>
                                            <div>
                                                <h4 class="activity-title">{act?.title}</h4>
                                                <p class="activity-desc">{act?.description}</p>
                                            </div>
                                        </div>
                                        <div class="activity-right">
                                            <span class="badge-pill {act?.badgeClass}">
                                                {act?.status}
                                            </span>
                                            <div class="activity-date">{act?.formattedDate}</div>
                                        </div>
                                    </div>
                                </ng-container>
                            </div>
                        </ng-container>
      <ng-container *ngSwitchDefault>
                            <div style="text-align:center; padding:36px 20px; color:#64748B;">
                                <div style="font-size:32px; margin-bottom:10px;">⏱️</div>
                                <p style="margin:0; font-size:14px; font-weight:500;">
                                    Your recent applications and repayments will appear here.
                                </p>
                            </div>
                        </ng-container>
    </ng-container>
                </div>
    
            </div>
        </ng-container>
    </ng-container>
    
    </div>
  `
})
export class DashboardComponent implements OnInit, OnDestroy {
  param: Record<string, any> = {};
  isStaff: boolean = false;
  isAdmin: boolean = false;
  isCustomer: boolean = false;
  errorMessage: string = '';
  private _activeTimers: Array<{ type: 'timeout' | 'interval'; id: any }> = [];
  private _activeListeners: Array<{ target: EventTarget; type: string; listener: any; options?: any }> = [];
  Boolean: any = undefined;
  _csrf: any = undefined;
  act: any = undefined;
  activeLoanCount: any = undefined;
  activeLoansCount: any = undefined;
  dl: any = undefined;
  dpdCurrentCount: any = undefined;
  dpdNpaCount: any = undefined;
  dpdSma0Count: any = undefined;
  dpdSma1Count: any = undefined;
  dpdSma2Count: any = undefined;
  l: any = undefined;
  loans: any = undefined;
  officerBranch: any = undefined;
  overdueLoansCount: any = undefined;
  parRate: any = undefined;
  pendingLoanCount: any = undefined;
  pendingLoansCount: any = undefined;
  pl: any = undefined;
  rc: any = undefined;
  staffUser: any = undefined;
  totalLoanCount: any = undefined;
  totalLoansCount: any = undefined;
  userObj: any = undefined;
  formData: Record<string, any> = {
    'parameterName': '',
    'loanId': '',
    'amount': '',
    'transactionReference': '',
    'reason': '',
    'paymentMode': '',
  };
  backendActionNotice: string = '';
  isSubmitting: boolean = false;
  submitError: string | null = null;
  submitSuccess: string | boolean = false;
  userObj: any = undefined;
  staffUser: any = undefined;
  userObj: any = undefined;
  data: Record<string, any> = {};

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.param = { ...(this.data?.['param'] || {}) };
    this.route?.queryParams?.subscribe((params) => {
      this.param = { ...params, ...(this.data?.['param'] || {}) };
      if (this.data) { this.data['param'] = this.param; }
    });
    const user = this.data?.['userObj'] || this.data?.['(data?.sessionScope || data)']?.['user'] || this.data?.['(data?.currentUser || data?.user || null)'] || this.data?.['user'] || null;
    const staff = this.data?.['staffUser'] || null;
    this.isStaff = Boolean(this.data?.['isStaff'] ?? ((user?.role && user?.role !== 'ROLE_CUSTOMER') || (staff?.role && staff?.role !== 'ROLE_CUSTOMER')));
    this.isAdmin = Boolean(this.data?.['isAdmin'] ?? (user?.role === 'ROLE_ADMIN' || user?.role === 'ADMIN' || staff?.role === 'ROLE_ADMIN'));
    this.isCustomer = Boolean(this.data?.['isCustomer'] ?? (user?.role === 'ROLE_CUSTOMER' || (!this.isStaff && !this.isAdmin && Boolean(user))));
    (window as any).resetInactivity = this.resetInactivity.bind(this);
    (window as any).showWarningModal = this.showWarningModal.bind(this);
    (window as any).stayLoggedIn = this.stayLoggedIn.bind(this);
    (window as any).logoutNow = this.logoutNow.bind(this);
    (window as any).openRejectModal = this.openRejectModal.bind(this);
    (window as any).closeRejectModal = this.closeRejectModal.bind(this);
    (window as any).openCollectionModal = this.openCollectionModal.bind(this);
    (window as any).closeCollectionModal = this.closeCollectionModal.bind(this);
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
      function openRejectModal(loanId, accountNumber, borrowerName) {
                      document.getElementById('rejectModalLoanId').value = loanId;
                      document.getElementById('rejectModalAccount').innerText = accountNumber;
                      document.getElementById('rejectModalBorrower').innerText = borrowerName;
                      document.getElementById('rejectModal').style.display = 'flex';
                  }
                  function closeRejectModal() {
                      document.getElementById('rejectModal').style.display = 'none';
                  }
                  function openCollectionModal(loanId, accountNumber, borrowerName, remaining, suggestedAmount) {
                      document.getElementById('collectModalLoanId').value = loanId;
                      document.getElementById('collectModalAccount').innerText = accountNumber;
                      document.getElementById('collectModalBorrower').innerText = borrowerName;
                      document.getElementById('collectModalBalance').innerText = '₹' + Number(remaining).toLocaleString('en-IN', {minimumFractionDigits: 2});
                      document.getElementById('collectModalOverdue').innerText = '₹' + Number(suggestedAmount).toLocaleString('en-IN', {minimumFractionDigits: 2});
                      document.getElementById('collectModalAmount').value = suggestedAmount > 0 ? suggestedAmount : remaining;
                      document.getElementById('collectModalAmount').max = remaining;
                      document.getElementById('collectModalRef').value = 'COL' + Date.now();
                      document.getElementById('collectionModal').style.display = 'flex';
                  }
                  function closeCollectionModal() {
                      document.getElementById('collectionModal').style.display = 'none';
                  }
                  // Close modals on clicking backdrop
                  this.registerListener(window, 'click', function(event) {
                      const rejectModal = document.getElementById('rejectModal');
                      const collectModal = document.getElementById('collectionModal');
                      if (event.target === rejectModal) {
                          closeRejectModal();
                      }
                      if (event.target === collectModal) {
                          closeCollectionModal();
                      }
                  });
    } catch (e) { console.warn(e); }
    this.Boolean = this.data?.['Boolean'] ?? this.Boolean;
    this._csrf = this.data?.['_csrf'] ?? this._csrf;
    this.act = this.data?.['act'] ?? this.act;
    this.activeLoanCount = this.data?.['activeLoanCount'] ?? this.activeLoanCount;
    this.activeLoansCount = this.data?.['activeLoansCount'] ?? this.activeLoansCount;
    this.dl = this.data?.['dl'] ?? this.dl;
    this.dpdCurrentCount = this.data?.['dpdCurrentCount'] ?? this.dpdCurrentCount;
    this.dpdNpaCount = this.data?.['dpdNpaCount'] ?? this.dpdNpaCount;
    this.dpdSma0Count = this.data?.['dpdSma0Count'] ?? this.dpdSma0Count;
    this.dpdSma1Count = this.data?.['dpdSma1Count'] ?? this.dpdSma1Count;
    this.dpdSma2Count = this.data?.['dpdSma2Count'] ?? this.dpdSma2Count;
    this.l = this.data?.['l'] ?? this.l;
    this.loans = this.data?.['loans'] ?? this.loans;
    this.officerBranch = this.data?.['officerBranch'] ?? this.officerBranch;
    this.overdueLoansCount = this.data?.['overdueLoansCount'] ?? this.overdueLoansCount;
    this.parRate = this.data?.['parRate'] ?? this.parRate;
    this.pendingLoanCount = this.data?.['pendingLoanCount'] ?? this.pendingLoanCount;
    this.pendingLoansCount = this.data?.['pendingLoansCount'] ?? this.pendingLoansCount;
    this.pl = this.data?.['pl'] ?? this.pl;
    this.rc = this.data?.['rc'] ?? this.rc;
    this.staffUser = this.data?.['staffUser'] ?? this.staffUser;
    this.totalLoanCount = this.data?.['totalLoanCount'] ?? this.totalLoanCount;
    this.totalLoansCount = this.data?.['totalLoansCount'] ?? this.totalLoansCount;
    this.userObj = this.data?.['userObj'] ?? this.userObj;
    this.userObj = Boolean((data?.sessionScope?.user || data?.user)) ? (data?.sessionScope?.user || data?.user) : (data?.currentUser || data?.user || null);
    this.staffUser = Boolean((data?.currentUser || data?.user || null)) ? (data?.currentUser || data?.user || null) : (data?.sessionScope?.user || data?.user);
    this.userObj = Boolean((data?.currentUser || data?.user || null)) ? (data?.currentUser || data?.user || null) : (data?.sessionScope?.user || data?.user);
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

  closeCollectionModal(...args: any[]): void {
    try {
      if (typeof (window as any).closeCollectionModal === 'function') {
        (window as any).closeCollectionModal(...args);
      }
    } catch (e) {}
  }

  closeRejectModal(...args: any[]): void {
    try {
      if (typeof (window as any).closeRejectModal === 'function') {
        (window as any).closeRejectModal(...args);
      }
    } catch (e) {}
  }

  confirm(...args: any[]): void {
    try {
      if (typeof (window as any).confirm === 'function') {
        (window as any).confirm(...args);
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

  openCollectionModal(...args: any[]): void {
    try {
      if (typeof (window as any).openCollectionModal === 'function') {
        (window as any).openCollectionModal(...args);
      }
    } catch (e) {}
  }

  openRejectModal(...args: any[]): void {
    try {
      if (typeof (window as any).openRejectModal === 'function') {
        (window as any).openRejectModal(...args);
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

export default DashboardComponent;