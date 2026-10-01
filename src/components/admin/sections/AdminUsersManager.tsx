import React, { useState } from 'react';
import { useAuth, UserRole, AppUserProfile } from '../../../context/AuthContext';
import { BOOTSTRAP_ADMIN_EMAIL } from '../../../firebase';
import {
  Users,
  Shield,
  ShieldCheck,
  UserCheck,
  Crown,
  Search,
  UserPlus,
  Trash2,
  Check,
  AlertCircle,
  Database,
  RefreshCw,
  Mail,
  Clock,
  Sparkles,
  Key,
} from 'lucide-react';

export const AdminUsersManager: React.FC = () => {
  const {
    allUsers,
    usersLoading,
    currentUser,
    userProfile,
    updateUserRole,
    deleteUser,
    addAdminByEmail,
  } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoleFilter, setSelectedRoleFilter] = useState<'all' | UserRole>('all');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('admin');
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmDeleteUid, setConfirmDeleteUid] = useState<string | null>(null);

  const showNotification = (msg: string, isError = false) => {
    if (isError) {
      setActionError(msg);
      setTimeout(() => setActionError(null), 4000);
    } else {
      setActionSuccess(msg);
      setTimeout(() => setActionSuccess(null), 4000);
    }
  };

  // Stats calculation
  const totalUsers = allUsers.length;
  const adminCount = allUsers.filter(
    (u) => u.role === 'admin' || u.role === 'super_admin' || u.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()
  ).length;
  const editorCount = allUsers.filter((u) => u.role === 'editor').length;
  const regularCount = allUsers.filter((u) => u.role === 'user').length;

  // Filtered users list
  const filteredUsers = allUsers.filter((u) => {
    const matchesSearch =
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.uid.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRole =
      selectedRoleFilter === 'all' ? true : u.role === selectedRoleFilter;

    return matchesSearch && matchesRole;
  });

  const handleRoleChange = async (targetUid: string, userEmail: string, newRole: UserRole) => {
    if (userEmail.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
      showNotification('মাস্টার ওনার (Master Owner) এর রোল পরিবর্তন করা যাবে না।', true);
      return;
    }

    try {
      await updateUserRole(targetUid, newRole);
      showNotification(`${userEmail} এর রোল সফলভাবে ${newRole}-এ পরিবর্তন করা হয়েছে।`);
    } catch (err) {
      showNotification('রোল আপডেট করতে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।', true);
    }
  };

  const handleDeleteUser = async (targetUid: string, userEmail: string) => {
    if (userEmail.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase()) {
      showNotification('মাস্টার ওনার অ্যাকাউন্ট ডিলিট করা যাবে না।', true);
      setConfirmDeleteUid(null);
      return;
    }

    try {
      await deleteUser(targetUid);
      setConfirmDeleteUid(null);
      showNotification(`${userEmail} এর অ্যাকাউন্ট ও এক্সেস মুছে ফেলা হয়েছে।`);
    } catch (err) {
      showNotification('ব্যবহারকারী ডিলিট করতে সমস্যা হয়েছে।', true);
    }
  };

  const handleAddAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail.trim() || !inviteEmail.includes('@')) {
      showNotification('সঠিক ইমেইল এড্রেস লিখুন।', true);
      return;
    }

    setIsSubmitting(true);
    try {
      await addAdminByEmail(inviteEmail.trim(), inviteRole);
      showNotification(`${inviteEmail} কে সফলভাবে ${inviteRole} হিসেবে যুক্ত করা হয়েছে!`);
      setInviteEmail('');
    } catch (err) {
      showNotification('এডমিন রোল বরাদ্দ করতে সমস্যা হয়েছে।', true);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getRoleBadge = (role: UserRole, email: string) => {
    const isMaster = email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

    if (isMaster) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-100 text-amber-900 dark:bg-amber-900/40 dark:text-amber-300 border border-amber-300 dark:border-amber-700/60 shadow-xs">
          <Crown className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
          <span>Master Owner</span>
        </span>
      );
    }

    switch (role) {
      case 'super_admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 border border-amber-200 dark:border-amber-800">
            <Crown className="w-3 h-3 text-amber-500" />
            <span>Super Admin</span>
          </span>
        );
      case 'admin':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
            <ShieldCheck className="w-3 h-3 text-purple-500" />
            <span>Admin</span>
          </span>
        );
      case 'editor':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border border-blue-200 dark:border-blue-800">
            <UserCheck className="w-3 h-3 text-blue-500" />
            <span>Editor</span>
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-neutral-100 text-neutral-700 dark:bg-neutral-800 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
            <Users className="w-3 h-3 text-neutral-400" />
            <span>Reader / User</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in">
      {/* Header & Firebase Status Banner */}
      <div
        className="p-6 rounded-2xl border space-y-4 shadow-xs"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800 flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Firebase Connected
              </span>
              <span className="text-xs text-neutral-400 font-mono">Project: blogweb</span>
            </div>
            <h2 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--text-primary)' }}>
              Firebase ইউজার ও এডমিন কন্ট্রোল
            </h2>
            <p className="text-xs text-neutral-500 max-w-2xl">
              ব্যবহারকারীদের রোল ম্যানেজ করুন (Super Admin, Admin, Editor, User)। রিয়েল-টাইম ফায়ারবেস অথেনটিকেশন ও ফায়ারস্টোর ডেটাবেস দ্বারা সুরক্ষিত।
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div
              className="p-3 rounded-xl border flex items-center gap-3 text-xs"
              style={{ backgroundColor: 'var(--bg-secondary)', borderColor: 'var(--border-color)' }}
            >
              <Database className="w-4 h-4 text-amber-500" />
              <div>
                <div className="font-semibold text-neutral-700 dark:text-neutral-300">Firestore DB</div>
                <div className="text-[10px] text-neutral-400 font-mono">Live RBAC Active</div>
              </div>
            </div>
          </div>
        </div>

        {/* Master Admin Notice */}
        <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/50 flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-200">
          <Crown className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
          <div className="space-y-0.5">
            <span className="font-bold">ডিফল্ট সুপার এডমিন (Master Owner): </span>
            <span className="font-mono bg-white dark:bg-black px-1.5 py-0.5 rounded text-[11px] font-semibold border border-amber-300 dark:border-amber-800">
              {BOOTSTRAP_ADMIN_EMAIL}
            </span>
            <p className="text-[11px] text-amber-800 dark:text-amber-300">
              এই ইমেইল দিয়ে গুগল বা ইমেইল দিয়ে লগইন করলে স্বয়ংক্রিয়ভাবে সুপার এডমিনের পূর্ণ নিয়ন্ত্রণ পাওয়া যায়।
            </p>
          </div>
        </div>
      </div>

      {/* Notifications */}
      {actionSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/70 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-200 text-xs flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-600" />
          <span>{actionSuccess}</span>
        </div>
      )}

      {actionError && (
        <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/70 border border-rose-200 dark:border-rose-800 text-rose-800 dark:text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-600" />
          <span>{actionError}</span>
        </div>
      )}

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div
          className="p-5 rounded-xl border space-y-1 shadow-xs"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold">সর্বমোট ইউজার</span>
            <Users className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {totalUsers}
          </div>
          <span className="text-[10px] text-neutral-400">নিবন্ধিত পাঠক ও টিম মেম্বার</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-1 shadow-xs"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold">এডমিন প্যানেল এক্সেস</span>
            <Shield className="w-4 h-4 text-amber-500" />
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {adminCount}
          </div>
          <span className="text-[10px] text-neutral-400">পূর্ণ প্রশাসনিক ক্ষমতাপ্রাপ্ত</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-1 shadow-xs"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold">কন্টেন্ট এডিটর</span>
            <UserCheck className="w-4 h-4 text-purple-500" />
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {editorCount}
          </div>
          <span className="text-[10px] text-neutral-400">পোস্ট লেখা ও প্রকাশের অনুমতি</span>
        </div>

        <div
          className="p-5 rounded-xl border space-y-1 shadow-xs"
          style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
        >
          <div className="flex items-center justify-between text-neutral-400">
            <span className="text-xs font-semibold">সাধারণ পাঠক / ইউজার</span>
            <Mail className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
            {regularCount}
          </div>
          <span className="text-[10px] text-neutral-400">কমেন্ট ও প্রোফাইল এক্সেস</span>
        </div>
      </div>

      {/* Add New Admin Form */}
      <div
        className="p-6 rounded-2xl border space-y-4 shadow-xs"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        <div className="flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-blue-600" />
          <h3 className="text-base font-bold" style={{ color: 'var(--text-primary)' }}>
            নতুন এডমিন বা এডিটর যুক্ত করুন
          </h3>
        </div>
        <p className="text-xs text-neutral-500">
          যেকোনো ব্যক্তির ইমেইল দিয়ে তাকে এডমিন বা এডিটর ক্ষমতা দিতে পারেন। তিনি সাইটে সাইন ইন করলেই স্বয়ংক্রিয়ভাবে সেই ভূমিকা পেয়ে যাবেন।
        </p>

        <form onSubmit={handleAddAdmin} className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-2">
          <div className="sm:col-span-6">
            <input
              type="email"
              placeholder="ব্যবহারকারীর ইমেইল (যেমন: editor@example.com)"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={inviteRole}
              onChange={(e) => setInviteRole(e.target.value as UserRole)}
              className="w-full px-3 py-2.5 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500 font-semibold"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="admin">Admin (পূর্ণ নিয়ন্ত্রণ)</option>
              <option value="editor">Editor (পোস্ট লেখা ও এডিট)</option>
              <option value="super_admin">Super Admin (সর্বোচ্চ ক্ষমতা)</option>
              <option value="user">User (সাধারণ পাঠক)</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all hover:opacity-90 cursor-pointer shadow-xs disabled:opacity-50"
              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
            >
              <Key className="w-3.5 h-3.5" />
              <span>{isSubmitting ? 'প্রসেসিং...' : 'এক্সেস বরাদ্দ করুন'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Users List & Controls */}
      <div
        className="rounded-2xl border shadow-xs overflow-hidden space-y-4"
        style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border-color)' }}
      >
        {/* Toolbar */}
        <div
          className="p-4 border-b flex flex-col sm:flex-row items-center justify-between gap-3"
          style={{ borderColor: 'var(--border-color)' }}
        >
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="নাম, ইমেইল বা UID দিয়ে খুঁজুন..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border bg-transparent focus:outline-none focus:border-neutral-500"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-xs text-neutral-400 font-medium">রোল ফিল্টার:</span>
            <select
              value={selectedRoleFilter}
              onChange={(e) => setSelectedRoleFilter(e.target.value as any)}
              className="px-3 py-1.5 text-xs rounded-xl border bg-transparent focus:outline-none font-medium"
              style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
            >
              <option value="all">সকল ব্যবহারকারী ({totalUsers})</option>
              <option value="super_admin">Super Admin</option>
              <option value="admin">Admin</option>
              <option value="editor">Editor</option>
              <option value="user">User</option>
            </select>
          </div>
        </div>

        {/* User Table */}
        <div className="overflow-x-auto">
          {usersLoading ? (
            <div className="p-12 text-center text-xs text-neutral-400 flex items-center justify-center gap-2">
              <RefreshCw className="w-4 h-4 animate-spin text-blue-500" />
              <span>ফায়ারবেস থেকে ব্যবহারকারীদের তালিকা লোড হচ্ছে...</span>
            </div>
          ) : filteredUsers.length === 0 ? (
            <div className="p-12 text-center text-xs text-neutral-400 space-y-2">
              <Users className="w-8 h-8 mx-auto opacity-30" />
              <p>কোনো ব্যবহারকারী পাওয়া যায়নি।</p>
              <p className="text-[11px] text-neutral-500">
                সাইটে গুগল বা ইমেইল দিয়ে সাইন ইন করলে তাদের তালিকা স্বয়ংক্রিয়ভাবে এখানে দেখা যাবে।
              </p>
            </div>
          ) : (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr
                  className="border-b font-semibold text-neutral-400 uppercase tracking-wider text-[10px]"
                  style={{ borderColor: 'var(--border-color)', backgroundColor: 'var(--bg-secondary)' }}
                >
                  <th className="py-3 px-4">ইউজার / প্রোফাইল</th>
                  <th className="py-3 px-4">বর্তমান ভূমিকা (Role)</th>
                  <th className="py-3 px-4">ভূমিকা পরিবর্তন</th>
                  <th className="py-3 px-4">যোগদানের তারিখ</th>
                  <th className="py-3 px-4 text-right">একশন</th>
                </tr>
              </thead>
              <tbody className="divide-y" style={{ borderColor: 'var(--border-color)' }}>
                {filteredUsers.map((user) => {
                  const isCurrentLoggedUser = currentUser?.uid === user.uid;
                  const isMasterOwner =
                    user.email.toLowerCase() === BOOTSTRAP_ADMIN_EMAIL.toLowerCase();

                  return (
                    <tr
                      key={user.uid}
                      className="hover:bg-neutral-50 dark:hover:bg-neutral-800/40 transition-colors"
                    >
                      {/* User Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          {user.photoURL ? (
                            <img
                              src={user.photoURL}
                              alt={user.displayName}
                              className="w-8 h-8 rounded-full object-cover border"
                              style={{ borderColor: 'var(--border-color)' }}
                            />
                          ) : (
                            <div
                              className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs"
                              style={{ backgroundColor: 'var(--btn-bg)', color: 'var(--btn-text)' }}
                            >
                              {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                            </div>
                          )}

                          <div className="min-w-0">
                            <div className="font-bold flex items-center gap-1.5" style={{ color: 'var(--text-primary)' }}>
                              <span className="truncate">{user.displayName || 'Unnamed User'}</span>
                              {isCurrentLoggedUser && (
                                <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-100 text-blue-800 dark:bg-blue-900/60 dark:text-blue-300 font-bold">
                                  আপনি
                                </span>
                              )}
                            </div>
                            <div className="text-[11px] text-neutral-400 font-mono truncate">
                              {user.email}
                            </div>
                            <div className="text-[9px] text-neutral-400 font-mono opacity-60">
                              UID: {user.uid.slice(0, 10)}...
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Current Role Badge */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {getRoleBadge(user.role, user.email)}
                      </td>

                      {/* Role Selector */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isMasterOwner ? (
                          <span className="text-[11px] text-neutral-400 italic">লক করা (Owner)</span>
                        ) : (
                          <select
                            value={user.role}
                            onChange={(e) =>
                              handleRoleChange(user.uid, user.email, e.target.value as UserRole)
                            }
                            className="px-2.5 py-1 text-xs rounded-lg border bg-transparent font-medium cursor-pointer focus:outline-none"
                            style={{ borderColor: 'var(--border-color)', color: 'var(--text-primary)' }}
                          >
                            <option value="super_admin">Super Admin</option>
                            <option value="admin">Admin</option>
                            <option value="editor">Editor</option>
                            <option value="user">User (Reader)</option>
                          </select>
                        )}
                      </td>

                      {/* Created At */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-neutral-400 font-mono text-[11px]">
                        {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 whitespace-nowrap text-right">
                        {isMasterOwner ? (
                          <span className="text-[10px] text-neutral-400">সুরক্ষিত</span>
                        ) : confirmDeleteUid === user.uid ? (
                          <div className="flex items-center justify-end gap-1.5">
                            <span className="text-[10px] text-rose-500 font-bold">নিশ্চিত?</span>
                            <button
                              onClick={() => handleDeleteUser(user.uid, user.email)}
                              className="px-2 py-0.5 rounded bg-rose-600 text-white font-bold text-[10px] hover:bg-rose-700 cursor-pointer"
                            >
                              হ্যাঁ
                            </button>
                            <button
                              onClick={() => setConfirmDeleteUid(null)}
                              className="px-2 py-0.5 rounded border text-[10px] text-neutral-400 hover:text-black dark:hover:text-white cursor-pointer"
                              style={{ borderColor: 'var(--border-color)' }}
                            >
                              না
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setConfirmDeleteUid(user.uid)}
                            className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                            title="ইউজার ডিলিট করুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
