import { useState } from 'react';
import { User, Bell, Shield, Database, Save } from 'lucide-react';
import { useAuth } from '@/store/AuthContext';
import { cn } from '@/lib/utils';

const settingsSections = [
  { id: 'profile', label: 'Profile', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'data', label: 'Data & Privacy', icon: Database },
];

function ProfileSection() {
  const { profile, user } = useAuth();

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary mb-6">Profile Settings</h2>

      {/* Avatar */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 rounded-full bg-surface-border flex items-center justify-center">
          <span className="text-2xl font-semibold text-text-primary">{profile?.initials || '?'}</span>
        </div>
        <div>
          <button className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors">
            Change Avatar
          </button>
          <p className="text-xs text-text-muted mt-2">JPG, PNG or GIF. Max 2MB.</p>
        </div>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Full Name</label>
            <input
              type="text"
              defaultValue={profile?.full_name || ''}
              className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-text-primary mb-1.5">Email</label>
            <input
              type="email"
              defaultValue={user?.email || ''}
              className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Role</label>
          <input
            type="text"
            defaultValue={(profile?.role || 'member').charAt(0).toUpperCase() + (profile?.role || 'member').slice(1)}
            disabled
            className="w-full h-10 px-3 bg-surface-hover border border-surface-border rounded-md text-sm text-text-muted cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-text-primary mb-1.5">Bio</label>
          <textarea
            rows={4}
            placeholder="Tell us about yourself..."
            className="w-full px-3 py-2 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors resize-none"
          />
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-surface-border">
          <button className="h-9 px-4 bg-surface border border-surface-border rounded-md text-sm font-medium text-text-secondary hover:bg-surface-hover hover:text-text-primary transition-colors">
            Cancel
          </button>
          <button className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors inline-flex items-center gap-2">
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function NotificationsSection() {
  const [emailNotifs, setEmailNotifs] = useState(true);
  const [articleUpdates, setArticleUpdates] = useState(true);
  const [discussionReplies, setDiscussionReplies] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);

  const toggles = [
    { label: 'Email notifications', description: 'Receive email notifications for important updates', value: emailNotifs, setter: setEmailNotifs },
    { label: 'Article updates', description: 'Get notified when articles you follow are updated', value: articleUpdates, setter: setArticleUpdates },
    { label: 'Discussion replies', description: 'Get notified when someone replies to your discussions', value: discussionReplies, setter: setDiscussionReplies },
    { label: 'Weekly digest', description: 'Receive a weekly summary of activity in your workspaces', value: weeklyDigest, setter: setWeeklyDigest },
  ];

  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary mb-6">Notification Preferences</h2>
      <div className="space-y-1">
        {toggles.map((toggle, i) => (
          <div key={i} className="flex items-center justify-between py-4 border-b border-surface-border last:border-0">
            <div>
              <p className="text-sm font-medium text-text-primary">{toggle.label}</p>
              <p className="text-xs text-text-muted mt-0.5">{toggle.description}</p>
            </div>
            <button
              onClick={() => toggle.setter(!toggle.value)}
              className={cn(
                'w-10 h-6 rounded-full transition-colors relative',
                toggle.value ? 'bg-white' : 'bg-surface-border'
              )}
            >
              <span className={cn(
                'absolute top-1 w-4 h-4 rounded-full transition-all',
                toggle.value ? 'left-5 bg-black' : 'left-1 bg-text-muted'
              )} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

function SecuritySection() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary mb-6">Security</h2>
      <div className="space-y-6">
        {/* Change Password */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-3">Change Password</h3>
          <div className="space-y-3 max-w-md">
            <div>
              <label className="block text-xs text-text-muted mb-1">Current Password</label>
              <input type="password" placeholder="••••••••" className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">New Password</label>
              <input type="password" placeholder="••••••••" className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors" />
            </div>
            <div>
              <label className="block text-xs text-text-muted mb-1">Confirm New Password</label>
              <input type="password" placeholder="••••••••" className="w-full h-10 px-3 bg-background border border-surface-border rounded-md text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-text-muted transition-colors" />
            </div>
            <button className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors">
              Update Password
            </button>
          </div>
        </div>

        {/* Sessions */}
        <div className="pt-4 border-t border-surface-border">
          <h3 className="text-sm font-medium text-text-primary mb-3">Active Sessions</h3>
          <div className="bg-background border border-surface-border rounded-md p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-text-primary font-medium">Current Session</p>
                <p className="text-xs text-text-muted mt-0.5">Last active: Just now</p>
              </div>
              <span className="px-2 py-0.5 bg-status-published-bg text-status-published-text text-xs rounded-full">Active</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function DataPrivacySection() {
  return (
    <div>
      <h2 className="text-lg font-semibold text-text-primary mb-6">Data & Privacy</h2>
      <div className="space-y-6">
        {/* Export */}
        <div>
          <h3 className="text-sm font-medium text-text-primary mb-2">Export Your Data</h3>
          <p className="text-xs text-text-muted mb-3">Download a copy of all your articles, discussions, and account data.</p>
          <button className="h-9 px-4 bg-white rounded-md text-sm font-medium text-black hover:bg-white/90 transition-colors">
            Request Data Export
          </button>
        </div>

        {/* Delete */}
        <div className="pt-4 border-t border-surface-border">
          <h3 className="text-sm font-medium text-status-error-text mb-2">Danger Zone</h3>
          <p className="text-xs text-text-muted mb-3">Permanently delete your account and all associated data. This action cannot be undone.</p>
          <button className="h-9 px-4 bg-status-error-bg border border-status-error-text/30 rounded-md text-sm font-medium text-status-error-text hover:bg-status-error-text/20 transition-colors">
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}

export function SettingsPage() {
  const [activeSection, setActiveSection] = useState('profile');

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl font-bold text-text-primary tracking-tight">Settings</h1>
        <p className="text-sm text-text-muted mt-0.5">Manage your account and preferences</p>
      </div>

      <div className="flex gap-6">
        {/* Sidebar */}
        <div className="w-64 flex-shrink-0">
          <div className="bg-surface border border-surface-border rounded-lg overflow-hidden">
            {settingsSections.map((section, index) => {
              const Icon = section.icon;
              const isActive = section.id === activeSection;
              return (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                    isActive
                      ? 'bg-surface-border text-white'
                      : 'text-text-secondary hover:text-text-primary hover:bg-surface-hover',
                    index !== settingsSections.length - 1 && 'border-b border-surface-border'
                  )}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <div className="bg-surface border border-surface-border rounded-lg p-6">
            {activeSection === 'profile' && <ProfileSection />}
            {activeSection === 'notifications' && <NotificationsSection />}
            {activeSection === 'security' && <SecuritySection />}
            {activeSection === 'data' && <DataPrivacySection />}
          </div>
        </div>
      </div>
    </div>
  );
}
